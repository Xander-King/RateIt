import Link from 'next/link';
import { createClient } from "@/lib/supabase/server";

export default async function BoomingTopics() {
    const supabase = createClient();

    const { data: boomingTopics } = (await supabase.rpc("get_booming_topics", {
        result_limit: 30,
    })) as { data: { TopicKey: number; TopicName: string; EngagementCount: number }[] | null };

    return (
        <section className="mx-auto w-full max-w-2xl text-center">
            <h2 className="panel-heading">Booming Topics</h2>
            <div className="flex flex-col gap-4">
                {boomingTopics?.map((topic, i) => (
                    <div key={i} className="card">
                        <Link href={`/Topic/${topic.TopicKey}`} className="link-accent">{topic.TopicName}</Link>
                        <p className="muted">{topic.EngagementCount} likes + comments today</p>
                    </div>
                ))}
            </div>
        </section>
    )
}