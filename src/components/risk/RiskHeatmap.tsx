import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

// Generate 7 days x 24 hours of mock data with realistic patterns
const generateData = () => {
  const data = [];
  for (let d = 0; d < 7; d++) {
    const dayData = [];
    for (let h = 0; h < 24; h++) {
      // More activity during day (10am - 6pm)
      const score = (h >= 10 && h <= 18)
        ? Math.floor(Math.random() * 5) + 1 + (Math.random() > 0.8 ? 2 : 0)
        : Math.floor(Math.random() * 3);
      dayData.push(score);
    }
    data.push(dayData);
  }
  return data;
};

const STATIC_HEATMAP_DATA = generateData();

export default function RiskHeatmap() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [heatmapData] = useState(STATIC_HEATMAP_DATA);

  const getColor = (val: number) => {
    if (val === 0) return "bg-gray-100";
    if (val <= 2) return "bg-yellow-100";
    if (val <= 5) return "bg-yellow-300";
    return "bg-red-500";
  };

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-6 mb-6">
      <div 
        className="px-6 py-4 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="text-[14px] font-medium text-black">Transaction activity heatmap — last 7 days</h3>
        {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
      </div>
      
      {isExpanded && (
        <div className="p-6 border-t border-gray-100 animate-slide-in-row">
          <div className="flex">
            <div className="flex flex-col gap-[3px] pr-3 pt-[20px]">
              {days.map(d => <span key={d} className="text-[10px] text-gray-400 uppercase tracking-widest leading-[18px]">{d}</span>)}
            </div>
            
            <div className="flex-1 overflow-x-auto">
              <div className="flex gap-[3px] mb-2 pl-1">
                {[0, 6, 12, 18, 23].map((h, i) => (
                  <div key={h} className="text-[10px] text-gray-400" style={{ width: i === 4 ? "auto" : "25%" }}>
                    {h}:00
                  </div>
                ))}
              </div>
              
              <div className="flex flex-col gap-[3px]">
                {heatmapData.map((day, dIdx) => (
                  <div key={dIdx} className="flex gap-[3px]">
                    {day.map((val, hIdx) => (
                      <div 
                        key={hIdx} 
                        className={`h-[18px] flex-1 rounded-[2px] ${getColor(val)} transition-colors hover:ring-1 hover:ring-black cursor-crosshair`}
                        title={`${days[dIdx]} ${hIdx}:00 - ${val} transactions`}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex items-center gap-4">
            <span className="text-[11px] text-gray-500 uppercase tracking-widest">Legend</span>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-[2px] bg-gray-100" /> <span className="text-[11px] text-gray-500">None</span></div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-[2px] bg-yellow-100" /> <span className="text-[11px] text-gray-500">Low</span></div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-[2px] bg-yellow-300" /> <span className="text-[11px] text-gray-500">Medium</span></div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-[2px] bg-red-500" /> <span className="text-[11px] text-gray-500">High</span></div>
          </div>
        </div>
      )}
    </div>
  );
}
