import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function RecentPosts() {
    const supabase = createClient();

    const { data: RecentPosts } = (await supabase.rpc("get_recent_posts", {
        result_limit: 30,
    })) as {
        data: {
            UserKey: string;
            TopicKey: number;
            ItemKey: number;
            PostKey: number;
            TopicName: string;
            ItemName: string;
            UserName: string;
            PostRating: number;
            PostDescription: string;
        }[] | null;
    };

    return (
        <section className="mx-auto w-full max-w-2xl text-center lg:max-w-md">
            <h2 className="panel-heading">Recent Posts</h2>
            <div className="flex flex-col gap-4">
                {RecentPosts?.map((post, i) => {
                    return (
                        <div key={i} className="flex flex-col gap-1">
                            <Link href={`/User/${post.UserKey}`} className="link-accent">{post.UserName}</Link>
                            <Link href={`/Topic/${post.TopicKey}`} className="link-accent">{post.TopicName}</Link>
                            <Link href={`/Item/${post.ItemKey}`} className="link-accent">{post.ItemName}</Link>
                            <span className="stat">{post.PostRating} / 5</span>
                            <p className="muted">{post.PostDescription}</p>
                            <Link href={`/Post/${post.PostKey}`} className="link-accent">See Post</Link>
                        </div>
                    );
                })}
            </div>
        </section>
    )
}