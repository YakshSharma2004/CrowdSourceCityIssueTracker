import { MapPin, User } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Issue } from "../lib/types";

interface IssueCardProps {
  issue: Issue;
  isStaff: boolean;
  onViewDetails: (issueId: string) => void;
  onAssign?: (issueId: string) => void;
}

export function IssueCard({ issue, isStaff, onViewDetails, onAssign }: IssueCardProps) {

  const getStatusColor = (status: string) => {
    switch (status) {
      case "OPEN":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "IN_PROGRESS":
        return "bg-amber-100 text-amber-800 hover:bg-amber-100";
      case "RESOLVED":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      default:
        return "";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "LOW":
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "HIGH":
        return "bg-orange-100 text-orange-800 hover:bg-orange-100";
      case "CRITICAL": // Note: CRITICAL might not be in the inferred type but good to keep if backend adds it
        return "bg-red-100 text-red-800 hover:bg-red-100";
      default:
        return "";
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "today";
    if (diffDays === 1) return "1d ago";
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    return `${Math.floor(diffDays / 30)}mo ago`;
  };

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onViewDetails(issue.id.toString())}>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header row */}
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="mb-2 font-semibold text-lg">{issue.title}</h3>
              <div className="flex flex-wrap gap-2">
                <Badge className={getStatusColor(issue.status)}>
                  {issue.status === "IN_PROGRESS" ? "In Progress" : issue.status}
                </Badge>
                <Badge className={getSeverityColor(issue.severity)}>
                  {issue.severity}
                </Badge>
                <Badge variant="outline">{issue.category}</Badge>
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-muted-foreground line-clamp-2">{issue.description}</p>

          {/* Footer */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex flex-col gap-2 text-muted-foreground text-sm">
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                <span className="truncate max-w-[200px]">{issue.address}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <User className="h-4 w-4" />
                <span>
                  {issue.reporterName} • {formatDate(issue.createdAt)}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              {isStaff && onAssign && (
                <Button size="sm" onClick={(e) => { e.stopPropagation(); onAssign(issue.id.toString()); }}>
                  Assign
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
