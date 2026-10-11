import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function Friends({ params }: { params: { UserKey: string } }) {
    const supabase = createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { data: friends } = (await supabase
        .from("Friends")
        .select("FriendKey, UserInfo!FriendKey(UserName, ProfilePicPath)")
        .eq("UserKey", params.UserKey)) as {
        data: { FriendKey: string; UserInfo: { UserName: string; ProfilePicPath: string } | null }[] | null;
    };

    return (
        <section className="mx-auto w-full max-w-2xl text-center lg:max-w-md">
            <h2 className="panel-heading">Friends</h2>
            <div className="flex flex-col gap-4">
                {friends?.map((friend, i) => {
                    const { data: { publicUrl } } = supabase.storage
                        .from("ProfilePic-images")
                        .getPublicUrl(friend.UserInfo?.ProfilePicPath ?? "");

                    return (
                        <div key={i} className="card flex items-center gap-4">
                            <Image
                                src={publicUrl}
                                width={40}
                                height={40}
                                alt={friend.UserInfo?.UserName ? `${friend.UserInfo.UserName}'s profile picture` : "Profile picture"}
                                className="h-10 w-10 avatar"
                            />
                            <Link href={`/User/${friend.FriendKey}`} className="link-accent">{friend.UserInfo?.UserName}</Link>
                        </div>
                    );
                })}
            </div>
        </section>
    )
}
