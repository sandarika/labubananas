"use client";

import { useState, useEffect } from "react";
import { unionsApi, Union } from "@/lib/api";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Search, Building2, Tag, CheckCircle2, PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function UnionsPage() {
  const [unions, setUnions] = useState<Union[]>([]);
  const [filteredUnions, setFilteredUnions] = useState<Union[]>([]);
  const [industries, setIndustries] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState<string>("all");
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterUnions();
  }, [searchQuery, selectedIndustry, unions]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [unionsData, industriesData] = await Promise.all([
        unionsApi.getUnions(0, 100),
        unionsApi.getIndustries(),
      ]);
      setUnions(unionsData);
      setFilteredUnions(unionsData);
      setIndustries(industriesData);
    } catch (error) {
      console.error("Error loading unions:", error);
      toast({
        title: "Error",
        description: "Failed to load unions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterUnions = () => {
    let filtered = unions;

    // Filter by industry
    if (selectedIndustry !== "all") {
      filtered = filtered.filter((union) => union.industry === selectedIndustry);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (union) =>
          union.name.toLowerCase().includes(query) ||
          union.description?.toLowerCase().includes(query) ||
          union.tags?.toLowerCase().includes(query)
      );
    }

    setFilteredUnions(filtered);
  };

  const handleJoinLeave = async (unionId: number, isMember: boolean) => {
    try {
      if (isMember) {
        await unionsApi.leaveUnion(unionId);
        toast({
          title: "Success",
          description: "You have left the union.",
        });
      } else {
        await unionsApi.joinUnion(unionId);
        toast({
          title: "Success",
          description: "You have joined the union!",
        });
      }
      // Reload unions to update member status
      loadData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update membership.",
        variant: "destructive",
      });
    }
  };

  const parseTags = (tags: string | null): string[] => {
    if (!tags) return [];
    return tags.split(",").map((tag) => tag.trim()).filter(Boolean);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Browse Unions</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Find and join unions that align with your interests and profession. Connect with fellow workers and organize for better working conditions.
          </p>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search unions by name, description, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Industry Filter */}
              <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="All Industries" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Industries</SelectItem>
                  {industries.map((industry) => (
                    <SelectItem key={industry} value={industry}>
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Active Filters Display */}
            <div className="mt-4 flex flex-wrap gap-2">
              {selectedIndustry !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  <Building2 className="h-3 w-3" />
                  {selectedIndustry}
                </Badge>
              )}
              {searchQuery && (
                <Badge variant="secondary" className="gap-1">
                  <Search className="h-3 w-3" />
                  "{searchQuery}"
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="text-sm text-muted-foreground">
          Showing {filteredUnions.length} {filteredUnions.length === 1 ? "union" : "unions"}
        </div>

        {/* Unions Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-10 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : filteredUnions.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <Building2 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No unions found</h3>
              <p className="text-muted-foreground">
                {searchQuery || selectedIndustry !== "all"
                  ? "Try adjusting your filters to see more results."
                  : "There are no unions available yet. Check back later!"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUnions.map((union) => (
              <Card key={union.id} className="flex flex-col hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <CardTitle className="text-xl">{union.name}</CardTitle>
                    {union.is_member && (
                      <Badge variant="default" className="gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Member
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4" />
                    {union.member_count} {union.member_count === 1 ? "member" : "members"}
                  </CardDescription>
                </CardHeader>

                <CardContent className="flex-1 space-y-4">
                  {union.industry && (
                    <div className="flex items-center gap-2 text-sm">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{union.industry}</span>
                    </div>
                  )}

                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {union.description || "No description available."}
                  </p>

                  {union.tags && parseTags(union.tags).length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {parseTags(union.tags).map((tag, idx) => (
                        <Badge key={idx} variant="outline" className="gap-1">
                          <Tag className="h-3 w-3" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>

                <CardFooter>
                  <Button
                    className="w-full"
                    variant={union.is_member ? "outline" : "default"}
                    onClick={() => handleJoinLeave(union.id, union.is_member)}
                  >
                    {union.is_member ? (
                      <>Leave Union</>
                    ) : (
                      <>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Join Union
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
