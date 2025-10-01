-- Enable pgvector extension and add embedding column
-- Run this SQL directly on your PostgreSQL database before running Prisma migrations

-- Enable the pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Add embedding column to Section table (if not exists)
ALTER TABLE "Section" ADD COLUMN IF NOT EXISTS embedding vector(768);

-- Create index for vector similarity search using cosine distance
-- This index will speed up vector similarity queries significantly
CREATE INDEX IF NOT EXISTS section_embedding_idx 
ON "Section" USING ivfflat (embedding vector_cosine_ops) 
WITH (lists = 100);

-- Optional: Create a partial index for non-null embeddings only
-- This can be more efficient if many sections don't have embeddings yet
CREATE INDEX IF NOT EXISTS section_embedding_not_null_idx 
ON "Section" USING ivfflat (embedding vector_cosine_ops) 
WITH (lists = 100)
WHERE embedding IS NOT NULL;
