"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { WalletConnectionModal } from "./WalletConnectionModal";
import { WalletDetailsModal } from "./WalletDetailsModal";
import {
  useAccount as useStarknetAccount,
  useDisconnect as useStarknetDisconnect,
} from "@starknet-react/core";

export function Header() {
  // Track both wallet types separately
  const [evmConnected] = useState(false);
  const [evmAddress] = useState<string | undefined>();
  const [starknetConnected, setStarknetConnected] = useState(false);
  const [starknetWalletAddress, setStarknetWalletAddress] = useState<
    string | undefined
  >();

  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showWalletDetails, setShowWalletDetails] = useState(false);
  const [buttonPosition, setButtonPosition] = useState<
    { top: number; right: number } | undefined
  >();
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Get Starknet account
  const { address: starknetAddress } = useStarknetAccount();
  const { disconnect: disconnectStarknet } = useStarknetDisconnect();

  // Listen for AppKit connection changes for EVM
  // useEffect(() => {
  //   // Get the appKit instance that was created in WalletConnectionModal
  //   const appKit = window.appKit;

  //   if (!appKit) return;

  //   // const unsubscribe = appKit.subscribeAccount(
  //   //   (account: { address?: string }) => {
  //   //     if (account?.address) {
  //   //       setEvmConnected(true);
  //   //       setEvmAddress(account.address);
  //   //     } else {
  //   //       setEvmConnected(false);
  //   //       setEvmAddress(undefined);
  //   //     }
  //   //   }
  //   // );

  //   return () => {
  //     if (typeof unsubscribe === "function") {
  //       unsubscribe();
  //     }
  //   };
  // }, []);

  // Check if connected to Starknet
  useEffect(() => {
    if (starknetAddress) {
      setStarknetConnected(true);
      setStarknetWalletAddress(starknetAddress);
    } else {
      setStarknetConnected(false);
      setStarknetWalletAddress(undefined);
    }
  }, [starknetAddress]);

  // Determine what to show on the connect wallet button
  const anyWalletConnected = evmConnected || starknetConnected;
  const primaryAddress = evmConnected ? evmAddress : starknetWalletAddress;

  const handleConnectButtonClick = () => {
    if (anyWalletConnected) {
      // Update button position for dropdown positioning
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        setButtonPosition({
          top: rect.bottom,
          right: window.innerWidth - rect.right,
        });
      }

      // If already connected, show wallet details
      setShowWalletDetails(true);
      return;
    }

    // Update button position for dropdown positioning
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setButtonPosition({
        top: rect.bottom,
        right: window.innerWidth - rect.right,
      });
    }

    // Show wallet modal
    setShowWalletModal(true);
  };

  const handleWalletConnect = (walletId: string) => {
    console.log(`Connecting to ${walletId} wallet`);
    setShowWalletModal(false);
    // Connection state is handled by the useEffect monitoring address changes
  };

  const handleConnectFromDetails = () => {
    // Close wallet details modal first
    setShowWalletDetails(false);

    // Show the connect wallet modal to connect the new wallet
    setShowWalletModal(true);
  };

  const handleDisconnect = (walletType: "evm" | "starknet" | "all") => {
    if (walletType === "starknet" || walletType === "all") {
      disconnectStarknet();
    }

    if (walletType === "evm" || walletType === "all") {
      // Disconnect from EVM wallet if appKit is available
      try {
        // const appKit = window.appKit;
        // if (appKit && typeof appKit.disconnect === 'function') {
        //   // appKit.disconnect();
        // }
      } catch (error) {
        console.error("Error disconnecting EVM wallet:", error);
      }
    }

    if (walletType === "all") {
      setShowWalletDetails(false);
    }
  };

  // Format the displayed address
  const displayAddress = primaryAddress
    ? `${primaryAddress.slice(0, 6)}...${primaryAddress.slice(-4)}`
    : "Connect Wallet";

  return (
    <header className="w-full bg-black py-4">
      <div className="max-w-[1000px] mx-auto flex justify-between items-center px-6">
        {/* Logo - Mobile version for small screens, Desktop version for medium screens and up */}
        <div className="flex items-center">
          <div className="block md:hidden">
            <Image
              src="/logos/oneramp.png"
              alt="OneRamp"
              width={40}
              height={40}
              priority
              className="rounded-full"
            />
          </div>
          <div className="hidden md:block">
            <Image
              src="/logos/oneramp-long.png"
              alt="OneRamp"
              width={150}
              height={40}
              priority
            />
          </div>
        </div>

        {/* Connect Wallet Button */}
        <Button
          ref={buttonRef}
          onClick={handleConnectButtonClick}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            anyWalletConnected
              ? "bg-[#232323] hover:bg-[#2c2c2c] text-purple-400"
              : "bg-[#2563eb] hover:bg-[#1d4ed8] text-white"
          }`}
        >
          {anyWalletConnected ? displayAddress : "Connect Wallet"}
        </Button>
      </div>

      {/* Wallet Connection Modal */}
      <WalletConnectionModal
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
        buttonPosition={buttonPosition}
        onConnect={handleWalletConnect}
      />

      {/* Wallet Details Modal */}
      {anyWalletConnected && (
        <WalletDetailsModal
          isOpen={showWalletDetails}
          onClose={() => setShowWalletDetails(false)}
          buttonPosition={buttonPosition}
          evmAddress={evmAddress}
          evmConnected={evmConnected}
          starknetAddress={starknetWalletAddress}
          starknetConnected={starknetConnected}
          onDisconnect={handleDisconnect}
          onConnectWallet={handleConnectFromDetails}
        />
      )}
    </header>
  );
}
