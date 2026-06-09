import { useRiskStore } from "../store/riskStore";
import FilterBar from "../components/risk/FilterBar";
import TransactionTable from "../components/risk/TransactionTable";
import TransactionDrawer from "../components/risk/TransactionDrawer";
import RiskHeatmap from "../components/risk/RiskHeatmap";
import { AlertTriangle, CheckCircle, Clock, Activity } from "lucide-react";

export default function RiskPage() {
  const { transactions } = useRiskStore();

  const stats = {
    total: transactions.length,
    flagged: transactions.filter((t) => t.status === "flagged").length,
    clear: transactions.filter((t) => t.status === "clear").length,
    review: transactions.filter((t) => t.status === "review").length,
  };

  const Sparkline = ({ points, colorClass }: { points: number[], colorClass: string }) => {
    const min = Math.min(...points);
    const max = Math.max(...points);
    const range = max - min || 1;
    
    // SVG viewBox is 100x30
    const pointsStr = points.map((p, i) => {
      const x = (i / (points.length - 1)) * 100;
      const y = 30 - ((p - min) / range) * 26 - 2; // Keep within bounds
      return `${x},${y}`;
    }).join(" ");

    return (
      <svg viewBox="0 0 100 30" className="w-16 h-8 overflow-visible">
        <polyline 
          points={pointsStr} 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={colorClass} 
        />
      </svg>
    );
  };

  const statCards = [
    { 
      title: "Total Transactions", 
      value: stats.total, 
      icon: Activity, 
      bg: "bg-gray-100", 
      color: "text-gray-600",
      points: [20, 22, 19, 24, 21, 23, 25],
      sparklineColor: "text-gray-400",
      delta: "+12 today",
      deltaColor: "text-gray-500"
    },
    { 
      title: "Flagged (High Risk)", 
      value: stats.flagged, 
      icon: AlertTriangle, 
      bg: "bg-red-100", 
      color: "text-red-600",
      points: [2, 3, 3, 5, 4, 7, 8],
      sparklineColor: "text-red-500",
      delta: "+3 today",
      deltaColor: "text-red-600"
    },
    { 
      title: "Pending Review", 
      value: stats.review, 
      icon: Clock, 
      bg: "bg-yellow-100", 
      color: "text-yellow-600",
      points: [5, 4, 5, 5, 4, 6, 5],
      sparklineColor: "text-yellow-500",
      delta: "Unchanged",
      deltaColor: "text-yellow-600"
    },
    { 
      title: "Cleared", 
      value: stats.clear, 
      icon: CheckCircle, 
      bg: "bg-green-100", 
      color: "text-green-600",
      points: [12, 10, 8, 5, 4, 4, 3],
      sparklineColor: "text-green-500",
      delta: "-2 today",
      deltaColor: "text-green-600"
    },
  ];

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-[22px] font-medium tracking-tight text-black">Risk Monitor</h1>
        <p className="text-[13px] text-secondary mt-1">
          Real-time transaction monitoring and risk analysis dashboard.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg ${stat.bg}`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <Sparkline points={stat.points} colorClass={stat.sparklineColor} />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-widest text-secondary font-medium mb-1">{stat.title}</p>
                <div className="flex items-end gap-3">
                  <p className="text-3xl font-semibold tracking-tight text-black leading-none">{stat.value}</p>
                  <p className={`text-[11px] font-medium mb-0.5 ${stat.deltaColor}`}>{stat.delta}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <RiskHeatmap />
      <FilterBar />
      <TransactionTable />
      <TransactionDrawer />
    </div>
  );
}
