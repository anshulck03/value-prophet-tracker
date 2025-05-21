
export type BetType = "moneyline" | "spread" | "total" | "prop" | "parlay" | "future";
export type BetStatus = "pending" | "win" | "loss" | "push";
export type OddsFormat = "american" | "decimal" | "fractional";

export interface Bet {
  id: string;
  sport: string;
  league: string;
  event: string;
  betType: BetType;
  selection: string;
  odds: string;
  oddsFormat: OddsFormat;
  stake: string;
  sportsbook: string;
  status: BetStatus;
  date: string;
  createdAt: string;
  notes?: string;
  tags?: string[];
  confidenceLevel?: number;
}
