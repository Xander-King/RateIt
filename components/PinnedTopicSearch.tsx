"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import { searchTopics } from "@/lib/actions/search";
import { addPinnedTopic } from "@/lib/actions/user";

type Topic = { TopicKey: number; TopicName: string; IconUrl: string };

export default function PinnedTopicSearch() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Topic[] | null>(null);
    const [isPending, startTransition] = useTransition();

    function handleSearch() {
        if (!query.trim()) {
            setResults(null);
            return;
        }

        startTransition(async () => {
            const data = await searchTopics(query);
            setResults(data);
        });
    }

    function handleAdd(topicKey: number) {
        startTransition(async () => {
            await addPinnedTopic(topicKey);
        });
    }

    return (
        <div className="flex flex-col gap-2">
            <div className="flex gap-2">
                <input
                    type="text"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    onKeyDown={(event) => {
                        if (event.key === "Enter") {
                            event.preventDefault();
                            handleSearch();
                        }
                    }}
                    placeholder="Search topics to pin..."
                    className="field"
                />
                <button
                    type="button"
                    onClick={handleSearch}
                    className="btn-outline px-4 py-2"
                >
                    Search
                </button>
            </div>

            {isPending && <p className="text-sm muted">Loading...</p>}

            {!isPending && results && (
                <div className="flex flex-col gap-2">
                    {results.length === 0 && <p className="text-sm muted">No topics found.</p>}
                    {results.map((topic) => (
                        <button
                            key={topic.TopicKey}
                            type="button"
                            onClick={() => handleAdd(topic.TopicKey)}
                            className="card-hover flex items-center gap-3 p-2"
                        >
                            <Image
                                src={topic.IconUrl}
                                width={32}
                                height={32}
                                alt={`${topic.TopicName} icon`}
                                className="h-8 w-8 thumb"
                            />
                            <span className="stat text-sm">{topic.TopicName}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
