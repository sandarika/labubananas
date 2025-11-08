"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, Plus, Clock, MapPin, Users, ChevronLeft, ChevronRight, List } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

type Event = {
  id: number
  title: string
  date: string
  time: string
  location: string
  category: "Meeting" | "Training" | "Workshop" | "Negotiation"
  attendees: number
  canEdit: boolean
  organizer: string
}

const events: Event[] = [
  {
    id: 1,
    title: "Monthly Union Meeting",
    date: "2025-01-15",
    time: "6:00 PM - 8:00 PM",
    location: "Union Hall, Main Street",
    category: "Meeting",
    attendees: 67,
    canEdit: true,
    organizer: "Admin",
  },
  {
    id: 2,
    title: "Safety Training Workshop",
    date: "2025-01-18",
    time: "2:00 PM - 5:00 PM",
    location: "Training Center",
    category: "Training",
    attendees: 34,
    canEdit: true,
    organizer: "Admin",
  },
  {
    id: 3,
    title: "Contract Negotiation Session",
    date: "2025-01-22",
    time: "10:00 AM - 4:00 PM",
    location: "Conference Room A",
    category: "Negotiation",
    attendees: 23,
    canEdit: false,
    organizer: "Union Leader",
  },
  {
    id: 4,
    title: "Healthcare Benefits Information",
    date: "2025-01-25",
    time: "7:00 PM - 8:30 PM",
    location: "Virtual (Zoom)",
    category: "Workshop",
    attendees: 89,
    canEdit: true,
    organizer: "Benefits Coordinator",
  },
  {
    id: 5,
    title: "Leadership Training",
    date: "2025-01-12",
    time: "9:00 AM - 12:00 PM",
    location: "Training Center",
    category: "Training",
    attendees: 15,
    canEdit: true,
    organizer: "Admin",
  },
  {
    id: 6,
    title: "Member Orientation",
    date: "2025-01-28",
    time: "6:00 PM - 7:00 PM",
    location: "Union Hall",
    category: "Meeting",
    attendees: 42,
    canEdit: true,
    organizer: "Admin",
  },
]

const categoryColors: Record<Event["category"], string> = {
  Meeting: "#F2C94C", // banana-gold
  Training: "#E7B056", // muted orange
  Workshop: "#A7B9D0", // soft gray-blue
  Negotiation: "#C36B5E", // deep muted red
}

