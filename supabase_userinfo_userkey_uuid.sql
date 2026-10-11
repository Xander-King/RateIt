-- Run this once in the Supabase SQL editor.
-- Only safe if UserInfo is currently empty (or you don't need to keep existing UserKey values) —
-- a bigint value like 12345 cannot be cast to a valid uuid.
alter table "UserInfo" drop column "UserKey";
alter table "UserInfo" add column "UserKey" uuid primary key references auth.users(id);
