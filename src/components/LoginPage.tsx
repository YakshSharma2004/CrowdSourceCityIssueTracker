import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { AlertCircle } from "lucide-react";

interface LoginPageProps {
  onLogin: (role: "citizen" | "staff") => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (role: "citizen" | "staff") => {
    // Mock login - in real app, this would validate credentials
    onLogin(role);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-6 w-6" />
            City Issue Tracker
          </CardTitle>
          <CardDescription>
            Report and track issues in your community
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="citizen" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="citizen">Citizen Login</TabsTrigger>
              <TabsTrigger value="staff">Staff Login</TabsTrigger>
            </TabsList>
            
            <TabsContent value="citizen" className="space-y-4">
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
              <Button className="w-full" onClick={() => handleLogin("citizen")}>
                Login as Citizen
              </Button>
              <p className="text-center text-muted-foreground">
                Don't have an account?{" "}
                <button className="text-primary hover:underline">Sign up</button>
              </p>
            </TabsContent>
            
            <TabsContent value="staff" className="space-y-4">
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
              <Button className="w-full" onClick={() => handleLogin("staff")}>
                Login as Staff
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
