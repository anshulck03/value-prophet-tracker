
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

// Mock data for odds comparison
const mockGames = [
  {
    id: "1",
    sport: "nfl",
    league: "NFL",
    event: "Kansas City Chiefs vs Baltimore Ravens",
    date: "2025-05-24T20:00:00",
    markets: {
      moneyline: {
        home: { draftkings: "+150", fanduel: "+155", caesars: "+145", betmgm: "+148", pointsbet: "+152" },
        away: { draftkings: "-180", fanduel: "-185", caesars: "-175", betmgm: "-178", pointsbet: "-182" }
      },
      spread: {
        home: { 
          line: { draftkings: "+3.5", fanduel: "+3.5", caesars: "+3.5", betmgm: "+3", pointsbet: "+3.5" },
          odds: { draftkings: "-110", fanduel: "-108", caesars: "-110", betmgm: "-105", pointsbet: "-110" }
        },
        away: {
          line: { draftkings: "-3.5", fanduel: "-3.5", caesars: "-3.5", betmgm: "-3", pointsbet: "-3.5" },
          odds: { draftkings: "-110", fanduel: "-112", caesars: "-110", betmgm: "-115", pointsbet: "-110" }
        }
      },
      total: {
        over: {
          line: { draftkings: "47.5", fanduel: "48", caesars: "47.5", betmgm: "47.5", pointsbet: "48.5" },
          odds: { draftkings: "-110", fanduel: "-110", caesars: "-110", betmgm: "-110", pointsbet: "-110" }
        },
        under: {
          line: { draftkings: "47.5", fanduel: "48", caesars: "47.5", betmgm: "47.5", pointsbet: "48.5" },
          odds: { draftkings: "-110", fanduel: "-110", caesars: "-110", betmgm: "-110", pointsbet: "-110" }
        }
      }
    }
  },
  {
    id: "2",
    sport: "nba",
    league: "NBA",
    event: "Boston Celtics vs Denver Nuggets",
    date: "2025-05-24T19:30:00",
    markets: {
      moneyline: {
        home: { draftkings: "-140", fanduel: "-135", caesars: "-142", betmgm: "-145", pointsbet: "-140" },
        away: { draftkings: "+120", fanduel: "+115", caesars: "+122", betmgm: "+125", pointsbet: "+120" }
      },
      spread: {
        home: { 
          line: { draftkings: "-2.5", fanduel: "-2", caesars: "-2.5", betmgm: "-2.5", pointsbet: "-2.5" },
          odds: { draftkings: "-110", fanduel: "-110", caesars: "-110", betmgm: "-110", pointsbet: "-115" }
        },
        away: {
          line: { draftkings: "+2.5", fanduel: "+2", caesars: "+2.5", betmgm: "+2.5", pointsbet: "+2.5" },
          odds: { draftkings: "-110", fanduel: "-110", caesars: "-110", betmgm: "-110", pointsbet: "-105" }
        }
      },
      total: {
        over: {
          line: { draftkings: "221.5", fanduel: "222", caesars: "221.5", betmgm: "221", pointsbet: "222.5" },
          odds: { draftkings: "-110", fanduel: "-110", caesars: "-110", betmgm: "-110", pointsbet: "-110" }
        },
        under: {
          line: { draftkings: "221.5", fanduel: "222", caesars: "221.5", betmgm: "221", pointsbet: "222.5" },
          odds: { draftkings: "-110", fanduel: "-110", caesars: "-110", betmgm: "-110", pointsbet: "-110" }
        }
      }
    }
  },
  {
    id: "3",
    sport: "mlb",
    league: "MLB",
    event: "New York Yankees vs Los Angeles Dodgers",
    date: "2025-05-24T16:10:00",
    markets: {
      moneyline: {
        home: { draftkings: "-125", fanduel: "-130", caesars: "-125", betmgm: "-128", pointsbet: "-130" },
        away: { draftkings: "+105", fanduel: "+110", caesars: "+105", betmgm: "+108", pointsbet: "+110" }
      },
      spread: {
        home: { 
          line: { draftkings: "-1.5", fanduel: "-1.5", caesars: "-1.5", betmgm: "-1.5", pointsbet: "-1.5" },
          odds: { draftkings: "+150", fanduel: "+155", caesars: "+148", betmgm: "+150", pointsbet: "+145" }
        },
        away: {
          line: { draftkings: "+1.5", fanduel: "+1.5", caesars: "+1.5", betmgm: "+1.5", pointsbet: "+1.5" },
          odds: { draftkings: "-180", fanduel: "-185", caesars: "-178", betmgm: "-180", pointsbet: "-175" }
        }
      },
      total: {
        over: {
          line: { draftkings: "8.5", fanduel: "8.5", caesars: "8", betmgm: "8.5", pointsbet: "8.5" },
          odds: { draftkings: "-110", fanduel: "-105", caesars: "-120", betmgm: "-110", pointsbet: "-110" }
        },
        under: {
          line: { draftkings: "8.5", fanduel: "8.5", caesars: "8", betmgm: "8.5", pointsbet: "8.5" },
          odds: { draftkings: "-110", fanduel: "-115", caesars: "+100", betmgm: "-110", pointsbet: "-110" }
        }
      }
    }
  }
];

