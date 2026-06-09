import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useRiskStore } from "../store/riskStore";
import { ShieldCheck, Bell, AlertTriangle, FileText, Settings } from "lucide-react";

export default function Navbar() {
  const location = useLocation();
  const transactions = useRiskStore((state) => state.transactions);
  const flaggedCount = transactions.filter((t) => t.status === "flagged").length;
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Left: Brand */}
          <div className="flex flex-col justify-center min-w-[240px]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-red-600" />
              <span className="font-mono font-bold text-lg tracking-tight text-black">
                DeepShield Rental Trust
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5 ml-8">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
              <span className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">
                All systems operational
              </span>
            </div>
          </div>

          {/* Center: Nav Links */}
          <div className="hidden sm:flex items-center justify-center space-x-2 flex-1">
            <Link
              to="/kyc"
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-150 ${
                location.pathname === "/kyc"
                  ? "bg-black text-white"
                  : "bg-transparent text-gray-500 hover:bg-gray-100"
              }`}
            >
              Owner Verification
            </Link>
            <Link
              to="/risk"
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-150 flex items-center ${
                location.pathname === "/risk"
                  ? "bg-black text-white"
                  : "bg-transparent text-gray-500 hover:bg-gray-100"
              }`}
            >
              Fraud Control Center
              {flaggedCount > 0 && (
                <span className={`ml-2 inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  location.pathname === "/risk" ? "bg-red-600 text-white" : "bg-red-100 text-red-800"
                }`}>
                  {flaggedCount}
                </span>
              )}
            </Link>
          </div>

          {/* Right: Actions & User */}
          <div className="flex items-center justify-end min-w-[200px] gap-4">
            
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="relative p-2 rounded-full text-gray-500 hover:bg-gray-100 transition-colors active:scale-[0.97]"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600 border border-white"></span>
                </span>
              </button>

              {/* Notifications Dropdown */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden z-50 animate-slide-in-row">
                  <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Notifications</span>
                    <span className="text-xs text-red-600 hover:text-red-700 cursor-pointer font-medium">Mark all as read</span>
                  </div>
                  <div className="divide-y divide-gray-50">
                    <div className="p-4 hover:bg-gray-50 flex gap-3 cursor-pointer transition-colors">
                      <div className="mt-0.5">
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-black font-medium leading-snug mb-1">
                          Duplicate property images detected — Gurugram Ad Ad Ad
                        </p>
                        <p className="text-xs text-gray-500">2 min ago</p>
                      </div>
                      <div className="w-2 h-2 rounded-full bg-red-600 mt-1"></div>
                    </div>
                    
                    <div className="p-4 hover:bg-gray-50 flex gap-3 cursor-pointer transition-colors">
                      <div className="mt-0.5">
                        <FileText className="w-4 h-4 text-yellow-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-black font-medium leading-snug mb-1">
                          Owner verification pending review — Rahul Verma
                        </p>
                        <p className="text-xs text-gray-500">14 min ago</p>
                      </div>
                      <div className="w-2 h-2 rounded-full bg-yellow-500 mt-1"></div>
                    </div>

                    <div className="p-4 hover:bg-gray-50 flex gap-3 cursor-pointer transition-colors">
                      <div className="mt-0.5">
                        <Settings className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-black font-medium leading-snug mb-1">
                          System: Rental model updated to v1.2
                        </p>
                        <p className="text-xs text-gray-500">1 hr ago</p>
                      </div>
                      <div className="w-2 h-2 rounded-full bg-blue-600 mt-1"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="h-8 w-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-semibold tracking-wider cursor-pointer active:scale-[0.97] transition-transform">
              RK
            </div>
          </div>

        </div>
      </div>
    </nav>
  );
}
