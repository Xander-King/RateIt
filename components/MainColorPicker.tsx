"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "mainColor";
const DEFAULT_COLOR = "#ffffff";

export default function MainColorPicker() {
  const [color, setColor] = useState(DEFAULT_COLOR);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setColor(stored);
    }
  }, []);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    setColor(value);
    document.documentElement.style.setProperty("--background", value);
    localStorage.setItem(STORAGE_KEY, value);
  }

  return (
    <div className="flex items-center justify-center gap-3">
      <label htmlFor="main-color" className="field-label">
        Main Color
      </label>
      <input
        id="main-color"
        type="color"
        value={color}
        onChange={handleChange}
        className="h-10 w-16 cursor-pointer rounded-md border border-neon-cyan/40 bg-noir-900"
      />
    </div>
  );
}
