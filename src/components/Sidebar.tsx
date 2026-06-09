import { Link, useLocation } from "react-router-dom";
import { ShieldCheck, LayoutDashboard, FileText, Settings, Key, X } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const location = useLocation();

  const links = [
    { name: "Owner Verification", path: "/kyc", icon: ShieldCheck },
    { name: "Fraud Control Center", path: "/risk", icon: LayoutDashboard },
    { name: "Reports & Analytics", path: "/reports", icon: FileText },
    { name: "Rules Engine", path: "/rules", icon: Key },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[60] lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-[70] transform transition-transform duration-300 ease-in-out flex flex-col overflow-hidden ${
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200 shrink-0">
          <span className="font-mono font-bold text-lg tracking-tight text-black flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-red-600" />
            DeepShield
          </span>
          <button 
            className="lg:hidden p-2 -mr-2 text-gray-500 hover:bg-gray-100 rounded-full"
            onClick={() => setIsOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname.startsWith(link.path);
            
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive 
                    ? "bg-black text-white" 
                    : "text-gray-600 hover:bg-gray-100 hover:text-black"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-gray-400"}`} />
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-600">
              RK
            </div>
            <div>
              <p className="text-sm font-medium text-black">Rahul Kumar</p>
              <p className="text-xs text-gray-500">Risk Operations</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
