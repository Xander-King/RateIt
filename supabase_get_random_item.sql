-- Run this once in the Supabase SQL editor.
-- Adjust the return type (bigint) below if your ItemKey column uses a different type (e.g. uuid, int).
create or replace function get_random_item()
returns bigint
language sql
stable
as $$
  select "ItemKey" from "Items" order by random() limit 1;
$$;
