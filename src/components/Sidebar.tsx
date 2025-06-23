'use client';

import { 
  LayoutDashboard, 
  PlusCircle, 
  Briefcase, 
  Users, 
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const menuItems = [
  {
    name: 'Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard',
  },
  {
    name: 'Create a job',
    icon: PlusCircle,
    href: '/dashboard/create-job',
  },
  {
    name: 'Jobs',
    icon: Briefcase,
    href: '/dashboard/jobs',
  },
  {
    name: 'Candidates',
    icon: Users,
    href: '/dashboard/candidates',
    submenu: [
      { name: 'All Candidates', href: '/dashboard/candidates' },
      { name: 'Shortlisted Candidates', href: '/dashboard/candidates/shortlisted' },
      { name: 'Talent Pool', href: '/dashboard/candidates/talent-pool' }
    ]
  },
  {
    name: 'Settings',
    icon: Settings,
    href: '/dashboard/settings',
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

  const toggleSubmenu = (menuName: string) => {
    setExpandedMenu(expandedMenu === menuName ? null : menuName);
  };

  return (
    <div className="w-64 bg-white flex flex-col">
      {/* Logo Section */}
      <div className="h-20 border-b border-gray-200 flex items-center px-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">AI</span>
          </div>
          <span className="text-xl font-bold text-gray-900">Shortlist AI</span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const hasSubmenu = item.submenu && item.submenu.length > 0;
            const isSubmenuExpanded = expandedMenu === item.name;
            const isSubmenuActive = hasSubmenu && item.submenu?.some(subItem => pathname === subItem.href);

            return (
              <li key={item.name}>
                {hasSubmenu ? (
                  <div>
                    <button
                      onClick={() => toggleSubmenu(item.name)}
                      className={`flex items-center justify-between w-full px-4 py-3 rounded-lg transition-colors ${
                        isSubmenuActive
                          ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <item.icon className={`w-5 h-5 ${
                          isSubmenuActive ? 'text-blue-700' : 'text-gray-500'
                        }`} />
                        <span className="font-medium">{item.name}</span>
                      </div>
                      {isSubmenuExpanded ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>
                    
                    {isSubmenuExpanded && (
                      <ul className="ml-8 mt-2 space-y-1">
                        {item.submenu?.map((subItem) => {
                          const isSubActive = pathname === subItem.href;
                          return (
                            <li key={subItem.name}>
                              <Link
                                href={subItem.href}
                                className={`block px-4 py-2 rounded-lg transition-colors text-sm ${
                                  isSubActive
                                    ? 'bg-blue-50 text-blue-700'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                              >
                                {subItem.name}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <item.icon className={`w-5 h-5 ${
                      isActive ? 'text-blue-700' : 'text-gray-500'
                    }`} />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom Section - Logout */}
      <div className="p-4 border-t border-gray-200">
        <button className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors w-full">
          <LogOut className="w-5 h-5 text-gray-500" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
} 