"use client";

import { useState } from "react";

export default function RatingSlider() {
    const [rating, setRating] = useState(3);

    return (
        <div className="flex flex-col gap-1">
            <label htmlFor="PostRating" className="field-label">
                Rating: {rating} / 5
            </label>
            <input
                id="PostRating"
                name="PostRating"
                type="range"
                min={1}
                max={5}
                step={0.5}
                value={rating}
                onChange={(event) => setRating(Number(event.target.value))}
                required
                className="w-full"
            />
        </div>
    )
}
