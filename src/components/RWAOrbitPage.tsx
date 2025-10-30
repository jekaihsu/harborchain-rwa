// src/components/RWAOrbitPage.tsx
"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Wallet, Github, Twitter } from "lucide-react";

import { products } from "./data/rwaProducts"; // ✅ 只留這一個，不要再宣告一次
import PixelArt from "./PixelArt"; // 你剛剛已經拆出去的
import RWAProductModal from "./RWAProductModal"; // 你剛剛也拆出去的

// ----------------------------------------------------
// 1) 橢圓軌道 hook
// ----------------------------------------------------
function useOrbit(
  itemCount: number,
  {
    a = 300,
    b = 180,
    friction = 0.95,
    idle = 0.001,
  }: { a?: number; b?: number; friction?: number; idle?: number }
) {
  const [theta, setTheta] = useState(
    Array.from({ length: itemCount }, (_, i) => (i * 2 * Math.PI) / itemCount)
  );
  const speed = useRef(idle);
  const lastInteraction = useRef(Date.now());
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const loop = () => {
      const now = Date.now();
      const timeSinceInteraction = now - lastInteraction.current;

      setTheta((t) => t.map((x) => x + speed.current));

      // 慢慢減速
      if (timeSinceInteraction > 3000) {
        speed.current = idle;
      } else if (Math.abs(speed.current) > Math.abs(idle)) {
        speed.current *= friction;
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [friction, idle]);

  const onDrag = useCallback((dx: number) => {
    speed.current += dx * 0.002;
    lastInteraction.current = Date.now();
  }, []);

  const onWheel = useCallback((deltaY: number) => {
    speed.current += deltaY * 0.0001;
    lastInteraction.current = Date.now();
  }, []);

  const onKeyboard = useCallback((direction: number) => {
    speed.current += direction * 0.01;
    lastInteraction.current = Date.now();
  }, []);

  return { theta, onDrag, onWheel, onKeyboard, a, b };
}

// ----------------------------------------------------
// 2) 背景格線
// ----------------------------------------------------
function GridBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, #00F5FF 1px, transparent 1px),
            linear-gradient(to bottom, #00F5FF 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, #FF00FF 1px, transparent 1px),
            linear-gradient(to bottom, #FF00FF 1px, transparent 1px)
          `,
          backgroundSize: "200px 200px",
        }}
      />
    </div>
  );
}

// ----------------------------------------------------
// 3) 橢圓輪播本體
// ----------------------------------------------------
function OrbitCarousel({
  products,
  onProductClick,
}: {
  products: any[];
  onProductClick: (p: any) => void;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dragStart = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);

  const a = dimensions.width * 0.35;
  const b = dimensions.height * 0.35;

  const { theta, onDrag, onWheel, onKeyboard } = useOrbit(products.length, {
    a,
    b,
    friction: 0.96,
    idle: 0.0008,
  });

  // 追蹤容器大小
  useEffect(() => {
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
    return () => window.removeEventListener("resize", update);
  }, []);

  // 滑鼠拖曳
  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    dragStart.current = { x: e.clientX, y: e.clientY };
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - dragStart.current.x;
    onDrag(dx);
    dragStart.current = { x: e.clientX, y: e.clientY };
  };
  const handleMouseUp = () => {
    isDragging.current = false;
  };

  // 觸控拖曳
  const handleTouchStart = (e: React.TouchEvent) => {
    isDragging.current = true;
    const t = e.touches[0];
    dragStart.current = { x: t.clientX, y: t.clientY };
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    const t = e.touches[0];
    const dx = t.clientX - dragStart.current.x;
    onDrag(dx);
    dragStart.current = { x: t.clientX, y: t.clientY };
  };

  // 滾輪
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const wheel = (e: WheelEvent) => {
      e.preventDefault();
      onWheel(e.deltaY);
    };
    el.addEventListener("wheel", wheel, { passive: false });
    return () => el.removeEventListener("wheel", wheel);
  }, [onWheel]);

  // 鍵盤
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      onKeyboard(-1);
      setFocusedIndex((p) => (p - 1 + products.length) % products.length);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      onKeyboard(1);
      setFocusedIndex((p) => (p + 1) % products.length);
    } else if (e.key === "Enter" && focusedIndex >= 0) {
      e.preventDefault();
      onProductClick(products[focusedIndex]);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[500px] lg:h-[600px] overflow-hidden cursor-grab active:cursor-grabbing select-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseUp}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label="RWA orbit carousel"
    >
      {/* 中心軌道 */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="border-2 border-cyan-500/30 rounded-full"
          style={{
            width: a * 2,
            height: b * 2,
            boxShadow:
              "0 0 40px rgba(0, 245, 255, 0.2), inset 0 0 40px rgba(0, 245, 255, 0.1)",
          }}
        />
      </div>

      {/* 產品卡片 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative" style={{ width: a * 2, height: b * 2 }}>
          {products.map((product, i) => {
            const angle = theta[i];
            const x = a * Math.cos(angle);
            const y = b * Math.sin(angle);

            const depth = Math.sin(angle);
            const scale = 0.6 + (depth + 1) * 0.2;
            const opacity = 0.5 + (depth + 1) * 0.25;
            const zIndex = Math.floor((depth + 1) * 50);

            const isHovered = hoveredId === product.id;
            const isFocused = focusedIndex === i;

            return (
              <button
                key={product.id}
                className="absolute transition-all duration-200 group outline-none"
                style={{
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                  transform: `translate(-50%, -50%) scale(${
                    isHovered || isFocused ? scale * 1.15 : scale
                  })`,
                  opacity: isHovered || isFocused ? 1 : opacity,
                  zIndex: isHovered || isFocused ? 1000 : zIndex,
                }}
                onMouseEnter={() => setHoveredId(product.id)}
                onMouseLeave={() => setHoveredId(null)}
                onFocus={() => setFocusedIndex(i)}
                onClick={() => onProductClick(product)}
                aria-label={`${product.name} - ${product.tagline}`}
              >
                <div
                  className="relative p-6 lg:p-8 rounded-lg backdrop-blur-sm transition-all duration-300"
                  style={{
                    backgroundColor: `${product.color}15`,
                    border: `2px solid ${product.color}`,
                    boxShadow:
                      isHovered || isFocused
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

                  {/* 掃描線 */}
                  <div
                    className="absolute inset-0 opacity-20 pointer-events-none"
                    style={{
                      background: `repeating-linear-gradient(
                        0deg,
                        transparent,
                        transparent 2px,
                        ${product.color} 2px,
                        ${product.color} 4px
                      )`,
                    }}
                  />
                </div>

                {/* Hover 小框 */}
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

      {/* 底部 tab */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-cyan-500/20">
        {products.map((p, idx) => (
          <button
            key={p.id}
            onClick={() => onProductClick(p)}
            className="text-xs font-mono px-3 py-1 rounded-full text-cyan-100/70 hover:bg-cyan-500/10"
          >
            {p.name}
          </button>
        ))}
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 4) 最外層頁面
// ----------------------------------------------------
export default function RWAOrbitPage() {
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  return (
    <div className="relative min-h-screen bg-[#020617] text-white overflow-hidden">
      <GridBackground />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-cyan-500/10 backdrop-blur-sm bg-black/20">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-sm text-gray-300">
            HarborChain • RWA 測量儀器
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1 text-sm text-cyan-200 hover:text-white transition">
            <Wallet className="w-4 h-4" />
            Connect
          </button>
          <button className="p-2 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30">
            <Github className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30">
            <Twitter className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 pt-10 pb-20">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-5xl font-bold mb-3 tracking-tight">
            Tokenized Survey Instruments
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            將公司內部高價測量設備 NFT 化，開放給同仁、合作社群、DAO 成員共同持有並分享租賃與數據收益。
          </p>
        </div>

        <OrbitCarousel products={products} onProductClick={setSelectedProduct} />
      </main>

      {/* Modal 用拆出去的那一支 */}
      {selectedProduct && (
        <RWAProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}
