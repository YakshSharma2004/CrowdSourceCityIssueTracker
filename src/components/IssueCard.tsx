import { MapPin, ArrowBigUp, User } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useState } from "react";

export interface Issue {
  id: string;
  title: string;
  description: string;
  status: "open" | "in-progress" | "resolved";
  severity: "low" | "medium" | "high" | "critical";
  category: string;
  address: string;
  reportedBy: string;
  reportedDate: string;
  upvotes: number;
}

interface IssueCardProps {
  issue: Issue;
  isStaff: boolean;
  onViewDetails: (issueId: string) => void;
  onAssign?: (issueId: string) => void;
}

export function IssueCard({ issue, isStaff, onViewDetails, onAssign }: IssueCardProps) {
  const [upvotes, setUpvotes] = useState(issue.upvotes);
  const [hasUpvoted, setHasUpvoted] = useState(false);

  const handleUpvote = () => {
    if (hasUpvoted) {
      setUpvotes(upvotes - 1);
      setHasUpvoted(false);
    } else {
      setUpvotes(upvotes + 1);
      setHasUpvoted(true);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "in-progress":
        return "bg-amber-100 text-amber-800 hover:bg-amber-100";
      case "resolved":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      default:
        return "";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low":
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
      case "medium":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "high":
        return "bg-orange-100 text-orange-800 hover:bg-orange-100";
      case "critical":
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
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header row */}
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="mb-2">{issue.title}</h3>
              <div className="flex flex-wrap gap-2">
                <Badge className={getStatusColor(issue.status)}>
                  {issue.status === "in-progress" ? "In Progress" : issue.status}
                </Badge>
                <Badge className={getSeverityColor(issue.severity)}>
                  {issue.severity}
                </Badge>
                <Badge variant="outline">{issue.category}</Badge>
              </div>
            </div>
            
            <button
              onClick={handleUpvote}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-md transition-colors ${
                hasUpvoted
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary hover:bg-secondary/80"
              }`}
            >
              <ArrowBigUp className={`h-4 w-4 ${hasUpvoted ? "fill-current" : ""}`} />
              <span>{upvotes}</span>
            </button>
          </div>

          {/* Description */}
          <p className="text-muted-foreground">{issue.description}</p>

          {/* Footer */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex flex-col gap-2 text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                <span>{issue.address}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <User className="h-4 w-4" />
                <span>
                  {issue.reportedBy} • {formatDate(issue.reportedDate)}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => onViewDetails(issue.id)}>
                View Details
              </Button>
              {isStaff && onAssign && (
                <Button size="sm" onClick={() => onAssign(issue.id)}>
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
