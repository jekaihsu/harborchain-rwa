// components/RWAOrbitPage.tsx
"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Wallet,
  Github,
  Twitter,
  Zap,
  TrendingUp,
  X,
  ShoppingCart,
  Lock,
  Users,
  LineChart, // ✅ 換成 LineChart
} from "lucide-react";
import { products, nftMarketplaces } from "./data/rwaProducts";


// 像素圖
function PixelArt({
  pixelData,
  color,
  size = 8,
}: {
  pixelData: string;
  color: string;
  size?: number;
}) {
  const lines = pixelData
    .trim()
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  return (
    <div className="flex flex-col gap-[2px]">
      {lines.map((line, y) => (
        <div key={y} className="flex gap-[2px]">
          {Array.from(line).map((char, x) => (
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

// 產品 modal
function ProductModal({ product, onClose }: { product: any; onClose: () => void }) {
  if (!product) return null;
  const marketplace = nftMarketplaces[product.nftMarket];
  const nftUrl = `${marketplace.baseUrl}${product.contractAddress}`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div
        className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-gray-900 rounded-2xl border-2 p-8"
        style={{
          borderColor: product.color,
          boxShadow: `0 0 60px ${product.color}40`,
        }}
      >
        {/* 關閉 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center border border-gray-700"
          aria-label="關閉"
        >
          <X className="w-6 h-6" />
        </button>

        {/* 頂部內容 */}
        <div className="flex flex-col lg:flex-row gap-8 mb-8">
          {/* 左邊圖 */}
          <div className="flex-shrink-0">
            <div
              className="w-48 h-48 rounded-2xl flex items-center justify-center p-8 relative overflow-hidden"
              style={{
                backgroundColor: `${product.color}15`,
                border: `2px solid ${product.color}`,
                boxShadow: `0 0 40px ${product.color}40, inset 0 0 30px ${product.color}20`,
              }}
            >
              <PixelArt pixelData={product.pixelArt} color={product.color} size={10} />
              <div
                className="absolute inset-0 opacity-20"
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
          </div>

          {/* 右邊資訊 */}
          <div className="flex-1">
            <div
              className="inline-block px-3 py-1 rounded-full text-xs font-mono mb-3"
              style={{
                backgroundColor: `${product.color}20`,
                border: `1px solid ${product.color}`,
                color: product.color,
              }}
            >
              RWA TOKENIZED ASSET
            </div>
            <h2
              className="text-4xl font-bold mb-2 font-mono"
              style={{ color: product.color }}
            >
              {product.fullName}
            </h2>
            <p className="text-gray-400 mb-6 leading-relaxed">{product.description}</p>

            {/* NFT 資訊 */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                <div className="text-gray-500 text-xs font-mono mb-1">總供應量</div>
                <div className="text-white font-bold font-mono">
                  {product.totalSupply}
                </div>
              </div>
              <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                <div className="text-gray-500 text-xs font-mono mb-1">地板價</div>
                <div className="text-white font-bold font-mono">
                  {product.priceETH} ETH
                </div>
              </div>
              <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                <div className="text-gray-500 text-xs font-mono mb-1">合約地址</div>
                <div className="text-white font-bold font-mono text-xs">
                  {product.contractAddress.slice(0, 8)}...
                </div>
              </div>
              <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                <div className="text-gray-500 text-xs font-mono mb-1">市場</div>
                <div className="text-white font-bold font-mono">
                  {marketplace.icon} {marketplace.name}
                </div>
              </div>
            </div>

            {/* 按鈕 */}
            <div className="flex gap-4">
              <a
                href={nftUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-lg font-mono font-bold transition-all hover:scale-105"
                style={{
                  backgroundColor: `${product.color}20`,
                  border: `2px solid ${product.color}`,
                  color: product.color,
                  boxShadow: `0 0 30px ${product.color}40`,
                }}
              >
                <ShoppingCart className="w-5 h-5" />
                前往 {marketplace.name} 購買
              </a>
              <button
                className="px-6 py-4 bg-gray-800 hover:bg-gray-700 rounded-lg font-mono border border-gray-700"
                onClick={() => alert("查看合約功能開發中...")}
              >
                查看合約
              </button>
            </div>
          </div>
        </div>

        {/* 技術規格 */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-4 font-mono flex items-center gap-2">
            <Zap className="w-6 h-6" style={{ color: product.color }} />
            技術規格
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {product.specs.map((spec: string, index: number) => (
              <div
                key={index}
                className="flex items-start gap-3 bg-gray-800/30 p-4 rounded-lg border border-gray-800"
              >
                <div
                  className="w-2 h-2 rounded-full mt-2"
                  style={{ backgroundColor: product.color }}
                />
                <span className="text-gray-300 font-mono text-sm">{spec}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 收益模型 */}
        <div>
          <h3 className="text-2xl font-bold mb-4 font-mono flex items-center gap-2">
            <LineChart className="w-6 h-6" style={{ color: product.color }} />
            收益模型
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 租賃收益 */}
            <div className="bg-gradient-to-br from-cyan-500/10 to-transparent p-6 rounded-xl border border-cyan-500/30">
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-5 h-5 text-cyan-400" />
                <h4 className="font-bold font-mono text-cyan-400">租賃收益</h4>
              </div>
              <div className="text-3xl font-bold mb-2 text-cyan-400">
                {product.revenueModel.rentalYield}
              </div>
              <p className="text-gray-400 text-sm">年化收益率</p>
              <p className="text-gray-500 text-xs mt-2 font-mono">
                持有 NFT 即可獲得儀器租賃收入分潤
              </p>
            </div>

            {/* 數據收益 */}
            <div className="bg-gradient-to-br from-purple-500/10 to-transparent p-6 rounded-xl border border-purple-500/30">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-5 h-5 text-purple-400" />
                <h4 className="font-bold font-mono text-purple-400">數據收益</h4>
              </div>
              <div className="text-3xl font-bold mb-2 text-purple-400">
                {product.revenueModel.dataRevenue}
              </div>
              <p className="text-gray-400 text-sm">使用費</p>
              <p className="text-gray-500 text-xs mt-2 font-mono">
                每次測量數據上鏈自動分配收益
              </p>
            </div>

            {/* 增值潛力 */}
            <div className="bg-gradient-to-br from-pink-500/10 to-transparent p-6 rounded-xl border border-pink-500/30">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5 text-pink-400" />
                <h4 className="font-bold font-mono text-pink-400">增值潛力</h4>
              </div>
              <div className="text-3xl font-bold mb-2 text-pink-400">
                {product.revenueModel.appreciation}
              </div>
              <p className="text-gray-400 text-sm">預估增值</p>
              <p className="text-gray-500 text-xs mt-2 font-mono">
                隨著 RWA 市場成長，NFT 價值持續上升
              </p>
            </div>
          </div>

          {/* 說明 */}
          <div className="mt-6 p-6 bg-gray-800/30 rounded-xl border border-gray-700">
            <h4 className="font-bold mb-3 flex items-center gap-2 font-mono">
              <Lock className="w-5 h-5 text-yellow-400" />
              收益機制說明
            </h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1">•</span>
                <span>
                  <strong className="text-white">智能合約自動分配：</strong>
                  所有收益透過智能合約自動計算並分配至 NFT 持有者錢包
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-1">•</span>
                <span>
                  <strong className="text-white">即時結算：</strong>
                  每筆測量數據上鏈後立即觸發收益分配，無需等待
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-pink-400 mt-1">•</span>
                <span>
                  <strong className="text-white">二級市場交易：</strong>
                  可隨時在 NFT 市場出售，流動性高
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">•</span>
                <span>
                  <strong className="text-white">治理權益：</strong>
                  持有者可參與設備升級、租金定價等決策投票
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// 橢圓 hook
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

// 背景
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

// Orbit 主體
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

  // 容器 resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        setDimensions({ width: clientWidth, height: clientHeight });
      }
    };
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

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

  const handleTouchStart = (e: React.TouchEvent) => {
    isDragging.current = true;
    const touch = e.touches[0];
    dragStart.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    const touch = e.touches[0];
    const dx = touch.clientX - dragStart.current.x;
    onDrag(dx);
    dragStart.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    onWheel(e.deltaY);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      onKeyboard(-1);
      setFocusedIndex((prev) => (prev - 1 + products.length) % products.length);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      onKeyboard(1);
      setFocusedIndex((prev) => (prev + 1) % products.length);
    } else if (e.key === "Enter" && focusedIndex >= 0) {
      e.preventDefault();
      onProductClick(products[focusedIndex]);
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      const listener = (e: WheelEvent) => handleWheel(e);
      container.addEventListener("wheel", listener, { passive: false });
      return () => container.removeEventListener("wheel", listener);
    }
  }, []);

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
      aria-label="產品輪播"
    >
      {/* 軌道 */}
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

      {/* 產品 */}
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
                  {/* 圖 */}
                  <div className="mb-3 flex justify-center">
                    <PixelArt
                      pixelData={product.pixelArt}
                      color={product.color}
                      size={6}
                    />
                  </div>

                  {/* 名稱 */}
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

                {/* Hover 提示 */}
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
                    <div
                      className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45"
                      style={{
                        backgroundColor: `${product.color}20`,
                        borderTop: `1px solid ${product.color}`,
                        borderLeft: `1px solid ${product.color}`,
                      }}
                    />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 下方 tab */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-cyan-500/20">
        {products.map((p, idx) => (
          <button
            key={p.id}
            onClick={() => onProductClick(p)}
            className={`text-xs font-mono px-3 py-1 rounded-full transition-all ${
              idx === focusedIndex
                ? "bg-cyan-500 text-black"
                : "text-cyan-100/70 hover:bg-cyan-500/10"
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>
    </div>
  );
}

// 最外層頁面
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

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}
