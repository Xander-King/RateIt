-- Run this once in the Supabase SQL editor.
-- Adjust column types (bigint) below if your *Key columns use a different type (e.g. uuid, int).
create or replace function get_booming_posts(result_limit int default 10)
returns table (
  "TopicKey" bigint,
  "TopicName" text,
  "EngagementCount" bigint
)
language sql
stable
as $$
  select
    t."TopicKey",
    t."TopicName",
    count(distinct l."LikeKey") + count(distinct c."CommentKey") as "EngagementCount"
  from "Topics" t
  join "Items" i on t."TopicKey" = i."TopicKey"
  join "Posts" p on i."ItemKey" = p."ItemKey"
  join "Likes" l on p."PostKey" = l."PostKey" and l."LikeDate"::date = current_date
  join "Comments" c on p."PostKey" = c."PostKey" and c."CommentDate"::date = current_date
  group by t."TopicKey", t."TopicName"
  order by "EngagementCount" desc
  limit result_limit;
$$;
