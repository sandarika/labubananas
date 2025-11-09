"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { User, Briefcase, Calendar, Shield, UserCircle } from "lucide-react"
import { useUser } from "@/lib/user-context"
import { Skeleton } from "@/components/ui/skeleton"

export default function ProfilePage() {
  const { user, isSignedIn, loading } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isSignedIn) {
      router.push("/sign-in")
    }
  }, [loading, isSignedIn, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-20">
          <div className="mx-auto max-w-2xl space-y-4">
            <Skeleton className="h-12 w-64" />
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-20 w-20 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
                <div className="space-y-4">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { 
      year: "numeric", 
      month: "long", 
      day: "numeric" 
    })
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "bg-red-500 hover:bg-red-600"
      case "organizer":
        return "bg-blue-500 hover:bg-blue-600"
      default:
        return "bg-green-500 hover:bg-green-600"
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return Shield
      case "organizer":
        return Briefcase
      default:
        return User
    }
  }

  const RoleIcon = getRoleIcon(user.role)

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-4xl font-bold mb-8">My Profile</h1>

          <div className="space-y-6">
            {/* Main Profile Card */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center ring-2 ring-primary/20">
                    <UserCircle className="h-12 w-12 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl font-semibold">{user.username}</h2>
                      <Badge className={getRoleBadgeColor(user.role)}>
                        <RoleIcon className="h-3 w-3 mr-1" />
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm">Member since {formatDate(user.created_at)}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t space-y-3">
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <User className="h-5 w-5" />
                      <span className="font-medium">User ID</span>
                    </div>
                    <span className="text-foreground">#{user.id}</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Shield className="h-5 w-5" />
                      <span className="font-medium">Account Type</span>
                    </div>
                    <span className="text-foreground capitalize">{user.role}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Account Stats Card */}
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

            {/* Role Description Card */}
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
                          <p className="text-sm text-muted-foreground">
                            Manage users, unions, and all platform content
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="h-2 w-2 rounded-full bg-green-500 mt-2" />
                        <div>
                          <p className="font-medium">Moderate Content</p>
                          <p className="text-sm text-muted-foreground">
                            Delete any posts, comments, or inappropriate content
                          </p>
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
                          <p className="text-sm text-muted-foreground">
                            Create and manage union posts and events
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="h-2 w-2 rounded-full bg-blue-500 mt-2" />
                        <div>
                          <p className="font-medium">Create Polls</p>
                          <p className="text-sm text-muted-foreground">
                            Conduct votes and gather member feedback
                          </p>
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
                          <p className="text-sm text-muted-foreground">
                            Share updates and participate in discussions
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="h-2 w-2 rounded-full bg-green-500 mt-2" />
                        <div>
                          <p className="font-medium">Comment & Vote</p>
                          <p className="text-sm text-muted-foreground">
                            Engage with posts and participate in polls
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="h-2 w-2 rounded-full bg-green-500 mt-2" />
                        <div>
                          <p className="font-medium">Anonymous Feedback</p>
                          <p className="text-sm text-muted-foreground">
                            Submit confidential feedback and concerns
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
