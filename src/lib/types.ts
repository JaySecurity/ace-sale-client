export interface StoreData {
  maxSupply: number;
  remaining: number;
  soldAmount: number;
  remainingTokens: number;
  minimumPurchaseTokens: number;
  pricePerToken: number;
  nextRoundPrice: number;
  ETHRate: number;
  LOCGRate: number;
  usdRaised?: string;
  usdGoal?: string;
  endDate: Date;
}

export interface Token {
  ID: string;
  TokenID: string;
  Name: string;
  Available: boolean;
  MaxSupply: number;
  QtyPerUnit: number;
  SaleStart: number;
  SaleEnd: number;
  ProductID: string;
  PriceInUSD: 0.00015;
  LOCGBonus: number;
  MaxPurchase: number;
  MinPurchase: number;
  Remaining: number;
  AdditionalAccountedQuantity: number;
  Offers: [Offer];
  PromoCodes: [PromoCode];
}

export interface Offer {
  ID: string;
  SaleStart: number;
  SaleEnd: number;
  LOCGBonusOverride: number;
}

export interface PromoCode {
  ID: string;
  Active: boolean;
  Bonus: number;
  ReferralBonus: number;
  ReferrerPayout: number;
  PaymentMethodsExcept: [number];
}

export interface Timer {
  now: Date;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  timeRemaining: number;
  endDate: Date;
}

export interface Order {
  ID: string;
  BuyerID: string;
  Quantity: number;
  ProductID: string;
  ProductType: number;
  PaymentMethod: number;
  Status: number;
  Price: string;
  CreatedAt: Date;
  PaymentHash: string;
  OperationHash: string;
  Cards: string[];
  Coins: number;
  Error: string;
  PromoCode: string;
}

export interface OrderResponse {
  To: string;
  CallData: string;
  Order: Order;
  ChainID: string;
  Value: string;
}
