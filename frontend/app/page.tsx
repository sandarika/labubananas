import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AIChatbotButton } from "@/components/ai-chatbot-button"
import { MessageSquare, Calendar, Vote, Shield, Bell, Scale } from "lucide-react"

export default function LandingPage() {
  const features = [
    {
      icon: MessageSquare,
      title: "Community Forum",
      description: "Connect with union members across North America in our Reddit-style forum",
    },
    {
      icon: Calendar,
      title: "Event Scheduling",
      description: "Stay updated on meetings, training sessions, and union events",
    },
    {
      icon: Vote,
      title: "Democratic Voting",
      description: "Participate in polls and make your voice heard on important decisions",
    },
    {
      icon: Shield,
      title: "Anonymous Feedback",
      description: "Share concerns and feedback safely with complete anonymity",
    },
    {
      icon: Bell,
      title: "Real-time Updates",
      description: "Get instant notifications about union news and announcements",
    },
    {
      icon: Scale,
      title: "Chatbot and Legal Advice",
      description: "Get instant answers to labor law questions and union guidance",
    },
  ]

  const statistics = [
    { number: "2.5M+", label: "Union Members" },
    { number: "15,000+", label: "Active Unions" },
    { number: "98%", label: "User Satisfaction" },
    { number: "$45B+", label: "Wages Protected" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <AIChatbotButton />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="mx-auto max-w-3xl space-y-8">
          <div className="banana-bounce inline-block">
            <span className="text-9xl">🍌</span>
          </div>

          <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl md:text-7xl text-balance">
            Join the Bunch!
          </h1>

          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto text-pretty">
            Empowering unions and their members across North America with tools to communicate, organize, and protect
            worker rights.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href="/forum">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/80 hover:scale-105 transition-all text-lg px-8 py-6"
              >
                Enter the Forum
              </Button>
            </Link>
            <Link href="/calendar">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto text-lg px-8 py-6 hover:bg-primary hover:text-primary-foreground hover:scale-105 transition-all bg-transparent"
              >
                View Events
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Everything Your Union Needs</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Built for union members, by people who care about worker empowerment
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card key={index} className="border-border hover:border-primary transition-colors">
              <CardContent className="pt-6">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-card-foreground">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-20 bg-muted/30">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">By the Numbers</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Join thousands of unions making a real difference for workers
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {statistics.map((stat, index) => (
            <Card key={index} className="text-center border-2 hover:border-primary transition-colors">
              <CardContent className="pt-8 pb-6">
                <div className="text-5xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-lg text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="bg-primary text-primary-foreground border-primary">
          <CardContent className="py-16 text-center">
            <h2 className="text-4xl font-bold mb-4 text-balance">Ready to strengthen your union?</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90 text-pretty">
              Join thousands of union members already using BunchUp to organize, communicate, and make their voices
              heard.
            </p>
            <Link href="/sign-up">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6 hover:scale-105 transition-transform">
                Get Started Now
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>© 2025 BunchUp. Empowering unions across North America. 🍌</p>
        </div>
      </footer>
    </div>
  )
}
