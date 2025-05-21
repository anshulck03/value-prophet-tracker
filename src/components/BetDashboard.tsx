
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Bet, BetStatus } from "@/types/bet";
import { PerformanceChart } from "@/components/PerformanceChart";
import { BetTable } from "@/components/BetTable";

export function BetDashboard() {
  const [bets, setBets] = useState<Bet[]>([]);
  const [timeRange, setTimeRange] = useState<"all" | "month" | "week" | "day">("all");
  
  useEffect(() => {
    // Load bets from localStorage
    const savedBets = JSON.parse(localStorage.getItem("bets") || "[]");
    setBets(savedBets);
  }, []);
  
  const calculateStats = () => {
    const settledBets = bets.filter(bet => bet.status === "win" || bet.status === "loss");
    
    if (settledBets.length === 0) {
      return {
        totalBets: 0,
        wins: 0,
        losses: 0,
        winRate: 0,
        profit: 0,
        roi: 0,
      };
    }
    
    const wins = settledBets.filter(bet => bet.status === "win").length;
    const losses = settledBets.filter(bet => bet.status === "loss").length;
    
    // Calculate profit (this is simplified - in a real implementation we'd need to convert odds formats and calculate actual returns)
    const profit = settledBets.reduce((acc, bet) => {
      const stake = parseFloat(bet.stake);
      if (bet.status === "win") {
        // Very rough approximation of winnings based on American odds
        const americanOdds = parseInt(bet.odds);
        const winnings = americanOdds > 0 
          ? stake * (americanOdds / 100) 
          : stake * (100 / Math.abs(americanOdds));
        return acc + winnings;
      } else {
        return acc - stake;
      }
    }, 0);
    
    const totalStaked = settledBets.reduce((acc, bet) => acc + parseFloat(bet.stake), 0);
    
    return {
      totalBets: settledBets.length,
      wins,
      losses,
      winRate: (wins / settledBets.length) * 100,
      profit,
      roi: (profit / totalStaked) * 100,
    };
  };
  
  const stats = calculateStats();
  
  const updateBetStatus = (id: string, status: BetStatus) => {
    const updatedBets = bets.map(bet => 
      bet.id === id ? { ...bet, status } : bet
    );
    
    setBets(updatedBets);
    localStorage.setItem("bets", JSON.stringify(updatedBets));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium text-gray-500">Total Bets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBets}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium text-gray-500">Win Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.winRate.toFixed(1)}%</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium text-gray-500">Profit/Loss</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stats.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.profit >= 0 ? '+' : ''}{stats.profit.toFixed(2)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium text-gray-500">ROI</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stats.roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.roi.toFixed(2)}%
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="performance" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="history">Bet History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Performance Overview</CardTitle>
              <CardDescription>
                Track your betting performance over time
              </CardDescription>
              <div className="flex gap-2 mt-2">
                <Badge 
                  className={`cursor-pointer ${timeRange === 'all' ? 'bg-green-600' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
                  onClick={() => setTimeRange("all")}
                >
                  All Time
                </Badge>
                <Badge 
                  className={`cursor-pointer ${timeRange === 'month' ? 'bg-green-600' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
                  onClick={() => setTimeRange("month")}
                >
                  Month
                </Badge>
                <Badge 
                  className={`cursor-pointer ${timeRange === 'week' ? 'bg-green-600' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
                  onClick={() => setTimeRange("week")}
                >
                  Week
                </Badge>
                <Badge 
                  className={`cursor-pointer ${timeRange === 'day' ? 'bg-green-600' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
                  onClick={() => setTimeRange("day")}
                >
                  Day
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <PerformanceChart bets={bets} timeRange={timeRange} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Bet History</CardTitle>
              <CardDescription>
                View and manage your betting history
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BetTable bets={bets} onUpdateStatus={updateBetStatus} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
