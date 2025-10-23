import { useState } from "react";
import { LoginPage } from "./components/LoginPage";
import { MainPage } from "./components/MainPage";
import { ReportIssuePage } from "./components/ReportIssuePage";
import { IssueDetailPage } from "./components/IssueDetailPage";
import { AnalyticsPage } from "./components/AnalyticsPage";
import { Toaster } from "./components/ui/sonner";

// Mock data
const mockIssues = [
  {
    id: "1",
    title: "Pothole on Main Street causing traffic delays",
    description: "Large pothole near the intersection of Main St and 5th Ave. Several vehicles have been damaged.",
    status: "open" as const,
    severity: "high" as const,
    category: "roads",
    address: "Main Street & 5th Avenue",
    reportedBy: "John Smith",
    reportedDate: "2025-10-16",
    upvotes: 23,
  },
  {
    id: "2",
    title: "Broken street light on Park Avenue",
    description: "Street light has been out for over a week, making the area unsafe at night.",
    status: "in-progress" as const,
    severity: "medium" as const,
    category: "lighting",
    address: "Park Avenue, near Oak Street",
    reportedBy: "Sarah Johnson",
    reportedDate: "2025-10-14",
    upvotes: 15,
  },
  {
    id: "3",
    title: "Overflowing garbage bins in Central Park",
    description: "Multiple garbage bins are overflowing, attracting pests and creating unsanitary conditions.",
    status: "open" as const,
    severity: "high" as const,
    category: "sanitation",
    address: "Central Park, North Entrance",
    reportedBy: "Mike Chen",
    reportedDate: "2025-10-17",
    upvotes: 31,
  },
  {
    id: "4",
    title: "Water main leak on Elm Street",
    description: "Water is leaking from underground pipe, creating a large puddle and potentially wasting water.",
    status: "in-progress" as const,
    severity: "critical" as const,
    category: "water",
    address: "Elm Street, between 2nd and 3rd",
    reportedBy: "Lisa Anderson",
    reportedDate: "2025-10-18",
    upvotes: 45,
  },
  {
    id: "5",
    title: "Damaged playground equipment",
    description: "Swing set chain is broken and poses a safety hazard to children.",
    status: "resolved" as const,
    severity: "medium" as const,
    category: "parks",
    address: "Riverside Park Playground",
    reportedBy: "David Brown",
    reportedDate: "2025-10-10",
    upvotes: 12,
  },
  {
    id: "6",
    title: "Graffiti on community center wall",
    description: "Vandalism on the east wall of the community center building.",
    status: "open" as const,
    severity: "low" as const,
    category: "sanitation",
    address: "Community Center, 123 Center St",
    reportedBy: "Emma Wilson",
    reportedDate: "2025-10-15",
    upvotes: 8,
  },
];

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<"citizen" | "staff">("citizen");
  const [currentPage, setCurrentPage] = useState<string>("issues");
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);

  const handleLogin = (role: "citizen" | "staff") => {
    setUserRole(role);
    setIsLoggedIn(true);
    setCurrentPage("issues");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage("issues");
    setSelectedIssueId(null);
  };

  const handleNavigate = (page: string, issueId?: string) => {
    setCurrentPage(page);
    if (issueId) {
      setSelectedIssueId(issueId);
    }
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const selectedIssue = selectedIssueId
    ? mockIssues.find((issue) => issue.id === selectedIssueId)
    : null;

  return (
    <>
      {currentPage === "issues" && (
        <MainPage userRole={userRole} onLogout={handleLogout} onNavigate={handleNavigate} />
      )}
      {currentPage === "report" && (
        <ReportIssuePage userRole={userRole} onLogout={handleLogout} onNavigate={handleNavigate} />
      )}
      {currentPage === "issue-detail" && selectedIssue && (
        <IssueDetailPage
          userRole={userRole}
          onLogout={handleLogout}
          onNavigate={handleNavigate}
          issue={selectedIssue}
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
          issues={mockIssues}
        />
      )}
      <Toaster />
    </>
  );
}
