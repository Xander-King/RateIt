import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createPostForTopic } from "@/lib/actions/posts";
import RatingSlider from "@/components/RatingSlider";
import ItemResolver from "@/components/ItemResolver";

export default async function MakePostTopic({
    params,
    searchParams,
}: {
    params: { TopicKey: string };
    searchParams: { error?: string };
}) {
    const topicKey = Number(params.TopicKey);
    const supabase = createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const createPostForThisTopic = createPostForTopic.bind(null, topicKey);

    return (
        <main className="flex min-h-screen items-center justify-center p-8">
            <div className="w-full max-w-sm">
                <h1 className="page-heading mb-6 text-2xl">Make a Post</h1>

                {searchParams.error && (
                    <p className="alert-error">
                        {searchParams.error}
                    </p>
                )}

                <form action={createPostForThisTopic} className="flex flex-col gap-4">
                    <ItemResolver topicKey={topicKey} />

                    <div>
                        <label htmlFor="PostImage" className="field-label">
                            Photo
                        </label>
                        <input
                            id="PostImage"
                            name="PostImage"
                            type="file"
                            accept="image/*"
                            required
                            className="field"
                        />
                    </div>

                    <RatingSlider />

                    <div>
                        <label htmlFor="PostDescription" className="field-label">
                            Description
                        </label>
                        <textarea
                            id="PostDescription"
                            name="PostDescription"
                            rows={4}
                            required
                            className="field"
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn-primary mt-2"
                    >
                        Post
                    </button>
                </form>
            </div>
        </main>
    )
}
