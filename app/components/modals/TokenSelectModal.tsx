import { useState } from "react";
import Image from "next/image";

interface Token {
  symbol: string;
  name: string;
  logo: string;
  network: string;
  networkLogo: string;
}

interface TokenSelectModalProps {
  open: boolean;
  onClose: () => void;
  tokens: Token[];
  selectedToken: Token | null;
  onSelect: (token: Token) => void;
  networks: string[];
}

export function TokenSelectModal({
  open,
  onClose,
  tokens,
  // selectedToken,
  onSelect,
  networks,
}: TokenSelectModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNetwork, setSelectedNetwork] = useState("All Networks");
  const [showNetworkDropdown, setShowNetworkDropdown] = useState(false);

  // Filter tokens based on search query and selected network
  const filteredTokens = tokens.filter((token) => {
    // Filter by search query
    const matchesSearch =
      searchQuery === "" ||
      token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.name.toLowerCase().includes(searchQuery.toLowerCase());

    // Filter by network
    const matchesNetwork =
      selectedNetwork === "All Networks" || token.network === selectedNetwork;

    return matchesSearch && matchesNetwork;
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center ">
      <div className="bg-[#232323] rounded-2xl max-w-md w-[95%] shadow-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center p-5 border-b border-[#3a4155]">
          <button
            className="text-neutral-400 hover:text-white mr-4"
            onClick={onClose}
          >
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path
                d="M19 12H5M5 12l7-7m-7 7l7 7"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <h3 className="text-xl text-white font-medium flex-1 text-center">
            Select A Token
          </h3>
        </div>

        {/* Search and Filter Area */}
        <div className="p-4 flex gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                <path
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  stroke="#999"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Type a currency"
              className="w-full bg-[#1f2533] text-white py-3 pl-10 pr-4 rounded-xl border border-[#3a4155] focus:outline-none"
            />
          </div>

          {/* Network Filter Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNetworkDropdown(!showNetworkDropdown)}
              className="bg-[#1f2533] text-white py-3 px-4 rounded-xl border border-[#3a4155] flex items-center gap-2 min-w-[160px]"
            >
              <span>{selectedNetwork}</span>
              <svg
                width="16"
                height="16"
                fill="none"
                viewBox="0 0 24 24"
                className={`transition-transform ${
                  showNetworkDropdown ? "rotate-180" : ""
                }`}
              >
                <path
                  d="M7 10l5 5 5-5"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {/* Network Dropdown Menu */}
            {showNetworkDropdown && (
              <div className="absolute right-0 mt-2 bg-[#1f2533] border border-[#3a4155] rounded-xl w-full z-10 shadow-lg">
                {networks.map((network) => (
                  <button
                    key={network}
                    className={`w-full text-left px-4 py-2 text-white hover:bg-[#3a4155] ${
                      selectedNetwork === network ? "bg-[#3a4155]" : ""
                    }`}
                    onClick={() => {
                      setSelectedNetwork(network);
                      setShowNetworkDropdown(false);
                    }}
                  >
                    {network}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Token List */}
        <div className="overflow-y-auto flex-1">
          {filteredTokens.length > 0 ? (
            filteredTokens.map((token, index) => (
              <button
                key={`${token.symbol}-${token.network}-${index}`}
                className="flex items-center justify-between w-full p-2 hover:bg-[#3a4155] transition-colors border-b border-[#3a4155] last:border-0"
                onClick={() => {
                  onSelect(token);
                }}
              >
                <div className="flex items-center gap-3">
                  <Image
                    src={token.logo}
                    alt={token.symbol}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <div className="text-left">
                    <div className="text-white font-medium">{token.symbol}</div>
                    <div className="text-neutral-400 text-sm">{token.name}</div>
                  </div>
                </div>
                <div className="bg-[#232836] px-3 py-1 rounded-full text-white text-sm">
                  {token.network}
                </div>
              </button>
            ))
          ) : (
            <div className="p-4 text-center text-neutral-400">
              No tokens found matching your criteria
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
