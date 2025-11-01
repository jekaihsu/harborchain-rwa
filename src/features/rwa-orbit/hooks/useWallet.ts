"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type WalletStatus =
  | "idle"
  | "unavailable"
  | "connecting"
  | "connected"
  | "error";

type EthereumRequest = {
  method: string;
  params?: unknown[] | Record<string, unknown>;
};

type EthereumProvider = {
  isMetaMask?: boolean;
  request: (args: EthereumRequest) => Promise<unknown>;
  on?: (event: string, listener: (...args: unknown[]) => void) => void;
  removeListener?: (
    event: string,
    listener: (...args: unknown[]) => void,
  ) => void;
  providers?: EthereumProvider[];
};

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

function truncateAddress(address: string) {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

function resolveBrowserProvider(): EthereumProvider | undefined {
  if (typeof window === "undefined") {
    return undefined;
  }

  const { ethereum } = window;

  if (!ethereum) {
    return undefined;
  }

  if (Array.isArray(ethereum.providers)) {
    const metaMaskProvider = ethereum.providers.find(
      (provider) => provider && provider.isMetaMask,
    );

    if (metaMaskProvider) {
      return metaMaskProvider;
    }

    return ethereum.providers[0];
  }

  if (ethereum.isMetaMask || typeof ethereum.request === "function") {
    return ethereum;
  }

  return undefined;
}

export default function useWallet() {
  const initialProvider = resolveBrowserProvider();
  const [accounts, setAccounts] = useState<string[]>([]);
  const [status, setStatus] = useState<WalletStatus>(() => {
    if (typeof window === "undefined") {
      return "unavailable";
    }
    return initialProvider ? "idle" : "unavailable";
  });
  const [error, setError] = useState<string | null>(null);

  const provider = useMemo<EthereumProvider | undefined>(() => {
    return resolveBrowserProvider();
  }, []);

  useEffect(() => {
    if (!provider) return;

    const handleAccountsChanged = (nextAccounts: unknown) => {
      if (!Array.isArray(nextAccounts)) return;
      setAccounts(nextAccounts);
      setStatus(nextAccounts.length > 0 ? "connected" : "idle");
    };

    provider.on?.("accountsChanged", handleAccountsChanged);

    provider
      .request({ method: "eth_accounts" })
      .then((initialAccounts) => {
        if (Array.isArray(initialAccounts) && initialAccounts.length > 0) {
          setAccounts(initialAccounts);
          setStatus("connected");
        }
      })
      .catch(() => {
        // Ignore silent failures while probing existing connections.
      });

    return () => {
      provider.removeListener?.("accountsChanged", handleAccountsChanged);
    };
  }, [provider]);

  const connect = useCallback(async () => {
    if (!provider) {
      setStatus("unavailable");
      setError("瀏覽器尚未偵測到相容的錢包擴充功能。");
      return;
    }

    setStatus("connecting");
    setError(null);

    try {
      const requestedAccounts = await provider.request({
        method: "eth_requestAccounts",
      });

      if (!Array.isArray(requestedAccounts) || requestedAccounts.length === 0) {
        setStatus("idle");
        return;
      }

      setAccounts(requestedAccounts as string[]);
      setStatus("connected");
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "錢包連線失敗，請再試一次。";
      setError(message);
      setStatus("error");
    }
  }, [provider]);

  const disconnect = useCallback(() => {
    setAccounts([]);
    setStatus(provider ? "idle" : "unavailable");
    setError(null);
  }, [provider]);

  const primaryAccount = accounts[0];
  const formattedAddress = primaryAccount
    ? truncateAddress(primaryAccount)
    : undefined;

  return {
    accounts,
    address: primaryAccount,
    formattedAddress,
    status,
    error,
    isConnecting: status === "connecting",
    isConnected: status === "connected" && Boolean(primaryAccount),
    connect,
    disconnect,
    walletAvailable: Boolean(provider),
  };
}
