-- Run this once in the Supabase SQL editor.
-- Adjust the return type (bigint) below if your ItemKey column uses a different type (e.g. uuid, int).
create or replace function get_random_item("TopicKey" bigint)
returns bigint
language sql
stable
as $$
  select i."ItemKey" from "Items" i where i."TopicKey" = "TopicKey" order by random() limit 1;
$$;
