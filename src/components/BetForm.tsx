
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { BetType, Bet, OddsFormat } from "@/types/bet";

type BetFormProps = {
  onClose: () => void;
};

export function BetForm({ onClose }: BetFormProps) {
  const [bet, setBet] = useState<Partial<Bet>>({
    sport: "",
    league: "",
    event: "",
    betType: "moneyline" as BetType,
    selection: "",
    odds: "",
    stake: "",
    sportsbook: "",
    status: "pending",
    date: new Date().toISOString().split("T")[0],
    oddsFormat: "american" as OddsFormat,
  });

  const handleChange = (field: keyof Bet, value: string) => {
    setBet((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!bet.sport || !bet.betType || !bet.selection || !bet.odds || !bet.stake || !bet.sportsbook) {
      toast({
        title: "Missing information",
        description: "Please fill out all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    // Here we would normally save the bet to a database
    // For now, let's add it to localStorage as a stand-in
    const bets = JSON.parse(localStorage.getItem("bets") || "[]");
    const newBet = {
      ...bet,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    
    localStorage.setItem("bets", JSON.stringify([...bets, newBet]));
    
    toast({
      title: "Bet added",
      description: "Your bet has been successfully tracked.",
    });
    
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New Bet</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sport">Sport*</Label>
              <Select
                value={bet.sport}
                onValueChange={(value) => handleChange("sport", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a sport" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nfl">NFL</SelectItem>
                  <SelectItem value="nba">NBA</SelectItem>
                  <SelectItem value="mlb">MLB</SelectItem>
                  <SelectItem value="nhl">NHL</SelectItem>
                  <SelectItem value="ncaaf">NCAAF</SelectItem>
                  <SelectItem value="ncaab">NCAAB</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="league">League</Label>
              <Input 
                id="league" 
                value={bet.league || ""} 
                onChange={(e) => handleChange("league", e.target.value)} 
                placeholder="e.g., AFC East"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="event">Event/Game*</Label>
            <Input 
              id="event" 
              value={bet.event || ""} 
              onChange={(e) => handleChange("event", e.target.value)} 
              placeholder="e.g., Chiefs vs. Ravens"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="betType">Bet Type*</Label>
              <Select
                value={bet.betType}
                onValueChange={(value) => handleChange("betType", value as BetType)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select bet type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="moneyline">Moneyline</SelectItem>
                  <SelectItem value="spread">Spread</SelectItem>
                  <SelectItem value="total">Total (Over/Under)</SelectItem>
                  <SelectItem value="prop">Prop</SelectItem>
                  <SelectItem value="parlay">Parlay</SelectItem>
                  <SelectItem value="future">Future</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="selection">Selection*</Label>
              <Input 
                id="selection" 
                value={bet.selection || ""} 
                onChange={(e) => handleChange("selection", e.target.value)} 
                placeholder="e.g., Chiefs -3.5"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="odds">Odds Format</Label>
            <Tabs defaultValue="american" className="w-full" onValueChange={(value) => handleChange("oddsFormat", value as OddsFormat)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="american">American</TabsTrigger>
                <TabsTrigger value="decimal">Decimal</TabsTrigger>
                <TabsTrigger value="fractional">Fractional</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="odds">Odds*</Label>
              <Input 
                id="odds" 
                value={bet.odds || ""} 
                onChange={(e) => handleChange("odds", e.target.value)} 
                placeholder={bet.oddsFormat === "american" ? "e.g., -110" : bet.oddsFormat === "decimal" ? "e.g., 1.91" : "e.g., 10/11"}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="stake">Stake*</Label>
              <Input 
                id="stake" 
                type="number" 
                min="0.01" 
                step="0.01" 
                value={bet.stake || ""} 
                onChange={(e) => handleChange("stake", e.target.value)} 
                placeholder="Amount wagered"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sportsbook">Sportsbook*</Label>
              <Select
                value={bet.sportsbook}
                onValueChange={(value) => handleChange("sportsbook", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select sportsbook" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draftkings">DraftKings</SelectItem>
                  <SelectItem value="fanduel">FanDuel</SelectItem>
                  <SelectItem value="caesars">Caesars</SelectItem>
                  <SelectItem value="betmgm">BetMGM</SelectItem>
                  <SelectItem value="pointsbet">PointsBet</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="date">Date Placed</Label>
              <Input 
                id="date" 
                type="date" 
                value={bet.date || ""} 
                onChange={(e) => handleChange("date", e.target.value)} 
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">Save Bet</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
