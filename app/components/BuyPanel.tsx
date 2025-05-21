"use client";
import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { CountryCurrencyModal } from "./modals/CountryCurrencyModal";
import { TokenSelectModal } from "./modals/TokenSelectModal";
import { InstitutionModal } from "./modals/InstitutionModal";
import { BuyTransactionReviewModal } from "./modals/BuyTransactionReviewModal";

// Reuse the same country list from SwapPanel
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

// Available networks
const networks = [
  "All Networks",
  "ethereum",
  "polygon",
  "base",
  "celo",
  "starknet",
];

// Token options with networks
const tokenOptions = [
  {
    symbol: "USDC",
    name: "USD Coin",
    logo: "/logos/USDC.svg",
    network: "base",
    networkLogo: "/logos/base.png",
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    logo: "/logos/USDC.svg",
    network: "starknet",
    networkLogo: "/logos/starknet.png",
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    logo: "/logos/USDC.svg",
    network: "ethereum",
    networkLogo: "/logos/ethereum.png",
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    logo: "/logos/USDC.svg",
    network: "polygon",
    networkLogo: "/logos/polygon.png",
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    logo: "/logos/USDC.svg",
    network: "celo",
    networkLogo: "/logos/celo-logo.png",
  },
  {
    symbol: "USDT",
    name: "USD Tether",
    logo: "/logos/USDT.svg",
    network: "ethereum",
    networkLogo: "/logos/ethereum.png",
  },
  {
    symbol: "USDT",
    name: "USD Tether",
    logo: "/logos/USDT.svg",
    network: "polygon",
    networkLogo: "/logos/polygon.png",
  },
  // USDT on Base removed as Base only supports USDC
  {
    symbol: "USDT",
    name: "USD Tether",
    logo: "/logos/USDT.svg",
    network: "celo",
    networkLogo: "/logos/celo-logo.png",
  },
  {
    symbol: "USDT",
    name: "USD Tether",
    logo: "/logos/USDT.svg",
    network: "starknet",
    networkLogo: "/logos/starknet.png",
  },
];

