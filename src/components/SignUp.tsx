import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { AuthLayout } from "./AuthLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { AlertCircle, ArrowLeft } from "lucide-react";

interface SignUpProps {
    onNavigateToLogin: () => void;
}

export function SignUp({ onNavigateToLogin }: SignUpProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [role, setRole] = useState<"citizen" | "staff">("citizen");

    const handleSignup = () => {
        // Mock signup - in real app, this would create an account
        // For now, just redirect to login as requested
        onNavigateToLogin();
    };

    return (
        <AuthLayout>
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
                    <Tabs defaultValue="citizen" className="w-full" onValueChange={(v) => setRole(v as "citizen" | "staff")}>
                        <TabsList className="grid w-full grid-cols-2 mb-4">
                            <TabsTrigger value="citizen">Citizen Signup</TabsTrigger>
                            <TabsTrigger value="staff">Staff Signup</TabsTrigger>
                        </TabsList>

                        <TabsContent value="citizen" className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="citizen-name">Full Name</Label>
                                <Input
                                    id="citizen-name"
                                    placeholder="John Doe"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="citizen-email">Email</Label>
                                <Input
                                    id="citizen-email"
                                    type="email"
                                    placeholder="citizen@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="citizen-password">Password</Label>
                                <Input
                                    id="citizen-password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <Button className="w-full" onClick={handleSignup}>
                                Sign Up as Citizen
                            </Button>
                        </TabsContent>

                        <TabsContent value="staff" className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="staff-name">Full Name</Label>
                                <Input
                                    id="staff-name"
                                    placeholder="Jane Smith"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="staff-email">Email</Label>
                                <Input
                                    id="staff-email"
                                    type="email"
                                    placeholder="staff@city.gov"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="staff-password">Password</Label>
                                <Input
                                    id="staff-password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <Button className="w-full" onClick={handleSignup}>
                                Sign Up as Staff
                            </Button>
                        </TabsContent>
                    </Tabs>
                    <div className="mt-4 text-center text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <button className="text-primary hover:underline font-medium" onClick={onNavigateToLogin}>
                            Login
                        </button>
                    </div>
                </CardContent>
            </Card>
        </AuthLayout>
    );
}