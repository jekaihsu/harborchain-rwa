// src/components/data/rwaProducts.ts

export const nftMarketplaces = {
  opensea: {
    name: "OpenSea",
    baseUrl: "https://opensea.io/assets/ethereum/",
    icon: "🌊",
  },
  rarible: {
    name: "Rarible",
    baseUrl: "https://rarible.com/token/",
    icon: "🎨",
  },
  blur: {
    name: "Blur",
    baseUrl: "https://blur.io/asset/",
    icon: "⚡",
  },
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
  nftMarket: keyof typeof nftMarketplaces;
  contractAddress: string;
  totalSupply: number;
  priceETH: string;
  revenueModel: {
    rentalYield: string;
    dataRevenue: string;
    appreciation: string;
  };
};

export const products: RWAProduct[] = [
  {
    id: "gps",
    name: "GPS",
    fullName: "GPS 精密定位系統",
    tagline: "Global Positioning System",
    color: "#00F5FF",
    pixelArt: `
      ████████
      ██░░░░██
      ██░██░██
      ██░░░░██
      ████████
      ░░████░░
      ░░████░░
    `,
    description:
      "專業級 GPS 接收器，提供 RTK 即時動態定位，精度可達釐米級。適用於土地測量、工程施工、地籍調查等專業領域。",
    specs: [
      "定位精度：±2cm（水平）/ ±5cm（垂直）",
      "衛星系統：GPS / GLONASS / BeiDou / Galileo",
      "數據更新率：20Hz",
      "防護等級：IP67",
    ],
    nftMarket: "opensea",
    contractAddress: "0x1234...5678",
    totalSupply: 100,
    priceETH: "0.5",
    revenueModel: {
      rentalYield: "8-12%",
      dataRevenue: "每筆測量 0.001 ETH",
      appreciation: "預估年增值 15-20%",
    },
  },
  {
    id: "theodolite",
    name: "經緯儀",
    fullName: "電子經緯儀系統",
    tagline: "Theodolite Precision",
    color: "#FF00FF",
    pixelArt: `
      ░░████░░
      ░██████░
      ████████
      ██░██░██
      ░░████░░
      ░░░██░░░
      ░██████░
    `,
    description:
      "高精度電子經緯儀，具備自動目標識別與追蹤功能。廣泛應用於建築測量、隧道工程、變形監測等專業場景。",
    specs: [
      '角度精度：±1"',
      "測距範圍：5000m",
      "自動補償：雙軸液體電子",
      "內存容量：10000 點",
    ],
    nftMarket: "opensea",
    contractAddress: "0x2345...6789",
    totalSupply: 80,
    priceETH: "0.8",
    revenueModel: {
      rentalYield: "10-15%",
      dataRevenue: "每個項目 0.005 ETH",
      appreciation: "預估年增值 18-25%",
    },
  },
  {
    id: "level",
    name: "水準儀",
    fullName: "數位水準儀",
    tagline: "Level Instrument",
    color: "#FFD700",
    pixelArt: `
      ░░████░░
      ████████
      ██████░░
      ████████
      ░░████░░
      ░░░██░░░
      ░░████░░
    `,
    description:
      "數位自動安平水準儀，內建條碼尺讀數系統。適用於高程測量、沉降觀測、路橋施工等精密工程。",
    specs: [
      "測量精度：±0.3mm/km",
      "放大倍率：32x",
      "最短視距：0.6m",
      "自動安平範圍：±15'",
    ],
    nftMarket: "opensea",
    contractAddress: "0x3456...7890",
    totalSupply: 120,
    priceETH: "0.4",
    revenueModel: {
      rentalYield: "7-10%",
      dataRevenue: "每日使用 0.0005 ETH",
      appreciation: "預估年增值 12-18%",
    },
  },
  {
    id: "scanner",
    name: "掃描儀",
    fullName: "3D 雷射掃描儀",
    tagline: "3D Laser Scanner",
    color: "#00FF41",
    pixelArt: `
      ████████
      ██░░░░██
      ██████░░
      ██░░████
      ██░░░░██
      ████████
      ░░░░░░░░
    `,
    description:
      "高速 3D 雷射掃描系統，可快速獲取三維點雲數據。應用於古蹟保存、BIM 建模、工廠數位孿生等領域。",
    specs: [
      "掃描速度：976,000 點/秒",
      "測距範圍：350m",
      "點位精度：±2mm",
      "視場角：360° × 300°",
    ],
    nftMarket: "opensea",
    contractAddress: "0x4567...8901",
    totalSupply: 50,
    priceETH: "1.5",
    revenueModel: {
      rentalYield: "15-20%",
      dataRevenue: "每個模型 0.01 ETH",
      appreciation: "預估年增值 25-35%",
    },
  },
];
