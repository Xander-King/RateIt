"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useTransition } from "react";
import { searchUsers, searchTopics, searchItems } from "@/lib/actions/search";

type Subject = "Users" | "Topics" | "Items";

type Results =
    | { subject: "Users"; data: { UserKey: string; UserName: string }[] }
    | { subject: "Topics"; data: { TopicKey: number; TopicName: string; IconUrl: string }[] }
    | { subject: "Items"; data: { ItemKey: number; ItemName: string; ImageUrl: string; PostRating: number }[] };

const SUBJECTS: Subject[] = ["Users", "Topics", "Items"];

export default function Search() {
    const [query, setQuery] = useState("");
    const [subject, setSubject] = useState<Subject>("Users");
    const [results, setResults] = useState<Results | null>(null);
    const [isPending, startTransition] = useTransition();

    function runSearch(nextSubject: Subject, nextQuery: string) {
        if (!nextQuery.trim()) {
            setResults(null);
            return;
        }

        startTransition(async () => {
            if (nextSubject === "Users") {
                const data = await searchUsers(nextQuery);
                setResults({ subject: "Users", data });
            } else if (nextSubject === "Topics") {
                const data = await searchTopics(nextQuery);
                setResults({ subject: "Topics", data });
            } else {
                const data = await searchItems(nextQuery);
                setResults({ subject: "Items", data });
            }
        });
    }

    function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        runSearch(subject, query);
    }

    function handleSubjectChange(nextSubject: Subject) {
        setSubject(nextSubject);
        runSearch(nextSubject, query);
    }

    return (
        <main className="flex min-h-screen flex-col items-center gap-6 p-8">
            <h1 className="page-heading">Search</h1>

            <div className="flex w-full max-w-2xl flex-col items-center gap-4">
                <form onSubmit={handleSubmit} className="flex w-full gap-2">
                    <input
                        type="text"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder={`Search ${subject.toLowerCase()}...`}
                        className="field"
                    />
                    <button
                        type="submit"
                        className="btn-primary"
                    >
                        Search
                    </button>
                </form>

                <div className="flex items-center gap-2">
                    {SUBJECTS.map((s) => (
                        <button
                            key={s}
                            type="button"
                            aria-pressed={subject === s}
                            onClick={() => handleSubjectChange(s)}
                            className={`rounded-md border px-3 py-1.5 font-display text-sm uppercase tracking-wide transition ${
                                subject === s
                                    ? "border-neon-amber bg-neon-amber text-noir-950"
                                    : "border-neon-cyan/40 bg-noir-900/40 text-neon-cyan hover:bg-neon-cyan/10"
                            }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            <section className="w-full max-w-2xl lg:max-w-md">
                <div className="flex flex-col gap-4">
                    {isPending && <p className="text-center muted">Searching...</p>}

                    {!isPending && results?.subject === "Users" &&
                        results.data.map((user, i) => (
                            <div key={i} className="card">
                                <Link href={`/User/${user.UserKey}`} className="link-accent">{user.UserName}</Link>
                            </div>
                        ))}

                    {!isPending && results?.subject === "Topics" &&
                        results.data.map((topic, i) => (
                            <div key={i} className="card flex items-center gap-4">
                                <Image
                                    src={topic.IconUrl}
                                    width={40}
                                    height={40}
                                    alt={`${topic.TopicName} icon`}
                                    className="h-10 w-10 thumb"
                                />
                                <Link href={`/Topic/${topic.TopicKey}`} className="link-accent">{topic.TopicName}</Link>
                            </div>
                        ))}

                    {!isPending && results?.subject === "Items" &&
                        results.data.map((item, i) => (
                            <div key={i} className="card flex gap-4">
                                <Image
                                    src={item.ImageUrl}
                                    width={80}
                                    height={80}
                                    alt={item.ItemName}
                                    className="h-20 w-20 thumb"
                                />
                                <div className="flex flex-col gap-1">
                                    <Link href={`/Item/${item.ItemKey}`} className="link-accent">{item.ItemName}</Link>
                                    <p className="muted">Average Rating: {item.PostRating}</p>
                                </div>
                            </div>
                        ))}

                    {!isPending && results && results.data.length === 0 && (
                        <p className="text-center muted">No results found.</p>
                    )}
                </div>
            </section>
        </main>
    )
}
