import { useState, useMemo } from "react";
import { Header } from "./Header";
import { FilterBar } from "./FilterBar";
import { IssueCard, Issue } from "./IssueCard";

interface MainPageProps {
  userRole: "citizen" | "staff";
  onLogout: () => void;
  onNavigate: (page: string) => void;
}

// Mock data
const mockIssues: Issue[] = [
  {
    id: "1",
    title: "Pothole on Main Street causing traffic delays",
    description: "Large pothole near the intersection of Main St and 5th Ave. Several vehicles have been damaged.",
    status: "open",
    severity: "high",
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
    status: "in-progress",
    severity: "medium",
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
    status: "open",
    severity: "high",
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
    status: "in-progress",
    severity: "critical",
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
    status: "resolved",
    severity: "medium",
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
    status: "open",
    severity: "low",
    category: "sanitation",
    address: "Community Center, 123 Center St",
    reportedBy: "Emma Wilson",
    reportedDate: "2025-10-15",
    upvotes: 8,
  },
];

export function MainPage({ userRole, onLogout, onNavigate }: MainPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [severity, setSeverity] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  const handleViewDetails = (issueId: string) => {
    onNavigate("issue-detail", issueId);
  };

  const handleAssign = (issueId: string) => {
    onNavigate("issue-detail", issueId);
  };

  const filteredIssues = useMemo(() => {
    let filtered = [...mockIssues];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (issue) =>
          issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          issue.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          issue.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (category !== "all") {
      filtered = filtered.filter((issue) => issue.category === category);
    }

    // Filter by status
    if (status !== "all") {
      filtered = filtered.filter((issue) => issue.status === status);
    }

    // Filter by severity
    if (severity !== "all") {
      filtered = filtered.filter((issue) => issue.severity === severity);
    }

    // Sort
    if (sortBy === "recent") {
      filtered.sort(
        (a, b) =>
          new Date(b.reportedDate).getTime() - new Date(a.reportedDate).getTime()
      );
    } else if (sortBy === "upvotes") {
      filtered.sort((a, b) => b.upvotes - a.upvotes);
    } else if (sortBy === "severity") {
      const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      filtered.sort(
        (a, b) => severityOrder[b.severity] - severityOrder[a.severity]
      );
    }

    return filtered;
  }, [searchQuery, category, status, severity, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userRole={userRole} onLogout={onLogout} onNavigate={onNavigate} currentPage="issues" />
      
      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        category={category}
        onCategoryChange={setCategory}
        status={status}
        onStatusChange={setStatus}
        severity={severity}
        onSeverityChange={setSeverity}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      <main className="container mx-auto px-4 py-6">
        <div className="space-y-4">
          {filteredIssues.length > 0 ? (
            filteredIssues.map((issue) => (
              <IssueCard
                key={issue.id}
                issue={issue}
                isStaff={userRole === "staff"}
                onViewDetails={handleViewDetails}
                onAssign={handleAssign}
              />
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No issues found matching your filters.
              </p>
            </div>
          )}
        </div>
      </main>

      <footer className="border-t bg-white mt-12">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-muted-foreground">
            © 2025 City Issue Tracker. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
