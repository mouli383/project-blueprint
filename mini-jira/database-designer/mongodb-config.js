// =====================================================
// Mini Jira/Trello — MongoDB Configuration
// Role: Database Designer
// Tech: MongoDB (for activity_log real-time features)
// =====================================================
// MongoDB is used alongside MySQL for:
// - Real-time activity feeds (high-write workload)
// - Session storage
// - Caching frequently accessed data
// =====================================================

const { MongoClient } = require('mongodb');

// ── Configuration ────────────────────────────────────
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017';
const DB_NAME = 'mini_jira_mongo';

let db = null;
let client = null;

// ── Connect to MongoDB ──────────────────────────────
async function connectMongo() {
    try {
        client = new MongoClient(MONGO_URI);
        await client.connect();
        db = client.db(DB_NAME);
        console.log(`[MongoDB] Connected to ${DB_NAME}`);

        // Create collections with schemas
        await createCollections();

        return db;
    } catch (error) {
        console.error('[MongoDB] Connection failed:', error.message);
        process.exit(1);
    }
}

// ── Create Collections & Indexes ────────────────────
async function createCollections() {
    // Activity Feed Collection (real-time)
    const activityExists = await db.listCollections({ name: 'activity_feed' }).hasNext();
    if (!activityExists) {
        await db.createCollection('activity_feed', {
            validator: {
                $jsonSchema: {
                    bsonType: 'object',
                    required: ['project_id', 'actor_id', 'action', 'entity_type', 'entity_id'],
                    properties: {
                        project_id: { bsonType: 'string', description: 'UUID from MySQL projects table' },
                        actor_id: { bsonType: 'string', description: 'UUID from MySQL users table' },
                        action: { bsonType: 'string' },
                        entity_type: { enum: ['task', 'sprint', 'project', 'comment'] },
                        entity_id: { bsonType: 'string' },
                        metadata: { bsonType: 'object' },
                        created_at: { bsonType: 'date' }
                    }
                }
            }
        });
        // Indexes for fast queries
        await db.collection('activity_feed').createIndex({ project_id: 1, created_at: -1 });
        await db.collection('activity_feed').createIndex({ actor_id: 1 });
        console.log('[MongoDB] Created activity_feed collection');
    }

    // Sessions Collection
    const sessionsExists = await db.listCollections({ name: 'sessions' }).hasNext();
    if (!sessionsExists) {
        await db.createCollection('sessions');
        await db.collection('sessions').createIndex({ user_id: 1 });
        await db.collection('sessions').createIndex({ expires_at: 1 }, { expireAfterSeconds: 0 });
        console.log('[MongoDB] Created sessions collection');
    }

    // Notifications Collection
    const notifExists = await db.listCollections({ name: 'notifications' }).hasNext();
    if (!notifExists) {
        await db.createCollection('notifications');
        await db.collection('notifications').createIndex({ user_id: 1, read: 1, created_at: -1 });
        console.log('[MongoDB] Created notifications collection');
    }
}

// ── Get DB instance ─────────────────────────────────
function getDB() {
    if (!db) throw new Error('[MongoDB] Not connected. Call connectMongo() first.');
    return db;
}

// ── Close connection ────────────────────────────────
async function closeMongo() {
    if (client) {
        await client.close();
        console.log('[MongoDB] Connection closed');
    }
}

module.exports = { connectMongo, getDB, closeMongo };
