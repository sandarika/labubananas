"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { ForumLeftSidebar } from "@/components/forum-left-sidebar"
import { ForumRightSidebar } from "@/components/forum-right-sidebar"
import { PostCard } from "@/components/post-card"
import { PollCard } from "@/components/poll-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Search, SlidersHorizontal, Bot, TrendingUp, Flame, Clock, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { useUser } from "@/lib/user-context"
import { UnionAssistantWidget } from "@/components/union-assistant-widget"
import { postsApi, pollsApi, type Post as ApiPost, type Poll as ApiPoll } from "@/lib/api"

const mockPosts = [
  {
    id: 1,
    title: "Contract Negotiations Update - Construction Workers United",
    author: "OrganizerJane",
    role: "Admin" as const,
    isAnonymous: false,
    category: "Construction",
    content:
      "Great news everyone! Our negotiating team has made significant progress on wage increases. The employer has agreed to our core demands including a 15% raise over three years and improved safety protocols...",
    upvotes: 234,
    comments: 45,
    time: "2 hours ago",
    isPinned: true,
  },
  {
    id: 2,
    title: "Healthcare Benefits Discussion - Nurses Alliance",
    author: "Anonymous",
    role: "Member" as const,
    isAnonymous: true,
    category: "Healthcare",
    content:
      "We need to discuss the proposed changes to our healthcare plan. The new policy reduces coverage for family members and I'm concerned about the impact on our members. Please share your thoughts and concerns...",
    upvotes: 189,
    comments: 67,
    time: "5 hours ago",
    isPinned: false,
  },
  {
    id: 3,
    title: "Teacher Strike Success Story - Lessons Learned",
    author: "TeacherTom",
    role: "Admin" as const,
    isAnonymous: false,
    category: "Teachers",
    content:
      "After 3 weeks of striking, we achieved all our major goals! Here's what we learned and how we stayed strong together. The key was maintaining clear communication and showing unified support...",
    upvotes: 412,
    comments: 98,
    time: "1 day ago",
    isPinned: false,
  },
  {
    id: 4,
    title: "New Safety Protocols in Manufacturing - Your Input Needed",
    author: "SafetyFirst",
    role: "Member" as const,
    isAnonymous: true,
    category: "Manufacturing",
    content:
      "Important updates regarding workplace safety. Admin has posted new guidelines that we should all review. I have some concerns about implementation timing and would love to hear from others in manufacturing...",
    upvotes: 156,
    comments: 34,
    time: "1 day ago",
    isPinned: false,
  },
]

const samplePoll = {
  question: "Should we prioritize wage increases or better healthcare in our next negotiation?",
  options: [
    { label: "Wage increases first", votes: 145 },
    { label: "Healthcare improvements", votes: 203 },
    { label: "Equal priority for both", votes: 98 },
    { label: "Other suggestions", votes: 34 },
  ],
  totalVotes: 480,
}

