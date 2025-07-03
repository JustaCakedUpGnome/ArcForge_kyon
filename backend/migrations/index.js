const fs = require('fs');
const path = require('path');
const pool = require('../config/database');

class MigrationRunner {
    static async runMigrations() {
        try {
            // Create migrations tracking table if it doesn't exist
            await this.createMigrationsTable();
            
            // Get list of migration files
            const migrationFiles = this.getMigrationFiles();
            
            // Get already run migrations
            const runMigrations = await this.getRunMigrations();
            
            // Find pending migrations
            const pendingMigrations = migrationFiles.filter(file => 
                !runMigrations.includes(file)
            );
            
            if (pendingMigrations.length === 0) {
                console.log('✅ All migrations up to date');
                return;
            }
            
            console.log(`🔄 Running ${pendingMigrations.length} pending migrations...`);
            
            // Run each pending migration
            for (const migrationFile of pendingMigrations) {
                await this.runMigration(migrationFile);
            }
            
            console.log('✅ All migrations completed successfully');
            
        } catch (error) {
            console.error('❌ Migration error:', error);
            throw error;
        }
    }
    
    static async createMigrationsTable() {
        const query = `
            CREATE TABLE IF NOT EXISTS migrations (
                id SERIAL PRIMARY KEY,
                filename VARCHAR(255) NOT NULL UNIQUE,
                executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        await pool.query(query);
    }
    
    static getMigrationFiles() {
        const migrationsDir = __dirname;
        const files = fs.readdirSync(migrationsDir)
            .filter(file => file.endsWith('.sql'))
            .sort(); // Run in alphabetical order
        return files;
    }
    
    static async getRunMigrations() {
        const query = 'SELECT filename FROM migrations ORDER BY filename';
        const result = await pool.query(query);
        return result.rows.map(row => row.filename);
    }
    
    static async runMigration(filename) {
        console.log(`🔄 Running migration: ${filename}`);
        
        // Read migration file
        const migrationPath = path.join(__dirname, filename);
        const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
        
        // Begin transaction
        const client = await pool.connect();
        
        try {
            await client.query('BEGIN');
            
            // Run migration SQL
            await client.query(migrationSQL);
            
            // Record migration as completed
            await client.query(
                'INSERT INTO migrations (filename) VALUES ($1)',
                [filename]
            );
            
            await client.query('COMMIT');
            console.log(`✅ Completed migration: ${filename}`);
            
        } catch (error) {
            await client.query('ROLLBACK');
            console.error(`❌ Failed migration: ${filename}`, error);
            throw error;
        } finally {
            client.release();
        }
    }
}

module.exports = MigrationRunner;