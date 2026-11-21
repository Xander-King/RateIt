import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { likePost, unlikePost } from "@/lib/actions/posts";

export default async function Post({
    params,
    searchParams,
}: {
    params: { PostKey: string };
    searchParams: { error?: string };
}) {
    const postKey = Number(params.PostKey);
    const supabase = createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { data: post } = await supabase
        .from("Posts")
        .select("UserKey, PostImagePath, PostDescription, PostRating")
        .eq("PostKey", postKey)
        .single();

    const { count: likeCount } = await supabase
        .from("Likes")
        .select("*", { count: "exact", head: true })
        .eq("PostKey", postKey);

    let alreadyLiked = false;

    if (user) {
        const { data: existingLike } = await supabase
            .from("Likes")
            .select("UserKey")
            .eq("PostKey", postKey)
            .eq("UserKey", user.id)
            .maybeSingle();

        alreadyLiked = !!existingLike;
    }

    const likeThisPost = likePost.bind(null, postKey);
    const unlikeThisPost = unlikePost.bind(null, postKey);

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
                {searchParams.error && (
                    <p className="alert-error">
                        {searchParams.error}
                    </p>
                )}

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

                        {user && (
                            <form action={alreadyLiked ? unlikeThisPost : likeThisPost}>
                                <button
                                    type="submit"
                                    aria-label={alreadyLiked ? "Unlike" : "Like"}
                                    aria-pressed={alreadyLiked}
                                    className="icon-btn self-start"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={alreadyLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                                    </svg>
                                </button>
                            </form>
                        )}
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