export function OddsComparisonMatrix() {
  const [selectedSport, setSelectedSport] = useState<string>("all");
  const [selectedMarket, setSelectedMarket] = useState<"moneyline" | "spread" | "total">("moneyline");
  const [games, setGames] = useState(mockGames);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  
  const sportsbooks = ["draftkings", "fanduel", "caesars", "betmgm", "pointsbet"];
  
  const filteredGames = selectedSport === "all" 
    ? games 
    : games.filter(game => game.sport === selectedSport);

  const findBestOdds = (game: typeof mockGames[0], market: "moneyline" | "spread" | "total", team: "home" | "away") => {
    if (market === "moneyline") {
      const odds = Object.entries(game.markets.moneyline[team]);
      let bestOddsValue = 0;
      let bestOddsBook = "";
      
      odds.forEach(([book, value]) => {
        const numValue = parseInt(value);
        if (team === "home") {
          // For underdog, higher positive is better
          if (numValue > 0 && numValue > bestOddsValue) {
            bestOddsValue = numValue;
            bestOddsBook = book;
          }
          // For favorite, less negative is better
          if (numValue < 0 && (bestOddsValue === 0 || numValue > bestOddsValue)) {
            bestOddsValue = numValue;
            bestOddsBook = book;
          }
        } else {
          // Same logic applies for away team
          if (numValue > 0 && numValue > bestOddsValue) {
            bestOddsValue = numValue;
            bestOddsBook = book;
          }
          if (numValue < 0 && (bestOddsValue === 0 || numValue > bestOddsValue)) {
            bestOddsValue = numValue;
            bestOddsBook = book;
          }
        }
      });
      
      return bestOddsBook;
    } else {
      // For spread and total, we look at the odds (not the line)
      const odds = Object.entries(
        market === "spread" 
          ? game.markets.spread[team].odds
          : (team === "home" ? game.markets.total.over.odds : game.markets.total.under.odds)
      );
      
      let bestOddsValue = 0;
      let bestOddsBook = "";
      
      odds.forEach(([book, value]) => {
        const numValue = parseInt(value);
        if (numValue > 0 && numValue > bestOddsValue) {
          bestOddsValue = numValue;
          bestOddsBook = book;
        }
        if (numValue < 0 && (bestOddsValue === 0 || numValue > bestOddsValue)) {
          bestOddsValue = numValue;
          bestOddsBook = book;
        }
      });
      
      return bestOddsBook;
    }
  };
  
  const formatEventTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const refreshOdds = () => {
    // In a real application, this would fetch fresh odds from an API
    // For the mock, we'll simulate a refresh with a slight delay
    toast({
      title: "Refreshing odds...",
    });
    
    setTimeout(() => {
      setLastUpdated(new Date());
      toast({
        title: "Odds updated",
        description: "Latest odds have been loaded."
      });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Odds Comparison</CardTitle>
              <CardDescription>
                Compare odds across major sportsbooks
              </CardDescription>
            </div>
            <div className="text-sm text-gray-500">
              Last updated: {lastUpdated.toLocaleTimeString()}
              <Button 
                variant="outline" 
                size="sm" 
                className="ml-4"
                onClick={refreshOdds}
              >
                Refresh Odds
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 md:items-center mb-6">
            <div className="w-full md:w-1/3">
              <Select
                value={selectedSport}
                onValueChange={setSelectedSport}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a sport" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sports</SelectItem>
                  <SelectItem value="nfl">NFL</SelectItem>
                  <SelectItem value="nba">NBA</SelectItem>
                  <SelectItem value="mlb">MLB</SelectItem>
                  <SelectItem value="nhl">NHL</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-full md:w-1/3">
              <Select
                value={selectedMarket}
                onValueChange={(value) => setSelectedMarket(value as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select market" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="moneyline">Moneyline</SelectItem>
                  <SelectItem value="spread">Spread</SelectItem>
                  <SelectItem value="total">Total (Over/Under)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Game</TableHead>
                  <TableHead>Time</TableHead>
                  {sportsbooks.map((book) => (
                    <TableHead key={book} className="capitalize">{book}</TableHead>
                  ))}
                  <TableHead>Best Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGames.map((game) => (
                  <>
                    <TableRow key={`${game.id}-home`}>
                      <TableCell>
                        <div className="font-medium">{game.event.split(" vs ")[0]}</div>
                        <div className="text-xs text-gray-500">{game.league}</div>
                      </TableCell>
                      <TableCell>
                        {formatEventTime(game.date)}
                      </TableCell>
                      {sportsbooks.map((book) => {
                        let cellContent;
                        let highlight = false;
                        
                        if (selectedMarket === "moneyline") {
                          cellContent = game.markets.moneyline.home[book as keyof typeof game.markets.moneyline.home];
                          highlight = book === findBestOdds(game, "moneyline", "home");
                        } else if (selectedMarket === "spread") {
                          const line = game.markets.spread.home.line[book as keyof typeof game.markets.spread.home.line];
                          const odds = game.markets.spread.home.odds[book as keyof typeof game.markets.spread.home.odds];
                          cellContent = `${line} (${odds})`;
                          highlight = book === findBestOdds(game, "spread", "home");
                        } else {
                          const line = game.markets.total.over.line[book as keyof typeof game.markets.total.over.line];
                          const odds = game.markets.total.over.odds[book as keyof typeof game.markets.total.over.odds];
                          cellContent = `O ${line} (${odds})`;
                          highlight = book === findBestOdds(game, "total", "home");
                        }
                        
                        return (
                          <TableCell 
                            key={`${game.id}-home-${book}`}
                            className={highlight ? "font-bold text-green-600" : ""}
                          >
                            {cellContent}
                          </TableCell>
                        );
                      })}
                      <TableCell>
                        {findBestOdds(game, selectedMarket, "home") && (
                          <div className="capitalize text-green-600 font-medium">
                            {findBestOdds(game, selectedMarket, "home")}
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                    
                    <TableRow key={`${game.id}-away`}>
                      <TableCell>
                        <div className="font-medium">{game.event.split(" vs ")[1]}</div>
                        <div className="text-xs invisible">spacer</div>
                      </TableCell>
                      <TableCell>
                        <div className="invisible">spacer</div>
                      </TableCell>
                      {sportsbooks.map((book) => {
                        let cellContent;
                        let highlight = false;
                        
                        if (selectedMarket === "moneyline") {
                          cellContent = game.markets.moneyline.away[book as keyof typeof game.markets.moneyline.away];
                          highlight = book === findBestOdds(game, "moneyline", "away");
                        } else if (selectedMarket === "spread") {
                          const line = game.markets.spread.away.line[book as keyof typeof game.markets.spread.away.line];
                          const odds = game.markets.spread.away.odds[book as keyof typeof game.markets.spread.away.odds];
                          cellContent = `${line} (${odds})`;
                          highlight = book === findBestOdds(game, "spread", "away");
                        } else {
                          const line = game.markets.total.under.line[book as keyof typeof game.markets.total.under.line];
                          const odds = game.markets.total.under.odds[book as keyof typeof game.markets.total.under.odds];
                          cellContent = `U ${line} (${odds})`;
                          highlight = book === findBestOdds(game, "total", "away");
                        }
                        
                        return (
                          <TableCell 
                            key={`${game.id}-away-${book}`}
                            className={highlight ? "font-bold text-green-600" : ""}
                          >
                            {cellContent}
                          </TableCell>
                        );
                      })}
                      <TableCell>
                        {findBestOdds(game, selectedMarket, "away") && (
                          <div className="capitalize text-green-600 font-medium">
                            {findBestOdds(game, selectedMarket, "away")}
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  </>
                ))}
                
                {filteredGames.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7 + sportsbooks.length} className="text-center py-8">
                      No games available for the selected sport.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
