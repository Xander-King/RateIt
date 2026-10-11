"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import { searchItems } from "@/lib/actions/search";
import { addPinnedItem } from "@/lib/actions/user";

type Item = { ItemKey: number; ItemName: string; ImageUrl: string; PostRating: number };

export default function PinnedItemSearch() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Item[] | null>(null);
    const [isPending, startTransition] = useTransition();

    function handleSearch() {
        if (!query.trim()) {
            setResults(null);
            return;
        }

        startTransition(async () => {
            const data = await searchItems(query);
            setResults(data);
        });
    }

    function handleAdd(itemKey: number) {
        startTransition(async () => {
            await addPinnedItem(itemKey);
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
                    placeholder="Search items to pin..."
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
                    {results.length === 0 && <p className="text-sm muted">No items found.</p>}
                    {results.map((item) => (
                        <button
                            key={item.ItemKey}
                            type="button"
                            onClick={() => handleAdd(item.ItemKey)}
                            className="card-hover flex items-center gap-3 p-2"
                        >
                            <Image
                                src={item.ImageUrl}
                                width={32}
                                height={32}
                                alt={item.ItemName}
                                className="h-8 w-8 thumb"
                            />
                            <span className="stat text-sm">{item.ItemName}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
