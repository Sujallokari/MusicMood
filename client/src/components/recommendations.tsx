import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import type { Track } from "@shared/schema";

export default function Recommendations() {
  const { data: recommendations = [], isLoading } = useQuery<Track[]>({
    queryKey: ["/api/recommendations"],
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold">Recommended for You</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-[var(--dark-surface)] rounded-lg p-4 flex items-center space-x-4 animate-pulse">
              <div className="w-16 h-16 bg-[var(--dark-accent)] rounded-lg"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-[var(--dark-accent)] rounded w-3/4"></div>
                <div className="h-3 bg-[var(--dark-accent)] rounded w-1/2"></div>
                <div className="h-3 bg-[var(--dark-accent)] rounded w-1/3"></div>
              </div>
              <div className="w-8 h-8 bg-[var(--dark-accent)] rounded-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold">Recommended for You</h2>
        <div className="text-center py-8">
          <p className="text-[var(--text-secondary)]">No recommendations available yet. Generate some playlists to get personalized recommendations!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Recommended for You</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {recommendations.map((track) => (
          <div
            key={track.id}
            className="recommendation-card bg-[var(--dark-surface)] rounded-lg p-4 flex items-center space-x-4 hover:bg-[var(--dark-accent)] transition-colors cursor-pointer group"
          >
            <img
              src={track.imageUrl || "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=80"}
              alt={`${track.name} album cover`}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h4 className="font-semibold">{track.name}</h4>
              <p className="text-[var(--text-secondary)] text-sm">{track.artist}</p>
              <p className="text-[var(--text-secondary)] text-xs">{track.album}</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-[var(--text-secondary)] text-sm">
                {track.duration ? `${Math.floor(track.duration / 60)}:${String(track.duration % 60).padStart(2, '0')}` : "3:20"}
              </span>
              <Button
                size="sm"
                className="opacity-0 group-hover:opacity-100 bg-[var(--spotify-green)] hover:bg-green-600 text-white w-8 h-8 p-0 rounded-full transition-all duration-200"
              >
                <Play className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
