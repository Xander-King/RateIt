"use client";

import { useState, useTransition } from "react";
import { searchItemsInTopic } from "@/lib/actions/search";

type Item = { ItemKey: number; ItemName: string };

export default function ItemResolver({ topicKey }: { topicKey: number }) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Item[] | null>(null);
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const [newItemName, setNewItemName] = useState("");
    const [isPending, startTransition] = useTransition();

    function handleSearch() {
        if (!query.trim()) {
            setResults(null);
            return;
        }

        startTransition(async () => {
            const data = await searchItemsInTopic(topicKey, query);
            setResults(data);
        });
    }

    function selectItem(item: Item) {
        setSelectedItem(item);
        setNewItemName("");
        setResults(null);
        setQuery("");
    }

    return (
        <div className="flex flex-col gap-1">
            <label className="field-label">Item</label>

            {selectedItem ? (
                <div className="flex items-center justify-between rounded-md border border-neon-cyan/40 bg-noir-900/50 px-3 py-2">
                    <span className="stat">{selectedItem.ItemName}</span>
                    <button
                        type="button"
                        onClick={() => setSelectedItem(null)}
                        className="link-muted"
                    >
                        Change
                    </button>
                </div>
            ) : (
                <>
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
                            placeholder="Search items in this topic..."
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

                    {isPending && <p className="mt-2 text-sm muted">Searching...</p>}

                    {!isPending && results && (
                        <div className="mt-2 flex flex-col gap-2">
                            {results.length === 0 && (
                                <p className="text-sm muted">No items found.</p>
                            )}
                            {results.map((item) => (
                                <button
                                    key={item.ItemKey}
                                    type="button"
                                    onClick={() => selectItem(item)}
                                    className="card-hover px-3 py-2 text-sm"
                                >
                                    {item.ItemName}
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="mt-4">
                        <label htmlFor="NewItemName" className="field-label">
                            Or create a new item
                        </label>
                        <input
                            id="NewItemName"
                            name="NewItemName"
                            type="text"
                            value={newItemName}
                            onChange={(event) => setNewItemName(event.target.value)}
                            placeholder="New item name"
                            className="field"
                        />
                    </div>
                </>
            )}

            <input type="hidden" name="ItemKey" value={selectedItem?.ItemKey ?? ""} />
        </div>
    )
}
