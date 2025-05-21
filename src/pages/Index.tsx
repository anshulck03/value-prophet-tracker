
import { Button } from "@/components/ui/button";
import { BetDashboard } from "@/components/BetDashboard";
import { Navigation } from "@/components/Navigation";
import { useState } from "react";
import { BetForm } from "@/components/BetForm";
import { OddsComparisonMatrix } from "@/components/OddsComparisonMatrix";

const Index = () => {
  const [view, setView] = useState<"dashboard" | "odds" | "research" | "bankroll">("dashboard");
  const [showBetForm, setShowBetForm] = useState(false);
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navigation activeView={view} setView={setView} />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {view === "dashboard" && "Performance Dashboard"}
            {view === "odds" && "Odds Comparison"}
            {view === "research" && "Research Hub"}
            {view === "bankroll" && "Bankroll Management"}
          </h1>
          {view === "dashboard" && (
            <Button 
              onClick={() => setShowBetForm(true)}
              className="bg-green-600 hover:bg-green-700"
            >
              Add New Bet
            </Button>
          )}
        </div>
        
        {view === "dashboard" && <BetDashboard />}
        {view === "odds" && <OddsComparisonMatrix />}
        {view === "research" && (
          <div className="bg-white p-8 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Research Hub</h2>
            <p>Coming soon in the next phase.</p>
          </div>
        )}
        {view === "bankroll" && (
          <div className="bg-white p-8 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Bankroll Management</h2>
            <p>Coming soon in the next phase.</p>
          </div>
        )}
      </main>
      
      {showBetForm && (
        <BetForm onClose={() => setShowBetForm(false)} />
      )}
    </div>
  );
};

export default Index;