export default function ForumPage() {
  const [feedFilter, setFeedFilter] = useState<"best" | "hot" | "popular">("best")
  const [searchValue, setSearchValue] = useState("")
  const [showChatbot, setShowChatbot] = useState(false)
  const { user, isSignedIn } = useUser()
  
  // State for API data
  const [apiPosts, setApiPosts] = useState<ApiPost[]>([])
  const [polls, setPolls] = useState<ApiPoll[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Create post dialog state
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [newPostTitle, setNewPostTitle] = useState("")
  const [newPostContent, setNewPostContent] = useState("")
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState("")

  // Fetch posts and polls from API
  const fetchData = async () => {
    try {
      setLoading(true)
      // Fetch posts from union ID 1 (or adjust as needed)
      const postsData = await postsApi.getPostsByUnion(1).catch(() => [])
      setApiPosts(postsData)
      
      // Fetch polls
      const pollsData = await pollsApi.getPolls().catch(() => [])
      setPolls(pollsData)
      
      setError(null)
    } catch (err) {
      console.error("Error fetching forum data:", err)
      setError("Failed to load forum data. Using mock data.")
      // Keep mock data as fallback
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleCreatePost = async () => {
    if (!newPostTitle.trim() || !newPostContent.trim()) {
      setCreateError("Please fill in both title and content")
      return
    }

    if (!isSignedIn) {
      setCreateError("You must be signed in to create a post")
      return
    }

    setCreating(true)
    setCreateError("")

    try {
      await postsApi.createPost(1, {
        title: newPostTitle,
        content: newPostContent,
      })
      
      // Refresh posts
      await fetchData()
      
      // Reset form
      setNewPostTitle("")
      setNewPostContent("")
      setShowCreatePost(false)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create post"
      console.error("Error creating post:", err)
      setCreateError(errorMessage)
    } finally {
      setCreating(false)
    }
  }

  const filterIcons = {
    best: TrendingUp,
    hot: Flame,
    popular: Clock,
  }

  // Transform API posts to match PostCard props
  const transformedPosts = apiPosts.map((post) => ({
    id: post.id,
    title: post.title,
    author: "User", // API doesn't return author yet
    role: "Member" as const,
    isAnonymous: false,
    category: "General",
    content: post.content,
    upvotes: 0, // API doesn't track upvotes yet
    comments: post.feedbacks?.length || 0,
    time: new Date(post.created_at).toLocaleString(),
    isPinned: false,
  }))

  // Use mock data as fallback if no API data
  const displayPosts = transformedPosts.length > 0 ? transformedPosts : mockPosts

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="w-full">
        <div className="max-w-[1600px] mx-auto flex gap-6 px-4 py-6">
          {/* Left Sidebar - Hidden on mobile */}
          <div className="hidden lg:block">
            <ForumLeftSidebar />
          </div>

          {/* Main Feed */}
          <main className="flex-1 min-w-0 space-y-4">
            {loading && (
              <div className="text-center py-8 text-muted-foreground">
                Loading forum data...
              </div>
            )}
            
            {error && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                {error}
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="gap-2 bg-banana-light border-banana-DEFAULT text-foreground">
                <span className="h-2 w-2 bg-green-500 rounded-full" />
                {isSignedIn && user ? `Signed in as ${user.username} (${user.role})` : "You are browsing anonymously"}
              </Badge>
              <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground">
                What does this mean?
              </Button>
            </div>

            {/* Search and Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Feed Toggle */}
              <div className="flex rounded-lg border border-border bg-card p-1 shadow-sm">
                {(["best", "hot", "popular"] as const).map((filter) => {
                  const Icon = filterIcons[filter]
                  return (
                    <Button
                      key={filter}
                      size="sm"
                      variant="ghost"
                      onClick={() => setFeedFilter(filter)}
                      className={cn(
                        "capitalize text-xs px-3 gap-1.5 transition-all",
                        feedFilter === filter &&
                          "bg-banana-DEFAULT text-foreground font-semibold shadow-sm hover:bg-banana-DEFAULT",
                      )}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {filter}
                    </Button>
                  )
                })}
              </div>

              {/* Search Input */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="search + filter through posts"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="pl-10 shadow-sm"
                  aria-label="Search posts"
                />
              </div>

              {/* Create Post Button */}
              {isSignedIn && (
                <Dialog open={showCreatePost} onOpenChange={setShowCreatePost}>
                  <DialogTrigger asChild>
                    <Button className="gap-2 shrink-0 bg-banana-DEFAULT text-foreground hover:bg-banana-dark shadow-sm">
                      <Plus className="h-4 w-4" />
                      <span className="hidden sm:inline">New Post</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Post</DialogTitle>
                      <DialogDescription>
                        Share your thoughts with the union community
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      {createError && (
                        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded">
                          {createError}
                        </div>
                      )}
                      
                      <div className="space-y-2">
                        <Label htmlFor="post-title">Title</Label>
                        <Input
                          id="post-title"
                          placeholder="What's your post about?"
                          value={newPostTitle}
                          onChange={(e) => setNewPostTitle(e.target.value)}
                          disabled={creating}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="post-content">Content</Label>
                        <Textarea
                          id="post-content"
                          placeholder="Share your thoughts..."
                          value={newPostContent}
                          onChange={(e) => setNewPostContent(e.target.value)}
                          rows={6}
                          disabled={creating}
                        />
                      </div>
                      
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="outline"
                          onClick={() => setShowCreatePost(false)}
                          disabled={creating}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleCreatePost}
                          disabled={creating || !newPostTitle.trim() || !newPostContent.trim()}
                          className="bg-banana-DEFAULT text-foreground hover:bg-banana-dark"
                        >
                          {creating ? "Creating..." : "Create Post"}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )}

              {/* Filter Dropdown */}
              <Button
                variant="outline"
                className="gap-2 shrink-0 bg-card shadow-sm hover:bg-banana-light transition-colors"
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span className="hidden sm:inline"># Filter</span>
              </Button>
            </div>

            {/* Posts Feed */}
            <div className="space-y-5">
              {displayPosts.map((post, index) => (
                <div key={post.id}>
                  <PostCard {...post} />
                  {/* Insert poll after 2nd post */}
                  {index === 1 && polls.length > 0 && (
                    <div className="mt-5">
                      <PollCard poll={polls[0]} showInFeed />
                    </div>
                  )}
                  {index === 1 && polls.length === 0 && (
                    <div className="mt-5">
                      <PollCard {...samplePoll} showInFeed />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Permission Notice */}
            <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border shadow-sm">
              <p className="text-sm text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Note:</strong> Some features are restricted based on your role.{" "}
                <span className="font-semibold text-foreground">Admins</span> can create events and manage union
                settings. <span className="font-semibold text-foreground">Members</span> can post, comment, and vote.
              </p>
            </div>
          </main>

          {/* Right Sidebar - Hidden on mobile */}
          <div className="hidden xl:block">
            <ForumRightSidebar />
          </div>
        </div>
      </div>

      {/* Mobile Floating AI Button */}
      <Sheet open={showChatbot} onOpenChange={setShowChatbot}>
        <SheetTrigger asChild>
          <Button
            size="icon"
            className="xl:hidden fixed bottom-6 right-6 h-14 w-14 rounded-full bg-banana-DEFAULT text-foreground hover:bg-banana-dark shadow-lg z-40 banana-bounce"
            aria-label="Open AI Assistant"
          >
            <Bot className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-full sm:w-96 p-0">
          <div className="h-full">
            <ForumRightSidebar />
          </div>
        </SheetContent>
      </Sheet>

      {/* Union Assistant Widget - shows on all screen sizes */}
      <UnionAssistantWidget />
    </div>
  )
}
