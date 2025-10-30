export type NFTMarketplaceId = "opensea" | "rarible" | "blur";

export type NFTMarketplace = {
  name: string;
  baseUrl: string;
  icon: string;
};

export type RWAProduct = {
  id: string;
  name: string;
  fullName: string;
  tagline: string;
  color: string;
  pixelArt: string;
  description: string;
  specs: string[];
  nftMarket: NFTMarketplaceId;
  contractAddress: string;
  totalSupply: number;
  priceETH: string;
  revenueModel: {
    rentalYield: string;
    dataRevenue: string;
    appreciation: string;
  };
};
