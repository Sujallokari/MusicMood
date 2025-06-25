import { Smile, Leaf, Zap, CloudRain, Brain, Music } from "lucide-react";

interface MoodSelectorProps {
  selectedMood: string;
  onMoodSelect: (mood: string) => void;
}

const moods = [
  { id: "happy", name: "Happy", icon: Smile, gradient: "from-yellow-400 to-orange-500" },
  { id: "chill", name: "Chill", icon: Leaf, gradient: "from-blue-400 to-purple-500" },
  { id: "energetic", name: "Energetic", icon: Zap, gradient: "from-red-400 to-pink-500" },
  { id: "sad", name: "Melancholy", icon: CloudRain, gradient: "from-gray-400 to-blue-600" },
  { id: "focus", name: "Focus", icon: Brain, gradient: "from-green-400 to-teal-500" },
  { id: "party", name: "Party", icon: Music, gradient: "from-purple-400 to-pink-600" },
];

export default function MoodSelector({ selectedMood, onMoodSelect }: MoodSelectorProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {moods.map((mood) => {
        const Icon = mood.icon;
        return (
          <button
            key={mood.id}
            onClick={() => onMoodSelect(mood.id)}
            className={`mood-card bg-gradient-to-br ${mood.gradient} p-6 rounded-lg text-center hover:scale-105 transition-transform duration-200 ${
              selectedMood === mood.id ? "ring-2 ring-white" : ""
            }`}
          >
            <Icon className="w-8 h-8 mx-auto mb-2" />
            <span className="block font-semibold text-white">{mood.name}</span>
          </button>
        );
      })}
    </div>
  );
}
