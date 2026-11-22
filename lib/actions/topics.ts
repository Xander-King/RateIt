"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function followTopic(topicKey: number) {
    const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
    
      if (!user) {
        redirect("/login");
      }

      const { error } = await supabase
    .from("FollowedTopics")
    .insert({
      TopicKey: topicKey,
      UserKey: user.id,
    });

  if (error) {
    redirect(`/Topic/${topicKey}?error=${encodeURIComponent(error.message)}`);
  }

  redirect(`/Topic/${topicKey}`);
}

export async function unfollowTopic(topicKey: number) {
    const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
    
      if (!user) {
        redirect("/login");
      }

      const { error } = await supabase
    .from("FollowedTopics")
    .delete()
    .eq("TopicKey", topicKey)
    .eq("UserKey", user.id);

  if (error) {
    redirect(`/Topic/${topicKey}?error=${encodeURIComponent(error.message)}`);
  }

  redirect(`/Topic/${topicKey}`);
}