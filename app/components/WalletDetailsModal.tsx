"use client";
import { useRef, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { StarknetkitConnector, useStarknetkitConnectModal } from "starknetkit";
import { useConnect as useStarknetConnect } from "@starknet-react/core";
import { Connector } from "@starknet-react/core";

interface WalletDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  buttonPosition?: { top: number; right: number };
  evmAddress?: string;
  evmConnected: boolean;
  starknetAddress?: string;
  starknetConnected: boolean;
  onDisconnect: (walletType: "evm" | "starknet" | "all") => void;
  onConnectWallet: (walletType: string) => void;
}

export function WalletDetailsModal({
  isOpen,
  onClose,
  buttonPosition,
  evmAddress,
  evmConnected,
  starknetAddress,
  starknetConnected,
  onDisconnect,
}: // onConnectWallet
WalletDetailsModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Starknet connection functions
  const { connect: connectStarknet, connectors: starknetConnectors } =
    useStarknetConnect();
  const { starknetkitConnectModal } = useStarknetkitConnectModal({
    connectors: starknetConnectors as StarknetkitConnector[],
  });

  // Format the displayed addresses
  const displayEvmAddress = evmAddress
    ? `${evmAddress.slice(0, 6)}...${evmAddress.slice(-4)}`
    : "";

  const displayStarknetAddress = starknetAddress
    ? `${starknetAddress.slice(0, 6)}...${starknetAddress.slice(-4)}`
    : "";

  useEffect(() => {
    // Close modal when clicking outside
    function handleClickOutside(event: MouseEvent) {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Connect wallet functions
  async function connectStarknetWallet() {
    const { connector } = await starknetkitConnectModal();
    if (!connector) {
      return;
    }
    await connectStarknet({ connector: connector as Connector });
    onClose();
  }

  async function connectEVMWallet() {
    // try {
    //   // Open AppKit modal for EVM wallet connection
    //   const appKit = (window as any).appKit;
    //   if (appKit) {
    //     appKit.open();
    //   }
    //   onClose();
    // } catch (error) {
    //   console.error("Error connecting to EVM wallet:", error);
    // }
  }

  const handleConnectWallet = (walletId: string) => {
    if (walletId === "starknet") {
      connectStarknetWallet();
    } else if (walletId === "evm") {
      connectEVMWallet();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 pointer-events-none"
      aria-hidden={!isOpen}
    >
      <div
        ref={modalRef}
        className="absolute pointer-events-auto rounded-xl bg-[#1c1c1c] shadow-xl border border-[#333] w-[320px] overflow-hidden"
        style={
          buttonPosition
            ? {
                top: `${buttonPosition.top + 10}px`,
                right: `${buttonPosition.right}px`,
              }
            : {
                top: "70px",
                right: "20px",
              }
        }
      >
        <div className="p-4 border-b border-[#333]">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white">My Wallets</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path
                  d="M18 6L6 18M6 6l12 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-4">
          {/* EVM Section */}
          <div className="mb-3 text-gray-400 text-sm font-medium">EVM</div>

          {evmConnected ? (
            <div className="p-3 rounded-lg border border-[#444] bg-[#232323] mb-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="relative">
                  <Image
                    src="/logos/ethereum.png"
                    alt="Avatar"
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-[#831d1d] text-white text-xs rounded-full px-1 py-0.5">
                    0
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-white">{displayEvmAddress}</span>
                  <span className="text-xs text-gray-400">MetaMask</span>
                </div>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="ml-auto text-gray-500"
                >
                  <path
                    d="M9 5L16 12L9 19"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <div className="mt-4">
                <Button
                  onClick={() => onDisconnect("evm")}
                  className="w-full bg-[#1a1a1a] border border-[#444] hover:bg-[#232323] text-white rounded-lg"
                >
                  <svg
                    className="mr-2"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8 12H16M8 12L10 10M8 12L10 14"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Disconnect
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-lg bg-[#232323] mb-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Image
                    src="/logos/ethereum.png"
                    alt="EVM"
                    width={30}
                    height={30}
                    className="rounded-full"
                  />
                  <span className="text-white">EVM</span>
                </div>
                <Button
                  onClick={() => handleConnectWallet("evm")}
                  className="bg-white hover:bg-gray-100 text-black rounded-lg"
                >
                  Connect
                </Button>
              </div>
            </div>
          )}

          {/* Starknet Section */}
          <div className="mb-3 text-gray-400 text-sm font-medium">Starknet</div>

          {starknetConnected ? (
            <div className="p-3 rounded-lg border border-[#444] bg-[#232323] mb-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="relative">
                  <Image
                    src="/logos/starknet.png"
                    alt="Avatar"
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-[#831d1d] text-white text-xs rounded-full px-1 py-0.5">
                    0
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-white">{displayStarknetAddress}</span>
                  <span className="text-xs text-gray-400">Argent X</span>
                </div>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="ml-auto text-gray-500"
                >
                  <path
                    d="M9 5L16 12L9 19"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <div className="mt-4">
                <Button
                  onClick={() => onDisconnect("starknet")}
                  className="w-full bg-[#1a1a1a] border border-[#444] hover:bg-[#232323] text-white rounded-lg"
                >
                  <svg
                    className="mr-2"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8 12H16M8 12L10 10M8 12L10 14"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Disconnect
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-lg bg-[#232323] mb-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Image
                    src="/logos/starknet.png"
                    alt="Starknet"
                    width={30}
                    height={30}
                    className="rounded-full"
                  />
                  <span className="text-white">Starknet</span>
                </div>
                <Button
                  onClick={() => handleConnectWallet("starknet")}
                  className="bg-white hover:bg-gray-100 text-black rounded-lg"
                >
                  Connect
                </Button>
              </div>
            </div>
          )}

          {/* Disconnect all button (only show if at least one wallet is connected) */}
          {(evmConnected || starknetConnected) && (
            <div className="mt-4">
              <Button
                onClick={() => onDisconnect("all")}
                className="w-full bg-[#831d1d] hover:bg-[#9e2121] text-white rounded-lg"
              >
                Disconnect All
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
