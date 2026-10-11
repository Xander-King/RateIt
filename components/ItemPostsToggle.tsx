"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type Post = { PostKey: number; PostDescription: string; PostRating: number; ImageUrl: string };

export default function ItemPostsToggle({
    recentPosts,
    myPosts,
    showToggle,
}: {
    recentPosts: Post[];
    myPosts: Post[];
    showToggle: boolean;
}) {
    const [showMyPosts, setShowMyPosts] = useState(false);
    const posts = showMyPosts ? myPosts : recentPosts;

    return (
        <section className="w-full max-w-2xl lg:max-w-md">
            <div className="mb-4 flex items-center gap-2">
                <h2 className="panel-heading">
                    {showMyPosts ? "My Posts" : "Recent Posts"}
                </h2>
                {showToggle && (
                    <button
                        type="button"
                        onClick={() => setShowMyPosts((prev) => !prev)}
                        className="btn-outline"
                    >
                        {showMyPosts ? "Show Recent Posts" : "Show My Posts"}
                    </button>
                )}
            </div>
            <div className="flex flex-col gap-4">
                {posts.map((post, i) => (
                    <Link
                        key={i}
                        href={`/Post/${post.PostKey}`}
                        className="card-hover flex gap-4"
                    >
                        <Image
                            src={post.ImageUrl}
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
                ))}
            </div>
        </section>
    )
}
