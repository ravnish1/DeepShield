import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Menu, Bell, AlertTriangle, FileText, Settings } from "lucide-react";

export default function Navbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { t } = useTranslation();
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
          
          {/* Left: Brand & Menu (Mobile/Tablet only) */}
          <div className="flex items-center gap-3 lg:hidden">
            <button 
              onClick={onMenuClick}
              className="p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors active:scale-[0.97]"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex flex-col justify-center">
              <span className="font-mono font-bold text-[16px] tracking-tight text-black line-clamp-1">
                {t('brandName')}
              </span>
            </div>
          </div>

          {/* Center: Nav Links */}
          <div className="hidden sm:flex items-center justify-center space-x-2 flex-1">
            {/* Links moved to Sidebar */}
          </div>

          {/* Right: Actions & User */}
          <div className="flex items-center justify-end gap-3 ml-auto">
            
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
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">{t('navbar.notifications')}</span>
                    <span className="text-xs text-red-600 hover:text-red-700 cursor-pointer font-medium">{t('navbar.markAsRead')}</span>
                  </div>
                  <div className="divide-y divide-gray-50">
                    <div className="p-4 hover:bg-gray-50 flex gap-3 cursor-pointer transition-colors">
                      <div className="mt-0.5">
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-black font-medium leading-snug mb-1">
                          {t('navbar.duplicateImages')}
                        </p>
                        <p className="text-xs text-gray-500">{t('navbar.minAgo')}</p>
                      </div>
                      <div className="w-2 h-2 rounded-full bg-red-600 mt-1"></div>
                    </div>
                    
                    <div className="p-4 hover:bg-gray-50 flex gap-3 cursor-pointer transition-colors">
                      <div className="mt-0.5">
                        <FileText className="w-4 h-4 text-yellow-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-black font-medium leading-snug mb-1">
                          {t('navbar.verificationPending')}
                        </p>
                        <p className="text-xs text-gray-500">{t('navbar.min14Ago')}</p>
                      </div>
                      <div className="w-2 h-2 rounded-full bg-yellow-500 mt-1"></div>
                    </div>

                    <div className="p-4 hover:bg-gray-50 flex gap-3 cursor-pointer transition-colors">
                      <div className="mt-0.5">
                        <Settings className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-black font-medium leading-snug mb-1">
                          {t('navbar.systemUpdate')}
                        </p>
                        <p className="text-xs text-gray-500">{t('navbar.hr1Ago')}</p>
                      </div>
                      <div className="w-2 h-2 rounded-full bg-blue-600 mt-1"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-xs font-semibold text-red-700 cursor-pointer hover:bg-red-200 transition-colors">
              {t('sidebar.userInitials')}
            </div>
          </div>

        </div>
      </div>
    </nav>
  );
}
