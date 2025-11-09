"use client"

import { useState, useEffect } from "react"
import { ForumLeftSidebar } from "@/components/forum-left-sidebar"
import { ForumRightSidebar } from "@/components/forum-right-sidebar"
import { PostCard } from "@/components/post-card"
import { PollCard } from "@/components/poll-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Search, SlidersHorizontal, Bot, Plus, X, Clock, TrendingUp, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuRadioGroup, DropdownMenuRadioItem } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
    upvotes: 0,
    comments: 0,
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
    upvotes: 0,
    comments: 0,
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
    upvotes: 0,
    comments: 0,
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
    upvotes: 0,
    comments: 0,
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
  const [searchValue, setSearchValue] = useState("")
  const [showChatbot, setShowChatbot] = useState(false)
  const { user, isSignedIn } = useUser()
  
  // Sorting and filtering state
  const [sortBy, setSortBy] = useState<"recent" | "popular">("recent")
  const [timeRange, setTimeRange] = useState<"today" | "week" | "month" | "year" | "all">("all")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const availableCategories = ["Construction", "Healthcare", "Teachers", "Manufacturing", "Agriculture", "Technology", "Retail", "Transportation", "Hospitality"]
  
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

  // Create poll dialog state
  const [showCreatePoll, setShowCreatePoll] = useState(false)
  const [newPollQuestion, setNewPollQuestion] = useState("")
  const [newPollOptions, setNewPollOptions] = useState(["", ""])
  const [creatingPoll, setCreatingPoll] = useState(false)
  const [createPollError, setCreatePollError] = useState("")

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

  const handleCreatePoll = async () => {
    // Validate inputs
    const validOptions = newPollOptions.filter(opt => opt.trim().length > 0)
    
    if (!newPollQuestion.trim()) {
      setCreatePollError("Please enter a poll question")
      return
    }

    if (validOptions.length < 2) {
      setCreatePollError("Please provide at least 2 options")
      return
    }

    if (!isSignedIn) {
      setCreatePollError("You must be signed in to create a poll")
      return
    }

    setCreatingPoll(true)
    setCreatePollError("")

    try {
      await pollsApi.createPoll({
        question: newPollQuestion,
        union_id: 1,
        options: validOptions.map(text => ({ text })),
      })
      
      // Refresh polls
      await fetchData()
      
      // Reset form
      setNewPollQuestion("")
      setNewPollOptions(["", ""])
      setShowCreatePoll(false)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create poll"
      console.error("Error creating poll:", err)
      setCreatePollError(errorMessage)
    } finally {
      setCreatingPoll(false)
    }
  }

  const addPollOption = () => {
    if (newPollOptions.length < 6) {
      setNewPollOptions([...newPollOptions, ""])
    }
  }

  const removePollOption = (index: number) => {
    if (newPollOptions.length > 2) {
      setNewPollOptions(newPollOptions.filter((_, i) => i !== index))
    }
  }

  const updatePollOption = (index: number, value: string) => {
    const updated = [...newPollOptions]
    updated[index] = value
    setNewPollOptions(updated)
  }

  // Toggle category filter
  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  // Clear all filters
  const clearFilters = () => {
    setSearchValue("")
    setSelectedCategories([])
  }

  // Filter posts by time range
  const filterByTimeRange = (post: typeof displayPosts[0]) => {
    // Only apply time range filter when sorting by popular AND time range is not "all"
    if (sortBy === "recent" || timeRange === "all") return true
    
    // Parse the post time - it could be relative ("2 hours ago") or absolute
    // For mock data with relative times, we'll need to handle it differently
    let postDate: Date
    
    // Try to parse as a date string first (for API data)
    if (post.time.includes('/') || post.time.includes('-') || post.time.includes(',')) {
      postDate = new Date(post.time)
    } else {
      // For relative time strings like "2 hours ago", "1 day ago"
      // We'll estimate the date based on the relative time
      const now = new Date()
      if (post.time.includes('hour')) {
        const hours = parseInt(post.time) || 0
        postDate = new Date(now.getTime() - hours * 60 * 60 * 1000)
      } else if (post.time.includes('day')) {
        const days = parseInt(post.time) || 0
        postDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000)
      } else if (post.time.includes('week')) {
        const weeks = parseInt(post.time) || 0
        postDate = new Date(now.getTime() - weeks * 7 * 24 * 60 * 60 * 1000)
      } else if (post.time.includes('month')) {
        const months = parseInt(post.time) || 0
        postDate = new Date(now.getTime() - months * 30 * 24 * 60 * 60 * 1000)
      } else {
        // If we can't parse it, assume it's recent
        postDate = now
      }
    }
    
    const now = new Date()
    
    switch (timeRange) {
      case "today":
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        return postDate >= todayStart
      case "week":
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        return postDate >= weekAgo
      case "month":
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        return postDate >= monthAgo
      case "year":
        const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
        return postDate >= yearAgo
      default:
        return true
    }
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
    upvotes: (post.upvotes || 0) - (post.downvotes || 0), // Net upvotes (upvotes minus downvotes)
    comments: post.comments?.length || 0,
    time: new Date(post.created_at).toLocaleString(),
    isPinned: false,
  }))

  // Use mock data as fallback if no API data
  const displayPosts = transformedPosts.length > 0 ? transformedPosts : mockPosts

  // Filter posts based on search and category filters
  const filteredPosts = displayPosts
    .filter(post => {
      // Search filter
      const matchesSearch = searchValue === "" || 
        post.title.toLowerCase().includes(searchValue.toLowerCase()) ||
        post.content.toLowerCase().includes(searchValue.toLowerCase())
      
      // Category filter
      const matchesCategory = selectedCategories.length === 0 || 
        selectedCategories.includes(post.category)
      
      // Time range filter
      const matchesTimeRange = filterByTimeRange(post)
      
      return matchesSearch && matchesCategory && matchesTimeRange
    })
    .sort((a, b) => {
      if (sortBy === "popular") {
        // Sort by upvotes (popularity)
        return b.upvotes - a.upvotes
      } else {
        // Sort by most recent (assuming time is a relative string, we'll use id as proxy)
        return b.id - a.id
      }
    })

  const hasActiveFilters = searchValue !== "" || selectedCategories.length > 0

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full">
        <div className="max-w-[1600px] mx-auto flex gap-6 px-4 py-6">
          {/* Left Sidebar - Hidden on mobile */}
          <div className="hidden lg:block">
            <ForumLeftSidebar 
              onCreatePost={() => setShowCreatePost(true)}
              onCreatePoll={() => setShowCreatePoll(true)}
            />
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
            </div>

            {/* Sort and Time Range Selector */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 bg-card rounded-lg border border-border shadow-sm">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium text-muted-foreground">Sort by:</span>
                <div className="flex rounded-lg border border-border bg-background p-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setSortBy("recent")}
                    className={cn(
                      "gap-1.5 text-xs px-3 transition-all",
                      sortBy === "recent" &&
                        "bg-banana-DEFAULT text-foreground font-semibold shadow-sm hover:bg-banana-DEFAULT"
                    )}
                  >
                    <Clock className="h-3.5 w-3.5" />
                    Most Recent
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setSortBy("popular")}
                    className={cn(
                      "gap-1.5 text-xs px-3 transition-all",
                      sortBy === "popular" &&
                        "bg-banana-DEFAULT text-foreground font-semibold shadow-sm hover:bg-banana-DEFAULT"
                    )}
                  >
                    <TrendingUp className="h-3.5 w-3.5" />
                    Most Popular
                  </Button>
                </div>
              </div>

              {/* Time Range Selector - Only visible when "Most Popular" is selected */}
              {sortBy === "popular" && (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-muted-foreground">From:</span>
                  <Select value={timeRange} onValueChange={(value: typeof timeRange) => setTimeRange(value)}>
                    <SelectTrigger className="w-[140px] h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                      <SelectItem value="year">This Year</SelectItem>
                      <SelectItem value="all">All Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {/* Search and Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search Input */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search posts by title or content..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="pl-10 shadow-sm"
                  aria-label="Search posts"
                />
                {searchValue && (
                  <button
                    onClick={() => setSearchValue("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "gap-2 shrink-0 bg-card shadow-sm hover:bg-banana-light transition-colors",
                      selectedCategories.length > 0 && "bg-banana-light border-banana-DEFAULT"
                    )}
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                    <span className="hidden sm:inline">
                      Filter {selectedCategories.length > 0 && `(${selectedCategories.length})`}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {availableCategories.map((category) => (
                    <DropdownMenuCheckboxItem
                      key={category}
                      checked={selectedCategories.includes(category)}
                      onCheckedChange={() => toggleCategory(category)}
                    >
                      {category}
                    </DropdownMenuCheckboxItem>
                  ))}
                  {selectedCategories.length > 0 && (
                    <>
                      <DropdownMenuSeparator />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-center text-xs"
                        onClick={clearFilters}
                      >
                        Clear Filters
                      </Button>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-muted-foreground">Active filters:</span>
                {searchValue && (
                  <Badge variant="secondary" className="gap-1">
                    Search: "{searchValue}"
                    <button
                      onClick={() => setSearchValue("")}
                      className="ml-1 hover:text-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {selectedCategories.map((category) => (
                  <Badge key={category} variant="secondary" className="gap-1">
                    {category}
                    <button
                      onClick={() => toggleCategory(category)}
                      className="ml-1 hover:text-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="h-6 px-2 text-xs"
                >
                  Clear all
                </Button>
              </div>
            )}

            {/* Posts Feed */}
            <div className="space-y-5">
              {filteredPosts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg mb-2">No posts found</p>
                  <p className="text-sm text-muted-foreground">
                    {hasActiveFilters ? "Try adjusting your filters or search" : "Be the first to create a post!"}
                  </p>
                </div>
              ) : (
                filteredPosts.map((post, index) => (
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
                ))
              )}
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

      {/* Create Poll Dialog */}
      <Dialog open={showCreatePoll} onOpenChange={setShowCreatePoll}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Poll</DialogTitle>
            <DialogDescription>
              Ask the community for their opinion
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {createPollError && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded">
                {createPollError}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="poll-question">Question</Label>
              <Input
                id="poll-question"
                placeholder="What do you want to ask?"
                value={newPollQuestion}
                onChange={(e) => setNewPollQuestion(e.target.value)}
                disabled={creatingPoll}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Options</Label>
              {newPollOptions.map((option, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder={`Option ${index + 1}`}
                    value={option}
                    onChange={(e) => updatePollOption(index, e.target.value)}
                    disabled={creatingPoll}
                  />
                  {newPollOptions.length > 2 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removePollOption(index)}
                      disabled={creatingPoll}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              {newPollOptions.length < 6 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addPollOption}
                  disabled={creatingPoll}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Option
                </Button>
              )}
            </div>
            
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowCreatePoll(false)}
                disabled={creatingPoll}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreatePoll}
                disabled={creatingPoll || !newPollQuestion.trim() || newPollOptions.filter(o => o.trim()).length < 2}
                className="bg-banana-DEFAULT text-foreground hover:bg-banana-dark"
              >
                {creatingPoll ? "Creating..." : "Create Poll"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Union Assistant Widget - shows on all screen sizes */}
      <UnionAssistantWidget />
    </div>
  )
}
