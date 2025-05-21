"use client";
import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { NetworkSelectModal } from "./modals/NetworkSelectModal";
import { CountryCurrencyModal } from "./modals/CountryCurrencyModal";
import { InstitutionModal } from "./modals/InstitutionModal";
import { TransactionReviewModal } from "./modals/TransactionReviewModal";
import { useAccount as useStarknetAccount } from "@starknet-react/core";
import { WalletConnectionModal } from "./WalletConnectionModal";

const currencies = [
  { symbol: "USDC", logo: "/logos/USDC.svg" },
  { symbol: "USDT", logo: "/logos/USDT.svg" },
];

const networks = [
  { name: "Base", logo: "/logos/base.png", type: "evm" },
  { name: "Ethereum", logo: "/logos/ethereum.png", type: "evm" },
  { name: "Polygon", logo: "/logos/polygon.png", type: "evm" },
  { name: "Celo", logo: "/logos/celo-logo.png", type: "evm" },
  { name: "Starknet", logo: "/logos/starknet.png", type: "starknet" },
];

const countryCurrencies = [
  { name: "Nigeria", logo: "/logos/nigeria.png" },
  { name: "Kenya", logo: "/logos/kenya.png" },
  { name: "Ghana", logo: "/logos/ghana.png" },
  { name: "Zambia", logo: "/logos/zambia.png" },
  { name: "Uganda", logo: "/logos/uganda.png" },
  { name: "Tanzania", logo: "/logos/tanzania.png" },
];

// Country-specific institution lists
const countryInstitutions = {
  Nigeria: [
    { name: "OPay" },
    { name: "PalmPay" },
    { name: "Moniepoint MFB" },
    { name: "Kuda Microfinance Bank" },
    { name: "Access Bank" },
    { name: "Citibank" },
    { name: "Diamond Bank" },
    { name: "Ecobank Bank" },
    { name: "FBNQuest Merchant Bank" },
    { name: "FCMB" },
    { name: "Fidelity Bank" },
    { name: "First Bank Of Nigeria" },
    { name: "FSDH Merchant Bank" },
    { name: "Greenwich Merchant Bank" },
    { name: "Guaranty Trust Bank" },
    { name: "Heritage" },
    { name: "Jaiz Bank" },
    { name: "Keystone Bank" },
    { name: "Paystack-Titan MFB" },
    { name: "Polaris Bank" },
    { name: "Providus Bank" },
    { name: "Rand Merchant Bank" },
    { name: "Safe Haven MFB" },
    { name: "Stanbic IBTC Bank" },
    { name: "Standard Chartered Bank" },
    { name: "Sterling Bank" },
    { name: "Suntrust Bank" },
    { name: "Union Bank" },
    { name: "United Bank for Africa" },
    { name: "Unity Bank" },
    { name: "Wema Bank" },
    { name: "Zenith Bank" },
  ],
  Kenya: [
    { name: "AIRTEL" },
    { name: "M-PESA" },
    { name: "ABSA Bank Kenya" },
    { name: "African Bank Corporation Limited" },
    { name: "Bank of Africa" },
    { name: "Bank of Baroda" },
    { name: "Caritas Microfinance Bank" },
    { name: "Choice Microfinance Bank Kenya Limited" },
    { name: "Citi Bank" },
    { name: "Commercial International Bank Kenya Limited" },
    { name: "Consolidated Bank Kenya" },
    { name: "Cooperative Bank of Kenya" },
    { name: "Credit Bank Limited" },
    { name: "Diamond Trust Bank" },
    { name: "Dubai Islamic Bank" },
    { name: "Ecobank Transnational Inc." },
    { name: "Equity Bank" },
    { name: "Family Bank" },
    { name: "Faulu Bank" },
    { name: "First Community Bank" },
    { name: "Guaranty Trust Holding Company PLC" },
    { name: "Guardian Bank Limited" },
    { name: "Gulf African Bank" },
    { name: "Housing finance Company" },
    { name: "Investments & Morgage Limited" },
    { name: "Kenya Commercial Bank" },
    { name: "Kenya Women Microfinance Bank" },
    { name: "Kingdom Bank Limited" },
    { name: "Middle East Bank" },
    { name: "National Bank of Kenya" },
    { name: "National Commercial Bank of Africa" },
    { name: "Oriental Commercial Bank Limited" },
    { name: "Paramount Bank" },
    { name: "Prime Bank Limited" },
    { name: "SBM Bank Kenya" },
    { name: "Sidian Bank" },
    { name: "Stanbic Bank Kenya" },
    { name: "Standard Chartered Kenya" },
    { name: "Stima SACCO" },
    { name: "Unaitas Sacco" },
    { name: "United Bank for Africa" },
    { name: "Victoria Commercial Bank" },
  ],
  Uganda: [{ name: "AIRTEL" }, { name: "MTN" }],
  Ghana: [{ name: "AIRTEL" }, { name: "MTN" }],
  Zambia: [{ name: "AIRTEL" }, { name: "MTN" }],
  Tanzania: [
    { name: "AIRTEL" },
    { name: "MTN" },
    { name: "SAFARICOM" },
    { name: "VADAFORN" },
  ],
};

