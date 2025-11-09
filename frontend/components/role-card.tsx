import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { LucideIcon } from "lucide-react"
import { Calendar } from "lucide-react"

type User = {
  id: number
  username: string
  role: string
  created_at: string
  email?: string
  phone?: string
  union?: string
}

type RoleCardProps = {
  user: User
  role: string
  roleInfo: {
    title: string
    icon: LucideIcon
    description: string
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  })
}

export function RoleCard({ user, role, roleInfo }: RoleCardProps) {
  const Icon = roleInfo.icon

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-center py-6">
          <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
            <Icon className="h-12 w-12 text-primary" />
          </div>
        </div>

        <div className="text-center space-y-2">
          <h3 className="text-2xl font-bold text-foreground">{user.username}</h3>
          <Badge className="bg-primary text-primary-foreground text-base px-4 py-1">{roleInfo.title}</Badge>
        </div>

        <p className="text-sm text-center text-muted-foreground leading-relaxed">{roleInfo.description}</p>

        <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
          <Calendar className="h-4 w-4" />
          <span>Member since {formatDate(user.created_at)}</span>
        </div>

        <div className="pt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">User ID</span>
            <span className="font-medium text-foreground">#{user.id}</span>
          </div>
          {user.union && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Union</span>
              <span className="font-medium text-foreground">{user.union}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-muted-foreground">Account Status</span>
            <span className="font-medium text-primary">Active</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
