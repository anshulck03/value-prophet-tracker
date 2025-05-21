
import { Button } from "@/components/ui/button";
import { CreditCard, LineChart, Search, Settings } from "lucide-react";

type NavigationProps = {
  activeView: "dashboard" | "odds" | "research" | "bankroll";
  setView: (view: "dashboard" | "odds" | "research" | "bankroll") => void;
};

export function Navigation({ activeView, setView }: NavigationProps) {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-green-600 mr-8">BetTrackr</h1>
            <nav className="hidden md:flex space-x-1">
              <NavButton 
                icon={<LineChart className="h-4 w-4" />}
                label="Dashboard"
                isActive={activeView === "dashboard"}
                onClick={() => setView("dashboard")}
              />
              <NavButton 
                icon={<Search className="h-4 w-4" />}
                label="Odds"
                isActive={activeView === "odds"}
                onClick={() => setView("odds")}
              />
              <NavButton 
                icon={<Settings className="h-4 w-4" />}
                label="Research"
                isActive={activeView === "research"}
                onClick={() => setView("research")}
              />
              <NavButton 
                icon={<CreditCard className="h-4 w-4" />}
                label="Bankroll"
                isActive={activeView === "bankroll"}
                onClick={() => setView("bankroll")}
              />
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline">Login</Button>
            <Button>Sign Up</Button>
          </div>
        </div>
        <div className="md:hidden flex overflow-x-auto py-2 -mb-px space-x-2">
          <NavButton 
            icon={<LineChart className="h-4 w-4" />}
            label="Dashboard"
            isActive={activeView === "dashboard"}
            onClick={() => setView("dashboard")}
          />
          <NavButton 
            icon={<Search className="h-4 w-4" />}
            label="Odds"
            isActive={activeView === "odds"}
            onClick={() => setView("odds")}
          />
          <NavButton 
            icon={<Settings className="h-4 w-4" />}
            label="Research"
            isActive={activeView === "research"}
            onClick={() => setView("research")}
          />
          <NavButton 
            icon={<CreditCard className="h-4 w-4" />}
            label="Bankroll"
            isActive={activeView === "bankroll"}
            onClick={() => setView("bankroll")}
          />
        </div>
      </div>
    </header>
  );
}

type NavButtonProps = {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
};

function NavButton({ icon, label, isActive, onClick }: NavButtonProps) {
  return (
    <Button
      variant={isActive ? "default" : "ghost"}
      className={`flex items-center gap-2 px-4 py-2 ${
        isActive ? "bg-green-600 hover:bg-green-700" : ""
      }`}
      onClick={onClick}
    >
      {icon}
      <span>{label}</span>
    </Button>
  );
}
