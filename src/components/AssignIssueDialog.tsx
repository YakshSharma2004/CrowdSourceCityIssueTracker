import { useState, useEffect } from "react";
import { api } from "../services/api";
import { Department, User } from "../lib/types";
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
  const [departments, setDepartments] = useState<Department[]>([]);
  const [staffUsers, setStaffUsers] = useState<User[]>([]);

  useEffect(() => {
    if (open) {
      const fetchData = async () => {
        try {
          const [deptData, staffData] = await Promise.all([
            api.getDepartments(),
            api.getStaffUsers(),
          ]);
          setDepartments(deptData);
          setStaffUsers(staffData);
        } catch (err) {
          console.error("Failed to fetch data:", err);
          toast.error("Failed to load assignment data");
        }
      };
      fetchData();
    }
  }, [open]);

  const handleAssign = async () => {
    if (!department) {
      toast.error("Please select a department");
      return;
    }

    try {
      const departmentId = parseInt(department);
      const staffId = assignedStaff ? parseInt(assignedStaff) : null;

      await api.assignIssue(issueId, departmentId, staffId, notes);

      const deptName = departments.find(d => d.id === departmentId)?.name;
      const staffName = staffUsers.find(u => u.id === staffId)?.fullName;

      if (staffName) {
        toast.success(`Issue assigned to ${staffName} (${deptName})`);
      } else {
        toast.success(`Issue assigned to ${deptName}`);
      }

      // Reset and close
      setDepartment("");
      setAssignedStaff("");
      setNotes("");
      onOpenChange(false);
    } catch (err) {
      console.error("Failed to assign issue:", err);
      toast.error("Failed to assign issue");
    }
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
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id.toString()}>
                    {dept.name}
                  </SelectItem>
                ))}
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
                {staffUsers.map((user) => (
                  <SelectItem key={user.id} value={user.id.toString()}>
                    {user.fullName}
                  </SelectItem>
                ))}
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
