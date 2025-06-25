import { Heart, Sparkles, Music } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Landing() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--dark-bg)] via-[var(--dark-surface)] to-[var(--dark-bg)]">
      <div className="text-center max-w-2xl mx-auto px-6">
        <div className="mb-8">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-[var(--spotify-green)] to-green-400 bg-clip-text text-transparent">
            VibeStream
          </h1>
          <p className="text-xl text-[var(--text-secondary)] mb-8">
            Discover your perfect soundtrack. Generate personalized playlists based on your mood and taste.
          </p>
        </div>
        
        <div className="space-y-4 max-w-md mx-auto">
          <Button 
            onClick={() => window.location.href = '/api/login'}
            className="w-full bg-[var(--spotify-green)] hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-full transition-colors duration-200"
          >
            Get Started
          </Button>
          <Button 
            onClick={() => window.location.href = '/api/login'}
            variant="outline"
            className="w-full border-[var(--text-secondary)] text-[var(--text-secondary)] hover:text-white hover:border-white font-semibold py-3 px-6 rounded-full transition-colors duration-200"
          >
            Sign Up
          </Button>
        </div>
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6 bg-[var(--dark-surface)] rounded-lg">
            <Heart className="text-[var(--spotify-green)] w-8 h-8 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Mood-Based</h3>
            <p className="text-[var(--text-secondary)] text-sm">Playlists that match your current vibe</p>
          </div>
          <div className="p-6 bg-[var(--dark-surface)] rounded-lg">
            <Sparkles className="text-[var(--spotify-green)] w-8 h-8 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">AI-Powered</h3>
            <p className="text-[var(--text-secondary)] text-sm">Smart recommendations just for you</p>
          </div>
          <div className="p-6 bg-[var(--dark-surface)] rounded-lg">
            <Music className="text-[var(--spotify-green)] w-8 h-8 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Spotify Integration</h3>
            <p className="text-[var(--text-secondary)] text-sm">Seamless playback experience</p>
          </div>
        </div>
      </div>
    </div>
  );
}
