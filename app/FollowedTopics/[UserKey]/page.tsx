import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function FollowedTopics({ params }: { params: { UserKey: string } }) {
    const supabase = createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { data: followedTopics } = (await supabase
        .from("FollowedTopics")
        .select("TopicKey, Topics(TopicName)")
        .eq("UserKey", params.UserKey)) as {
        data: { TopicKey: number; Topics: { TopicName: string } | null }[] | null;
    };

    return (
        <section className="mx-auto w-full max-w-2xl text-center lg:max-w-md">
            <h2 className="panel-heading">Followed Topics</h2>
            <div className="flex flex-col gap-4">
                {followedTopics?.map((topic, i) => (
                    <div key={i} className="card">
                        <Link href={`/Topic/${topic.TopicKey}`} className="link-accent">{topic.Topics?.TopicName}</Link>
                    </div>
                ))}
            </div>
        </section>
    )
}
