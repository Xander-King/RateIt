-- Run this once in the Supabase SQL editor.
-- UserInfo has RLS enabled but no policy allowing a user to write their own
-- row, which is why the signup-confirmation upsert in app/auth/confirm/route.ts
-- fails with "new row violates row-level security policy for table \"UserInfo\"".
create policy "Users can insert their own UserInfo row"
on "UserInfo"
for insert
to authenticated
with check (auth.uid() = "UserKey");

create policy "Users can update their own UserInfo row"
on "UserInfo"
for update
to authenticated
using (auth.uid() = "UserKey")
with check (auth.uid() = "UserKey");

-- UserInfo holds public profile info (username, pic path), not secrets, so any
-- signed-in user can read any row. This is also required for the upsert above:
-- an `INSERT ... ON CONFLICT DO UPDATE` needs SELECT visibility to evaluate the
-- conflict target, even when no conflicting row exists yet — without this policy
-- that lookup itself gets blocked by RLS and surfaces as the same
-- "violates row-level security policy" error on the INSERT path.
create policy "Any authenticated user can view UserInfo rows"
on "UserInfo"
for select
to authenticated
using (true);
