
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bet, BetStatus } from "@/types/bet";

type BetTableProps = {
  bets: Bet[];
  onUpdateStatus: (id: string, status: BetStatus) => void;
};

export function BetTable({ bets, onUpdateStatus }: BetTableProps) {
  const [sortColumn, setSortColumn] = useState<keyof Bet>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  
  const handleSort = (column: keyof Bet) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };
  
  const sortedBets = [...bets].sort((a, b) => {
    if (a[sortColumn] < b[sortColumn]) return sortDirection === "asc" ? -1 : 1;
    if (a[sortColumn] > b[sortColumn]) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });
  
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  const getStatusBadge = (status: BetStatus) => {
    switch (status) {
      case "win":
        return <Badge className="bg-green-600">Win</Badge>;
      case "loss":
        return <Badge className="bg-red-600">Loss</Badge>;
      case "push":
        return <Badge className="bg-gray-500">Push</Badge>;
      default:
        return <Badge className="bg-yellow-500">Pending</Badge>;
    }
  };

  if (bets.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No bets tracked yet. Add your first bet to get started!</p>
      </div>
    );
  }
  
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort("date")}
            >
              Date {sortColumn === "date" && (sortDirection === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead>Sport</TableHead>
            <TableHead>Event</TableHead>
            <TableHead>Bet Type</TableHead>
            <TableHead>Selection</TableHead>
            <TableHead>Odds</TableHead>
            <TableHead>Stake</TableHead>
            <TableHead>Sportsbook</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedBets.map((bet) => (
            <TableRow key={bet.id}>
              <TableCell>{formatDate(bet.date)}</TableCell>
              <TableCell className="capitalize">{bet.sport}</TableCell>
              <TableCell>{bet.event}</TableCell>
              <TableCell className="capitalize">{bet.betType}</TableCell>
              <TableCell>{bet.selection}</TableCell>
              <TableCell>{bet.odds}</TableCell>
              <TableCell>${parseFloat(bet.stake).toFixed(2)}</TableCell>
              <TableCell className="capitalize">{bet.sportsbook}</TableCell>
              <TableCell>{getStatusBadge(bet.status)}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      Update
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => onUpdateStatus(bet.id, "win")}>
                      Mark as Win
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onUpdateStatus(bet.id, "loss")}>
                      Mark as Loss
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onUpdateStatus(bet.id, "push")}>
                      Mark as Push
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onUpdateStatus(bet.id, "pending")}>
                      Mark as Pending
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
