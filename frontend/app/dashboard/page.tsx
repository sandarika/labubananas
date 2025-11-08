"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RoleCard } from "@/components/role-card"
import { FeedbackForm } from "@/components/feedback-form"
import { Shield, Users, Megaphone, CheckCircle2, XCircle } from "lucide-react"

type UserRole = "admin" | "organizer" | "member"

const roleInfo = {
  admin: {
    title: "Admin",
    icon: Shield,
    description: "Full control over union operations",
    permissions: [
      { name: "Create and manage events", granted: true },
      { name: "Manage polls and voting", granted: true },
      { name: "Manage users and roles", granted: true },
      { name: "Post announcements", granted: true },
      { name: "Access analytics", granted: true },
      { name: "Delete content", granted: true },
    ],
  },
  organizer: {
    title: "Organizer",
    icon: Megaphone,
    description: "Lead discussions and coordinate activities",
    permissions: [
      { name: "Create and manage events", granted: true },
      { name: "Manage polls and voting", granted: true },
      { name: "Manage users and roles", granted: false },
      { name: "Post announcements", granted: true },
      { name: "Access analytics", granted: false },
      { name: "Delete content", granted: false },
    ],
  },
  member: {
    title: "Member",
    icon: Users,
    description: "Participate in union activities",
    permissions: [
      { name: "Create and manage events", granted: false },
      { name: "Manage polls and voting", granted: false },
      { name: "Manage users and roles", granted: false },
      { name: "Post announcements", granted: false },
      { name: "Access analytics", granted: false },
      { name: "Delete content", granted: false },
    ],
  },
}

export default function DashboardPage() {
  const [currentRole, setCurrentRole] = useState<UserRole>("member")

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Manage your profile and view your permissions</p>
        </div>

        {/* Role Selection Demo */}
        <Card className="mb-8 bg-primary/10 border-primary">
          <CardContent className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg mb-1 text-foreground">Demo Mode</h3>
                <p className="text-sm text-muted-foreground">Change your role to see different permissions</p>
              </div>
              <Select value={currentRole} onValueChange={(value) => setCurrentRole(value as UserRole)}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="organizer">Organizer</SelectItem>
                  <SelectItem value="member">Member</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* User Profile */}
          <div className="lg:col-span-1">
            <RoleCard role={currentRole} roleInfo={roleInfo[currentRole]} />
          </div>

          {/* Permissions Table */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Role Permissions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {roleInfo[currentRole].permissions.map((permission, index) => (
                    <div key={index} className="flex items-center justify-between py-3 px-4 rounded-lg bg-muted/50">
                      <span className="text-sm font-medium text-foreground">{permission.name}</span>
                      {permission.granted ? (
                        <Badge className="bg-primary text-primary-foreground">
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                          Granted
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-muted-foreground">
                          <XCircle className="mr-1 h-3 w-3" />
                          Not Granted
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Anonymous Feedback */}
        <div className="mt-8">
          <FeedbackForm />
        </div>
      </div>
    </div>
  )
}
