"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RoleCard } from "@/components/role-card"
import { FeedbackForm } from "@/components/feedback-form"
import { Shield, Users, Megaphone, CheckCircle2, XCircle } from "lucide-react"
import { useUser } from "@/lib/user-context"
import { useRouter } from "next/navigation"

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
  const { user, isSignedIn, loading } = useUser()
  const router = useRouter()
  const [demoRole, setDemoRole] = useState<UserRole | null>(null)

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (!loading && !isSignedIn) {
      router.push("/sign-in")
    }
  }, [loading, isSignedIn, router])

  // Set user's actual role when loaded
  useEffect(() => {
    if (user) {
      const userRole = user.role as UserRole
      if (userRole in roleInfo) {
        setDemoRole(userRole)
      } else {
        setDemoRole("member")
      }
    }
  }, [user])

  // Use demo role for display (allows testing different roles)
  const currentRole = demoRole || "member"

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isSignedIn || !user) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen bg-background">
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
                <h3 className="font-semibold text-lg mb-1 text-foreground">
                  Your Current Role: <span className="text-primary">{currentRole}</span>
                </h3>
                <p className="text-sm text-muted-foreground">
                  Signed in as {user.username}
                  {user.role !== currentRole && " (Demo mode active)"}
                </p>
              </div>
              <Select value={currentRole} onValueChange={(value) => setDemoRole(value as UserRole)}>
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

          {/* Account Overview Card (from profile) */}
          <div className="mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-muted/50 text-center">
                    <div className="text-3xl font-bold text-primary mb-1">Active</div>
                    <div className="text-sm text-muted-foreground">Account Status</div>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50 text-center">
                    <div className="text-3xl font-bold text-primary mb-1 capitalize">{user.role}</div>
                    <div className="text-sm text-muted-foreground">Member Role</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Role Description Card (from profile) */}
          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Role Permissions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {user.role === "admin" && (
                    <>
                      <div className="flex items-start gap-3">
                        <div className="h-2 w-2 rounded-full bg-green-500 mt-2" />
                        <div>
                          <p className="font-medium">Full Administrative Access</p>
                          <p className="text-sm text-muted-foreground">Manage users, unions, and all platform content</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="h-2 w-2 rounded-full bg-green-500 mt-2" />
                        <div>
                          <p className="font-medium">Moderate Content</p>
                          <p className="text-sm text-muted-foreground">Delete any posts, comments, or inappropriate content</p>
                        </div>
                      </div>
                    </>
                  )}
                  {user.role === "organizer" && (
                    <>
                      <div className="flex items-start gap-3">
                        <div className="h-2 w-2 rounded-full bg-blue-500 mt-2" />
                        <div>
                          <p className="font-medium">Union Management</p>
                          <p className="text-sm text-muted-foreground">Create and manage union posts and events</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="h-2 w-2 rounded-full bg-blue-500 mt-2" />
                        <div>
                          <p className="font-medium">Create Polls</p>
                          <p className="text-sm text-muted-foreground">Conduct votes and gather member feedback</p>
                        </div>
                      </div>
                    </>
                  )}
                  {user.role === "member" && (
                    <>
                      <div className="flex items-start gap-3">
                        <div className="h-2 w-2 rounded-full bg-green-500 mt-2" />
                        <div>
                          <p className="font-medium">Create Posts</p>
                          <p className="text-sm text-muted-foreground">Share updates and participate in discussions</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="h-2 w-2 rounded-full bg-green-500 mt-2" />
                        <div>
                          <p className="font-medium">Comment & Vote</p>
                          <p className="text-sm text-muted-foreground">Engage with posts and participate in polls</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="h-2 w-2 rounded-full bg-green-500 mt-2" />
                        <div>
                          <p className="font-medium">Anonymous Feedback</p>
                          <p className="text-sm text-muted-foreground">Submit confidential feedback and concerns</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

        {/* Anonymous Feedback */}
        <div className="mt-8">
          <FeedbackForm />
        </div>
      </div>
    </div>
  )
}
