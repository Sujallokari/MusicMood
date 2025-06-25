import { useState } from "react";
import { 
  Heart, 
  Shuffle, 
  SkipBack, 
  Play, 
  Pause, 
  SkipForward, 
  Repeat, 
  List, 
  Monitor, 
  Volume2 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(84); // 1:24 in seconds
  const [duration] = useState(200); // 3:20 in seconds
  const [volume, setVolume] = useState([75]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, '0')}`;
  };

  const progress = (currentTime / duration) * 100;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[var(--dark-surface)] border-t border-[var(--dark-accent)] p-4 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Current Track Info */}
        <div className="flex items-center space-x-4 flex-1">
          <img
            src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=56&h=56"
            alt="Currently playing track"
            className="w-14 h-14 rounded-lg object-cover"
          />
          <div>
            <h4 className="font-medium">Blinding Lights</h4>
            <p className="text-[var(--text-secondary)] text-sm">The Weeknd</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-[var(--text-secondary)] hover:text-[var(--spotify-green)] p-0"
          >
            <Heart className="w-4 h-4" />
          </Button>
        </div>

        {/* Player Controls */}
        <div className="flex-1 max-w-md mx-8">
          <div className="flex items-center justify-center space-x-4 mb-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-[var(--text-secondary)] hover:text-white p-0"
            >
              <Shuffle className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-[var(--text-secondary)] hover:text-white p-0"
            >
              <SkipBack className="w-4 h-4" />
            </Button>
            <Button
              onClick={() => setIsPlaying(!isPlaying)}
              className="bg-white text-black hover:scale-105 w-10 h-10 p-0 rounded-full transition-transform"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-[var(--text-secondary)] hover:text-white p-0"
            >
              <SkipForward className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-[var(--text-secondary)] hover:text-white p-0"
            >
              <Repeat className="w-4 h-4" />
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center space-x-2 text-xs text-[var(--text-secondary)]">
            <span>{formatTime(currentTime)}</span>
            <div className="flex-1 bg-[var(--dark-accent)] rounded-full h-1 relative">
              <div 
                className="bg-white h-1 rounded-full transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Additional Controls */}
        <div className="flex items-center space-x-4 flex-1 justify-end">
          <Button
            variant="ghost"
            size="sm"
            className="text-[var(--text-secondary)] hover:text-white p-0"
          >
            <List className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-[var(--text-secondary)] hover:text-white p-0"
          >
            <Monitor className="w-4 h-4" />
          </Button>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-[var(--text-secondary)] hover:text-white p-0"
            >
              <Volume2 className="w-4 h-4" />
            </Button>
            <div className="w-20">
              <Slider
                value={volume}
                onValueChange={setVolume}
                max={100}
                step={1}
                className="cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
