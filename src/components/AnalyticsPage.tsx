import { useState, useEffect, useMemo } from "react";
import { Header } from "./Header";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { CheckCircle, AlertCircle, Clock } from "lucide-react";
import { Issue } from "../lib/types";
import { api } from "../services/api";

interface AnalyticsPageProps {
  userRole: "citizen" | "staff";
  onLogout: () => void;
  onNavigate: (page: string) => void;
}

export function AnalyticsPage({
  userRole,
  onLogout,
  onNavigate,
}: AnalyticsPageProps) {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const data = await api.getIssues(0, 100);
        setIssues(data.content);
      } catch (err) {
        console.error("Failed to fetch issues for analytics:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchIssues();
  }, []);
  // Calculate statistics
  const stats = useMemo(() => {
    const openIssues = issues.filter((i) => i.status === "OPEN").length;
    const resolvedIssues = issues.filter((i) => i.status === "RESOLVED").length;
    const inProgressIssues = issues.filter((i) => i.status === "IN_PROGRESS").length;

    // Calculate average resolution time (mock data - assume resolved issues took 3-7 days)
    const avgResolutionTime = resolvedIssues > 0 ? 4.5 : 0;

    return {
      openIssues,
      resolvedIssues,
      inProgressIssues,
      avgResolutionTime,
      totalIssues: issues.length,
    };
  }, [issues]);

  // Issues by Category
  const categoryData = useMemo(() => {
    const categories: { [key: string]: number } = {};
    issues.forEach((issue) => {
      categories[issue.category] = (categories[issue.category] || 0) + 1;
    });

    return Object.entries(categories).map(([name, count]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      count,
    }));
  }, [issues]);

  // Issues by Status
  const statusData = useMemo(() => {
    return [
      { name: "Open", value: stats.openIssues },
      { name: "In Progress", value: stats.inProgressIssues },
      { name: "Resolved", value: stats.resolvedIssues },
    ].filter((item) => item.value > 0);
  }, [stats]);

  // Issues over Time (last 30 days)
  const timelineData = useMemo(() => {
    const days = 30;
    const today = new Date("2025-10-18");
    const timeline: { date: string; issues: number }[] = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);


      const issuesOnDate = issues.filter((issue) => {
        const reportedDate = new Date(issue.createdAt);
        return reportedDate <= date;
      }).length;

      timeline.push({
        date: `${date.getMonth() + 1}/${date.getDate()}`,
        issues: issuesOnDate,
      });
    }

    return timeline;
  }, [issues]);

  return (
    <div className="min-h-screen bg-muted/40 transition-colors duration-300">
      <Header
        userRole={userRole}
        onLogout={onLogout}
        onNavigate={onNavigate}
        currentPage="analytics"
      />

      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1>Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Overview of city issues and their status
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-muted-foreground">
                Open Issues
              </CardTitle>
              <AlertCircle className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-blue-600">{stats.openIssues}</span>
                <span className="text-muted-foreground">
                  of {stats.totalIssues} total
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-muted-foreground">
                Resolved
              </CardTitle>
              <CheckCircle className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-green-600">{stats.resolvedIssues}</span>
                <span className="text-muted-foreground">
                  {stats.totalIssues > 0
                    ? `${Math.round((stats.resolvedIssues / stats.totalIssues) * 100)}%`
                    : "0%"}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-muted-foreground">
                Avg Resolution Time
              </CardTitle>
              <Clock className="h-5 w-5 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-amber-600">
                  {stats.avgResolutionTime.toFixed(1)}
                </span>
                <span className="text-muted-foreground">days</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Issues by Category */}
          <Card>
            <CardHeader>
              <CardTitle>Issues by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12 }}
                    stroke="#6b7280"
                  />
                  <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--background)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      color: "var(--foreground)",
                    }}
                  />
                  <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Issues by Status */}
          <Card>
            <CardHeader>
              <CardTitle>Issues by Status</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={(entry) => `${entry.name}: ${entry.value}`}
                  >
                    {statusData.map((_, index) => {
                      const colors = ["#3b82f6", "#f59e0b", "#10b981"];
                      return <Cell key={`cell-${index}`} fill={colors[index]} />;
                    })}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--background)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      color: "var(--foreground)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Issues over Time */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Issues Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={timelineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    stroke="#6b7280"
                    interval="preserveStartEnd"
                  />
                  <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--background)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      color: "var(--foreground)",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="issues"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ fill: "#3b82f6", r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Total Issues"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="border-t bg-background mt-12">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-muted-foreground">
            © 2025 City Issue Tracker. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
