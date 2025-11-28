import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuthLayout } from "./AuthLayout";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { api } from "../services/api";
import { toast } from "sonner";

interface SignUpProps {
    onSignup: (role: "citizen" | "staff") => void;
    onNavigateToLogin: () => void;
}

export function SignUp({ onSignup, onNavigateToLogin }: SignUpProps) {
    const [isLoading, setIsLoading] = useState(false);

    // Citizen Form State
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Staff Form State (Mock for now as backend only supports citizen signup via script logic)
    const [staffFirstName, setStaffFirstName] = useState("");
    const [staffLastName, setStaffLastName] = useState("");
    const [staffId, setStaffId] = useState("");
    const [department, setDepartment] = useState("");
    const [staffPassword, setStaffPassword] = useState("");

    const handleSignup = async (role: "citizen" | "staff") => {
        setIsLoading(true);
        try {
            if (role === "citizen") {
                const fullName = `${firstName} ${lastName}`.trim();
                // Add artificial delay as requested
                await new Promise((resolve) => setTimeout(resolve, 3000));
                await api.signup(email, password, fullName);
                toast.success("Account created successfully! Logging you in...");
                onSignup("citizen");
            } else {
                // Staff signup logic (if different)
                // For now, we'll assume same endpoint or show not implemented
                toast.error("Staff signup is not yet supported via the public interface.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Signup failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Card className="w-full shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                    <CardHeader className="space-y-1">
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2 text-2xl font-bold text-primary">
                                <AlertCircle className="h-6 w-6" />
                                City Issue Tracker
                            </CardTitle>
                            <Button variant="ghost" size="sm" onClick={onNavigateToLogin} className="text-muted-foreground hover:text-primary">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Login
                            </Button>
                        </div>
                        <CardDescription>
                            Create an account to report and track issues
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="citizen" className="w-full">
                            <TabsList className="grid w-full grid-cols-2 mb-4">
                                <TabsTrigger value="citizen">Citizen</TabsTrigger>
                                <TabsTrigger value="staff">Staff</TabsTrigger>
                            </TabsList>

                            <TabsContent value="citizen">
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        handleSignup("citizen");
                                    }}
                                    className="space-y-4"
                                >
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="first-name">First name</Label>
                                            <Input
                                                id="first-name"
                                                placeholder="John"
                                                required
                                                className="h-10"
                                                value={firstName}
                                                onChange={(e) => setFirstName(e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="last-name">Last name</Label>
                                            <Input
                                                id="last-name"
                                                placeholder="Doe"
                                                required
                                                className="h-10"
                                                value={lastName}
                                                onChange={(e) => setLastName(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="name@example.com"
                                            required
                                            className="h-10"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="password">Password</Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            required
                                            className="h-10"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>
                                    <Button type="submit" className="w-full h-10" disabled={isLoading}>
                                        {isLoading ? "Creating account..." : "Create Account"}
                                    </Button>
                                </form>
                            </TabsContent>

                            <TabsContent value="staff">
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        handleSignup("staff");
                                    }}
                                    className="space-y-4"
                                >
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="staff-first-name">First name</Label>
                                            <Input
                                                id="staff-first-name"
                                                placeholder="Jane"
                                                required
                                                className="h-10"
                                                value={staffFirstName}
                                                onChange={(e) => setStaffFirstName(e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="staff-last-name">Last name</Label>
                                            <Input
                                                id="staff-last-name"
                                                placeholder="Smith"
                                                required
                                                className="h-10"
                                                value={staffLastName}
                                                onChange={(e) => setStaffLastName(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="staff-id">Staff ID</Label>
                                        <Input
                                            id="staff-id"
                                            placeholder="STF-2025-001"
                                            required
                                            className="h-10"
                                            value={staffId}
                                            onChange={(e) => setStaffId(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="department">Department</Label>
                                        <Input
                                            id="department"
                                            placeholder="Public Works"
                                            required

                                            className="h-10"
                                            value={department}
                                            onChange={(e) => setDepartment(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="staff-password">Password</Label>
                                        <Input
                                            id="staff-password"
                                            type="password"
                                            required
                                            className="h-10"
                                            value={staffPassword}
                                            onChange={(e) => setStaffPassword(e.target.value)}
                                        />
                                    </div>
                                    <Button type="submit" className="w-full h-10" disabled={isLoading}>
                                        {isLoading ? "Creating account..." : "Create Account"}
                                    </Button>
                                </form>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </motion.div>
        </AuthLayout>
    );
}