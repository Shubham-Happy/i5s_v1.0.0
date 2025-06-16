
-- Add starred and archived columns to conversations table
ALTER TABLE conversations 
ADD COLUMN is_starred_user1 BOOLEAN DEFAULT FALSE,
ADD COLUMN is_starred_user2 BOOLEAN DEFAULT FALSE,
ADD COLUMN is_archived_user1 BOOLEAN DEFAULT FALSE,
ADD COLUMN is_archived_user2 BOOLEAN DEFAULT FALSE;

-- Add indexes for better performance when filtering
CREATE INDEX idx_conversations_starred_user1 ON conversations(user1_id, is_starred_user1) WHERE is_starred_user1 = TRUE;
CREATE INDEX idx_conversations_starred_user2 ON conversations(user2_id, is_starred_user2) WHERE is_starred_user2 = TRUE;
CREATE INDEX idx_conversations_archived_user1 ON conversations(user1_id, is_archived_user1) WHERE is_archived_user1 = TRUE;
CREATE INDEX idx_conversations_archived_user2 ON conversations(user2_id, is_archived_user2) WHERE is_archived_user2 = TRUE;
