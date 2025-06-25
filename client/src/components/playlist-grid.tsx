import { useState } from "react";
import { Plus, Play, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { Playlist } from "@shared/schema";

interface PlaylistGridProps {
  selectedMood: string;
}

export default function PlaylistGrid({ selectedMood }: PlaylistGridProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: playlists = [], isLoading } = useQuery<Playlist[]>({
    queryKey: ["/api/playlists"],
    retry: false,
  });

  const generatePlaylistMutation = useMutation({
    mutationFn: async (mood: string) => {
      const res = await apiRequest("POST", "/api/playlists/generate", { mood });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/playlists"] });
      toast({
        title: "Success",
        description: "Playlist generated successfully!",
      });
      setIsGenerating(false);
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to generate playlist. Please try again.",
        variant: "destructive",
      });
      setIsGenerating(false);
    },
  });

  const handleGeneratePlaylist = () => {
    if (!selectedMood) {
      toast({
        title: "Select a mood",
        description: "Please select a mood first to generate a playlist.",
        variant: "destructive",
      });
      return;
    }
    setIsGenerating(true);
    generatePlaylistMutation.mutate(selectedMood);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold">Your Playlists</h2>
          <div className="w-32 h-10 bg-[var(--dark-surface)] rounded-full animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-[var(--dark-surface)] rounded-lg p-4 animate-pulse">
              <div className="w-full aspect-square bg-[var(--dark-accent)] rounded-lg mb-4"></div>
              <div className="h-4 bg-[var(--dark-accent)] rounded mb-2"></div>
              <div className="h-3 bg-[var(--dark-accent)] rounded mb-2 w-3/4"></div>
              <div className="h-3 bg-[var(--dark-accent)] rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Your Playlists</h2>
        <Button
          onClick={handleGeneratePlaylist}
          disabled={isGenerating}
          className="bg-[var(--spotify-green)] hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-full transition-colors duration-200"
        >
          <Plus className="w-4 h-4 mr-2" />
          {isGenerating ? "Generating..." : "Generate New"}
        </Button>
      </div>
      
      {playlists.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-[var(--dark-surface)] rounded-full flex items-center justify-center mx-auto mb-4">
            <Music className="w-8 h-8 text-[var(--text-secondary)]" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No playlists yet</h3>
          <p className="text-[var(--text-secondary)] mb-4">Select a mood and generate your first playlist!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {playlists.map((playlist) => (
            <div
              key={playlist.id}
              className="playlist-card bg-[var(--dark-surface)] rounded-lg p-4 hover:bg-[var(--dark-accent)] transition-colors cursor-pointer group"
            >
              <img
                src={playlist.imageUrl || "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400"}
                alt={`${playlist.name} Playlist Cover`}
                className="w-full aspect-square object-cover rounded-lg mb-4"
              />
              <h3 className="font-semibold mb-1">{playlist.name}</h3>
              <p className="text-[var(--text-secondary)] text-sm mb-2">{playlist.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-[var(--text-secondary)] text-xs">
                  {playlist.trackCount || 0} songs
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
      )}
    </div>
  );
}
