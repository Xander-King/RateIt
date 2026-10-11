"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function updateProfile(formData: FormData) {
  const userName = (formData.get("UserName") as string)?.trim();
  const profilePic = formData.get("ProfilePic") as File;

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  if (!userName) {
    redirect(`/EditUser?error=${encodeURIComponent("Username is required")}`);
  }

  const { data: existing } = await supabase
    .from("UserInfo")
    .select("UserKey")
    .eq("UserName", userName)
    .neq("UserKey", user.id)
    .maybeSingle();

  if (existing) {
    redirect(`/EditUser?error=${encodeURIComponent("That username is already taken")}`);
  }

  const updates: { UserName: string; ProfilePicPath?: string } = { UserName: userName };

  if (profilePic && profilePic.size > 0) {
    const imagePath = `${user.id}/${Date.now()}_${profilePic.name}`;

    const { error: uploadError } = await supabase.storage
      .from("ProfilePic-images")
      .upload(imagePath, profilePic);

    if (uploadError) {
      redirect(`/EditUser?error=${encodeURIComponent(uploadError.message)}`);
    }

    updates.ProfilePicPath = imagePath;
  }

  const { error: updateError } = await supabase
    .from("UserInfo")
    .update(updates)
    .eq("UserKey", user.id);

  if (updateError) {
    redirect(`/EditUser?error=${encodeURIComponent(updateError.message)}`);
  }

  redirect(`/User/${user.id}`);
}

export async function addPinnedTopic(topicKey: number) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { count } = await supabase
    .from("PinnedTopics")
    .select("*", { count: "exact", head: true })
    .eq("UserKey", user.id);

  if ((count ?? 0) >= 4) {
    redirect(`/EditUser?error=${encodeURIComponent("You can only pin up to 4 topics")}`);
  }

  const { error } = await supabase
    .from("PinnedTopics")
    .insert({ UserKey: user.id, TopicKey: topicKey });

  if (error) {
    redirect(`/EditUser?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/EditUser");
}

export async function removePinnedTopic(topicKey: number) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  await supabase
    .from("PinnedTopics")
    .delete()
    .eq("UserKey", user.id)
    .eq("TopicKey", topicKey);

  redirect("/EditUser");
}

export async function addPinnedItem(itemKey: number) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { count } = await supabase
    .from("PinnedItems")
    .select("*", { count: "exact", head: true })
    .eq("UserKey", user.id);

  if ((count ?? 0) >= 4) {
    redirect(`/EditUser?error=${encodeURIComponent("You can only pin up to 4 items")}`);
  }

  const { error } = await supabase
    .from("PinnedItems")
    .insert({ UserKey: user.id, ItemKey: itemKey });

  if (error) {
    redirect(`/EditUser?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/EditUser");
}

export async function removePinnedItem(itemKey: number) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  await supabase
    .from("PinnedItems")
    .delete()
    .eq("UserKey", user.id)
    .eq("ItemKey", itemKey);

  redirect("/EditUser");
}
