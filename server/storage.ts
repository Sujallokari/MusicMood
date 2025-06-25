import {
  users,
  playlists,
  tracks,
  playlistTracks,
  userPreferences,
  type User,
  type UpsertUser,
  type Playlist,
  type InsertPlaylist,
  type Track,
  type InsertTrack,
  type PlaylistTrack,
  type UserPreferences,
  type InsertUserPreferences,
} from "@shared/schema";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Playlist operations
  getUserPlaylists(userId: string): Promise<Playlist[]>;
  createPlaylist(playlist: InsertPlaylist): Promise<Playlist>;
  updatePlaylist(id: number, updates: Partial<InsertPlaylist>): Promise<Playlist | undefined>;
  deletePlaylist(id: number): Promise<boolean>;
  getPlaylist(id: number): Promise<Playlist | undefined>;
  
  // Track operations
  createTrack(track: InsertTrack): Promise<Track>;
  getTrack(id: number): Promise<Track | undefined>;
  getTrackBySpotifyId(spotifyId: string): Promise<Track | undefined>;
  getPlaylistTracks(playlistId: number): Promise<Track[]>;
  addTrackToPlaylist(playlistId: number, trackId: number, position: number): Promise<PlaylistTrack>;
  removeTrackFromPlaylist(playlistId: number, trackId: number): Promise<boolean>;
  
  // User preferences
  getUserPreferences(userId: string): Promise<UserPreferences | undefined>;
  upsertUserPreferences(preferences: InsertUserPreferences): Promise<UserPreferences>;
  
  // Recommendations
  getRecommendations(userId: string, limit?: number): Promise<Track[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private playlists: Map<number, Playlist> = new Map();
  private tracks: Map<number, Track> = new Map();
  private playlistTracks: Map<string, PlaylistTrack> = new Map(); // key: `${playlistId}-${trackId}`
  private userPreferences: Map<string, UserPreferences> = new Map();
  private tracksBySpotifyId: Map<string, Track> = new Map();
  
  private currentPlaylistId = 1;
  private currentTrackId = 1;
  private currentPreferencesId = 1;
  private currentPlaylistTrackId = 1;

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const existingUser = this.users.get(userData.id);
    const user: User = {
      ...userData,
      email: userData.email ?? null,
      firstName: userData.firstName ?? null,
      lastName: userData.lastName ?? null,
      profileImageUrl: userData.profileImageUrl ?? null,
      createdAt: existingUser?.createdAt || new Date(),
      updatedAt: new Date(),
    };
    this.users.set(userData.id, user);
    return user;
  }

  // Playlist operations
  async getUserPlaylists(userId: string): Promise<Playlist[]> {
    return Array.from(this.playlists.values()).filter(p => p.userId === userId);
  }

  async createPlaylist(playlistData: InsertPlaylist): Promise<Playlist> {
    const id = this.currentPlaylistId++;
    const playlist: Playlist = {
      ...playlistData,
      id,
      description: playlistData.description ?? null,
      mood: playlistData.mood ?? null,
      genres: playlistData.genres ?? null,
      imageUrl: playlistData.imageUrl ?? null,
      trackCount: playlistData.trackCount ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.playlists.set(id, playlist);
    return playlist;
  }

  async updatePlaylist(id: number, updates: Partial<InsertPlaylist>): Promise<Playlist | undefined> {
    const playlist = this.playlists.get(id);
    if (!playlist) return undefined;
    
    const updatedPlaylist: Playlist = {
      ...playlist,
      ...updates,
      updatedAt: new Date(),
    };
    this.playlists.set(id, updatedPlaylist);
    return updatedPlaylist;
  }

  async deletePlaylist(id: number): Promise<boolean> {
    return this.playlists.delete(id);
  }

  async getPlaylist(id: number): Promise<Playlist | undefined> {
    return this.playlists.get(id);
  }

  // Track operations
  async createTrack(trackData: InsertTrack): Promise<Track> {
    const id = this.currentTrackId++;
    const track: Track = {
      ...trackData,
      id,
      spotifyId: trackData.spotifyId ?? null,
      album: trackData.album ?? null,
      duration: trackData.duration ?? null,
      imageUrl: trackData.imageUrl ?? null,
      previewUrl: trackData.previewUrl ?? null,
      genres: trackData.genres ?? null,
      createdAt: new Date(),
    };
    this.tracks.set(id, track);
    if (track.spotifyId) {
      this.tracksBySpotifyId.set(track.spotifyId, track);
    }
    return track;
  }

  async getTrack(id: number): Promise<Track | undefined> {
    return this.tracks.get(id);
  }

  async getTrackBySpotifyId(spotifyId: string): Promise<Track | undefined> {
    return this.tracksBySpotifyId.get(spotifyId);
  }

  async getPlaylistTracks(playlistId: number): Promise<Track[]> {
    const playlistTrackEntries = Array.from(this.playlistTracks.values())
      .filter(pt => pt.playlistId === playlistId)
      .sort((a, b) => a.position - b.position);
    
    const tracks: Track[] = [];
    for (const pt of playlistTrackEntries) {
      const track = this.tracks.get(pt.trackId);
      if (track) {
        tracks.push(track);
      }
    }
    return tracks;
  }

  async addTrackToPlaylist(playlistId: number, trackId: number, position: number): Promise<PlaylistTrack> {
    const id = this.currentPlaylistTrackId++;
    const playlistTrack: PlaylistTrack = {
      id,
      playlistId,
      trackId,
      position,
      createdAt: new Date(),
    };
    this.playlistTracks.set(`${playlistId}-${trackId}`, playlistTrack);
    
    // Update track count
    const playlist = this.playlists.get(playlistId);
    if (playlist) {
      const updatedPlaylist = { ...playlist, trackCount: (playlist.trackCount || 0) + 1 };
      this.playlists.set(playlistId, updatedPlaylist);
    }
    
    return playlistTrack;
  }

  async removeTrackFromPlaylist(playlistId: number, trackId: number): Promise<boolean> {
    const deleted = this.playlistTracks.delete(`${playlistId}-${trackId}`);
    
    if (deleted) {
      // Update track count
      const playlist = this.playlists.get(playlistId);
      if (playlist) {
        const updatedPlaylist = { ...playlist, trackCount: Math.max(0, (playlist.trackCount || 0) - 1) };
        this.playlists.set(playlistId, updatedPlaylist);
      }
    }
    
    return deleted;
  }

  // User preferences
  async getUserPreferences(userId: string): Promise<UserPreferences | undefined> {
    return this.userPreferences.get(userId);
  }

  async upsertUserPreferences(preferencesData: InsertUserPreferences): Promise<UserPreferences> {
    const existing = this.userPreferences.get(preferencesData.userId);
    const id = existing?.id || this.currentPreferencesId++;
    const preferences: UserPreferences = {
      ...preferencesData,
      id,
      favoriteGenres: preferencesData.favoriteGenres ?? null,
      spotifyConnected: preferencesData.spotifyConnected ?? null,
      spotifyUserId: preferencesData.spotifyUserId ?? null,
      createdAt: existing?.createdAt || new Date(),
      updatedAt: new Date(),
    };
    this.userPreferences.set(preferencesData.userId, preferences);
    return preferences;
  }

  // Recommendations (simple algorithm based on user's favorite genres)
  async getRecommendations(userId: string, limit = 10): Promise<Track[]> {
    const preferences = this.userPreferences.get(userId);
    const favoriteGenres = preferences?.favoriteGenres || [];
    
    if (favoriteGenres.length === 0) {
      // Return random tracks if no preferences
      return Array.from(this.tracks.values()).slice(0, limit);
    }
    
    // Filter tracks by favorite genres
    const recommendedTracks = Array.from(this.tracks.values())
      .filter(track => 
        track.genres?.some(genre => 
          favoriteGenres.some(favGenre => 
            genre.toLowerCase().includes(favGenre.toLowerCase())
          )
        )
      )
      .slice(0, limit);
    
    // Fill with random tracks if not enough recommendations
    if (recommendedTracks.length < limit) {
      const remainingTracks = Array.from(this.tracks.values())
        .filter(track => !recommendedTracks.includes(track))
        .slice(0, limit - recommendedTracks.length);
      recommendedTracks.push(...remainingTracks);
    }
    
    return recommendedTracks;
  }
}

export const storage = new MemStorage();
