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
  const isStaff = userRole === "staff";

  // Mock user data
  const userData = {
    name: isStaff ? "Jane Smith" : "John Doe",
    email: isStaff ? "jane.smith@citytracker.gov" : "john.doe@email.com",
    location: "Downtown District",
    joinDate: "January 2024",
    issuesReported: isStaff ? 0 : 12,
    upvotesGiven: isStaff ? 0 : 47,
    issuesResolved: isStaff ? 156 : 0,
    issuesAssigned: isStaff ? 23 : 0,
  };

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
                {userData.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <h3>{userData.name}</h3>
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
                <span>{userData.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{userData.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Joined {userData.joinDate}</span>
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
                    <p>{userData.issuesReported}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <ArrowBigUp className="h-4 w-4" />
                      <span>Upvotes Given</span>
                    </div>
                    <p>{userData.upvotesGiven}</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <CheckCircle className="h-4 w-4" />
                      <span>Resolved</span>
                    </div>
                    <p>{userData.issuesResolved}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <User className="h-4 w-4" />
                      <span>Assigned to Me</span>
                    </div>
                    <p>{userData.issuesAssigned}</p>
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
