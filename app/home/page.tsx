import Link from 'next/link';
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: RecentPosts } = (await supabase.rpc("get_recent_posts", {
    result_limit: 10,
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

  const { data: boomingTopics } = (await supabase.rpc("get_booming_topics", {
    result_limit: 10,
  })) as { data: { TopicKey: number; TopicName: string; EngagementCount: number }[] | null };

  let feedPosts: {
    UserKey: string;
    TopicKey: number;
    ItemKey: number;
    PostKey: number;
    TopicName: string;
    ItemName: string;
    UserName: string;
    PostRating: number;
    PostDescription: string;
  }[] = [];

  if (user) {
    const { data } = (await supabase.rpc("get_feed", {
      UserKey: user.id,
      result_limit: 10,
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

    feedPosts = data ?? [];
  }

  return (
    <div>
      <main className="flex min-h-screen flex-col items-center gap-6 p-8">
        <div className="flex w-full max-w-4xl flex-col items-center gap-6 lg:flex-row lg:items-start lg:justify-center">
          <section className="w-full max-w-2xl text-center lg:max-w-md">
            <h2 className="panel-heading">
              <Link href="/RecentPosts">
                Recent Posts
              </Link></h2>
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

          {user && (
            <section className="w-full max-w-2xl text-center lg:max-w-md">
              <h2 className="panel-heading">
                <Link href="/Feed">
                  Feed
                </Link></h2>
              <div className="flex flex-col gap-4">
                {feedPosts.map((post, i) => (
                  <div key={i} className="card flex flex-col gap-1">
                    <Link href={`/User/${post.UserKey}`} className="link-accent">{post.UserName}</Link>
                    <Link href={`/Topic/${post.TopicKey}`} className="link-accent">{post.TopicName}</Link>
                    <Link href={`/Item/${post.ItemKey}`} className="link-accent">{post.ItemName}</Link>
                    <span className="stat">{post.PostRating} / 5</span>
                    <p className="muted">{post.PostDescription}</p>
                    <Link href={`/Post/${post.PostKey}`} className="link-accent">See Post</Link>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <section className="mx-auto w-full max-w-2xl text-center">
          <h2 className="panel-heading">
            <Link href="/BoomingTopics">Booming Topics</Link>
          </h2>
          <div className="flex flex-col gap-4">
            {boomingTopics?.map((topic, i) => (
              <div key={i} className="card">
                <Link href={`/Topic/${topic.TopicKey}`} className="link-accent">{topic.TopicName}</Link>
                <p className="muted">{topic.EngagementCount} likes + comments today</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
