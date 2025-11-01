"use client";

import { useState } from "react";

import dynamic from "next/dynamic";

import OrbitCarousel from "./components/OrbitCarousel";
import GridBackground from "./components/GridBackground";
import OrbitHeader from "./components/OrbitHeader";
import { products } from "./data/products";
import type { ProductModalProps } from "./modal/ProductModal";
import type { RWAProduct } from "./types";

const ProductModal = dynamic<ProductModalProps>(
  () => import("./modal/ProductModal").then((module) => module.ProductModal),
  {
    ssr: false,
  }
);

export default function RWAOrbitPage() {
  const [selectedProduct, setSelectedProduct] = useState<RWAProduct | null>(null);

  return (
    <div className="relative min-h-screen bg-[#020617] text-white overflow-hidden">
      <GridBackground />
      <OrbitHeader />

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
        <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </div>
  );
}
