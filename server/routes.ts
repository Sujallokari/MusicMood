import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertPlaylistSchema, insertTrackSchema, insertUserPreferencesSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Playlist routes
  app.get('/api/playlists', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const playlists = await storage.getUserPlaylists(userId);
      res.json(playlists);
    } catch (error) {
      console.error("Error fetching playlists:", error);
      res.status(500).json({ message: "Failed to fetch playlists" });
    }
  });

  app.post('/api/playlists', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const playlistData = insertPlaylistSchema.parse({ ...req.body, userId });
      const playlist = await storage.createPlaylist(playlistData);
      res.json(playlist);
    } catch (error) {
      console.error("Error creating playlist:", error);
      res.status(400).json({ message: "Failed to create playlist" });
    }
  });

  app.get('/api/playlists/:id', isAuthenticated, async (req: any, res) => {
    try {
      const playlistId = parseInt(req.params.id);
      const playlist = await storage.getPlaylist(playlistId);
      if (!playlist) {
        return res.status(404).json({ message: "Playlist not found" });
      }
      res.json(playlist);
    } catch (error) {
      console.error("Error fetching playlist:", error);
      res.status(500).json({ message: "Failed to fetch playlist" });
    }
  });

  app.get('/api/playlists/:id/tracks', isAuthenticated, async (req: any, res) => {
    try {
      const playlistId = parseInt(req.params.id);
      const tracks = await storage.getPlaylistTracks(playlistId);
      res.json(tracks);
    } catch (error) {
      console.error("Error fetching playlist tracks:", error);
      res.status(500).json({ message: "Failed to fetch playlist tracks" });
    }
  });

  app.delete('/api/playlists/:id', isAuthenticated, async (req: any, res) => {
    try {
      const playlistId = parseInt(req.params.id);
      const deleted = await storage.deletePlaylist(playlistId);
      if (!deleted) {
        return res.status(404).json({ message: "Playlist not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting playlist:", error);
      res.status(500).json({ message: "Failed to delete playlist" });
    }
  });

  // Generate playlist based on mood
  app.post('/api/playlists/generate', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { mood, genres } = req.body;
      
      if (!mood) {
        return res.status(400).json({ message: "Mood is required" });
      }

      // Generate playlist name based on mood
      const moodNames: Record<string, string> = {
        happy: "Happy Vibes",
        chill: "Chill Beats",
        energetic: "Energy Boost",
        sad: "Melancholy Moments",
        focus: "Focus Flow",
        party: "Party Mix"
      };

      const playlistName = moodNames[mood] || `${mood.charAt(0).toUpperCase() + mood.slice(1)} Mix`;
      const description = `Generated playlist for your ${mood} mood`;

      // Create playlist
      const playlistData = insertPlaylistSchema.parse({
        userId,
        name: playlistName,
        description,
        mood,
        genres: genres || [],
        imageUrl: `https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400`,
        trackCount: 0
      });

      const playlist = await storage.createPlaylist(playlistData);
      
      // Generate sample tracks based on mood (in a real app, this would use Spotify API)
      const sampleTracks = await generateSampleTracks(mood, genres);
      
      // Add tracks to playlist
      for (let i = 0; i < sampleTracks.length; i++) {
        const track = await storage.createTrack(sampleTracks[i]);
        await storage.addTrackToPlaylist(playlist.id, track.id, i);
      }

      res.json(playlist);
    } catch (error) {
      console.error("Error generating playlist:", error);
      res.status(500).json({ message: "Failed to generate playlist" });
    }
  });

  // User preferences routes
  app.get('/api/preferences', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const preferences = await storage.getUserPreferences(userId);
      res.json(preferences);
    } catch (error) {
      console.error("Error fetching preferences:", error);
      res.status(500).json({ message: "Failed to fetch preferences" });
    }
  });

  app.post('/api/preferences', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const preferencesData = insertUserPreferencesSchema.parse({ ...req.body, userId });
      const preferences = await storage.upsertUserPreferences(preferencesData);
      res.json(preferences);
    } catch (error) {
      console.error("Error updating preferences:", error);
      res.status(400).json({ message: "Failed to update preferences" });
    }
  });

  // Recommendations route
  app.get('/api/recommendations', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const limit = parseInt(req.query.limit as string) || 10;
      const recommendations = await storage.getRecommendations(userId, limit);
      res.json(recommendations);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      res.status(500).json({ message: "Failed to fetch recommendations" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Helper function to generate sample tracks based on mood
async function generateSampleTracks(mood: string, genres: string[] = []) {
  const tracksByMood: Record<string, any[]> = {
    happy: [
      { name: "Blinding Lights", artist: "The Weeknd", album: "After Hours", duration: 200, genres: ["pop", "synthwave"] },
      { name: "Good 4 U", artist: "Olivia Rodrigo", album: "SOUR", duration: 178, genres: ["pop", "rock"] },
      { name: "Levitating", artist: "Dua Lipa", album: "Future Nostalgia", duration: 203, genres: ["pop", "disco"] },
      { name: "Stay", artist: "The Kid LAROI & Justin Bieber", album: "F*CK LOVE 3", duration: 141, genres: ["pop", "hip-hop"] }
    ],
    chill: [
      { name: "Lofi Study Beat #1", artist: "ChillHop Music", album: "Study Sessions", duration: 180, genres: ["lofi", "hip-hop"] },
      { name: "Sunset Drive", artist: "Synthwave Dreams", album: "Neon Nights", duration: 195, genres: ["synthwave", "electronic"] },
      { name: "Ocean Waves", artist: "Ambient Collective", album: "Nature Sounds", duration: 240, genres: ["ambient", "new age"] },
      { name: "Coffee Shop Jazz", artist: "Jazz Cafe", album: "Afternoon Sessions", duration: 165, genres: ["jazz", "instrumental"] }
    ],
    energetic: [
      { name: "Thunder", artist: "Imagine Dragons", album: "Evolve", duration: 187, genres: ["rock", "pop"] },
      { name: "Pump It Up", artist: "Electronic Energy", album: "Workout Hits", duration: 210, genres: ["electronic", "dance"] },
      { name: "Eye of the Tiger", artist: "Survivor", album: "Eye of the Tiger", duration: 245, genres: ["rock", "classic rock"] },
      { name: "Stronger", artist: "Kanye West", album: "Graduation", duration: 311, genres: ["hip-hop", "electronic"] }
    ],
    sad: [
      { name: "Someone Like You", artist: "Adele", album: "21", duration: 285, genres: ["pop", "ballad"] },
      { name: "Mad World", artist: "Gary Jules", album: "Trading Snakeoil for Wolftickets", duration: 193, genres: ["alternative", "indie"] },
      { name: "Hurt", artist: "Johnny Cash", album: "American IV: The Man Comes Around", duration: 218, genres: ["country", "alternative"] },
      { name: "Black", artist: "Pearl Jam", album: "Ten", duration: 343, genres: ["grunge", "rock"] }
    ],
    focus: [
      { name: "Weightless", artist: "Marconi Union", album: "Ambient Works", duration: 480, genres: ["ambient", "electronic"] },
      { name: "Deep Focus", artist: "Study Music Project", album: "Concentration", duration: 300, genres: ["ambient", "instrumental"] },
      { name: "White Noise Rain", artist: "Nature Sounds", album: "Focus Sessions", duration: 600, genres: ["ambient", "nature"] },
      { name: "Minimal Piano", artist: "Neo Classical", album: "Modern Minimalism", duration: 180, genres: ["classical", "minimalist"] }
    ],
    party: [
      { name: "Uptown Funk", artist: "Mark Ronson ft. Bruno Mars", album: "Uptown Special", duration: 269, genres: ["funk", "pop"] },
      { name: "Don't Stop Me Now", artist: "Queen", album: "Jazz", duration: 229, genres: ["rock", "pop"] },
      { name: "Dancing Queen", artist: "ABBA", album: "Arrival", duration: 230, genres: ["disco", "pop"] },
      { name: "I Gotta Feeling", artist: "The Black Eyed Peas", album: "The E.N.D.", duration: 285, genres: ["pop", "dance"] }
    ]
  };

  const baseTracks = tracksByMood[mood] || tracksByMood.happy;
  
  return baseTracks.map(track => ({
    ...track,
    spotifyId: `spotify_${Math.random().toString(36).substr(2, 9)}`,
    imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
    previewUrl: null
  }));
}
