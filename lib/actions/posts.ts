"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function createPost(itemKey: number, formData: FormData) {
  const rating = Number(formData.get("PostRating"));
  const description = formData.get("PostDescription") as string;
  const image = formData.get("PostImage") as File;

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  if (!image || image.size === 0) {
    redirect(`/MakePost/${itemKey}?error=${encodeURIComponent("Please upload a photo")}`);
  }

  const imagePath = `${user.id}/${Date.now()}_${image.name}`;

  const { error: uploadError } = await supabase.storage
    .from("post-images")
    .upload(imagePath, image);

  if (uploadError) {
    redirect(`/MakePost/${itemKey}?error=${encodeURIComponent(uploadError.message)}`);
  }

  const { data: post, error: insertError } = await supabase
    .from("Posts")
    .insert({
      UserKey: user.id,
      ItemKey: itemKey,
      PostImagePath: imagePath,
      PostRating: rating,
      PostDescription: description,
      PostDate: new Date().toISOString(),
    })
    .select("PostKey")
    .single();

  if (insertError || !post) {
    redirect(`/MakePost/${itemKey}?error=${encodeURIComponent(insertError?.message ?? "Could not create post")}`);
  }

  redirect(`/Post/${post.PostKey}`);
}

export async function createPostForTopic(topicKey: number, formData: FormData) {
  const itemKeyRaw = formData.get("ItemKey") as string;
  const newItemName = (formData.get("NewItemName") as string)?.trim();
  const rating = Number(formData.get("PostRating"));
  const description = formData.get("PostDescription") as string;
  const image = formData.get("PostImage") as File;

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  if (!image || image.size === 0) {
    redirect(`/MakePostTopic/${topicKey}?error=${encodeURIComponent("Please upload a photo")}`);
  }

  let itemKey: number;

  if (itemKeyRaw) {
    itemKey = Number(itemKeyRaw);
  } else if (newItemName) {
    const { data: newItem, error: itemError } = await supabase
      .from("Items")
      .insert({ ItemName: newItemName, TopicKey: topicKey })
      .select("ItemKey")
      .single();

    if (itemError || !newItem) {
      redirect(`/MakePostTopic/${topicKey}?error=${encodeURIComponent(itemError?.message ?? "Could not create item")}`);
    }

    itemKey = newItem.ItemKey;
  } else {
    redirect(`/MakePostTopic/${topicKey}?error=${encodeURIComponent("Please select or create an item")}`);
  }

  const imagePath = `${user.id}/${Date.now()}_${image.name}`;

  const { error: uploadError } = await supabase.storage
    .from("post-images")
    .upload(imagePath, image);

  if (uploadError) {
    redirect(`/MakePostTopic/${topicKey}?error=${encodeURIComponent(uploadError.message)}`);
  }

  const { data: post, error: insertError } = await supabase
    .from("Posts")
    .insert({
      UserKey: user.id,
      ItemKey: itemKey,
      PostImagePath: imagePath,
      PostRating: rating,
      PostDescription: description,
      PostDate: new Date().toISOString(),
    })
    .select("PostKey")
    .single();

  if (insertError || !post) {
    redirect(`/MakePostTopic/${topicKey}?error=${encodeURIComponent(insertError?.message ?? "Could not create post")}`);
  }

  redirect(`/Post/${post.PostKey}`);
}
