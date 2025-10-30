// src/components/PixelArt.tsx
"use client";

type PixelArtProps = {
  pixelData: string;
  color: string;
  size?: number;
};

export default function PixelArt({ pixelData, color, size = 8 }: PixelArtProps) {
  const lines = pixelData.trim().split("\n").filter((line) => line.trim());

  return (
    <div className="flex flex-col gap-[2px]">
      {lines.map((line, y) => (
        <div key={y} className="flex gap-[2px]">
          {line.split("").map((char, x) => (
            <div
              key={`${x}-${y}`}
              className="transition-all duration-200"
              style={{
                width: size,
                height: size,
                backgroundColor: char === "█" ? color : "transparent",
                boxShadow: char === "█" ? `0 0 8px ${color}80` : "none",
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
