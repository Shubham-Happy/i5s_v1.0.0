
import { useState } from "react";
import { fetchApprovedFundraisingEvents } from "@/lib/supabase-fundraising-queries";
import { useQuery } from "@tanstack/react-query";
import { FundraisingHeader } from "@/components/fundraising/FundraisingHeader";
import { FundraisingBanner } from "@/components/fundraising/FundraisingBanner";
import { FundraisingTabs } from "@/components/fundraising/FundraisingTabs";
import { EventGrid } from "@/components/fundraising/EventGrid";

export default function Fundraising() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");

  // Fetch only approved fundraising events for public display
  const { data: events = [], isLoading, refetch } = useQuery({
    queryKey: ["approved-fundraising-events"],
    queryFn: fetchApprovedFundraisingEvents,
  });

  // Filter events based on search query and category filter
  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) || event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === "all" || event.category.toLowerCase() === filter.toLowerCase();

    return matchesSearch && matchesFilter;
  });

  const handleEventCreated = () => {
    refetch();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ivory-light via-background to-gold-light/10">
      <div className="container max-w-7xl mx-auto px-4 py-6">
        {/* Hero Section with Golden Gradient */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-green via-slate-green/90 to-gold-medium/80 p-8 md:p-12 mb-8 shadow-2xl">
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
          <div className="relative z-10">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
              Fundraising &
              <span className="block bg-gradient-to-r from-gold-light to-gold-accent   bg-clip-text">
                Competitions
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-ivory-light/90 mb-6 max-w-2xl leading-relaxed">
              Discover exclusive opportunities to fund your dreams and showcase your innovation to the world.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
                <span className="text-white font-medium">{events.length}+ Active Events</span>
              </div>
              <div className="bg-gold-medium/20 backdrop-blur-sm rounded-full px-6 py-3 border border-gold-light/30">
                <span className="text-white font-medium">$10M+ in Prizes</span>
              </div>
            </div>
          </div>
        </div>

        <section className="space-y-8">
          <FundraisingHeader 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onEventCreated={handleEventCreated}
          />

          <FundraisingTabs onFilterChange={setFilter} />

          <EventGrid events={filteredEvents} isLoading={isLoading} />
        </section>
      </div>
    </div>
  );
}
