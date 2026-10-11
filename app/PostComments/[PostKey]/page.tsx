import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function PostComments({ params }: { params: { PostKey: string } }) {
    const supabase = createClient();

    const { data: comments } = (await supabase
        .from("Comments")
        .select("UserKey, CommentText, UserInfo(UserName)")
        .eq("PostKey", params.PostKey)) as {
        data: { UserKey: string; CommentText: string; UserInfo: { UserName: string } | null }[] | null;
    };

    return (
        <section className="w-full max-w-2xl lg:max-w-md">
            <h2 className="panel-heading">Comments</h2>
            <div className="flex flex-col gap-4">
                {comments?.map((comment, i) => (
                    <div key={i} className="card">
                        <Link href={`/User/${comment.UserKey}`} className="link-accent">{comment.UserInfo?.UserName}</Link>
                        <p className="muted">{comment.CommentText}</p>
                    </div>
                ))}
            </div>
        </section>
    )
}
