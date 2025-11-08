import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users } from "lucide-react"

const categories = [
  { name: "Construction", members: 2341, active: true },
  { name: "Teachers", members: 1876, active: false },
  { name: "Healthcare", members: 3102, active: false },
  { name: "Manufacturing", members: 1543, active: false },
  { name: "Transportation", members: 987, active: false },
  { name: "Service Workers", members: 2234, active: false },
  { name: "Public Sector", members: 1654, active: false },
]

export function UnionSidebar() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Union Categories</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {categories.map((category) => (
          <button
            key={category.name}
            className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
              category.active ? "bg-primary text-primary-foreground" : "hover:bg-accent hover:text-accent-foreground"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">{category.name}</span>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {category.members}
              </Badge>
            </div>
          </button>
        ))}
      </CardContent>
    </Card>
  )
}
