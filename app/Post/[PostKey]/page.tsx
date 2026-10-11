import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function Post({ params }: { params: { PostKey: string } }) {
    const postKey = Number(params.PostKey);
    const supabase = createClient();

    const { data: post } = await supabase
        .from("Posts")
        .select("UserKey, PostImagePath, PostDescription, PostRating")
        .eq("PostKey", postKey)
        .single();

    const { count: likeCount } = await supabase
        .from("Likes")
        .select("*", { count: "exact", head: true })
        .eq("PostKey", postKey);

    const { count: commentCount } = await supabase
        .from("Comments")
        .select("*", { count: "exact", head: true })
        .eq("PostKey", postKey);

    if (!post) {
        return (
            <main className="flex min-h-screen flex-col items-center gap-6 p-8">
                <p className="muted">Post not found.</p>
            </main>
        );
    }

    const { data: { publicUrl } } = supabase.storage
        .from("post-images")
        .getPublicUrl(post.PostImagePath);

    return (
        <main className="flex min-h-screen flex-col items-center gap-6 p-8">
            <section className="w-full max-w-2xl lg:max-w-md">
                <div className="card flex gap-4">
                    <Image
                        src={publicUrl}
                        width={80}
                        height={80}
                        alt={post.PostDescription ?? "Post image"}
                        className="h-20 w-20 thumb"
                    />
                    <div className="flex flex-1 flex-col gap-1">
                        <span className="stat">{post.PostRating} / 5</span>
                        <p className="muted">{post.PostDescription}</p>
                    </div>
                    <Link href={`/User/${post.UserKey}`} className="link-accent">
                        User
                    </Link>
                </div>

                <div className="mt-4 flex gap-4">
                    <Link
                        href={`/PostLikes/${postKey}`}
                        className="badge-link"
                    >
                        {likeCount ?? 0} likes
                    </Link>
                    <Link
                        href={`/PostComments/${postKey}`}
                        className="badge-link"
                    >
                        {commentCount ?? 0} comments
                    </Link>
                </div>
            </section>
        </main>
    )
    // TODO we need a new page for Post Creation. Will get to it once I start 
    // DB insertion development/testing
}
