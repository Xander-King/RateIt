import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function User({ params }: { params: { UserKey: string } }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const userKey = params.UserKey;

  const { data: userInfo } = await supabase
    .from("UserInfo")
    .select("UserName, ProfilePicPath")
    .eq("UserKey", userKey)
    .single();

  const { data: { publicUrl } } = supabase.storage
    .from("ProfilePic-images")
    .getPublicUrl(userInfo?.ProfilePicPath ?? "");

  const { data: pinnedTopics } = (await supabase
    .from("PinnedTopics")
    .select("TopicKey, Topics(TopicName, TopicIconImagePath)")
    .eq("UserKey", userKey)
    .limit(4)) as {
    data: { TopicKey: number; Topics: { TopicName: string; TopicIconImagePath: string } | null }[] | null;
  };

  const { data: pinnedItemKeys } = await supabase
    .from("PinnedItems")
    .select("ItemKey")
    .eq("UserKey", userKey)
    .limit(4);

  const { data: pinnedItemInfo } = (await supabase.rpc("get_item_info", {
    ItemKeys: pinnedItemKeys?.map((p) => p.ItemKey) ?? [],
  })) as { data: { ItemKey: number; ItemName: string; PostRating: number }[] | null };

  const { data: pinnedItemImages } = (await supabase.rpc("get_item_image", {
    ItemKeys: pinnedItemKeys?.map((p) => p.ItemKey) ?? [],
  })) as { data: { ItemKey: number; PostImagePath: string }[] | null };

  const imagePathByItemKey = new Map(
    pinnedItemImages?.map((image) => [image.ItemKey, image.PostImagePath])
  );

  const pinnedItems = (pinnedItemInfo ?? []).map((item) => ({
    ...item,
    PostImagePath: imagePathByItemKey.get(item.ItemKey) ?? "",
  }));

  return (
    <main className="flex min-h-screen flex-col items-center gap-6 p-8">
      <h1 className="page-heading">My Account</h1>
      <section className="flex w-full max-w-2xl flex-col items-center gap-4 text-center">
        <Image
          src={publicUrl}
          width={128}
          height={128}
          alt={userInfo?.UserName ? `${userInfo.UserName}'s profile picture` : "Profile picture"}
          className="h-32 w-32 avatar glow-cyan-lg"
        />
        <h2 className="panel-heading text-2xl">{userInfo?.UserName}</h2>
        {userKey === user.id && (
          <Link
            href="/EditUser"
            className="btn-outline"
          >
            Edit Profile
          </Link>
        )}
      </section>

      <section className="mx-auto w-full max-w-2xl text-center lg:max-w-md">
        <h2 className="panel-heading">Pinned Topics</h2>
        <div className="flex flex-col gap-4">
          {pinnedTopics?.map((pinnedTopic, i) => {
            const topic = pinnedTopic.Topics;
            const { data: { publicUrl: iconUrl } } = supabase.storage
              .from("topicIcon-images")
              .getPublicUrl(topic?.TopicIconImagePath ?? "");

            return (
              <div key={i} className="card flex items-center gap-4">
                <Image
                  src={iconUrl}
                  width={40}
                  height={40}
                  alt={topic?.TopicName ? `${topic.TopicName} icon` : "Topic icon"}
                  className="h-10 w-10 thumb"
                />
                <Link href={`/Topic/${pinnedTopic.TopicKey}`} className="link-accent">{topic?.TopicName}</Link>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto w-full max-w-2xl text-center lg:max-w-md">
        <h2 className="panel-heading">Pinned Items</h2>
        <div className="flex flex-col gap-4">
          {pinnedItems?.map((item, i) => {
            const { data: { publicUrl: itemImageUrl } } = supabase.storage
              .from("post-images")
              .getPublicUrl(item.PostImagePath);

            return (
              <div key={i} className="card flex gap-4">
                <Image
                  src={itemImageUrl}
                  width={80}
                  height={80}
                  alt={item.ItemName ?? "Item image"}
                  className="h-20 w-20 thumb"
                />
                <div className="flex flex-col gap-1">
                  <Link href={`/Item/${item.ItemKey}`} className="link-accent">{item.ItemName}</Link>
                  <p className="muted">Average Rating: {item.PostRating}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <nav className="flex w-full max-w-2xl flex-wrap items-center justify-center gap-2">
        <Link
          href={`/FollowedTopics/${userKey}`}
          className="btn-outline"
        >
          Followed Topics
        </Link>
        <Link
          href={`/Friends/${userKey}`}
          className="btn-outline"
        >
          Friends
        </Link>
        {userKey === user.id && (
          <Link
            href="/Feed"
            className="btn-outline"
          >
            Feed
          </Link>
        )}
        <Link
          href={`/UserLikes/${userKey}`}
          className="btn-outline"
        >
          Likes
        </Link>
        <Link
          href={`/UserComments/${userKey}`}
          className="btn-outline"
        >
          Comments
        </Link>
        <Link
          href={`/UserPosts/${userKey}`}
          className="btn-outline"
        >
          Posts
        </Link>
      </nav>
    </main>
  );
}