export function SwapPanel() {
  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState(networks[0]);
  const [showNetworkModal, setShowNetworkModal] = useState(false);
  const [selectedCountryCurrency, setSelectedCountryCurrency] =
    useState<null | { name: string; logo: string }>(null);
  const [showCountryCurrencyModal, setShowCountryCurrencyModal] =
    useState(false);
  const [accountNumber, setAccountNumber] = useState("");
  // const [description, setDescription] = useState('');
  const [institution, setInstitution] = useState<string | null>(null);
  const [showInstitutionModal, setShowInstitutionModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);

  // Wallet connection states
  const [evmConnected] = useState(false);
  const { address: starknetAddress } = useStarknetAccount();
  const starknetConnected = !!starknetAddress;

  // Check EVM wallet connection
  // useEffect(() => {
  //   const appKit = window.appKit;
  //   // if (!appKit) return;

  //   const checkConnection = async () => {
  //     const account = await appKit.getAccount();
  //     setEvmConnected(!!account?.address);
  //   };

  //   checkConnection();

  //   const unsubscribe = appKit.subscribeAccount((account: { address?: string }) => {
  //     setEvmConnected(!!account?.address);
  //   });

  //   return () => {
  //     if (typeof unsubscribe === 'function') {
  //       unsubscribe();
  //     }
  //   };
  // }, []);

  // Check if user has the required wallet for the selected network
  const hasRequiredWallet = () => {
    if (selectedNetwork.type === "starknet") {
      return starknetConnected;
    } else {
      return evmConnected;
    }
  };

  // Used to show wallet requirement in the network modal
  const canSwitchNetwork = (network: (typeof networks)[0]) => {
    if (network.type === "starknet") {
      return starknetConnected;
    } else {
      return evmConnected;
    }
  };

  // Updated to just set the selected network without switching
  const handleNetworkSelect = (network: (typeof networks)[0]) => {
    setSelectedNetwork(network);
    setShowNetworkModal(false);
  };

  // Only attempt to switch networks if the user has the required wallet
  const switchNetwork = async (network: (typeof networks)[0]) => {
    if (network.type !== "evm" || !evmConnected) return;

    // const appKit = window.appKit;
    try {
      // Example network IDs (in a real app, these would be actual chain IDs)
      // const networkMapping: {[key: string]: string} = {
      //   "Ethereum": "1",
      //   "Base": "8453",
      //   "Polygon": "137",
      //   "Celo": "42220"
      // };
      // // const chainId = networkMapping[network.name] || "1";
      // await appKit.switchNetwork({ chainId });
    } catch (error) {
      console.error("Failed to switch network:", error);
    }
  };

  // Update the swap button state based on various conditions
  const isSwapButtonDisabled = () => {
    // Only disable if country currency and account details are not complete
    // AND a wallet is already connected (otherwise we need to allow clicking to open wallet modal)
    if (hasRequiredWallet()) {
      return !selectedCountryCurrency || !institution || !accountNumber;
    }
    // Never disable the button if wallet connection is required
    return false;
  };

  // Handler for swap button click
  const handleSwapButtonClick = () => {
    // If wallet is not connected or wrong wallet type is connected, open wallet modal
    if (!hasRequiredWallet()) {
      setShowWalletModal(true);
      return;
    }

    // If appropriate wallet is connected, attempt to switch networks if needed
    if (selectedNetwork.type === "evm" && evmConnected) {
      switchNetwork(selectedNetwork);
    }

    // Only proceed to review if recipient info is provided
    if (selectedCountryCurrency && institution && accountNumber) {
      setShowReviewModal(true);
    }
  };

  // Updated swap button text function
  const getSwapButtonText = () => {
    // If no wallet is connected or the wrong wallet is connected
    if (!hasRequiredWallet()) {
      if (!evmConnected && !starknetConnected) {
        return "Connect Wallet";
      }

      if (selectedNetwork.type === "evm") {
        return "Connect EVM Wallet";
      }

      if (selectedNetwork.type === "starknet") {
        return "Connect Starknet Wallet";
      }
    }

    return "Swap";
  };

  // Handler for wallet connection
  const handleWalletConnect = () => {
    setShowWalletModal(false);
  };

  // Get institutions based on selected country
  const getInstitutionsForCountry = () => {
    if (!selectedCountryCurrency) return [];
    return (
      countryInstitutions[
        selectedCountryCurrency.name as keyof typeof countryInstitutions
      ] || []
    );
  };

  // Handler for swap confirmation
  const handleConfirmSwap = () => {
    // In a real app, this would submit the transaction
    setShowReviewModal(false);
    alert(
      "Transaction confirmed! This would normally process the transaction."
    );
  };

  return (
    <div className="w-full max-w-md mx-auto bg-[#181818] rounded-3xl p-0 flex flex-col gap-0 shadow-lg border border-[#232323] relative">
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-6 pb-2">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold text-white">Swap</span>
          <div className="relative">
            <Button
              variant="outline"
              className="flex items-center gap-2 bg-[#232323] border-none px-4 py-2 rounded-full min-w-[90px]"
              onClick={() => setShowDropdown((v) => !v)}
              type="button"
            >
              <Image
                src={selectedCurrency.logo}
                alt={selectedCurrency.symbol}
                width={24}
                height={24}
                className="rounded-full"
              />
              <span className="text-white font-medium">
                {selectedCurrency.symbol}
              </span>
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                <path
                  d="M7 10l5 5 5-5"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Button>
            <div
              className={`absolute left-0 mt-2 w-full bg-[#232323] rounded-2xl shadow-lg z-30 border border-[#6b6b6b] origin-top transition-all duration-200 ease-out transform ${
                showDropdown
                  ? "scale-100 opacity-100 pointer-events-auto"
                  : "scale-95 opacity-0 pointer-events-none"
              }`}
              style={{ minWidth: 150 }}
            >
              {currencies.map((c) => (
                <button
                  key={c.symbol}
                  className={`flex items-center justify-between w-full px-4 py-3 rounded-xl transition-colors gap-3 ${
                    selectedCurrency.symbol === c.symbol
                      ? "bg-[#353545]"
                      : "hover:bg-[#23232f]"
                  }`}
                  onClick={() => {
                    setSelectedCurrency(c);
                    setShowDropdown(false);
                  }}
                >
                  <span className="flex items-center gap-3">
                    <Image
                      src={c.logo}
                      alt={c.symbol}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    <span className="text-white font-medium text-lg">
                      {c.symbol}
                    </span>
                  </span>
                  {selectedCurrency.symbol === c.symbol && (
                    <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                      <path
                        d="M5 13l4 4L19 7"
                        stroke="#bcbcff"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
        <Button
          variant="outline"
          className="bg-[#232323] border-none p-2 rounded-xl"
        >
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
            <rect
              x="4"
              y="4"
              width="16"
              height="16"
              rx="3"
              stroke="#fff"
              strokeWidth="2"
            />
            <path
              d="M8 8h8v8"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </Button>
      </div>
      {/* From Panel */}
      <div className="mx-4 mt-2 bg-[#232323] rounded-2xl p-5 flex flex-col gap-2 relative">
        <div className="flex items-center justify-between mb-2">
          <span className="text-neutral-200 text-lg font-medium">From</span>
          <span className="text-neutral-400 text-sm">
            Balance: 0{" "}
            <span className="text-red-400 ml-1 cursor-pointer">Max</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="flex items-center gap-2 bg-black border-none px-4 py-2 rounded-full min-w-[120px]"
            onClick={() => setShowNetworkModal(true)}
            type="button"
          >
            <Image
              src={selectedNetwork.logo}
              alt={selectedNetwork.name}
              width={28}
              height={28}
              className="rounded-full"
            />
            <span className="text-white font-medium">
              {selectedNetwork.name}
            </span>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
              <path
                d="M7 10l5 5 5-5"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Button>
          <div className="flex-1 text-right">
            <span className="text-3xl text-neutral-300 font-light">
              0.00005~3
            </span>
          </div>
        </div>
        <NetworkSelectModal
          open={showNetworkModal}
          onClose={() => setShowNetworkModal(false)}
          networks={networks}
          selectedNetwork={selectedNetwork}
          onSelect={handleNetworkSelect}
          canSwitch={canSwitchNetwork}
        />
      </div>
      {/* Arrow in the middle */}
      <div
        className="flex justify-center relative z-20 mt-1"
        style={{ height: 0 }}
      >
        <div className="absolute left-1/2 -translate-x-1/2 -top-6">
          <div
            className="bg-[#181818] border-4 border-[#232323] rounded-xl p-3 shadow-lg flex items-center justify-center"
            style={{ width: 56, height: 56 }}
          >
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
              <path
                d="M12 5v14m0 0l-5-5m5 5l5-5"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="square"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
      {/* To Panel */}
      <div className="mx-4 mb-2 bg-[#232323] rounded-2xl p-5 flex flex-col gap-2 relative">
        <div className="flex items-center justify-between mb-2">
          <span className="text-neutral-200 text-lg font-medium">To</span>
          {selectedCountryCurrency && (
            <span className="text-purple-400 font-medium text-sm cursor-pointer">
              Select beneficiary
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="flex items-center gap-2 bg-black border-none px-4 py-2 rounded-full min-w-[140px]"
            onClick={() => setShowCountryCurrencyModal(true)}
            type="button"
          >
            {selectedCountryCurrency ? (
              <>
                <Image
                  src={selectedCountryCurrency.logo}
                  alt={selectedCountryCurrency.name}
                  width={28}
                  height={28}
                  className="rounded-full"
                />
                <span className="text-white font-medium">
                  {selectedCountryCurrency.name}
                </span>
              </>
            ) : (
              <span className="text-neutral-400 font-medium">
                Select Currency
              </span>
            )}
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
              <path
                d="M7 10l5 5 5-5"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Button>
          <div className="flex-1 text-right">
            <span className="text-3xl text-neutral-300 font-light">0</span>
          </div>
        </div>
        <CountryCurrencyModal
          open={showCountryCurrencyModal}
          onClose={() => setShowCountryCurrencyModal(false)}
          currencies={countryCurrencies}
          selectedCurrency={selectedCountryCurrency}
          onSelect={(c) => {
            setSelectedCountryCurrency(c);
            setShowCountryCurrencyModal(false);
          }}
        />
      </div>

      {/* Recipient Details - Only show when a country is selected */}
      {/* Swap Info */}
      {selectedCountryCurrency && (
        <div className="mx-10 mb-4 flex justify-between text-sm">
          <span className="text-neutral-400">
            1 {selectedCurrency.symbol} ~ 127.38 KES
          </span>
          <span className="text-neutral-400">
            Swap usually completes in 30s
          </span>
        </div>
      )}
      {selectedCountryCurrency && (
        <div className="mx-4 mb-2 bg-[#232323] rounded-2xl p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-white text-lg font-medium">Recipient</span>
          </div>

          <div className="flex gap-3">
            {/* Institution Selector */}
            <div className="flex-1">
              <div
                onClick={() => setShowInstitutionModal(true)}
                className="bg-transparent border border-[#444] text-neutral-400 rounded-full py-3 px-4 cursor-pointer flex items-center justify-between"
              >
                <span>{institution || "Select institution"}</span>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                  <path
                    d="M7 10l5 5 5-5"
                    stroke="#fff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            {/* Account Number */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="Account number"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="bg-transparent border border-[#444] text-white rounded-full py-3 px-4 w-full focus:outline-none focus:border-purple-400"
              />
            </div>
          </div>
        </div>
      )}

      {/* Updated Swap Button */}
      <div className="mx-4 mb-4">
        {/* If recipient form is fully completed or wallet is not yet connected, show the button */}
        <Button
          className={`w-full text-white text-base py-6 rounded-2xl font-medium ${
            hasRequiredWallet()
              ? selectedCountryCurrency && institution && accountNumber
                ? "bg-[#2563eb] hover:bg-[#1d4ed8]"
                : "bg-[#232323] hover:bg-[#2a2a2a]"
              : "bg-[#232323] hover:bg-[#2a2a2a]"
          }`}
          onClick={handleSwapButtonClick}
          disabled={isSwapButtonDisabled()}
        >
          {getSwapButtonText()}
        </Button>

        {/* Show wallet requirement message if needed */}
        {!hasRequiredWallet() && (
          <div className="text-center mt-2 text-xs text-amber-400 font-medium">
            {selectedNetwork.type === "starknet"
              ? "Starknet wallet required for this network"
              : "EVM wallet required for this network"}
          </div>
        )}
      </div>

      {/* Transaction Review Modal */}
      <TransactionReviewModal
        open={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        onConfirm={handleConfirmSwap}
        amount="1"
        currency={selectedCurrency.symbol}
        currencyLogo={selectedCurrency.logo}
        totalValue={
          selectedCountryCurrency
            ? `${
                selectedCountryCurrency.name.includes("Kenya") ? "Ksh" : "NGN"
              } 127.42`
            : "0"
        }
        recipient={
          accountNumber
            ? accountNumber.substring(0, 4) + "..."
            : "Not specified"
        }
        account={accountNumber || "Not specified"}
        institution={institution || "Not specified"}
        network={selectedNetwork.name}
        networkLogo={selectedNetwork.logo}
      />

      {/* Wallet Connection Modal */}
      <WalletConnectionModal
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
        buttonPosition={undefined}
        onConnect={handleWalletConnect}
      />

      {/* Institution Modal */}
      {selectedCountryCurrency && (
        <InstitutionModal
          open={showInstitutionModal}
          onClose={() => setShowInstitutionModal(false)}
          institutions={getInstitutionsForCountry()}
          selectedInstitution={institution}
          onSelect={(inst) => {
            setInstitution(inst);
            setShowInstitutionModal(false);
          }}
          country={selectedCountryCurrency.name}
        />
      )}
    </div>
  );
}
