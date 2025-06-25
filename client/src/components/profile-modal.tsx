import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import type { UserPreferences } from "@shared/schema";

interface ProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ProfileModal({ open, onOpenChange }: ProfileModalProps) {
  const { user } = useAuth();
  
  const { data: preferences } = useQuery<UserPreferences>({
    queryKey: ["/api/preferences"],
    retry: false,
    enabled: open && !!user,
  });

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const displayName = user ? 
    [user.firstName, user.lastName].filter(Boolean).join(' ') || 'User' : 
    'User';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[var(--dark-surface)] border-[var(--dark-accent)] text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Profile</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-20 h-20 bg-[var(--spotify-green)] rounded-full flex items-center justify-center mx-auto mb-4">
              {user?.profileImageUrl ? (
                <img 
                  src={user.profileImageUrl} 
                  alt="Profile" 
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-2xl font-bold text-white">
                  {displayName.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <h3 className="font-semibold text-lg">{displayName}</h3>
            <p className="text-[var(--text-secondary)]">{user?.email || 'No email provided'}</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Favorite Genres</label>
              <div className="flex flex-wrap gap-2">
                {preferences?.favoriteGenres && preferences.favoriteGenres.length > 0 ? (
                  preferences.favoriteGenres.map((genre, index) => (
                    <Badge 
                      key={index}
                      className="bg-[var(--spotify-green)] hover:bg-green-600 text-white"
                    >
                      {genre}
                    </Badge>
                  ))
                ) : (
                  <>
                    <Badge className="bg-[var(--spotify-green)] text-white">Pop</Badge>
                    <Badge className="bg-[var(--dark-accent)] text-white">Rock</Badge>
                    <Badge className="bg-[var(--dark-accent)] text-white">Electronic</Badge>
                  </>
                )}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Listening Activity</label>
              <p className="text-[var(--text-secondary)] text-sm">Active this week</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Spotify Connection</label>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-[var(--spotify-green)] rounded-full"></div>
                <span className="text-sm text-[var(--text-secondary)]">
                  {preferences?.spotifyConnected === "true" ? "Connected" : "Ready to connect"}
                </span>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <Button className="w-full bg-[var(--spotify-green)] hover:bg-green-600 text-white font-semibold">
              Edit Profile
            </Button>
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="w-full border-[var(--text-secondary)] text-[var(--text-secondary)] hover:text-white hover:border-white font-semibold"
            >
              Logout
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
