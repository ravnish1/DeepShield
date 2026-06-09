import { useState } from "react";
import { ShieldAlert, Plus, Zap, Power } from "lucide-react";

export default function RulesEnginePage() {
  const [engineEnabled, setEngineEnabled] = useState(true);

  const initialRules = [
    { id: 1, name: "Duplicate Images", condition: "duplicate_listing_images >= 2", effect: "add_risk_score(30)", desc: "Triggers reverse stock lookup check", enabled: true },
    { id: 2, name: "Rapid Bank Change", condition: "bank_account_changed_within_hours_of_payout <= 24", effect: "add_risk_score(25)", desc: "Detects possible account hijackers", enabled: true },
    { id: 3, name: "Double Renting", condition: "deposits_collected_for_overlapping_dates >= 2", effect: "add_risk_score(35)", desc: "Flags double renting scams", enabled: true },
    { id: 4, name: "Deed Mismatch", condition: "owner_name != property_document_name", effect: "add_risk_score(30)", desc: "Identifies deed signature anomalies", enabled: false },
    { id: 5, name: "Bait Pricing", condition: "listing_price_below_local_median >= 35%", effect: "add_risk_score(15)", desc: "Flags clickbait or bait listings", enabled: true },
    { id: 6, name: "New Broker Volume", condition: "new_broker_listings_per_day >= 10", effect: "add_risk_score(20)", desc: "Flags anomalous onboarding volume", enabled: false },
  ];

  const [rules, setRules] = useState(initialRules);

  const toggleRule = (id: number) => {
    setRules(rules.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto animate-fade-in">
      
      {/* Header & Global Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl transition-colors ${engineEnabled ? "bg-red-100" : "bg-gray-100"}`}>
            <ShieldAlert className={`w-6 h-6 ${engineEnabled ? "text-red-600" : "text-gray-400"}`} />
          </div>
          <div>
            <h1 className="text-[20px] font-semibold tracking-tight text-black">DeepShield Engine</h1>
            <p className="text-[13px] text-secondary mt-0.5">
              Automated risk scoring is currently <strong className={engineEnabled ? "text-green-600" : "text-gray-500"}>{engineEnabled ? "Active" : "Paused"}</strong>.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setEngineEnabled(!engineEnabled)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-medium transition-colors ${
              engineEnabled 
                ? "bg-gray-100 text-gray-700 hover:bg-gray-200" 
                : "bg-red-600 text-white hover:bg-red-700"
            }`}
          >
            <Power className="w-4 h-4" />
            {engineEnabled ? "Pause Engine" : "Activate Engine"}
          </button>
          
          <button className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg text-[13px] font-medium hover:bg-gray-800 transition-colors">
            <Plus className="w-4 h-4" />
            Add Rule
          </button>
        </div>
      </div>

      <div className="flex justify-between items-end mb-6">
        <h2 className="text-[16px] font-semibold text-black">Active Rule Weights (v1.2)</h2>
        <span className="text-[12px] text-gray-500 font-medium">{rules.filter(r => r.enabled).length} Rules Active</span>
      </div>

      {/* Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {rules.map((rule) => (
          <div 
            key={rule.id} 
            className={`relative bg-white border ${rule.enabled ? 'border-red-100 shadow-sm' : 'border-gray-200 opacity-60'} rounded-xl p-5 transition-all hover:shadow-md`}
          >
            <div className="flex justify-between items-start mb-4 gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {rule.enabled && <Zap className="w-3.5 h-3.5 text-red-500 fill-red-500 shrink-0" />}
                  <h3 className="text-[14px] font-bold text-black leading-tight">{rule.name}</h3>
                </div>
                <p className="text-[12px] text-gray-500 leading-relaxed">{rule.desc}</p>
              </div>

              {/* Toggle Switch */}
              <button 
                onClick={() => toggleRule(rule.id)}
                className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${rule.enabled ? 'bg-red-500' : 'bg-gray-300'}`}
              >
                <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${rule.enabled ? 'translate-x-4.5' : 'translate-x-1'}`} />
              </button>
            </div>

            <div className="bg-gray-50 rounded-lg p-3 border border-gray-100 font-mono space-y-1">
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 font-sans uppercase tracking-wider mb-0.5">Condition</span>
                <span className="text-[12px] text-black">IF <span className="text-blue-600">{rule.condition}</span></span>
              </div>
              <div className="flex flex-col pt-2 border-t border-gray-100/50 mt-2">
                <span className="text-[10px] text-gray-400 font-sans uppercase tracking-wider mb-0.5">Effect</span>
                <span className="text-[12px] text-black">THEN <span className="text-red-600 font-semibold">{rule.effect}</span></span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
