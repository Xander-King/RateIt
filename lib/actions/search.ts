"use server";

import { createClient } from "@/lib/supabase/server";

export async function searchUsers(query: string) {
    const supabase = createClient();

    const { data } = await supabase
        .from("UserInfo")
        .select("UserKey, UserName")
        .ilike("UserName", `%${query}%`)
        .limit(20);

    return (data ?? []) as { UserKey: string; UserName: string }[];
}

export async function searchTopics(query: string) {
    const supabase = createClient();

    const { data } = await supabase
        .from("Topics")
        .select("TopicKey, TopicName, TopicIconImagePath")
        .ilike("TopicName", `%${query}%`)
        .limit(20);

    const topics = (data ?? []) as { TopicKey: number; TopicName: string; TopicIconImagePath: string }[];

    return topics.map((topic) => {
        const { data: { publicUrl } } = supabase.storage
            .from("topicIcon-images")
            .getPublicUrl(topic.TopicIconImagePath);

        return { TopicKey: topic.TopicKey, TopicName: topic.TopicName, IconUrl: publicUrl };
    });
}

export async function searchItemsInTopic(topicKey: number, query: string) {
    const supabase = createClient();

    const { data } = await supabase
        .from("Items")
        .select("ItemKey, ItemName")
        .eq("TopicKey", topicKey)
        .ilike("ItemName", `%${query}%`)
        .limit(20);

    return (data ?? []) as { ItemKey: number; ItemName: string }[];
}

export async function searchItems(query: string) {
    const supabase = createClient();

    const { data: items } = await supabase
        .from("Items")
        .select("ItemKey")
        .ilike("ItemName", `%${query}%`)
        .limit(20);

    const itemKeys = items?.map((item) => item.ItemKey) ?? [];

    if (itemKeys.length === 0) {
        return [];
    }

    const { data } = (await supabase.rpc("get_item_info", { ItemKeys: itemKeys })) as {
        data: { ItemKey: number; ItemName: string; PostImageKey: string; PostRating: number }[] | null;
    };

    return (data ?? []).map((item) => {
        const { data: { publicUrl } } = supabase.storage
            .from("post-images")
            .getPublicUrl(item.PostImageKey);

        return { ItemKey: item.ItemKey, ItemName: item.ItemName, ImageUrl: publicUrl, PostRating: item.PostRating };
    });
}
