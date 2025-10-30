import { Github, Twitter, Wallet } from "lucide-react";

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
  );
}
