import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import {
  User,
  Mail,
  MapPin,
  Calendar,
  FileText,
  ArrowBigUp,
  CheckCircle,
  Bell,
  Shield,
  LogOut,
} from "lucide-react";
import { api } from "../services/api";
import { User as UserType } from "../lib/types";
import { useState, useEffect } from "react";

interface ProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userRole: "citizen" | "staff";
  onLogout: () => void;
}

export function ProfileDialog({
  open,
  onOpenChange,
  userRole,
  onLogout,
}: ProfileDialogProps) {
  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    if (open) {
      const fetchUser = async () => {
        try {
          const userData = await api.getCurrentUser();
          setUser(userData);
        } catch (err) {
          console.error("Failed to fetch user profile:", err);
        }
      };
      fetchUser();
    }
  }, [open]);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "Unknown";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  const isStaff = user?.role === "STAFF" || userRole === "staff";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Profile</DialogTitle>
          <DialogDescription>
            Manage your account and preferences
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* User Info */}
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-lg">
                {user?.fullName
                  ? user.fullName
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")
                  : "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <h3>{user?.fullName || "Loading..."}</h3>
              <Badge variant={isStaff ? "default" : "secondary"}>
                {isStaff ? "Staff Member" : "Citizen"}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Account Details */}
          <div className="space-y-3">
            <h4>Account Details</h4>
            <div className="space-y-2 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>{user?.email || "Loading..."}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Downtown District</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Joined {formatDate(user?.createdAt)}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Activity Stats */}
          <div className="space-y-3">
            <h4>Activity</h4>
            <div className="grid grid-cols-2 gap-3">
              {!isStaff ? (
                <>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <FileText className="h-4 w-4" />
                      <span>Issues Reported</span>
                    </div>
                    <p>12</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <ArrowBigUp className="h-4 w-4" />
                      <span>Upvotes Given</span>
                    </div>
                    <p>47</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <CheckCircle className="h-4 w-4" />
                      <span>Resolved</span>
                    </div>
                    <p>156</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <User className="h-4 w-4" />
                      <span>Assigned to Me</span>
                    </div>
                    <p>23</p>
                  </div>
                </>
              )}
            </div>
          </div>

          <Separator />

          {/* Settings */}
          <div className="space-y-4">
            <h4>Preferences</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="notifications" className="cursor-pointer">
                    Email Notifications
                  </Label>
                </div>
                <Switch id="notifications" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="privacy" className="cursor-pointer">
                    Public Profile
                  </Label>
                </div>
                <Switch id="privacy" defaultChecked />
              </div>
            </div>
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={() => {
                onOpenChange(false);
                onLogout();
              }}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