export function BuyPanel() {
  const [selectedCountry, setSelectedCountry] = useState<null | {
    name: string;
    logo: string;
  }>(null);
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [selectedToken, setSelectedToken] = useState<null | {
    symbol: string;
    name: string;
    logo: string;
    network: string;
    networkLogo: string;
  }>(null);
  const [showTokenModal, setShowTokenModal] = useState(false);

  // New states for recipient details
  const [institution, setInstitution] = useState<string | null>(null);
  const [showInstitutionModal, setShowInstitutionModal] = useState(false);
  const [accountNumber, setAccountNumber] = useState("");
  const [description, setDescription] = useState("");
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [amount, setAmount] = useState("100");

  // Get institutions based on selected country
  const getInstitutionsForCountry = () => {
    if (!selectedCountry) return [];
    return (
      countryInstitutions[
        selectedCountry.name as keyof typeof countryInstitutions
      ] || []
    );
  };

  // Handler for buy confirmation
  const handleConfirmBuy = () => {
    // In a real app, this would submit the transaction
    setShowReviewModal(false);
    alert(
      "Transaction confirmed! This would normally process the transaction."
    );
  };

  return (
    <div className="w-full max-w-md mx-auto bg-[#181818] rounded-2xl p-6 flex flex-col gap-4 border border-[#232323]">
      <div className="flex justify-between items-center mb-4">
        <span className="text-neutral-400 text-lg">You&apos;re buying</span>
        <Button
          variant="outline"
          className="flex items-center gap-2 bg-[#232323] border-none px-4 py-2 rounded-full"
          onClick={() => setShowCountryModal(true)}
        >
          {selectedCountry ? (
            <>
              <Image
                src={selectedCountry.logo}
                alt={selectedCountry.name}
                width={24}
                height={24}
                className="rounded-full"
              />
              <span className="text-white font-medium">
                {selectedCountry.name}
              </span>
            </>
          ) : (
            <>
              <span className="w-6 h-6 bg-[#444] rounded-full inline-block" />
              <span className="text-neutral-400 font-medium">
                Select country
              </span>
            </>
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
      </div>
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="text-6xl text-white font-light">${amount}</div>
        <Button
          variant="default"
          className="bg-white hover:bg-gray-100 text-black px-6 py-2 rounded-full font-medium flex items-center gap-2"
          onClick={() => setShowTokenModal(true)}
        >
          {selectedToken ? (
            <>
              <Image
                src={selectedToken.logo}
                alt={selectedToken.symbol}
                width={24}
                height={24}
                className="rounded-full"
              />
              <span className="font-medium">{selectedToken.symbol}</span>
              <span className="text-gray-500 text-xs">
                on {selectedToken.network}
              </span>
            </>
          ) : (
            <span>Select a token</span>
          )}
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
            <path
              d="M7 10l5 5 5-5"
              stroke="#000"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Button>

        {/* Quick amount buttons */}
        <div className="flex gap-4 mt-2">
          <Button
            variant="outline"
            className="rounded-full px-6 py-2 text-white bg-[#232323] border-none"
            onClick={() => setAmount("100")}
          >
            $100
          </Button>
          <Button
            variant="outline"
            className="rounded-full px-6 py-2 text-white bg-[#232323] border-none"
            onClick={() => setAmount("300")}
          >
            $300
          </Button>
          <Button
            variant="outline"
            className="rounded-full px-6 py-2 text-white bg-[#232323] border-none"
            onClick={() => setAmount("1000")}
          >
            $1000
          </Button>
        </div>
      </div>

      {/* Recipient Details - Only show when both country and token are selected */}
      {selectedCountry && selectedToken && (
        <>
          {/* Exchange Rate Info */}
          <div className="mt-2 flex justify-between text-sm">
            <span className="text-neutral-400">
              1 {selectedToken.symbol} ~ 127.42{" "}
              {selectedCountry.name === "Kenya" ? "KES" : "NGN"}
            </span>
            <span className="text-neutral-400">Usually completes in 30s</span>
          </div>
          <div className="mt-4 bg-[#232323] rounded-2xl p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-white text-lg font-medium">Recipient</span>
              <span className="text-purple-400 font-medium text-sm cursor-pointer">
                Select beneficiary
              </span>
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

            {/* Description Field */}
            <div className="flex items-center border border-[#444] rounded-full px-4 py-3">
              <svg
                width="24"
                height="24"
                className="mr-2 text-neutral-400"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="#888"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M11 4H4v14a2 2 0 002 2h12a2 2 0 002-2v-5M9 15H4M15 1v6m-3-3h6"
                />
              </svg>
              <input
                type="text"
                placeholder="Wallet address here..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-transparent text-white w-full focus:outline-none"
              />
            </div>
          </div>

          {/* Buy Button */}
          <Button
            className="w-full mt-2 bg-[#232323] hover:bg-[#2a2a2a] text-white text-lg py-4 rounded-2xl font-medium"
            disabled={!institution || !accountNumber}
            onClick={() => setShowReviewModal(true)}
          >
            Buy
          </Button>
        </>
      )}

      {/* Conditional Button - Only show when both country and token are not selected yet */}
      {!(selectedCountry && selectedToken) && (
        <Button
          className="w-full mt-4 bg-[#232323] text-white text-lg py-4 rounded-2xl font-medium"
          disabled={true}
        >
          Select country and token
        </Button>
      )}

      {/* Country Selection Modal */}
      <CountryCurrencyModal
        open={showCountryModal}
        onClose={() => setShowCountryModal(false)}
        currencies={countryCurrencies}
        selectedCurrency={selectedCountry}
        onSelect={(country) => {
          setSelectedCountry(country);
          setShowCountryModal(false);
        }}
      />

      {/* Token Selection Modal */}
      <TokenSelectModal
        open={showTokenModal}
        onClose={() => setShowTokenModal(false)}
        tokens={tokenOptions}
        selectedToken={selectedToken}
        networks={networks}
        onSelect={(token) => {
          setSelectedToken(token);
          setShowTokenModal(false);
        }}
      />

      {/* Institution Modal */}
      {selectedCountry && (
        <InstitutionModal
          open={showInstitutionModal}
          onClose={() => setShowInstitutionModal(false)}
          institutions={getInstitutionsForCountry()}
          selectedInstitution={institution}
          onSelect={(inst) => {
            setInstitution(inst);
            setShowInstitutionModal(false);
          }}
          country={selectedCountry.name}
        />
      )}

      {/* Buy Transaction Review Modal */}
      {selectedToken && selectedCountry && (
        <BuyTransactionReviewModal
          open={showReviewModal}
          onClose={() => setShowReviewModal(false)}
          onConfirm={handleConfirmBuy}
          amount={amount}
          currency={selectedToken.symbol}
          currencyLogo={selectedToken.logo}
          totalValue={`${selectedCountry.name === "Kenya" ? "Ksh" : "NGN"} ${(
            parseFloat(amount) * 127.42
          ).toFixed(2)}`}
          recipient={
            accountNumber
              ? accountNumber.substring(0, 4) + "..."
              : "Not specified"
          }
          account={accountNumber || "Not specified"}
          institution={institution || "Not specified"}
          network={selectedToken.network}
          networkLogo={selectedToken.networkLogo}
          walletAddress={description || undefined}
        />
      )}
    </div>
  );
}
