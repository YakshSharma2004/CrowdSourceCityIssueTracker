import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import { toast } from "sonner";

interface AssignIssueDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  issueId: string;
  issueTitle: string;
}

export function AssignIssueDialog({
  open,
  onOpenChange,
  issueId,
  issueTitle,
}: AssignIssueDialogProps) {
  const [department, setDepartment] = useState("");
  const [assignedStaff, setAssignedStaff] = useState("");
  const [notes, setNotes] = useState("");

  const handleAssign = () => {
    if (!department) {
      toast.error("Please select a department");
      return;
    }

    // Mock assignment
    toast.success(
      `Issue assigned to ${department}${assignedStaff ? ` - ${assignedStaff}` : ""}`
    );

    // Reset and close
    setDepartment("");
    setAssignedStaff("");
    setNotes("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Assign Issue</DialogTitle>
          <DialogDescription>
            Issue: {issueTitle} (#{issueId})
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="department">
              Department <span className="text-destructive">*</span>
            </Label>
            <Select value={department} onValueChange={setDepartment}>
              <SelectTrigger id="department">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public-works">Public Works</SelectItem>
                <SelectItem value="transportation">Transportation</SelectItem>
                <SelectItem value="sanitation">Sanitation</SelectItem>
                <SelectItem value="parks-recreation">Parks & Recreation</SelectItem>
                <SelectItem value="water-utilities">Water Utilities</SelectItem>
                <SelectItem value="electrical">Electrical Department</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="staff">Assign to Staff (Optional)</Label>
            <Select value={assignedStaff} onValueChange={setAssignedStaff}>
              <SelectTrigger id="staff">
                <SelectValue placeholder="Select staff member" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="john-doe">John Doe</SelectItem>
                <SelectItem value="jane-smith">Jane Smith</SelectItem>
                <SelectItem value="mike-johnson">Mike Johnson</SelectItem>
                <SelectItem value="sarah-williams">Sarah Williams</SelectItem>
                <SelectItem value="david-brown">David Brown</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Add any additional notes or instructions..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleAssign}>Assign Issue</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
