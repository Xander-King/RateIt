import Image from "next/image";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateProfile, removePinnedTopic, removePinnedItem } from "@/lib/actions/user";
import PinnedTopicSearch from "@/components/PinnedTopicSearch";
import PinnedItemSearch from "@/components/PinnedItemSearch";

export default async function EditUser({
    searchParams,
}: {
    searchParams: { error?: string };
}) {
    const supabase = createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { data: userInfo } = await supabase
        .from("UserInfo")
        .select("UserName, ProfilePicPath")
        .eq("UserKey", user.id)
        .single();

    const { data: { publicUrl } } = supabase.storage
        .from("ProfilePic-images")
        .getPublicUrl(userInfo?.ProfilePicPath ?? "");

    const { data: pinnedTopics } = (await supabase
        .from("PinnedTopics")
        .select("TopicKey, Topics(TopicName, TopicIconImagePath)")
        .eq("UserKey", user.id)) as {
        data: { TopicKey: number; Topics: { TopicName: string; TopicIconImagePath: string } | null }[] | null;
    };

    const pinnedTopicCount = pinnedTopics?.length ?? 0;

    const { data: pinnedItemKeys } = await supabase
        .from("PinnedItems")
        .select("ItemKey")
        .eq("UserKey", user.id);

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

    const pinnedItemCount = pinnedItems.length;

    return (
        <main className="flex min-h-screen flex-col items-center gap-6 p-8">
            <h1 className="page-heading">Edit Profile</h1>

            {searchParams.error && (
                <p className="alert-error w-full max-w-sm">
                    {searchParams.error}
                </p>
            )}

            <section className="w-full max-w-sm">
                <form action={updateProfile} className="flex flex-col gap-4">
                    <div className="flex flex-col items-center gap-2">
                        <Image
                            src={publicUrl}
                            width={96}
                            height={96}
                            alt="Current profile picture"
                            className="h-24 w-24 avatar glow-cyan-lg"
                        />
                        <label htmlFor="ProfilePic" className="field-label w-full">
                            Change profile picture
                        </label>
                        <input
                            id="ProfilePic"
                            name="ProfilePic"
                            type="file"
                            accept="image/*"
                            className="field"
                        />
                    </div>

                    <div>
                        <label htmlFor="UserName" className="field-label">
                            Username
                        </label>
                        <input
                            id="UserName"
                            name="UserName"
                            type="text"
                            defaultValue={userInfo?.UserName}
                            required
                            className="field"
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn-primary mt-2"
                    >
                        Save
                    </button>
                </form>
            </section>

            <section className="w-full max-w-sm">
                <h2 className="panel-heading">
                    Pinned Topics ({pinnedTopicCount} / 4)
                </h2>

                <div className="flex flex-col gap-2">
                    {pinnedTopics?.map((pinnedTopic, i) => {
                        const topic = pinnedTopic.Topics;
                        const { data: { publicUrl: iconUrl } } = supabase.storage
                            .from("topicIcon-images")
                            .getPublicUrl(topic?.TopicIconImagePath ?? "");

                        const removeThisTopic = removePinnedTopic.bind(null, pinnedTopic.TopicKey);

                        return (
                            <div key={i} className="card flex items-center gap-3 p-2">
                                <Image
                                    src={iconUrl}
                                    width={32}
                                    height={32}
                                    alt={topic?.TopicName ? `${topic.TopicName} icon` : "Topic icon"}
                                    className="h-8 w-8 thumb"
                                />
                                <span className="stat flex-1 text-sm">{topic?.TopicName}</span>
                                <form action={removeThisTopic}>
                                    <button
                                        type="submit"
                                        className="link-muted"
                                    >
                                        Remove
                                    </button>
                                </form>
                            </div>
                        );
                    })}
                </div>

                {pinnedTopicCount >= 4 ? (
                    <p className="mt-4 text-sm muted">You&apos;ve reached the pin limit (4).</p>
                ) : (
                    <div className="mt-4">
                        <PinnedTopicSearch />
                    </div>
                )}
            </section>

            <section className="w-full max-w-sm">
                <h2 className="panel-heading">
                    Pinned Items ({pinnedItemCount} / 4)
                </h2>

                <div className="flex flex-col gap-2">
                    {pinnedItems?.map((item, i) => {
                        const { data: { publicUrl: itemImageUrl } } = supabase.storage
                            .from("post-images")
                            .getPublicUrl(item.PostImagePath);

                        const removeThisItem = removePinnedItem.bind(null, item.ItemKey);

                        return (
                            <div key={i} className="card flex items-center gap-3 p-2">
                                <Image
                                    src={itemImageUrl}
                                    width={32}
                                    height={32}
                                    alt={item.ItemName ?? "Item image"}
                                    className="h-8 w-8 thumb"
                                />
                                <span className="stat flex-1 text-sm">{item.ItemName}</span>
                                <form action={removeThisItem}>
                                    <button
                                        type="submit"
                                        className="link-muted"
                                    >
                                        Remove
                                    </button>
                                </form>
                            </div>
                        );
                    })}
                </div>

                {pinnedItemCount >= 4 ? (
                    <p className="mt-4 text-sm muted">You&apos;ve reached the pin limit (4).</p>
                ) : (
                    <div className="mt-4">
                        <PinnedItemSearch />
                    </div>
                )}
            </section>
        </main>
    )
}
