import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function UserLikes({ params }: { params: { UserKey: string } }) {
    const supabase = createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { data: likes } = (await supabase
        .from("Likes")
        .select("PostKey, Posts(PostImagePath, PostDescription, PostRating)")
        .eq("UserKey", params.UserKey)) as {
        data: { PostKey: number; Posts: { PostImagePath: string; PostDescription: string; PostRating: number } | null }[] | null;
    };

    return (
        <section className="mx-auto w-full max-w-2xl text-center lg:max-w-md">
            <h2 className="panel-heading">Liked Posts</h2>
            <div className="flex flex-col gap-4">
                {likes?.map((like, i) => {
                    const post = like.Posts;
                    if (!post) return null;

                    const { data: { publicUrl } } = supabase.storage
                        .from("post-images")
                        .getPublicUrl(post.PostImagePath);

                    return (
                        <Link
                            key={i}
                            href={`/Post/${like.PostKey}`}
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
    )
}
