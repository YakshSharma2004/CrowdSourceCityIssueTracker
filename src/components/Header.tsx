import { useState } from "react";
import { AlertCircle, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { ThemeToggle } from "./ThemeToggle";

import { Avatar, AvatarFallback } from "./ui/avatar";
import { ProfileDialog } from "./ProfileDialog";


interface HeaderProps {
  userRole: "citizen" | "staff";
  onLogout: () => void;
  onNavigate?: (page: string) => void;
  currentPage?: string;
}

export function Header({ userRole, onLogout, onNavigate, currentPage = "issues" }: HeaderProps) {
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const handleNavClick = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
    }
  };

  return (
    <header className="border-b bg-background sticky top-0 z-10 transition-colors duration-300">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-6 w-6 text-primary" />
              <span>City Tracker</span>
            </div>

            <nav className="hidden md:flex items-center gap-6">
              <button
                onClick={() => handleNavClick("issues")}
                className={`transition-colors ${currentPage === "issues"
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-primary"
                  }`}
              >
                Issues
              </button>
              <button
                onClick={() => handleNavClick("map")}
                className={`transition-colors ${currentPage === "map"
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-primary"
                  }`}
              >
                Map
              </button>
              <button
                onClick={() => handleNavClick("report")}
                className={`transition-colors ${currentPage === "report"
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-primary"
                  }`}
              >
                Report Issue
              </button>
              <button
                onClick={() => handleNavClick("analytics")}
                className={`transition-colors ${currentPage === "analytics"
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-primary"
                  }`}
              >
                Analytics
              </button>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              className="flex items-center gap-2"
              onClick={() => setShowProfileDialog(true)}
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  {userRole === "staff" ? "ST" : "CT"}
                </AvatarFallback>
              </Avatar>
              <span className="hidden sm:inline">
                {userRole === "staff" ? "Staff" : "Citizen"}
              </span>
            </Button>

            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onLogout}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <ProfileDialog
        open={showProfileDialog}
        onOpenChange={setShowProfileDialog}
        userRole={userRole}
        onLogout={onLogout}
      />
    </header>
  );
}
