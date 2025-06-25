import { useState, useEffect } from "react";
import { Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import MoodSelector from "@/components/mood-selector";
import PlaylistGrid from "@/components/playlist-grid";
import Recommendations from "@/components/recommendations";
import MusicPlayer from "@/components/music-player";
import ProfileModal from "@/components/profile-modal";

export default function Dashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [showProfile, setShowProfile] = useState(false);
  const [selectedMood, setSelectedMood] = useState<string>("");

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
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
  }, [isAuthenticated, isLoading, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--dark-bg)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--spotify-green)] mx-auto mb-4"></div>
          <p className="text-[var(--text-secondary)]">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  return (
    <>
      <div className="min-h-screen bg-[var(--dark-bg)] text-white">
        {/* Navigation */}
        <nav className="bg-[var(--dark-surface)] border-b border-[var(--dark-accent)] px-6 py-4">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-bold text-[var(--spotify-green)]">VibeStream</h1>
              <div className="hidden md:flex space-x-6">
                <a href="#" className="text-white hover:text-[var(--spotify-green)] transition-colors">Home</a>
                <a href="#" className="text-[var(--text-secondary)] hover:text-white transition-colors">Browse</a>
                <a href="#" className="text-[var(--text-secondary)] hover:text-white transition-colors">Your Library</a>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:block relative">
                <Input
                  type="text"
                  placeholder="Search for songs, artists..."
                  className="bg-[var(--dark-bg)] border-[var(--dark-accent)] rounded-full py-2 px-4 pl-10 text-sm focus:border-[var(--spotify-green)]"
                />
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-secondary)]" />
              </div>
              <Button
                onClick={() => setShowProfile(true)}
                variant="ghost"
                size="sm"
                className="w-8 h-8 bg-[var(--dark-accent)] rounded-full p-0 hover:bg-[var(--spotify-green)]"
              >
                <User className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-6 py-8 pb-32">
          {/* Mood Selection */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">How are you feeling today?</h2>
            <MoodSelector selectedMood={selectedMood} onMoodSelect={setSelectedMood} />
          </section>

          {/* Generated Playlists */}
          <section className="mb-12">
            <PlaylistGrid selectedMood={selectedMood} />
          </section>

          {/* Recommendations */}
          <section className="mb-12">
            <Recommendations />
          </section>
        </div>
      </div>

      {/* Music Player */}
      <MusicPlayer />

      {/* Profile Modal */}
      <ProfileModal open={showProfile} onOpenChange={setShowProfile} />
    </>
  );
}
