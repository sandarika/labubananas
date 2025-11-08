import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { LucideIcon } from "lucide-react"

type RoleCardProps = {
  role: string
  roleInfo: {
    title: string
    icon: LucideIcon
    description: string
  }
}

export function RoleCard({ role, roleInfo }: RoleCardProps) {
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
          <h3 className="text-2xl font-bold text-foreground">Anonymous User</h3>
          <Badge className="bg-primary text-primary-foreground text-base px-4 py-1">{roleInfo.title}</Badge>
        </div>

        <p className="text-sm text-center text-muted-foreground leading-relaxed">{roleInfo.description}</p>

        <div className="pt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Member Since</span>
            <span className="font-medium text-foreground">Jan 2025</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Posts</span>
            <span className="font-medium text-foreground">23</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Comments</span>
            <span className="font-medium text-foreground">156</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
