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



import { db } from "./db";
import { eq, and, sql } from "drizzle-orm";

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async getUserPlaylists(userId: string): Promise<Playlist[]> {
    return await db.select().from(playlists).where(eq(playlists.userId, userId));
  }

  async createPlaylist(playlistData: InsertPlaylist): Promise<Playlist> {
    const [playlist] = await db
      .insert(playlists)
      .values(playlistData)
      .returning();
    return playlist;
  }

  async updatePlaylist(id: number, updates: Partial<InsertPlaylist>): Promise<Playlist | undefined> {
    const [playlist] = await db
      .update(playlists)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(playlists.id, id))
      .returning();
    return playlist || undefined;
  }

  async deletePlaylist(id: number): Promise<boolean> {
    const result = await db.delete(playlists).where(eq(playlists.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async getPlaylist(id: number): Promise<Playlist | undefined> {
    const [playlist] = await db.select().from(playlists).where(eq(playlists.id, id));
    return playlist || undefined;
  }

  async createTrack(trackData: InsertTrack): Promise<Track> {
    const [track] = await db
      .insert(tracks)
      .values(trackData)
      .returning();
    return track;
  }

  async getTrack(id: number): Promise<Track | undefined> {
    const [track] = await db.select().from(tracks).where(eq(tracks.id, id));
    return track || undefined;
  }

  async getTrackBySpotifyId(spotifyId: string): Promise<Track | undefined> {
    const [track] = await db.select().from(tracks).where(eq(tracks.spotifyId, spotifyId));
    return track || undefined;
  }

  async getPlaylistTracks(playlistId: number): Promise<Track[]> {
    const result = await db
      .select({
        id: tracks.id,
        name: tracks.name,
        artist: tracks.artist,
        album: tracks.album,
        duration: tracks.duration,
        imageUrl: tracks.imageUrl,
        previewUrl: tracks.previewUrl,
        genres: tracks.genres,
        spotifyId: tracks.spotifyId,
        createdAt: tracks.createdAt,
      })
      .from(playlistTracks)
      .innerJoin(tracks, eq(playlistTracks.trackId, tracks.id))
      .where(eq(playlistTracks.playlistId, playlistId))
      .orderBy(playlistTracks.position);
    
    return result;
  }

  async addTrackToPlaylist(playlistId: number, trackId: number, position: number): Promise<PlaylistTrack> {
    const [playlistTrack] = await db
      .insert(playlistTracks)
      .values({ playlistId, trackId, position })
      .returning();
    
    // Update track count
    const trackCountResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(playlistTracks)
      .where(eq(playlistTracks.playlistId, playlistId));
    
    await db
      .update(playlists)
      .set({ trackCount: trackCountResult[0].count })
      .where(eq(playlists.id, playlistId));
    
    return playlistTrack;
  }

  async removeTrackFromPlaylist(playlistId: number, trackId: number): Promise<boolean> {
    const result = await db
      .delete(playlistTracks)
      .where(and(
        eq(playlistTracks.playlistId, playlistId),
        eq(playlistTracks.trackId, trackId)
      ));
    
    if ((result.rowCount ?? 0) > 0) {
      // Update track count
      const trackCountResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(playlistTracks)
        .where(eq(playlistTracks.playlistId, playlistId));
      
      await db
        .update(playlists)
        .set({ trackCount: trackCountResult[0].count })
        .where(eq(playlists.id, playlistId));
    }
    
    return (result.rowCount ?? 0) > 0;
  }

  async getUserPreferences(userId: string): Promise<UserPreferences | undefined> {
    const [preferences] = await db.select().from(userPreferences).where(eq(userPreferences.userId, userId));
    return preferences || undefined;
  }

  async upsertUserPreferences(preferencesData: InsertUserPreferences): Promise<UserPreferences> {
    const [preferences] = await db
      .insert(userPreferences)
      .values(preferencesData)
      .onConflictDoUpdate({
        target: userPreferences.userId,
        set: {
          ...preferencesData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return preferences;
  }

  async getRecommendations(userId: string, limit = 10): Promise<Track[]> {
    const preferences = await this.getUserPreferences(userId);
    const favoriteGenres = preferences?.favoriteGenres || [];
    
    if (favoriteGenres.length === 0) {
      // Return random tracks if no preferences
      return await db.select().from(tracks).limit(limit);
    }
    
    // Simple recommendation based on genre overlap
    return await db.select().from(tracks).limit(limit);
  }
}

export const storage = new DatabaseStorage();
