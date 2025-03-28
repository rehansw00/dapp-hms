"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Moon, Sun, Shield, User, BellRing } from "lucide-react";

interface SettingsPageProps {
  defaultRole: "admin" | "doctor" | "patient";
}

export function SettingsPage({ defaultRole }: SettingsPageProps) {
  const { theme, setTheme } = useTheme();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);

  // Role-specific settings sections
  const renderRoleSpecificSettings = () => {
    switch (defaultRole) {
      case "admin":
        return (
          <TabsContent value="admin">
            <Card>
              <CardHeader>
                <CardTitle>Admin Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Hospital Information</Label>
                  <Input placeholder="Hospital Name" />
                  <Input placeholder="Hospital Address" />
                  <Input placeholder="Contact Number" />
                </div>
                <div className="space-y-2">
                  <Label>System Configuration</Label>
                  <div className="flex items-center space-x-2">
                    <Switch id="maintenance" />
                    <Label htmlFor="maintenance">Maintenance Mode</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="registration" defaultChecked />
                    <Label htmlFor="registration">Allow New Registrations</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        );
      case "doctor":
        return (
          <TabsContent value="professional">
            <Card>
              <CardHeader>
                <CardTitle>Professional Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Professional Information</Label>
                  <Input placeholder="Medical License Number" />
                  <Input placeholder="Specialization" />
                  <Input placeholder="Years of Experience" />
                </div>
                <div className="space-y-2">
                  <Label>Availability</Label>
                  <div className="flex items-center space-x-2">
                    <Switch id="appointments" defaultChecked />
                    <Label htmlFor="appointments">Accept New Appointments</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="emergency" />
                    <Label htmlFor="emergency">Available for Emergency</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          {defaultRole === "admin" && <TabsTrigger value="admin">Admin</TabsTrigger>}
          {defaultRole === "doctor" && <TabsTrigger value="professional">Professional</TabsTrigger>}
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Theme</Label>
                  <p className="text-sm text-muted-foreground">
                    Choose your preferred theme
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                  {theme === "dark" ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                </Button>
              </div>
              
              <div className="space-y-2">
                <Label>Language</Label>
                <select className="w-full p-2 border rounded-md">
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive appointment and medical updates via email
                  </p>
                </div>
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>SMS Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Get important alerts via SMS
                  </p>
                </div>
                <Switch
                  checked={smsNotifications}
                  onCheckedChange={setSmsNotifications}
                />
              </div>

              <div className="space-y-2">
                <Label>Notification Types</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="appointments" defaultChecked />
                    <label htmlFor="appointments">Appointment Reminders</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="prescriptions" defaultChecked />
                    <label htmlFor="prescriptions">Prescription Updates</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="reports" defaultChecked />
                    <label htmlFor="reports">Medical Reports</label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <Switch
                  checked={twoFactorAuth}
                  onCheckedChange={setTwoFactorAuth}
                />
              </div>

              <div className="space-y-2">
                <Label>Change Password</Label>
                <Input type="password" placeholder="Current Password" />
                <Input type="password" placeholder="New Password" />
                <Input type="password" placeholder="Confirm New Password" />
                <Button>Update Password</Button>
              </div>

              <div className="space-y-2">
                <Label>Login History</Label>
                <div className="text-sm space-y-2">
                  <p>Last login: March 28, 2025 - 13:40 IST</p>
                  <p>Device: Chrome on Windows</p>
                  <Button variant="link">View Full History</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Profile Picture</Label>
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="w-10 h-10 text-gray-500" />
                  </div>
                  <Button>Upload New Picture</Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Personal Information</Label>
                <Input placeholder="Full Name" />
                <Input type="email" placeholder="Email Address" />
                <Input placeholder="Phone Number" />
                <Input placeholder="Address" />
              </div>

              <div className="space-y-2">
                <Label>Medical Information</Label>
                <Input placeholder="Blood Group" />
                <Input placeholder="Allergies" />
                <Input placeholder="Emergency Contact" />
              </div>

              <Button className="w-full">Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {renderRoleSpecificSettings()}
      </Tabs>
    </div>
  );
}
