import { useState, useEffect } from "react";
import { LoginPage } from "./components/LoginPage";
import { SignUp } from "./components/SignUp";
import { MainPage } from "./components/MainPage";
import { ReportIssuePage } from "./components/ReportIssuePage";
import { IssueDetailPage } from "./components/IssueDetailPage";
import { AnalyticsPage } from "./components/AnalyticsPage";
import { Toaster } from "./components/ui/sonner";
import { SmoothCursor } from "@/components/ui/smooth-cursor";
import { ThemeProvider } from "./components/ThemeContext";
import { api } from "./services/api";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<"citizen" | "staff">("citizen");
  const [currentPage, setCurrentPage] = useState<string>("issues");
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);

  const [authMode, setAuthMode] = useState<"login" | "signup">("login");

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const role = localStorage.getItem("userRole") as "citizen" | "staff" | null;
    if (token) {
      setIsLoggedIn(true);
      if (role) setUserRole(role);
    }
  }, []);

  const handleLogin = (role: "citizen" | "staff") => {
    setUserRole(role);
    setIsLoggedIn(true);
    setCurrentPage("issues");
  };

  const handleLogout = () => {
    console.log("[App] handleLogout called");
    api.logout();
    setIsLoggedIn(false);
    setCurrentPage("issues");
    setSelectedIssueId(null);
    setAuthMode("login");
  };

  const handleNavigate = (page: string, issueId?: string) => {
    setCurrentPage(page);
    if (issueId) {
      setSelectedIssueId(issueId);
    }
  };

  const renderContent = () => {
    if (!isLoggedIn) {
      if (authMode === "signup") {
        return <SignUp onNavigateToLogin={() => setAuthMode("login")} onSignup={function (role: "citizen" | "staff"): void {
          // In a real app, this would handle signup logic
          handleLogin(role);
        }} />;
      }
      return <LoginPage onLogin={handleLogin} onSignupClick={() => setAuthMode("signup")} />;
    }

    return (
      <>
        <SmoothCursor />
        {currentPage === "issues" && (
          <MainPage userRole={userRole} onLogout={handleLogout} onNavigate={handleNavigate} />
        )}
        {currentPage === "report" && (
          <ReportIssuePage userRole={userRole} onLogout={handleLogout} onNavigate={handleNavigate} />
        )}
        {currentPage === "issue-detail" && selectedIssueId && (
          <IssueDetailPage
            userRole={userRole}
            onLogout={handleLogout}
            onNavigate={handleNavigate}
            issueId={selectedIssueId}
          />
        )}
        {currentPage === "map" && (
          <MainPage userRole={userRole} onLogout={handleLogout} onNavigate={handleNavigate} />
        )}
        {currentPage === "analytics" && (
          <AnalyticsPage
            userRole={userRole}
            onLogout={handleLogout}
            onNavigate={handleNavigate}
          />
        )}
      </>
    );
  };

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      {renderContent()}
      <Toaster />
    </ThemeProvider>
  );
}
