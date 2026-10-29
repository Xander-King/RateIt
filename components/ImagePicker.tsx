"use client";

import { useRef, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { cropImageToFile, type PixelCrop } from "@/lib/cropImage";

export default function ImagePicker({
    id,
    name,
    required = false,
    aspect = 1,
    previewAlt,
    previewClassName,
    initialPreviewUrl,
}: {
    id: string;
    name: string;
    required?: boolean;
    aspect?: number;
    previewAlt: string;
    previewClassName: string;
    initialPreviewUrl?: string;
}) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string | undefined>(initialPreviewUrl);
    const [rawImage, setRawImage] = useState<{ src: string; fileName: string; mimeType: string } | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<PixelCrop | null>(null);

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (!file) return;

        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setCroppedAreaPixels(null);
        setRawImage({ src: URL.createObjectURL(file), fileName: file.name, mimeType: file.type || "image/jpeg" });
    }

    function closeCropper() {
        if (rawImage) {
            URL.revokeObjectURL(rawImage.src);
        }
        setRawImage(null);
    }

    function cancelCrop() {
        closeCropper();
        if (inputRef.current) {
            inputRef.current.value = "";
        }
    }

    async function applyCrop() {
        if (!rawImage || !croppedAreaPixels || !inputRef.current) return;

        const croppedFile = await cropImageToFile(
            rawImage.src,
            croppedAreaPixels,
            rawImage.fileName,
            rawImage.mimeType
        );

        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(croppedFile);
        inputRef.current.files = dataTransfer.files;

        setPreviewUrl((current) => {
            if (current?.startsWith("blob:")) {
                URL.revokeObjectURL(current);
            }
            return URL.createObjectURL(croppedFile);
        });

        closeCropper();
    }

    return (
        <div className="flex flex-col items-center gap-2">
            {previewUrl && (
                // Blob URLs from cropping/createObjectURL can't go through
                // next/image's optimizer (it fetches from a remote origin), so a
                // plain <img> is the simplest way to render a local preview.
                // eslint-disable-next-line @next/next/no-img-element
                <img src={previewUrl} alt={previewAlt} className={previewClassName} />
            )}
            <input
                ref={inputRef}
                id={id}
                name={name}
                type="file"
                accept="image/*"
                required={required}
                onChange={handleChange}
                className="field"
            />

            {rawImage && (
                <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-noir-950/90 p-6">
                    <div className="relative h-72 w-full max-w-sm overflow-hidden rounded-md border border-neon-cyan/40">
                        <Cropper
                            image={rawImage.src}
                            crop={crop}
                            zoom={zoom}
                            aspect={aspect}
                            onCropChange={setCrop}
                            onZoomChange={setZoom}
                            onCropComplete={(_, areaPixels: Area) => setCroppedAreaPixels(areaPixels)}
                        />
                    </div>

                    <input
                        type="range"
                        min={1}
                        max={3}
                        step={0.1}
                        value={zoom}
                        onChange={(event) => setZoom(Number(event.target.value))}
                        className="w-full max-w-sm"
                        aria-label="Zoom"
                    />

                    <div className="flex gap-3">
                        <button type="button" onClick={cancelCrop} className="btn-outline">
                            Cancel
                        </button>
                        <button type="button" onClick={applyCrop} className="btn-primary">
                            Apply Crop
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
