import { useState } from "react";
import { useRiskStore } from "../store/riskStore";
import FilterBar from "../components/risk/FilterBar";
import TransactionTable from "../components/risk/TransactionTable";
import TransactionDrawer from "../components/risk/TransactionDrawer";
import RiskHeatmap from "../components/risk/RiskHeatmap";
import { AlertTriangle, CheckCircle, Clock, Activity, ShieldAlert, ChevronDown, ChevronUp } from "lucide-react";

export default function RiskPage() {
  const { transactions } = useRiskStore();
  const [showRules, setShowRules] = useState(false);

  const stats = {
    total: transactions.length,
    flagged: transactions.filter((t) => t.status === "flagged").length,
    clear: transactions.filter((t) => t.status === "clear").length,
    review: transactions.filter((t) => t.status === "review").length,
  };

  const Sparkline = ({ points, colorClass }: { points: number[]; colorClass: string }) => {
    const min = Math.min(...points);
    const max = Math.max(...points);
    const range = max - min || 1;
    
    const pointsStr = points.map((p, i) => {
      const x = (i / (points.length - 1)) * 100;
      const y = 30 - ((p - min) / range) * 26 - 2;
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

  // Compute stat sums
  const totalVolume = transactions.reduce((sum, t) => sum + t.amount, 0);
  const atRiskVolume = transactions.filter(t => t.status === "flagged").reduce((sum, t) => sum + t.amount, 0);
  const suspiciousRate = ((transactions.filter(t => t.status !== "clear").length / transactions.length) * 100).toFixed(1);

  const statCards = [
    { 
      title: "Deposits Processed", 
      value: `₹${(totalVolume / 1000).toFixed(0)}k`, 
      icon: Activity, 
      bg: "bg-gray-100", 
      color: "text-gray-600",
      points: [20, 22, 19, 24, 21, 23, 25],
      sparklineColor: "text-gray-400",
      delta: `${stats.total} bookings total`,
      deltaColor: "text-gray-500"
    },
    { 
      title: "At-Risk Deposits", 
      value: `₹${(atRiskVolume / 1000).toFixed(0)}k`, 
      icon: AlertTriangle, 
      bg: "bg-red-100", 
      color: "text-red-600",
      points: [2, 3, 3, 5, 4, 7, 8],
      sparklineColor: "text-red-500",
      delta: `${stats.flagged} events flagged`,
      deltaColor: "text-red-600"
    },
    { 
      title: "Suspicious Listing Rate", 
      value: `${suspiciousRate}%`, 
      icon: Clock, 
      bg: "bg-yellow-100", 
      color: "text-yellow-600",
      points: [5, 4, 5, 5, 4, 6, 5],
      sparklineColor: "text-yellow-500",
      delta: `${stats.review} items in review`,
      deltaColor: "text-yellow-600"
    },
    { 
      title: "Cleared Accounts", 
      value: stats.clear, 
      icon: CheckCircle, 
      bg: "bg-green-100", 
      color: "text-green-600",
      points: [12, 10, 8, 5, 4, 4, 3],
      sparklineColor: "text-green-500",
      delta: "Approved onboarding",
      deltaColor: "text-green-600"
    },
  ];

  const rules = [
    { rule: "IF duplicate_listing_images >= 2", effect: "THEN add_risk_score(30)", details: "Triggers reverse stock lookup check" },
    { rule: "IF bank_account_changed_within_hours_of_payout <= 24", effect: "THEN add_risk_score(25)", details: "Detects possible account hijackers" },
    { rule: "IF deposits_collected_for_overlapping_dates >= 2", effect: "THEN add_risk_score(35)", details: "Flagged double renting scams" },
    { rule: "IF owner_name != property_document_name", effect: "THEN add_risk_score(30)", details: "Identifies deed signature anomalies" },
    { rule: "IF listing_price_below_local_median >= 35%", effect: "THEN add_risk_score(15)", details: "Flags clickbait or bait listings" },
  ];

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-[22px] font-medium tracking-tight text-black">Rental Fraud Control Center</h1>
          <p className="text-[13px] text-secondary mt-1">
            Trust and Safety risk operations hub monitoring owner onboarding, listings, and payout streams.
          </p>
        </div>
        
        {/* Rules Engine Button */}
        <button
          onClick={() => setShowRules(!showRules)}
          className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-[13px] font-medium text-black transition-colors"
        >
          <ShieldAlert className="w-4 h-4 text-red-600" />
          <span>Active Rules Engine</span>
          {showRules ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Rules Engine Panel */}
      {showRules && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-8 animate-slide-in-row">
          <h3 className="text-[14px] font-bold text-black mb-3">DeepShield Score Engine Weights (v1.2)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rules.map((r, i) => (
              <div key={i} className="bg-white border border-gray-100 p-4 rounded-lg shadow-sm">
                <p className="text-[12px] font-semibold text-red-600 font-mono">{r.rule}</p>
                <p className="text-[12px] font-bold text-black font-mono mt-1">{r.effect}</p>
                <p className="text-[11px] text-gray-500 mt-2">{r.details}</p>
              </div>
            ))}
          </div>
        </div>
      )}

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
