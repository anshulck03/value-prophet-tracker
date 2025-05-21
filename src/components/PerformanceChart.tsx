
import { useMemo } from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Card } from "@/components/ui/card";
import { Bet } from "@/types/bet";

type PerformanceChartProps = {
  bets: Bet[];
  timeRange: "all" | "month" | "week" | "day";
};

export function PerformanceChart({ bets, timeRange }: PerformanceChartProps) {
  const chartData = useMemo(() => {
    // Filter bets by time range
    const now = new Date();
    const filteredBets = bets.filter(bet => {
      const betDate = new Date(bet.date);
      switch (timeRange) {
        case "day":
          return betDate.toDateString() === now.toDateString();
        case "week":
          const weekAgo = new Date();
          weekAgo.setDate(now.getDate() - 7);
          return betDate >= weekAgo;
        case "month":
          const monthAgo = new Date();
          monthAgo.setMonth(now.getMonth() - 1);
          return betDate >= monthAgo;
        default:
          return true;
      }
    });
    
    // Sort bets by date
    const sortedBets = [...filteredBets].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    // Group bets by date
    const betsByDate = sortedBets.reduce<Record<string, {wins: number, losses: number, profit: number}>>((acc, bet) => {
      const date = bet.date.split("T")[0];
      
      if (!acc[date]) {
        acc[date] = { wins: 0, losses: 0, profit: 0 };
      }
      
      const stake = parseFloat(bet.stake);
      
      if (bet.status === "win") {
        acc[date].wins += 1;
        // Very simplistic winnings calculation
        const americanOdds = parseInt(bet.odds);
        const winnings = americanOdds > 0 
          ? stake * (americanOdds / 100) 
          : stake * (100 / Math.abs(americanOdds));
        acc[date].profit += winnings;
      } else if (bet.status === "loss") {
        acc[date].losses += 1;
        acc[date].profit -= stake;
      }
      
      return acc;
    }, {});
    
    // Convert to chart data format and calculate running totals
    let runningProfit = 0;
    
    return Object.entries(betsByDate).map(([date, data]) => {
      runningProfit += data.profit;
      
      return {
        date: new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        profit: data.profit.toFixed(2),
        runningProfit: runningProfit.toFixed(2),
        wins: data.wins,
        losses: data.losses,
      };
    });
  }, [bets, timeRange]);
  
  // Handle empty state
  if (chartData.length === 0) {
    return (
      <Card className="flex items-center justify-center h-full">
        <p className="text-gray-500 text-center">
          No betting data available for the selected time range.
          <br />
          Add some bets to see your performance chart.
        </p>
      </Card>
    );
  }

  return (
    <ChartContainer 
      config={{
        profit: { label: "Profit" },
        runningProfit: { label: "Bankroll", color: "#22c55e" },
      }}
      className="h-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <ChartTooltip 
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <ChartTooltipContent>
                    <div className="px-2">
                      <p className="text-sm font-semibold">{payload[0].payload.date}</p>
                      <p className="text-xs text-gray-500">
                        Daily Profit: <span className={Number(payload[0].payload.profit) >= 0 ? "text-green-600" : "text-red-600"}>
                          {Number(payload[0].payload.profit) >= 0 ? '+' : ''}${payload[0].payload.profit}
                        </span>
                      </p>
                      <p className="text-xs text-gray-500">
                        Bankroll: <span className={Number(payload[0].payload.runningProfit) >= 0 ? "text-green-600" : "text-red-600"}>
                          ${payload[0].payload.runningProfit}
                        </span>
                      </p>
                      <p className="text-xs text-gray-500">
                        Record: {payload[0].payload.wins}W - {payload[0].payload.losses}L
                      </p>
                    </div>
                  </ChartTooltipContent>
                );
              }
              return null;
            }}
          />
          <Line 
            type="monotone" 
            dataKey="runningProfit" 
            stroke="#22c55e" 
            strokeWidth={2} 
            dot={true}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
