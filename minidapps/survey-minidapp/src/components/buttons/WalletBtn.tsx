"use client";

import React from "react";
import { useWeb3 } from "../../context/Web3Provider";

const WalletButton: React.FC = () => {
  const { account, isConnected, connectWallet, disconnectWallet } = useWeb3();

  return (
    <div className="flex flex-col items-center space-y-2 font-bold">
      {isConnected ? (
        <div>
          <button
            onClick={disconnectWallet}
            className="bg-slate-500 px-4 py-2 text-white rounded-lg"
          >
            <p>
              {account?.substring(0, 5) +
                "..." +
                account?.substring(account?.length - 3, account?.length)}
            </p>
          </button>
        </div>
      ) : (
        <button
          onClick={connectWallet}
          className="bg-blue-400 px-4 py-2 text-white rounded-lg"
        >
          Connect
        </button>
      )}
    </div>
  );
};

export default WalletButton;
