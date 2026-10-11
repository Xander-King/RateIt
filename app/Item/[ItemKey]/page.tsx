import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import ItemPostsToggle from "@/components/ItemPostsToggle";

export default async function Item({ params }: { params: { ItemKey: string } }) {
    const itemKey = Number(params.ItemKey);
    const supabase = createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { data: itemInfoResults } = (await supabase.rpc("get_item_info", {
        ItemKeys: [itemKey],
    })) as { data: { ItemKey: number; ItemName: string; PostImageKey: string; PostRating: number }[] | null };

    const itemInfo = itemInfoResults?.[0];

    const { data: { publicUrl: itemImageUrl } } = supabase.storage
        .from("post-images")
        .getPublicUrl(itemInfo?.PostImageKey ?? "");

    const { data: recentPostsRaw } = await supabase
        .from("Posts")
        .select("PostKey, PostImagePath, PostDescription, PostRating")
        .eq("ItemKey", itemKey)
        .order("PostDate", { ascending: false })
        .limit(10);

    const recentPosts = (recentPostsRaw ?? []).map((post) => {
        const { data: { publicUrl } } = supabase.storage
            .from("post-images")
            .getPublicUrl(post.PostImagePath);

        return { ...post, ImageUrl: publicUrl };
    });

    let myPosts: typeof recentPosts = [];

    if (user) {
        const { data: myPostsRaw } = await supabase
            .from("Posts")
            .select("PostKey, PostImagePath, PostDescription, PostRating")
            .eq("ItemKey", itemKey)
            .eq("UserKey", user.id)
            .order("PostDate", { ascending: false })
            .limit(10);

        myPosts = (myPostsRaw ?? []).map((post) => {
            const { data: { publicUrl } } = supabase.storage
                .from("post-images")
                .getPublicUrl(post.PostImagePath);

            return { ...post, ImageUrl: publicUrl };
        });
    }

    return (
        <main className="flex min-h-screen flex-col items-center gap-6 p-8">
            <section className="flex w-full max-w-2xl flex-col items-center gap-4 text-center">
                <Image
                    src={itemImageUrl}
                    width={128}
                    height={128}
                    alt={itemInfo?.ItemName ?? "Item image"}
                    className="h-32 w-32 thumb"
                />
                <h1 className="page-heading">{itemInfo?.ItemName}</h1>
                <p className="muted">Average Rating: {itemInfo?.PostRating}</p>
                {user && (
                    <Link
                        href={`/MakePost/${itemKey}`}
                        className="btn-primary text-sm"
                    >
                        Make a Post
                    </Link>
                )}
            </section>

            <ItemPostsToggle recentPosts={recentPosts} myPosts={myPosts} showToggle={!!user} />
        </main>
    )
}
