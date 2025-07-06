-- Add edit tracking columns to posts and replies tables
-- This enables post/reply edit functionality with proper audit trail

-- Add edit tracking columns to posts table
ALTER TABLE posts ADD COLUMN IF NOT EXISTS edit_count INTEGER DEFAULT 0;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS is_edited BOOLEAN DEFAULT false;

-- Add edit tracking columns to replies table  
ALTER TABLE replies ADD COLUMN IF NOT EXISTS edit_count INTEGER DEFAULT 0;
ALTER TABLE replies ADD COLUMN IF NOT EXISTS is_edited BOOLEAN DEFAULT false;

-- Add indexes for performance on edit queries
CREATE INDEX IF NOT EXISTS idx_posts_is_edited ON posts(is_edited);
CREATE INDEX IF NOT EXISTS idx_replies_is_edited ON replies(is_edited);

-- Create trigger function to update edit tracking when posts are modified
CREATE OR REPLACE FUNCTION update_post_edit_tracking()
RETURNS TRIGGER AS $$
BEGIN
    -- Only update if title or content actually changed
    IF OLD.title != NEW.title OR OLD.content != NEW.content THEN
        NEW.edit_count = OLD.edit_count + 1;
        NEW.is_edited = true;
        NEW.updated_at = CURRENT_TIMESTAMP;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger function to update edit tracking when replies are modified
CREATE OR REPLACE FUNCTION update_reply_edit_tracking()
RETURNS TRIGGER AS $$
BEGIN
    -- Only update if content actually changed
    IF OLD.content != NEW.content THEN
        NEW.edit_count = OLD.edit_count + 1;
        NEW.is_edited = true;
        NEW.updated_at = CURRENT_TIMESTAMP;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update edit tracking
CREATE TRIGGER posts_edit_tracking_trigger
    BEFORE UPDATE ON posts
    FOR EACH ROW
    EXECUTE FUNCTION update_post_edit_tracking();

CREATE TRIGGER replies_edit_tracking_trigger
    BEFORE UPDATE ON replies
    FOR EACH ROW
    EXECUTE FUNCTION update_reply_edit_tracking();

-- Add comments for documentation
COMMENT ON COLUMN posts.edit_count IS 'Number of times this post has been edited';
COMMENT ON COLUMN posts.is_edited IS 'Whether this post has been edited since creation';
COMMENT ON COLUMN replies.edit_count IS 'Number of times this reply has been edited';
COMMENT ON COLUMN replies.is_edited IS 'Whether this reply has been edited since creation';

-- Create helper function to get post edit history summary
CREATE OR REPLACE FUNCTION get_post_edit_summary(post_id_param INTEGER)
RETURNS TABLE(
    post_id INTEGER,
    title VARCHAR(255),
    is_edited BOOLEAN,
    edit_count INTEGER,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    author_username VARCHAR(50)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.title,
        p.is_edited,
        p.edit_count,
        p.created_at,
        p.updated_at,
        u.username
    FROM posts p
    JOIN users u ON p.user_id = u.id
    WHERE p.id = post_id_param;
END;
$$ LANGUAGE plpgsql;

-- Create helper function to get reply edit history summary
CREATE OR REPLACE FUNCTION get_reply_edit_summary(reply_id_param INTEGER)
RETURNS TABLE(
    reply_id INTEGER,
    content TEXT,
    is_edited BOOLEAN,
    edit_count INTEGER,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    author_username VARCHAR(50)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        r.id,
        r.content,
        r.is_edited,
        r.edit_count,
        r.created_at,
        r.updated_at,
        u.username
    FROM replies r
    JOIN users u ON r.user_id = u.id
    WHERE r.id = reply_id_param;
END;
$$ LANGUAGE plpgsql;