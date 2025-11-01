"use client";

import { Github, Loader2, Twitter, Wallet } from "lucide-react";

import useWallet from "../hooks/useWallet";

function WalletButton() {
  const {
    formattedAddress,
    connect,
    disconnect,
    isConnected,
    isConnecting,
    status,
    error,
    walletAvailable,
  } = useWallet();

  const handleClick = () => {
    if (isConnecting) return;
    if (isConnected) {
      disconnect();
      return;
    }
    void connect();
  };

  let label = "Connect";
  if (!walletAvailable) {
    label = "Install Wallet";
  } else if (isConnected && formattedAddress) {
    label = formattedAddress;
  } else if (isConnecting) {
    label = "Connecting";
  }

  return (
    <div className="flex flex-col items-end gap-1 min-w-[160px]">
      <button
        type="button"
        onClick={handleClick}
        className="flex items-center gap-2 text-sm text-cyan-200 hover:text-white transition disabled:opacity-70"
        disabled={isConnecting}
      >
        {isConnecting ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Wallet className="w-4 h-4" />
        )}
        <span className="font-medium">{label}</span>
      </button>
      {status === "error" && error ? (
        <span className="text-xs text-rose-300/80">{error}</span>
      ) : null}
      {status === "unavailable" ? (
        <span className="text-xs text-amber-200/80">
          請先安裝 MetaMask 或其他 EVM 錢包擴充功能。
        </span>
      ) : null}
    </div>
  );
}

export default function OrbitHeader() {
  return (
    <header className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-cyan-500/10 backdrop-blur-sm bg-black/20">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="font-mono text-sm text-gray-300">
          HarborChain • RWA 測量儀器
        </span>
      </div>
      <div className="flex items-center gap-3">
        <WalletButton />
        <button className="p-2 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30">
          <Github className="w-5 h-5" />
        </button>
        <button className="p-2 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30">
          <Twitter className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
