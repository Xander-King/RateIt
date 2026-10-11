import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import TopicItemSearch from "@/components/TopicItemSearch";

export default async function Topic({ params }: { params: { TopicKey: string } }) {
    const topicKey = Number(params.TopicKey);
    const supabase = createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { data: topic } = await supabase
        .from("Topics")
        .select("TopicName")
        .eq("TopicKey", topicKey)
        .single();

    const { data: boomingItems } = (await supabase.rpc("get_booming_items_for_topic", {
        TopicKey: topicKey,
        result_limit: 5,
    })) as { data: { ItemKey: number; ItemName: string }[] | null };

    const { data: randomItemKey } = await supabase.rpc("get_random_item");

    const { data: recentPosts } = (await supabase
        .from("Posts")
        .select("PostKey, PostImagePath, PostDescription, PostRating, Items!inner(TopicKey)")
        .eq("Items.TopicKey", topicKey)
        .order("PostDate", { ascending: false })
        .limit(10)) as {
        data: { PostKey: number; PostImagePath: string; PostDescription: string; PostRating: number }[] | null;
    };

    return (
        <main className="flex min-h-screen flex-col items-center gap-6 p-8">
            <h1 className="page-heading">{topic?.TopicName}</h1>

            <div className="flex w-full max-w-2xl items-center justify-end gap-4">
                <Link href={`/Item/${randomItemKey}`} className="link-accent">
                    Random Item
                </Link>
                {user && (
                    <Link
                        href={`/MakePostTopic/${topicKey}`}
                        className="btn-primary text-sm"
                    >
                        Make a Post
                    </Link>
                )}
            </div>

            <TopicItemSearch topicKey={topicKey} />

            <section className="w-full max-w-2xl lg:max-w-md">
                <h2 className="panel-heading">Booming Items</h2>
                <div className="flex flex-col gap-4">
                    {boomingItems?.map((item, i) => (
                        <div key={i} className="card">
                            <Link href={`/Item/${item.ItemKey}`} className="link-accent">{item.ItemName}</Link>
                        </div>
                    ))}
                </div>
            </section>

            <section className="w-full max-w-2xl lg:max-w-md">
                <h2 className="panel-heading">Recent Posts</h2>
                <div className="flex flex-col gap-4">
                    {recentPosts?.map((post, i) => {
                        const { data: { publicUrl } } = supabase.storage
                            .from("post-images")
                            .getPublicUrl(post.PostImagePath);

                        return (
                            <Link
                                key={i}
                                href={`/Post/${post.PostKey}`}
                                className="card-hover flex gap-4"
                            >
                                <Image
                                    src={publicUrl}
                                    width={80}
                                    height={80}
                                    alt={post.PostDescription ?? "Post image"}
                                    className="h-20 w-20 thumb"
                                />
                                <div className="flex flex-col gap-1">
                                    <span className="stat">{post.PostRating} / 5</span>
                                    <p className="muted">{post.PostDescription}</p>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </section>
        </main>
    )
}
