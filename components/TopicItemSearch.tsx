"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { searchItemsInTopic } from "@/lib/actions/search";

export default function TopicItemSearch({ topicKey }: { topicKey: number }) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<{ ItemKey: number; ItemName: string }[] | null>(null);
    const [isPending, startTransition] = useTransition();

    function handleSubmit(event: React.FormEvent) {
        event.preventDefault();

        if (!query.trim()) {
            setResults(null);
            return;
        }

        startTransition(async () => {
            const data = await searchItemsInTopic(topicKey, query);
            setResults(data);
        });
    }

    return (
        <div className="flex w-full max-w-2xl lg:max-w-md flex-col gap-4">
            <form onSubmit={handleSubmit} className="flex w-full gap-2">
                <input
                    type="text"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search items in this topic..."
                    className="field"
                />
                <button
                    type="submit"
                    className="btn-primary"
                >
                    Search
                </button>
            </form>

            {isPending && <p className="text-center muted">Searching...</p>}

            {!isPending && results && (
                <div className="flex flex-col gap-4">
                    {results.length === 0 && (
                        <p className="text-center muted">No items found.</p>
                    )}
                    {results.map((item, i) => (
                        <div key={i} className="card">
                            <Link href={`/Item/${item.ItemKey}`} className="link-accent">
                                {item.ItemName}
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
