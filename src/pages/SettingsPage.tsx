import { useState } from "react";
import { User, Bell, Key, Save, Copy, Check } from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-[22px] font-medium tracking-tight text-black">Settings</h1>
        <p className="text-[13px] text-secondary mt-1">
          Manage your platform preferences and API integrations.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Settings Navigation */}
        <div className="w-full md:w-64 shrink-0">
          <nav className="flex flex-col space-y-1">
            <button
              onClick={() => setActiveTab("general")}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-[13px] font-medium transition-colors ${
                activeTab === "general" 
                  ? "bg-black text-white" 
                  : "text-gray-600 hover:bg-gray-100 hover:text-black"
              }`}
            >
              <User className={`w-4 h-4 ${activeTab === "general" ? "text-white" : "text-gray-400"}`} />
              General Profile
            </button>
            <button
              onClick={() => setActiveTab("notifications")}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-[13px] font-medium transition-colors ${
                activeTab === "notifications" 
                  ? "bg-black text-white" 
                  : "text-gray-600 hover:bg-gray-100 hover:text-black"
              }`}
            >
              <Bell className={`w-4 h-4 ${activeTab === "notifications" ? "text-white" : "text-gray-400"}`} />
              Notifications
            </button>
            <button
              onClick={() => setActiveTab("apikeys")}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-[13px] font-medium transition-colors ${
                activeTab === "apikeys" 
                  ? "bg-black text-white" 
                  : "text-gray-600 hover:bg-gray-100 hover:text-black"
              }`}
            >
              <Key className={`w-4 h-4 ${activeTab === "apikeys" ? "text-white" : "text-gray-400"}`} />
              API Keys
            </button>
          </nav>
        </div>

        {/* Settings Content */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8 min-h-[500px]">
          
          {activeTab === "general" && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="text-[16px] font-semibold text-black">Company Details</h2>
                <p className="text-[13px] text-gray-500 mb-6">Update your organization's basic information.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[12px] font-medium text-black">Company Name</label>
                  <input 
                    type="text" 
                    defaultValue="Acme Real Estate Ltd."
                    className="w-full h-10 px-3 rounded-md border border-gray-200 text-[13px] focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[12px] font-medium text-black">Support Email</label>
                  <input 
                    type="email" 
                    defaultValue="support@acme.com"
                    className="w-full h-10 px-3 rounded-md border border-gray-200 text-[13px] focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[12px] font-medium text-black">Timezone</label>
                  <select className="w-full h-10 px-3 rounded-md border border-gray-200 text-[13px] bg-white focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors">
                    <option>Asia/Kolkata (IST)</option>
                    <option>UTC</option>
                    <option>America/New_York (EST)</option>
                  </select>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100 flex justify-end">
                <button className="flex items-center gap-2 px-6 py-2 bg-black text-white rounded-lg text-[13px] font-medium hover:bg-gray-800 transition-colors">
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="text-[16px] font-semibold text-black">Alert Preferences</h2>
                <p className="text-[13px] text-gray-500 mb-6">Choose when and how you want to be notified.</p>
              </div>

              <div className="space-y-4">
                {[
                  { title: "High-Risk Transactions", desc: "Get an email when a transaction's risk score exceeds 80.", default: true },
                  { title: "KYC Verification Failures", desc: "Alert me when a user fails document verification.", default: true },
                  { title: "Rules Engine Updates", desc: "Notify me when a team member modifies active rules.", default: false },
                  { title: "Weekly Digest", desc: "Receive a weekly summary report of fraud analytics.", default: true },
                ].map((notif, idx) => (
                  <div key={idx} className="flex items-start justify-between p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                    <div className="pr-8">
                      <p className="text-[14px] font-medium text-black">{notif.title}</p>
                      <p className="text-[12px] text-gray-500 mt-1">{notif.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer mt-1 shrink-0">
                      <input type="checkbox" className="sr-only peer" defaultChecked={notif.default} />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "apikeys" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-[16px] font-semibold text-black">API Integrations</h2>
                  <p className="text-[13px] text-gray-500 mb-6">Manage API keys used to connect your backend to DeepShield.</p>
                </div>
                <button className="px-4 py-2 bg-black text-white rounded-lg text-[12px] font-medium hover:bg-gray-800 transition-colors">
                  Generate New Key
                </button>
              </div>

              <div className="space-y-4">
                {[
                  { name: "Production Gateway", key: "ds_live_8f92a...x9qL", created: "Oct 12, 2025", lastUsed: "2 mins ago" },
                  { name: "Staging Testing", key: "ds_test_4m21b...p3kT", created: "Nov 04, 2025", lastUsed: "5 days ago" },
                ].map((api, idx) => (
                  <div key={idx} className="p-4 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        <span className="text-[14px] font-bold text-black">{api.name}</span>
                      </div>
                      <button className="text-[12px] text-red-600 font-medium hover:underline">Revoke</button>
                    </div>
                    
                    <div className="flex items-center justify-between bg-gray-50 p-2.5 rounded-md border border-gray-100">
                      <code className="text-[13px] font-mono text-gray-600">{api.key}</code>
                      <button 
                        onClick={() => handleCopy(api.key)}
                        className="text-gray-400 hover:text-black transition-colors"
                      >
                        {copiedKey === api.key ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    
                    <div className="flex gap-4 mt-3 text-[11px] text-gray-400">
                      <span>Created: {api.created}</span>
                      <span>Last Used: {api.lastUsed}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
