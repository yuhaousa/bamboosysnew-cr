-- Migration 002: Add password_hash to user_profiles for custom auth
ALTER TABLE user_profiles ADD COLUMN password_hash TEXT;
