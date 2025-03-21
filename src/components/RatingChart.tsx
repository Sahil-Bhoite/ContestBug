
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface RatingDataPoint {
  date: string;
  rating: number;
}

interface RatingChartProps {
  data: RatingDataPoint[];
  theme?: "light" | "dark";
  platform?: "Codeforces" | "LeetCode" | "CodeChef";
  currentRating?: number;
  tier?: string;
}

export const RatingChart = ({ data, theme = "dark", platform = "Codeforces", currentRating, tier }: RatingChartProps) => {
  // Format date for display in tooltip
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  };

  // Get color based on platform
  const getColor = () => {
    switch (platform) {
      case "Codeforces":
        return "#ef4444";
      case "LeetCode":
        return "#eab308";
      case "CodeChef":
        return "#22c55e";
      default:
        return "#3b82f6";
    }
  };

  const color = getColor();
  
  // Get minimum and maximum rating to set appropriate Y-axis domain
  const minRating = Math.min(...data.map(d => d.rating)) - 100;
  const maxRating = Math.max(...data.map(d => d.rating)) + 100;
  
  // Determine rating tier and color
  const getCurrentRating = () => {
    if (currentRating && tier) {
      return { rating: currentRating, tier };
    }
    
    if (data.length === 0) return { rating: 0, tier: "Unrated" };
    
    const latestRating = data[data.length - 1].rating;
    let calculatedTier = "";
    
    if (platform === "Codeforces") {
      if (latestRating < 1200) calculatedTier = "Newbie";
      else if (latestRating < 1400) calculatedTier = "Pupil";
      else if (latestRating < 1600) calculatedTier = "Specialist";
      else if (latestRating < 1900) calculatedTier = "Expert";
      else if (latestRating < 2100) calculatedTier = "Candidate Master";
      else if (latestRating < 2400) calculatedTier = "Master";
      else calculatedTier = "Grandmaster";
    } else if (platform === "LeetCode") {
      if (latestRating < 1500) calculatedTier = "Beginner";
      else if (latestRating < 1800) calculatedTier = "Intermediate";
      else if (latestRating < 2100) calculatedTier = "Advanced";
      else calculatedTier = "Expert";
    } else {
      if (latestRating < 1400) calculatedTier = "1★";
      else if (latestRating < 1600) calculatedTier = "2★";
      else if (latestRating < 1800) calculatedTier = "3★";
      else if (latestRating < 2000) calculatedTier = "4★";
      else if (latestRating < 2200) calculatedTier = "5★";
      else if (latestRating < 2500) calculatedTier = "6★";
      else calculatedTier = "7★";
    }
    
    return { rating: latestRating, tier: calculatedTier };
  };
  
  const { rating, tier: displayTier } = getCurrentRating();
  
  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className={`px-3 py-2 rounded shadow-md ${theme === "dark" ? "bg-zinc-800 border border-zinc-700" : "bg-white border border-zinc-200"}`}>
          <p className="text-sm font-medium">{formatDate(label)}</p>
          <p className="text-sm" style={{ color }}>
            Rating: <span className="font-semibold">{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className={`p-4 rounded-lg border ${theme === "dark" ? "border-zinc-700 bg-zinc-800/50" : "border-zinc-200 bg-zinc-50"} transition-all duration-200 hover:shadow-md`}>
      <div className="flex justify-between items-center mb-4">
        <div>
          <p className={`text-sm ${theme === "dark" ? "text-zinc-400" : "text-zinc-500"}`}>Current Rating</p>
          <p className="text-xl font-semibold" style={{ color }}>{rating}</p>
        </div>
        <div>
          <p className={`text-sm ${theme === "dark" ? "text-zinc-400" : "text-zinc-500"}`}>Tier</p>
          <p className="text-xl font-semibold" style={{ color }}>{displayTier}</p>
        </div>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 5, bottom: 5, left: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={theme === "dark" ? "#3f3f46" : "#e4e4e7"} />
            <XAxis 
              dataKey="date" 
              tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short' })}
              stroke={theme === "dark" ? "#a1a1aa" : "#71717a"}
            />
            <YAxis 
              domain={[minRating, maxRating]} 
              stroke={theme === "dark" ? "#a1a1aa" : "#71717a"}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="rating" 
              stroke={color} 
              strokeWidth={2}
              dot={{ r: 4, fill: color, strokeWidth: 1, stroke: theme === "dark" ? "#27272a" : "#ffffff" }}
              activeDot={{ r: 6, fill: color, strokeWidth: 1, stroke: theme === "dark" ? "#27272a" : "#ffffff" }}
              animationDuration={1500}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
