import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuthLayout } from "./AuthLayout";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, ArrowLeft } from "lucide-react";

interface SignUpProps {
    onSignup: (role: "citizen" | "staff") => void;
    onNavigateToLogin: () => void;
}

export function SignUp({ onSignup, onNavigateToLogin }: SignUpProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleSignup = async (role: "citizen" | "staff") => {
        setIsLoading(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setIsLoading(false);
        onSignup(role);
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
                                            <Input id="first-name" placeholder="John" required className="h-10" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="last-name">Last name</Label>
                                            <Input id="last-name" placeholder="Doe" required className="h-10" />
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
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="password">Password</Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            required
                                            className="h-10"
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
                                            <Input id="staff-first-name" placeholder="Jane" required className="h-10" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="staff-last-name">Last name</Label>
                                            <Input id="staff-last-name" placeholder="Smith" required className="h-10" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="staff-id">Staff ID</Label>
                                        <Input
                                            id="staff-id"
                                            placeholder="STF-2025-001"
                                            required
                                            className="h-10"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="department">Department</Label>
                                        <Input
                                            id="department"
                                            placeholder="Public Works"
                                            required
                                            className="h-10"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="staff-password">Password</Label>
                                        <Input
                                            id="staff-password"
                                            type="password"
                                            required
                                            className="h-10"
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