"use client";

declare global {
  interface Window {
    klaytn: any;
    ethereum: any;
  }
}

import React, { createContext, useContext, useEffect, useState } from "react";
import { WalletType, PaymentProvider } from "@linenext/dapp-portal-sdk";
import { Web3Provider as w3 } from "@kaiachain/ethers-ext/v6";
import { useLiff } from "./LiffProvider.tsx";
import { Identity } from "@semaphore-protocol/identity";
import { createIdentity } from "../hooks/browser/survey.tsx";

const WALLET_ACCOUNT_KEY = "walletAccount";
const WALLET_IS_CONNECTED_KEY = "isWalletConnected";
const SEMAPHORE_IDENTITY_KEY = "semaphoreIdentity";

interface Web3ContextType {
  provider: w3 | undefined;
  pProvider: PaymentProvider | undefined;
  account: string | null;
  identity: Identity | null;
  isConnected: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [provider, setProvider] = useState<w3 | undefined>(undefined);
  const [pProvider, setPProvider] = useState<PaymentProvider | undefined>(
    undefined
  );
  const [account, setAccount] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [identity, setIdentity] = useState<Identity | null>(null);
  const { liffObject, dappPortalSDK, loading } = useLiff();

  // liff.login() make the page reload, so we need to load the state from the session storage
  useEffect(() => {
    const storedAccount = sessionStorage.getItem(WALLET_ACCOUNT_KEY);
    const storedIsConnected = sessionStorage.getItem(WALLET_IS_CONNECTED_KEY);
    const storedIdentity = sessionStorage.getItem(SEMAPHORE_IDENTITY_KEY);
    if (storedAccount) {
      setAccount(storedAccount);
    }
    if (storedIsConnected) {
      setIsConnected(true);
    }
    if (storedIdentity) {
      setIdentity(new Identity(storedIdentity));
    }
    if (dappPortalSDK) {
      const pp = dappPortalSDK.getPaymentProvider();
      const p = dappPortalSDK.getWalletProvider();
      setPProvider(pp);
      setProvider(new w3(p));
    }
  }, [loading]);

  useEffect(() => {
    if (identity) {
      sessionStorage.setItem(
        SEMAPHORE_IDENTITY_KEY,
        identity.privateKey as string
      );
    } else {
      sessionStorage.removeItem(SEMAPHORE_IDENTITY_KEY);
    }
  }, [identity]);

  useEffect(() => {
    if (isConnected) {
      sessionStorage.setItem(WALLET_IS_CONNECTED_KEY, "true");
    } else {
      sessionStorage.removeItem(WALLET_IS_CONNECTED_KEY);
    }
  }, [isConnected]);

  useEffect(() => {
    if (account) {
      sessionStorage.setItem(WALLET_ACCOUNT_KEY, account);
    } else {
      sessionStorage.removeItem(WALLET_ACCOUNT_KEY);
    }
  }, [account]);

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      setAccount(null);
      setIsConnected(false);
    } else {
      setAccount(accounts[0]);
      setIsConnected(true);
    }
  };

  const connectWallet = async () => {
    try {
      const provider = dappPortalSDK?.getWalletProvider();
      const web3Provider = new w3(provider);
      const accounts = await web3Provider.send("kaia_requestAccounts", []);
      const pProvider = dappPortalSDK?.getPaymentProvider();

      if (
        provider &&
        liffObject &&
        (provider.getWalletType() === WalletType.Liff ||
          provider.getWalletType() === WalletType.Web) &&
        liffObject.isLoggedIn()
      ) {
        const identity = await createIdentity(
          web3Provider,
          accounts[0],
          liffObject
        );
        setIdentity(identity);
      }

      setPProvider(pProvider);
      setProvider(web3Provider);
      setAccount(accounts[0]);
      setIsConnected(true);
    } catch (error) {
      console.log("error", error);
    }
  };

  const disconnectWallet = () => {
    if (confirm("Are you sure you want to disconnect?")) {
      setPProvider(undefined);
      setProvider(undefined);
      setAccount(null);
      setIsConnected(false);
      sessionStorage.removeItem(SEMAPHORE_IDENTITY_KEY);
      sessionStorage.removeItem(WALLET_ACCOUNT_KEY);
      sessionStorage.removeItem(WALLET_IS_CONNECTED_KEY);
    }
  };

  return (
    <Web3Context.Provider
      value={{
        provider,
        pProvider,
        account,
        identity,
        isConnected,
        connectWallet,
        disconnectWallet,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error("useWeb3 must be used within a Web3Provider");
  }
  return context;
};