export default function CalendarPage() {
  const [rsvpStatus, setRsvpStatus] = useState<Record<number, boolean>>({
    1: true,
    3: true,
  })
  const [viewMode, setViewMode] = useState<"month" | "week" | "day" | "list">("month")
  const [filterMode, setFilterMode] = useState<"all" | "my">("all")
  const [currentDate, setCurrentDate] = useState(new Date(2025, 0, 1)) // January 2025
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isAdmin, setIsAdmin] = useState(true) // Mock admin status

  const toggleRSVP = (eventId: number) => {
    setRsvpStatus((prev) => ({
      ...prev,
      [eventId]: !prev[eventId],
    }))
  }

  const filteredEvents = filterMode === "my" ? events.filter((event) => rsvpStatus[event.id]) : events

  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0]
    return filteredEvents.filter((event) => event.date === dateStr)
  }

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days: (Date | null)[] = []

    // Add empty slots for days before the month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }

    return days
  }

  const calendarDays = generateCalendarDays()
  const monthName = currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })

  const upcomingEvents = filteredEvents
    .filter((event) => rsvpStatus[event.id])
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3)

  return (
    <div className="min-h-screen bg-[#f9f9f9]" style={{ fontFamily: "Verdana, sans-serif" }}>
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#1e1e1e]">Union Calendar</h1>
            <p className="text-[#737373]">Stay updated on meetings, events, and training sessions</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Filter toggle */}
            <div className="flex rounded-xl border border-[#e5e5e5] bg-white p-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFilterMode("all")}
                className={`rounded-lg px-4 ${
                  filterMode === "all" ? "bg-[#F2C94C] text-[#1e1e1e] hover:bg-[#F2C94C]/90" : "hover:bg-gray-100"
                }`}
              >
                All Events
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFilterMode("my")}
                className={`rounded-lg px-4 ${
                  filterMode === "my" ? "bg-[#F2C94C] text-[#1e1e1e] hover:bg-[#F2C94C]/90" : "hover:bg-gray-100"
                }`}
              >
                My Events
              </Button>
            </div>

            {/* View mode toggle */}
            <div className="flex rounded-xl border border-[#e5e5e5] bg-white p-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode("month")}
                className={`rounded-lg px-3 ${
                  viewMode === "month" ? "bg-[#F2C94C] text-[#1e1e1e] hover:bg-[#F2C94C]/90" : "hover:bg-gray-100"
                }`}
                aria-label="Month view"
              >
                Month
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode("list")}
                className={`rounded-lg px-3 ${
                  viewMode === "list" ? "bg-[#F2C94C] text-[#1e1e1e] hover:bg-[#F2C94C]/90" : "hover:bg-gray-100"
                }`}
                aria-label="List view"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>

            {isAdmin && (
              <Button className="rounded-xl bg-[#F2C94C] text-[#1e1e1e] hover:bg-[#E7B056] shadow-sm">
                <Plus className="mr-2 h-4 w-4" />
                Create Event
              </Button>
            )}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Main content area */}
          <div>
            {viewMode === "month" && (
              <Card className="rounded-xl shadow-sm border-[#e5e5e5]">
                <CardHeader className="border-b border-[#e5e5e5]">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-[#1e1e1e]">{monthName}</h2>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={goToToday}
                        className="rounded-lg border-[#e5e5e5] hover:bg-gray-50 bg-transparent"
                      >
                        Today
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={goToPreviousMonth}
                        className="rounded-lg hover:bg-gray-50"
                        aria-label="Previous month"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={goToNextMonth}
                        className="rounded-lg hover:bg-gray-50"
                        aria-label="Next month"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {/* Calendar grid */}
                  <div className="grid grid-cols-7">
                    {/* Day headers */}
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                      <div
                        key={day}
                        className="border-b border-r border-[#e5e5e5] p-3 text-center text-sm font-semibold text-[#737373] bg-gray-50"
                      >
                        {day}
                      </div>
                    ))}

                    {/* Calendar days */}
                    {calendarDays.map((date, index) => {
                      const dayEvents = date ? getEventsForDate(date) : []
                      const isToday = date && date.toDateString() === new Date().toDateString()

                      return (
                        <div
                          key={index}
                          className={`min-h-[100px] border-b border-r border-[#e5e5e5] p-2 transition-colors ${
                            date ? "cursor-pointer hover:bg-gray-50" : "bg-gray-50/50"
                          }`}
                          onClick={() => date && dayEvents.length > 0 && setSelectedDate(date)}
                          role={date ? "button" : undefined}
                          tabIndex={date ? 0 : -1}
                          aria-label={date ? `View events for ${date.toLocaleDateString()}` : undefined}
                          onKeyDown={(e) => {
                            if (date && (e.key === "Enter" || e.key === " ")) {
                              e.preventDefault()
                              dayEvents.length > 0 && setSelectedDate(date)
                            }
                          }}
                        >
                          {date && (
                            <>
                              <div
                                className={`mb-1 flex h-7 w-7 items-center justify-center rounded-full text-sm ${
                                  isToday ? "bg-[#F2C94C] font-bold text-[#1e1e1e]" : "text-[#1e1e1e]"
                                }`}
                              >
                                {date.getDate()}
                              </div>

                              {/* Event dots */}
                              <div className="flex flex-wrap gap-1">
                                {dayEvents.slice(0, 3).map((event) => (
                                  <div
                                    key={event.id}
                                    className="h-2 w-2 rounded-full"
                                    style={{ backgroundColor: categoryColors[event.category] }}
                                    title={event.title}
                                  />
                                ))}
                                {dayEvents.length > 3 && (
                                  <div className="text-xs text-[#737373]">+{dayEvents.length - 3}</div>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {viewMode === "list" && (
              <div className="space-y-4">
                {filteredEvents.length === 0 ? (
                  <Card className="rounded-xl shadow-sm border-[#e5e5e5]">
                    <CardContent className="py-12 text-center">
                      <CalendarIcon className="mx-auto h-12 w-12 text-[#737373] mb-4" />
                      <h3 className="text-xl font-semibold mb-2 text-[#1e1e1e]">No events found</h3>
                      <p className="text-[#737373]">
                        {filterMode === "my"
                          ? "You haven't RSVP'd to any events yet"
                          : "No events scheduled at this time"}
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  filteredEvents.map((event) => (
                    <Card
                      key={event.id}
                      className="rounded-xl shadow-sm border-[#e5e5e5] hover:shadow-md transition-shadow"
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="mb-2 flex items-center gap-2">
                              <Badge
                                variant="secondary"
                                className="rounded-lg"
                                style={{
                                  backgroundColor: categoryColors[event.category],
                                  color: "#1e1e1e",
                                }}
                              >
                                {event.category}
                              </Badge>
                              {rsvpStatus[event.id] && (
                                <div className="flex items-center gap-1 text-xs text-green-600">
                                  <div className="h-2 w-2 rounded-full bg-green-600" />
                                  Attending
                                </div>
                              )}
                            </div>
                            <CardTitle className="text-xl text-balance text-[#1e1e1e]">{event.title}</CardTitle>
                          </div>
                          <CalendarIcon className="h-5 w-5 text-[#737373]" />
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center text-[#737373]">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {new Date(event.date).toLocaleDateString("en-US", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </div>
                          <div className="flex items-center text-[#737373]">
                            <Clock className="mr-2 h-4 w-4" />
                            {event.time}
                          </div>
                          <div className="flex items-center text-[#737373]">
                            <MapPin className="mr-2 h-4 w-4" />
                            {event.location}
                          </div>
                          <div className="flex items-center text-[#737373]">
                            <Users className="mr-2 h-4 w-4" />
                            {event.attendees} attending
                          </div>
                          <div className="text-[#737373]">Organizer: {event.organizer}</div>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button
                            className={`rounded-xl ${
                              rsvpStatus[event.id]
                                ? "bg-green-600 text-white hover:bg-green-700"
                                : "bg-[#F2C94C] text-[#1e1e1e] hover:bg-[#E7B056]"
                            }`}
                            onClick={() => toggleRSVP(event.id)}
                          >
                            {rsvpStatus[event.id] ? "RSVP'd ✓" : "RSVP"}
                          </Button>
                          {rsvpStatus[event.id] && (
                            <Button
                              variant="outline"
                              className="rounded-xl border-[#e5e5e5] hover:bg-gray-50 bg-transparent"
                              onClick={() => toggleRSVP(event.id)}
                            >
                              Cancel
                            </Button>
                          )}
                          {event.canEdit && isAdmin && (
                            <Button variant="ghost" className="rounded-xl hover:bg-gray-50">
                              Edit
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            )}
          </div>

          <div className="hidden lg:block space-y-4">
            {/* Upcoming events */}
            <Card className="rounded-xl shadow-sm border-[#e5e5e5]">
              <CardHeader>
                <CardTitle className="text-lg text-[#1e1e1e]">Your Next Events</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {upcomingEvents.length === 0 ? (
                  <p className="text-sm text-[#737373]">No upcoming events</p>
                ) : (
                  upcomingEvents.map((event) => (
                    <div
                      key={event.id}
                      className="rounded-lg border border-[#e5e5e5] p-3 hover:border-[#F2C94C] transition-colors cursor-pointer"
                    >
                      <div
                        className="mb-1 h-1 w-full rounded-full"
                        style={{ backgroundColor: categoryColors[event.category] }}
                      />
                      <h4 className="font-semibold text-sm text-[#1e1e1e] mb-1">{event.title}</h4>
                      <p className="text-xs text-[#737373]">
                        {new Date(event.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                        {" • "}
                        {event.time.split(" - ")[0]}
                      </p>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Quick actions */}
            {isAdmin && (
              <Card className="rounded-xl shadow-sm border-[#e5e5e5]">
                <CardHeader>
                  <CardTitle className="text-lg text-[#1e1e1e]">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button className="w-full justify-start rounded-xl bg-[#F2C94C] text-[#1e1e1e] hover:bg-[#E7B056]">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Event
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start rounded-xl border-[#e5e5e5] hover:bg-gray-50 bg-transparent"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    Manage Calendar
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Legend */}
            <Card className="rounded-xl shadow-sm border-[#e5e5e5]">
              <CardHeader>
                <CardTitle className="text-lg text-[#1e1e1e]">Event Types</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {Object.entries(categoryColors).map(([category, color]) => (
                  <div key={category} className="flex items-center gap-2 text-sm">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
                    <span className="text-[#1e1e1e]">{category}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Dialog open={selectedDate !== null} onOpenChange={() => setSelectedDate(null)}>
        <DialogContent className="rounded-xl max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#1e1e1e]">
              {selectedDate?.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </DialogTitle>
            <DialogDescription className="text-[#737373]">
              {selectedDate && getEventsForDate(selectedDate).length} event(s) scheduled
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 mt-4">
            {selectedDate &&
              getEventsForDate(selectedDate).map((event) => (
                <div key={event.id} className="rounded-lg border border-[#e5e5e5] p-4">
                  <div className="flex items-start justify-between mb-2">
                    <Badge
                      variant="secondary"
                      className="rounded-lg"
                      style={{
                        backgroundColor: categoryColors[event.category],
                        color: "#1e1e1e",
                      }}
                    >
                      {event.category}
                    </Badge>
                    {rsvpStatus[event.id] && (
                      <div className="flex items-center gap-1 text-xs text-green-600">
                        <div className="h-2 w-2 rounded-full bg-green-600" />
                        Attending
                      </div>
                    )}
                  </div>
                  <h4 className="font-semibold text-[#1e1e1e] mb-2">{event.title}</h4>
                  <div className="space-y-1 text-sm text-[#737373] mb-3">
                    <div className="flex items-center">
                      <Clock className="mr-2 h-3 w-3" />
                      {event.time}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="mr-2 h-3 w-3" />
                      {event.location}
                    </div>
                    <div className="flex items-center">
                      <Users className="mr-2 h-3 w-3" />
                      {event.attendees} attending
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className={`rounded-lg w-full ${
                      rsvpStatus[event.id]
                        ? "bg-green-600 text-white hover:bg-green-700"
                        : "bg-[#F2C94C] text-[#1e1e1e] hover:bg-[#E7B056]"
                    }`}
                    onClick={() => toggleRSVP(event.id)}
                  >
                    {rsvpStatus[event.id] ? "RSVP'd ✓" : "RSVP"}
                  </Button>
                </div>
              ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
