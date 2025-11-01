"use client";

import { useEffect, useMemo } from "react";
import { X, ExternalLink } from "lucide-react";

import { nftMarketplaces } from "../data/products";
import type { RWAProduct } from "../types";

export type ProductModalProps = {
  product: RWAProduct;
  onClose: () => void;
};

export function ProductModal({ product, onClose }: ProductModalProps) {
  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") {
      return undefined;
    }

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const body = document.body;
    if (!body) {
      window.addEventListener("keydown", handleKey);
      return () => {
        window.removeEventListener("keydown", handleKey);
      };
    }

    const originalOverflow = body.style.overflow;
    body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKey);

    return () => {
      body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  const marketplace = useMemo(
    () => nftMarketplaces[product.nftMarket],
    [product.nftMarket]
  );
  const marketplaceUrl = useMemo(() => {
    if (!marketplace) return undefined;
    return `${marketplace.baseUrl}${product.contractAddress}`;
  }, [marketplace, product.contractAddress]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 py-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="rwa-product-modal-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-cyan-500/30 bg-slate-950/95 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-cyan-500/20 bg-black/40 px-6 py-4">
          <div>
            <p className="text-sm font-mono uppercase tracking-[0.3em] text-cyan-200/70">
              Tokenized Asset
            </p>
            <h2
              id="rwa-product-modal-title"
              className="mt-2 text-2xl font-semibold text-white"
              style={{ textShadow: `0 0 12px ${product.color}55` }}
            >
              {product.fullName}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-cyan-400/40 bg-cyan-400/10 p-2 text-cyan-100 transition hover:bg-cyan-400/20"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6 px-6 py-6 text-sm leading-relaxed text-slate-200">
          <p className="text-base text-slate-100">{product.description}</p>

          <div className="grid gap-4 rounded-xl border border-cyan-500/20 bg-black/30 p-4 md:grid-cols-2">
            <div>
              <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-cyan-200/70">
                Technical Specs
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-200">
                {product.specs.map((spec) => (
                  <li key={spec} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-cyan-400" aria-hidden />
                    <span>{spec}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-cyan-200/70">
                Revenue Model
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-200">
                <li className="flex items-center justify-between rounded-lg border border-cyan-500/20 bg-cyan-500/10 px-3 py-2">
                  <span className="text-cyan-100/80">租賃收益</span>
                  <span className="font-semibold text-cyan-200">
                    {product.revenueModel.rentalYield}
                  </span>
                </li>
                <li className="flex items-center justify-between rounded-lg border border-cyan-500/20 bg-cyan-500/10 px-3 py-2">
                  <span className="text-cyan-100/80">數據收益</span>
                  <span className="font-semibold text-cyan-200">
                    {product.revenueModel.dataRevenue}
                  </span>
                </li>
                <li className="flex items-center justify-between rounded-lg border border-cyan-500/20 bg-cyan-500/10 px-3 py-2">
                  <span className="text-cyan-100/80">預估增值</span>
                  <span className="font-semibold text-cyan-200">
                    {product.revenueModel.appreciation}
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-cyan-500/20 bg-black/30 p-4">
              <p className="text-xs font-mono uppercase tracking-[0.2em] text-cyan-200/70">
                Total Supply
              </p>
              <p className="mt-2 text-2xl font-semibold text-white">
                {product.totalSupply}
              </p>
            </div>
            <div className="rounded-xl border border-cyan-500/20 bg-black/30 p-4">
              <p className="text-xs font-mono uppercase tracking-[0.2em] text-cyan-200/70">
                Price
              </p>
              <p className="mt-2 text-2xl font-semibold text-white">
                {product.priceETH} ETH
              </p>
            </div>
            <div className="rounded-xl border border-cyan-500/20 bg-black/30 p-4">
              <p className="text-xs font-mono uppercase tracking-[0.2em] text-cyan-200/70">
                Contract
              </p>
              <p className="mt-2 break-all font-semibold text-cyan-200">
                {product.contractAddress}
              </p>
            </div>
          </div>

          {marketplace && (
            <a
              href={marketplaceUrl}
              target="_blank"
              rel="noreferrer"
              className="group flex items-center justify-between rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-5 py-3 text-cyan-100 transition hover:bg-cyan-500/20"
            >
              <div>
                <p className="text-xs font-mono uppercase tracking-[0.2em] text-cyan-200/70">
                  Marketplace
                </p>
                <p className="mt-1 text-lg font-semibold text-white">
                  {marketplace.icon} {marketplace.name}
                </p>
              </div>
              <ExternalLink className="h-5 w-5 text-cyan-200 transition group-hover:translate-x-0.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductModal;
