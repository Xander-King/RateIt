import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function PostLikes({ params }: { params: { PostKey: string } }) {
    const supabase = createClient();

    const { data: likes } = (await supabase
        .from("Likes")
        .select("UserKey, UserInfo(UserName)")
        .eq("PostKey", params.PostKey)) as {
        data: { UserKey: string; UserInfo: { UserName: string } | null }[] | null;
    };

    return (
        <section className="w-full max-w-2xl lg:max-w-md">
            <h2 className="panel-heading">Likes</h2>
            <div className="flex flex-col gap-4">
                {likes?.map((like, i) => (
                    <div key={i} className="card">
                        <Link href={`/User/${like.UserKey}`} className="link-accent">{like.UserInfo?.UserName}</Link>
                    </div>
                ))}
            </div>
        </section>
    )
}
