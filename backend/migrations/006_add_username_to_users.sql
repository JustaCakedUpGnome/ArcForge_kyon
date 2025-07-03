-- Add username field to users table for forum display names
-- This replaces email exposure in forum posts for privacy

-- Add username column
ALTER TABLE users ADD COLUMN IF NOT EXISTS username VARCHAR(50);

-- Add unique constraint for usernames
ALTER TABLE users ADD CONSTRAINT users_username_key UNIQUE (username);

-- Add index for faster username lookups
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- Update existing users with temporary usernames based on email
-- This handles any existing test accounts
UPDATE users 
SET username = CONCAT('user', id) 
WHERE username IS NULL;

-- Make username required for future inserts
ALTER TABLE users ALTER COLUMN username SET NOT NULL;

-- Add check constraint for username format (alphanumeric, underscore, hyphen)
ALTER TABLE users ADD CONSTRAINT users_username_format 
CHECK (username ~ '^[a-zA-Z0-9_-]{3,50}$');

-- Create or replace function to get user display info for forum
CREATE OR REPLACE FUNCTION get_user_display_info(user_id_param INTEGER)
RETURNS TABLE(
    user_id INTEGER,
    username VARCHAR(50),
    email VARCHAR(255),
    role VARCHAR(20)
) AS $$
BEGIN
    RETURN QUERY
    SELECT u.id, u.username, u.email, u.role
    FROM users u
    WHERE u.id = user_id_param;
END;
$$ LANGUAGE plpgsql;

-- Add comment for documentation
COMMENT ON COLUMN users.username IS 'Display name for forum posts and public areas - replaces email exposure';