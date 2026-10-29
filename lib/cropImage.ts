export type PixelCrop = { x: number; y: number; width: number; height: number };

function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = src;
    });
}

export async function cropImageToFile(
    imageSrc: string,
    pixelCrop: PixelCrop,
    fileName: string,
    mimeType: string
): Promise<File> {
    const image = await loadImage(imageSrc);
    const canvas = document.createElement("canvas");
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
        throw new Error("Could not get canvas context");
    }

    ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
    );

    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, mimeType));

    if (!blob) {
        throw new Error("Could not crop image");
    }

    return new File([blob], fileName, { type: mimeType });
}
