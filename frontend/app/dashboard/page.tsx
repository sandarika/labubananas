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
      { name: "Post and interact in forum", granted: true },
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
      { name: "Post and interact in forum", granted: true },
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
      { name: "Post and interact in forum", granted: true },
      { name: "Join calendar events", granted: true },
      { name: "Create and manage events", granted: false },
      { name: "Manage polls and voting", granted: false },
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
          <p className="text-muted-foreground">Manage your profile, view your permissions, and send anonymous feedback</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* User Profile */}
          <div className="lg:col-span-1">
            <RoleCard user={user} role={currentRole} roleInfo={roleInfo[currentRole]} />
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
