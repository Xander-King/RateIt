"use client";

import { useState } from "react";

export default function ImagePicker({
    id,
    name,
    required = false,
    previewAlt,
    previewClassName,
    initialPreviewUrl,
}: {
    id: string;
    name: string;
    required?: boolean;
    previewAlt: string;
    previewClassName: string;
    initialPreviewUrl?: string;
}) {
    const [previewUrl, setPreviewUrl] = useState<string | undefined>(initialPreviewUrl);

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];

        setPreviewUrl((current) => {
            if (current?.startsWith("blob:")) {
                URL.revokeObjectURL(current);
            }
            return file ? URL.createObjectURL(file) : initialPreviewUrl;
        });
    }

    return (
        <div className="flex flex-col items-center gap-2">
            {previewUrl && (
                // Blob URLs from createObjectURL can't go through next/image's
                // optimizer (it fetches from a remote origin), so a plain <img>
                // is the simplest way to render a local, pre-upload preview.
                // eslint-disable-next-line @next/next/no-img-element
                <img src={previewUrl} alt={previewAlt} className={previewClassName} />
            )}
            <input
                id={id}
                name={name}
                type="file"
                accept="image/*"
                required={required}
                onChange={handleChange}
                className="field"
            />
        </div>
    );
}
