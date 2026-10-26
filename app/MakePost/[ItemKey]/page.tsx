import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createPost } from "@/lib/actions/posts";
import RatingSlider from "@/components/RatingSlider";
import ImagePicker from "@/components/ImagePicker";

export default async function MakePost({
    params,
    searchParams,
}: {
    params: { ItemKey: string };
    searchParams: { error?: string };
}) {
    const itemKey = Number(params.ItemKey);
    const supabase = createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const createPostForItem = createPost.bind(null, itemKey);

    return (
        <main className="flex min-h-screen items-center justify-center p-8">
            <div className="w-full max-w-sm">
                <h1 className="page-heading mb-6 text-2xl">Make a Post</h1>

                {searchParams.error && (
                    <p className="alert-error">
                        {searchParams.error}
                    </p>
                )}

                <form action={createPostForItem} className="flex flex-col gap-4">
                    <div>
                        <label htmlFor="PostImage" className="field-label">
                            Photo
                        </label>
                        <ImagePicker
                            id="PostImage"
                            name="PostImage"
                            required
                            previewAlt="Selected photo preview"
                            previewClassName="h-40 w-40 thumb object-cover"
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
// TODO look into allowing image cropping
// TODO look into removing profile pics no longer in use from storage
//after a change
// TODO make post cards look better and less bulky. Maybe only a preview
//of the description?
