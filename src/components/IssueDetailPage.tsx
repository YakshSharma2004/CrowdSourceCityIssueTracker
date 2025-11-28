import { useState, useEffect } from "react";
import { Header } from "./Header";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Separator } from "./ui/separator";
import { AssignIssueDialog } from "./AssignIssueDialog";
import {
  ArrowBigUp,
  MapPin,
  User,
  Calendar,
  Tag,
  MessageSquare,
  ArrowLeft,
  Image as ImageIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Issue, Comment } from "../lib/types";
import { api } from "../services/api";



interface IssueDetailPageProps {
  userRole: "citizen" | "staff";
  onLogout: () => void;
  onNavigate: (page: string, issueId?: string) => void;
  issueId: string;
}

// Mock photo URLs
const mockPhotos = [
  "https://images.unsplash.com/photo-1615671524827-c1fe3973b648?w=400",
  "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400",
  "https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?w=400",
];

// Mock comments
// const mockComments: Comment[] = [
//   {
//     id: "1",
//     author: "Sarah Johnson",
//     role: "citizen",
//     date: "2025-10-17T10:30:00",
//     text: "I drove over this pothole yesterday and it damaged my tire. This needs to be fixed urgently!",
//   },
//   {
//     id: "2",
//     author: "Mike Chen",
//     role: "staff",
//     date: "2025-10-17T14:15:00",
//     text: "We have received your report and our team is currently assessing the damage. We will provide an update within 48 hours.",
//   },
//   {
//     id: "3",
//     author: "John Smith",
//     role: "citizen",
//     date: "2025-10-17T16:45:00",
//     text: "Thank you for the quick response! Looking forward to the update.",
//   },
// ];

export function IssueDetailPage({
  userRole,
  onLogout,
  onNavigate,
  issueId,
}: IssueDetailPageProps) {
  const [issue, setIssue] = useState<Issue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [upvotes, setUpvotes] = useState(0);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [newComment, setNewComment] = useState("");
  const [showAssignDialog, setShowAssignDialog] = useState(false);

  useEffect(() => {
    const fetchIssue = async () => {
      try {
        setLoading(true);
        const data = await api.getIssueById(issueId);
        setIssue(data);
        setUpvotes(data.upvotes || 0);
      } catch (err) {
        console.error("Failed to fetch issue:", err);
        setError("Failed to load issue details.");
      } finally {
        setLoading(false);
      }
    };

    const fetchComments = async () => {
      try {
        const data = await api.getCommentsByIssueId(issueId);
        setComments(data);
      } catch (err) {
        console.error("Failed to fetch comments:", err);
        toast.error("Failed to load comments");
      }
    };

    const fetchCurrentUser = async () => {
      try {
        const user = await api.getCurrentUser();
        setCurrentUserId(user.id);
      } catch (err) {
        console.error("Failed to fetch current user:", err);
      }
    };

    if (issueId) {
      fetchComments();
      fetchIssue();
      fetchCurrentUser();
    }
  }, [issueId]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (error || !issue) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-red-500">{error || "Issue not found"}</p>
        <Button onClick={() => onNavigate("issues")}>Back to Issues</Button>
      </div>
    );
  }

  const handleUpvote = () => {
    if (hasUpvoted) {
      setUpvotes(upvotes - 1);
      setHasUpvoted(false);
      toast.success("Upvote removed");
    } else {
      setUpvotes(upvotes + 1);
      setHasUpvoted(true);
      toast.success("Issue upvoted");
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      toast.error("Please enter a comment");
      return;
    }

    try {
      if (!currentUserId) {
        toast.error("User not authenticated");
        return;
      }
      const addedComment = await api.addComment(issueId, newComment, currentUserId);
      setComments([...comments, addedComment]);
      setNewComment("");
      toast.success("Comment added");
    } catch (err) {
      console.error("Failed to add comment:", err);
      toast.error("Failed to add comment");
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
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatRelativeDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));

    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 0) return "today";
    if (diffDays === 1) return "1d ago";
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    return `${Math.floor(diffDays / 30)}mo ago`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        userRole={userRole}
        onLogout={onLogout}
        onNavigate={onNavigate}
        currentPage="issues"
      />

      <main className="container mx-auto px-4 py-6 max-w-5xl">
        {/* Back button */}
        <Button
          variant="ghost"
          onClick={() => onNavigate("issues")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Issues
        </Button>

        <Card>
          <CardContent className="p-6 space-y-6">
            {/* Header */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h1 className="mb-3">{issue.title}</h1>
                  <div className="flex flex-wrap gap-2">
                    <Badge className={getStatusColor(issue.status)}>
                      {issue.status === "IN_PROGRESS"
                        ? "In Progress"
                        : issue.status.toUpperCase()}
                    </Badge>
                    <Badge className={getSeverityColor(issue.severity)}>
                      {issue.severity.toUpperCase()}
                    </Badge>
                  </div>
                </div>

                <button
                  onClick={handleUpvote}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${hasUpvoted
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary hover:bg-secondary/80"
                    }`}
                >
                  <ArrowBigUp
                    className={`h-5 w-5 ${hasUpvoted ? "fill-current" : ""}`}
                  />
                  <span>{upvotes}</span>
                </button>
              </div>

              {/* Metadata */}
              <div className="flex flex-wrap gap-4 text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Tag className="h-4 w-4" />
                  <span>{issue.category}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  <span>{issue.address}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <User className="h-4 w-4" />
                  <span>Reporter: {issue.reporterName}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  <span>Created: {formatDate(issue.createdAt)}</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Description */}
            <div className="space-y-2">
              <h3>Description</h3>
              <p className="text-muted-foreground">{issue.description}</p>
            </div>

            {/* Photos */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                <h3>Photos</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {mockPhotos.map((photo, index) => (
                  <div
                    key={index}
                    className="relative w-32 h-32 rounded-lg overflow-hidden bg-muted cursor-pointer hover:opacity-80 transition-opacity"
                  >
                    <img
                      src={photo}
                      alt={`Issue photo ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              {userRole === "staff" && (
                <Button onClick={() => setShowAssignDialog(true)}>
                  Assign Issue
                </Button>
              )}
              <Button variant="outline" onClick={handleUpvote}>
                <ArrowBigUp className="h-4 w-4 mr-2" />
                {hasUpvoted ? "Remove Upvote" : "Upvote"}
              </Button>
            </div>

            <Separator />

            {/* Comments Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                <h3>Comments ({comments.length})</h3>
              </div>

              {/* Comment List */}
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1.5">
                        <User className="h-4 w-4" />
                        <span>{comment.authorName}</span>
                      </span>
                      {comment.role === "staff" && (
                        <Badge variant="outline" className="text-xs">
                          Staff
                        </Badge>
                      )}
                      <span className="text-muted-foreground">•</span>
                      <span className="text-muted-foreground">
                        {formatRelativeDate(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-muted-foreground pl-5">{comment.content}</p>
                  </div>
                ))}
              </div>

              {/* Add Comment */}
              <div className="space-y-3 pt-2">
                <Textarea
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={3}
                />
                <Button onClick={handleAddComment}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Add Comment
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <footer className="border-t bg-white mt-12">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-muted-foreground">
            © 2025 City Issue Tracker. All rights reserved.
          </p>
        </div>
      </footer>

      <AssignIssueDialog
        open={showAssignDialog}
        onOpenChange={setShowAssignDialog}
        issueId={issue.id.toString()}
        issueTitle={issue.title}
      />
    </div>
  );
}
