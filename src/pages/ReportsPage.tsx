import { Activity, ShieldAlert, Clock, TrendingUp, Users, CheckCircle, XCircle } from "lucide-react";

export default function ReportsPage() {
  const kpis = [
    { title: "Total Verifications", value: "14,209", trend: "+12.5%", isPositive: true, icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
    { title: "Fraud Prevented Value", value: "₹4.2M", trend: "+8.2%", isPositive: true, icon: ShieldAlert, color: "text-green-600", bg: "bg-green-100" },
    { title: "Average Review Time", value: "1.4 hrs", trend: "-15%", isPositive: true, icon: Clock, color: "text-purple-600", bg: "bg-purple-100" },
    { title: "False Positive Rate", value: "2.1%", trend: "+0.4%", isPositive: false, icon: Activity, color: "text-red-600", bg: "bg-red-100" },
  ];

  const fraudTypes = [
    { type: "Duplicate Listings", count: 845, percentage: 42, color: "bg-red-500" },
    { type: "Fake Identity Documents", count: 420, percentage: 21, color: "bg-orange-500" },
    { type: "Account Takeover", count: 350, percentage: 17, color: "bg-yellow-500" },
    { type: "Bait & Switch Pricing", count: 285, percentage: 14, color: "bg-pink-500" },
    { type: "Other", count: 120, percentage: 6, color: "bg-gray-300" },
  ];

  const recentActivity = [
    { id: "REV-1049", user: "Rahul Verma", action: "Approved Onboarding", time: "10 mins ago", status: "success" },
    { id: "REV-1048", user: "System", action: "Flagged Listing (Rule #4)", time: "25 mins ago", status: "warning" },
    { id: "REV-1047", user: "Anita Sharma", action: "Rejected Identity Document", time: "1 hr ago", status: "error" },
    { id: "REV-1046", user: "Rahul Verma", action: "Approved Payout Transfer", time: "2 hrs ago", status: "success" },
    { id: "REV-1045", user: "System", action: "Blocked IP Range", time: "3 hrs ago", status: "error" },
  ];

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto animate-fade-in">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-[22px] font-medium tracking-tight text-black">Reports & Analytics</h1>
          <p className="text-[13px] text-secondary mt-1">
            Performance metrics and fraud detection insights for the last 30 days.
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-[13px] font-medium hover:bg-gray-50 transition-colors">
          <TrendingUp className="w-4 h-4 text-gray-500" />
          Export CSV
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg ${kpi.bg}`}>
                  <Icon className={`w-5 h-5 ${kpi.color}`} />
                </div>
                <span className={`text-[12px] font-semibold px-2 py-1 rounded-full ${
                  kpi.isPositive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                }`}>
                  {kpi.trend}
                </span>
              </div>
              <div>
                <p className="text-3xl font-semibold tracking-tight text-black leading-none mb-1">{kpi.value}</p>
                <p className="text-[12px] text-secondary font-medium">{kpi.title}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Fraud Types Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-[15px] font-semibold text-black mb-6">Fraud Types Detected</h2>
          
          {/* Custom CSS Horizontal Bar Chart */}
          <div className="space-y-5">
            {fraudTypes.map((item, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-end mb-1.5">
                  <span className="text-[13px] font-medium text-gray-700">{item.type}</span>
                  <div className="text-right">
                    <span className="text-[13px] font-bold text-black">{item.count}</span>
                    <span className="text-[11px] text-gray-400 ml-2">({item.percentage}%)</span>
                  </div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-2 rounded-full ${item.color} transition-all duration-1000 ease-out`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-[15px] font-semibold text-black">Recent Activity</h2>
            <button className="text-[12px] text-blue-600 font-medium hover:underline">View All</button>
          </div>
          
          <div className="space-y-0 relative">
            {/* Connecting line */}
            <div className="absolute left-[10px] top-4 bottom-4 w-px bg-gray-200 z-0" />
            
            {recentActivity.map((activity, idx) => (
              <div key={idx} className="relative flex items-start gap-3 py-3 group">
                <div className="bg-white relative z-10 shrink-0 mt-0.5">
                  {activity.status === 'success' && <CheckCircle className="w-5 h-5 text-green-500" />}
                  {activity.status === 'error' && <XCircle className="w-5 h-5 text-red-500" />}
                  {activity.status === 'warning' && <ShieldAlert className="w-5 h-5 text-yellow-500" />}
                </div>
                <div className="flex-1">
                  <p className="text-[13px] text-black font-medium leading-snug">
                    {activity.action}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] font-semibold text-gray-500">{activity.user}</span>
                    <span className="text-[10px] text-gray-400">• {activity.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
