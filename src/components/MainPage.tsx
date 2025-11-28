import { useState, useMemo, useEffect } from "react";
import { Header } from "./Header";
import { FilterBar } from "./FilterBar";
import { IssueCard } from "./IssueCard";
import { Issue } from "../lib/types";
import { api } from "../services/api";
import { motion, AnimatePresence } from "framer-motion";


interface MainPageProps {
  userRole: "citizen" | "staff";
  onLogout: () => void;
  onNavigate: (page: string, issueId?: string) => void;
}

export function MainPage({ userRole, onLogout, onNavigate }: MainPageProps) {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [severity, setSeverity] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        console.log("[MainPage] Starting fetchIssues...");
        setLoading(true);
        const data = await api.getIssues(0, 100); // Fetching 100 for now to have some data to filter
        console.log("[MainPage] Data received:", data);
        setIssues(data.content);
        setError(null);
      } catch (err: any) {
        console.error("[MainPage] Failed to fetch issues:", err);
        if (err.message === "Unauthorized") {
          console.log("[MainPage] 401 detected, forcing logout");
          // Token is invalid (e.g. server restarted), force logout
          // onLogout();
          return;
        }
        setError("Failed to load issues. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, []);

  const handleViewDetails = (issueId: string) => {
    onNavigate("issue-detail", issueId);
  };

  const handleAssign = (issueId: string) => {
    onNavigate("issue-detail", issueId);
  };

  const filteredIssues = useMemo(() => {
    let filtered = [...issues];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (issue) =>
          issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (issue.description && issue.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
          issue.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (category !== "all") {
      filtered = filtered.filter((issue) => issue.category === category);
    }

    // Filter by status
    if (status !== "all") {
      filtered = filtered.filter((issue) => issue.status === status); // Note: status case sensitivity might need check
    }

    // Filter by severity
    if (severity !== "all") {
      filtered = filtered.filter((issue) => issue.severity === severity);
    }

    // Sort
    if (sortBy === "recent") {
      filtered.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else if (sortBy === "upvotes") {
      filtered.sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0));
    } else if (sortBy === "severity") {
      const severityOrder = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
      // @ts-ignore - handling potential case mismatch or missing keys safely
      filtered.sort((a, b) => (severityOrder[b.severity] || 0) - (severityOrder[a.severity] || 0));
    }

    return filtered;
  }, [issues, searchQuery, category, status, severity, sortBy]);

  return (
    <div className="min-h-screen bg-muted/40 transition-colors duration-300">
      <Header userRole={userRole} onLogout={onLogout} onNavigate={onNavigate} currentPage="issues" />

      <main className="container mx-auto px-4 py-6 space-y-8">
        <div className="space-y-6">
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

          <motion.div
            layout
            className="space-y-4"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
            initial="hidden"
            animate="show"
          >
            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading issues...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-500">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 text-sm text-blue-500 hover:underline"
                >
                  Retry
                </button>
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {filteredIssues.length > 0 ? (
                  filteredIssues.map((issue) => (
                    <motion.div
                      key={issue.id}
                      layout
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        show: { opacity: 1, y: 0 }
                      }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                    >
                      <IssueCard
                        issue={issue}
                        isStaff={userRole === "staff"}
                        onViewDetails={handleViewDetails}
                        onAssign={handleAssign}
                      />
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                  >
                    <p className="text-muted-foreground">
                      No issues found matching your filters.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </motion.div>
        </div >
      </main >

      <footer className="border-t bg-background mt-12">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-muted-foreground">
            © 2025 City Issue Tracker. All rights reserved.
          </p>
        </div>
      </footer>
    </div >
  );
}
