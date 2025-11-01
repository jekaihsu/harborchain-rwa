"use client";

import { useEffect, useRef, useState } from "react";

import PixelArt from "@/components/PixelArt";
import { useOrbit } from "../hooks/useOrbit";
import type { RWAProduct } from "../types";

export type OrbitCarouselProps = {
  products: RWAProduct[];
  onProductClick: (product: RWAProduct) => void;
};

export default function OrbitCarousel({ products, onProductClick }: OrbitCarouselProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({
    width: 800,
    height: 500,
  });
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dragStart = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const isDragging = useRef(false);

  const a = dimensions.width * 0.35;
  const b = dimensions.height * 0.35;

  const { theta, onDrag, onWheel, onKeyboard } = useOrbit(products.length, {
    a,
    b,
    friction: 0.96,
    idle: 0.0008,
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const update = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };

    update();
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("resize", update);
    };
  }, []);

  const handleMouseDown = (event: React.MouseEvent) => {
    isDragging.current = true;
    dragStart.current = { x: event.clientX, y: event.clientY };
  };
  const handleMouseMove = (event: React.MouseEvent) => {
    if (!isDragging.current) return;
    const deltaX = event.clientX - dragStart.current.x;
    onDrag(deltaX);
    dragStart.current = { x: event.clientX, y: event.clientY };
  };
  const endDragging = () => {
    isDragging.current = false;
  };

  const handleTouchStart = (event: React.TouchEvent) => {
    isDragging.current = true;
    const touch = event.touches[0];
    dragStart.current = { x: touch.clientX, y: touch.clientY };
  };
  const handleTouchMove = (event: React.TouchEvent) => {
    if (!isDragging.current) return;
    const touch = event.touches[0];
    const deltaX = touch.clientX - dragStart.current.x;
    onDrag(deltaX);
    dragStart.current = { x: touch.clientX, y: touch.clientY };
  };

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    const wheel = (event: WheelEvent) => {
      event.preventDefault();
      onWheel(event.deltaY);
    };
    element.addEventListener("wheel", wheel, { passive: false });
    return () => element.removeEventListener("wheel", wheel);
  }, [onWheel]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      onKeyboard(-1);
      setFocusedIndex((previous) => (previous - 1 + products.length) % products.length);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      onKeyboard(1);
      setFocusedIndex((previous) => (previous + 1) % products.length);
    } else if (event.key === "Enter" && focusedIndex >= 0) {
      event.preventDefault();
      onProductClick(products[focusedIndex]);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[500px] lg:h-[600px] overflow-hidden cursor-grab active:cursor-grabbing select-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={endDragging}
      onMouseLeave={endDragging}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={endDragging}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label="RWA orbit carousel"
    >
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="border-2 border-cyan-500/30 rounded-full"
          style={{
            width: a * 2,
            height: b * 2,
            boxShadow: "0 0 40px rgba(0, 245, 255, 0.2), inset 0 0 40px rgba(0, 245, 255, 0.1)",
          }}
        />
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative" style={{ width: a * 2, height: b * 2 }}>
          {products.map((product, index) => {
            const angle = theta[index];
            const x = a * Math.cos(angle);
            const y = b * Math.sin(angle);

            const depth = Math.sin(angle);
            const scale = 0.6 + (depth + 1) * 0.2;
            const opacity = 0.5 + (depth + 1) * 0.25;
            const zIndex = Math.floor((depth + 1) * 50);

            const isHovered = hoveredId === product.id;
            const isFocused = focusedIndex === index;

            return (
              <button
                key={product.id}
                className="absolute transition-all duration-200 group outline-none"
                style={{
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                  transform: `translate(-50%, -50%) scale(${isHovered || isFocused ? scale * 1.15 : scale})`,
                  opacity: isHovered || isFocused ? 1 : opacity,
                  zIndex: isHovered || isFocused ? 1000 : zIndex,
                }}
                onMouseEnter={() => setHoveredId(product.id)}
                onMouseLeave={() => setHoveredId(null)}
                onFocus={() => setFocusedIndex(index)}
                onClick={() => onProductClick(product)}
                aria-label={`${product.name} - ${product.tagline}`}
              >
                <div
                  className="relative p-6 lg:p-8 rounded-lg backdrop-blur-sm transition-all duration-300"
                  style={{
                    backgroundColor: `${product.color}15`,
                    border: `2px solid ${product.color}`,
                    boxShadow: isHovered || isFocused
                      ? `0 0 30px ${product.color}80, 0 0 60px ${product.color}40, inset 0 0 20px ${product.color}20`
                      : `0 0 15px ${product.color}40, inset 0 0 10px ${product.color}10`,
                  }}
                >
                  <div className="mb-3 flex justify-center">
                    <PixelArt pixelData={product.pixelArt} color={product.color} size={6} />
                  </div>
                  <div
                    className="font-bold text-sm lg:text-base font-mono tracking-wider"
                    style={{ color: product.color }}
                  >
                    {product.name}
                  </div>
                  <div
                    className="absolute inset-0 opacity-20 pointer-events-none"
                    style={{
                      background: `repeating-linear-gradient(0deg, transparent, transparent 2px, ${product.color} 2px, ${product.color} 4px)`,
                    }}
                  />
                </div>

                {(isHovered || isFocused) && (
                  <div
                    className="absolute -bottom-16 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg whitespace-nowrap text-sm font-mono backdrop-blur-md"
                    style={{
                      backgroundColor: `${product.color}20`,
                      border: `1px solid ${product.color}`,
                      color: product.color,
                      boxShadow: `0 0 20px ${product.color}40`,
                    }}
                  >
                    {product.tagline}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-cyan-500/20">
        {products.map((product) => (
          <button
            key={product.id}
            onClick={() => onProductClick(product)}
            className="text-xs font-mono px-3 py-1 rounded-full text-cyan-100/70 hover:bg-cyan-500/10"
          >
            {product.name}
          </button>
        ))}
      </div>
    </div>
  );
}
