import React, { useState, useRef, useEffect } from 'react';
import { 
  Pill, 
  Bell, 
  LogOut, 
  ShieldCheck, 
  User as UserIcon, 
  ChevronDown, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  HeartHandshake,
  Activity,
  Plus,
  RefreshCw,
  PhoneCall,
  ExternalLink,
  Sun,
  Moon
} from 'lucide-react';
import { User, RefillAlert } from '../../types';
import { useTheme } from '../../context/ThemeContext';

interface NavbarProps {
  user: User | null;
  alerts: RefillAlert[];
  onOpenAuth: () => void;
  onLogout: () => void;
  onSwitchUser: (role: 'primary_user' | 'family_member') => void;
  onOpenNewPrescription: () => void;
  onOpenNewMember: () => void;
  onOpenNewRecord: () => void;
  onOpenRefillDrawer: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  alerts,
  onOpenAuth,
  onLogout,
  onSwitchUser,
  onOpenNewPrescription,
  onOpenNewMember,
  onOpenNewRecord,
  onOpenRefillDrawer,
  activeTab,
  setActiveTab,
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showAlertsDropdown, setShowAlertsDropdown] = useState(false);
  const { theme, toggleTheme, isDark } = useTheme();
  const profileRef = useRef<HTMLDivElement>(null);
  const alertsRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
      if (alertsRef.current && !alertsRef.current.contains(event.target as Node)) {
        setShowAlertsDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadAlertsCount = alerts.filter(a => !a.isRead).length;
  const urgentCount = alerts.filter(a => a.urgency === 'urgent').length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 shadow-xs transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* Left: Brand logo & Navigation */}
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setActiveTab('prescriptions')}>
              <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <Pill className="w-6 h-6 rotate-45" />
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white dark:border-slate-900"></span>
                </span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white font-sans">
                    Dawaaii<span className="text-emerald-600 dark:text-emerald-400">Rx</span>
                  </span>
                  <span className="px-1.5 py-0.5 text-[10px] font-bold tracking-wide uppercase bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 rounded-md border border-emerald-200 dark:border-emerald-800/60">
                    Family
                  </span>
                </div>
                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 leading-none">
                  Family Health & Prescription Portal
                </p>
              </div>
            </div>

            {/* Navigation tabs */}
            <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
              <button
                onClick={() => setActiveTab('prescriptions')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'prescriptions'
                    ? 'bg-white dark:bg-slate-900 text-emerald-800 dark:text-emerald-400 shadow-xs border border-slate-200/50 dark:border-slate-700'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50'
                }`}
              >
                Prescriptions & Refills
              </button>
              <button
                onClick={() => setActiveTab('family')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'family'
                    ? 'bg-white dark:bg-slate-900 text-emerald-800 dark:text-emerald-400 shadow-xs border border-slate-200/50 dark:border-slate-700'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50'
                }`}
              >
                Family Members
              </button>
              <button
                onClick={() => setActiveTab('records')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'records'
                    ? 'bg-white dark:bg-slate-900 text-emerald-800 dark:text-emerald-400 shadow-xs border border-slate-200/50 dark:border-slate-700'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50'
                }`}
              >
                Health Records
              </button>
              <button
                onClick={() => setActiveTab('schedule')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'schedule'
                    ? 'bg-white dark:bg-slate-900 text-emerald-800 dark:text-emerald-400 shadow-xs border border-slate-200/50 dark:border-slate-700'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50'
                }`}
              >
                Daily Pill Tracker
              </button>
            </nav>
          </div>

          {/* Right: Quick Actions, Theme Toggle, Notifications, User Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Quick Action Button Dropdown / Direct triggers */}
            <div className="hidden lg:flex items-center gap-2">
              <button
                onClick={onOpenNewPrescription}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 rounded-xl shadow-xs shadow-emerald-600/20 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Prescription</span>
              </button>

              <button
                onClick={onOpenNewRecord}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-95 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs transition-all cursor-pointer"
              >
                <Activity className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                <span>Add Record</span>
              </button>
            </div>

            {/* Dark Mode Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-amber-300 hover:bg-slate-100 dark:hover:bg-slate-700 shadow-xs transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500"
              title={isDark ? 'Switch to Light Mode (Slate/Emerald)' : 'Switch to Dark Mode (Deep Charcoal/Emerald)'}
              aria-label="Toggle theme color scheme"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400 animate-in spin-in-90 duration-200" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600 animate-in spin-in-90 duration-200" />
              )}
            </button>

            {/* Notification Bell with Refill Alerts badge */}
            <div className="relative" ref={alertsRef}>
              <button
                onClick={() => setShowAlertsDropdown(!showAlertsDropdown)}
                className={`relative p-2.5 rounded-xl border transition-all cursor-pointer ${
                  urgentCount > 0
                    ? 'border-rose-200 dark:border-rose-900/60 bg-rose-50/70 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-950/60'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
                title="Prescription Refill Reminders & Alerts"
                aria-label="Refill reminders"
              >
                <Bell className="w-4 h-4" />
                {unreadAlertsCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-rose-600 rounded-full border-2 border-white dark:border-slate-900 shadow-xs animate-pulse">
                    {unreadAlertsCount}
                  </span>
                )}
              </button>

              {/* Refill Alerts Dropdown */}
              {showAlertsDropdown && (
                <div className="absolute right-0 mt-2 w-84 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200/80 dark:border-slate-800 p-0 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="p-4 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-800 text-white flex items-center justify-between border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-emerald-400" />
                      <h4 className="text-xs font-bold uppercase tracking-wider">Refill Reminder Alerts</h4>
                    </div>
                    <span className="text-[11px] bg-emerald-500/20 text-emerald-300 font-semibold px-2 py-0.5 rounded-full border border-emerald-500/30">
                      {alerts.length} Active
                    </span>
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 p-2">
                    {alerts.length === 0 ? (
                      <div className="text-center py-8 text-slate-400">
                        <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500 mb-2 opacity-80" />
                        <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">All Prescriptions Are Well Stocked</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">No urgent refills scheduled in the next 10 days.</p>
                      </div>
                    ) : (
                      alerts.map((alert) => (
                        <div
                          key={alert.id}
                          className={`p-3 rounded-xl transition-colors ${
                            alert.urgency === 'urgent'
                              ? 'bg-rose-50/70 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/50 hover:bg-rose-100/80'
                              : alert.urgency === 'warning'
                              ? 'bg-amber-50/60 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/50 hover:bg-amber-100/70'
                              : 'hover:bg-slate-50 dark:hover:bg-slate-800/60'
                          } mb-1.5`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                                  alert.urgency === 'urgent'
                                    ? 'bg-rose-600 text-white'
                                    : 'bg-amber-500 text-white'
                                }`}>
                                  {alert.urgency === 'urgent' ? 'Urgent Refill' : 'Refill Due Soon'}
                                </span>
                                <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                                  {alert.medicineName}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1">
                                For: <strong className="text-slate-800 dark:text-slate-200">{alert.memberName}</strong> &bull; {alert.remainingPills} pills left ({alert.remainingDays} days)
                              </p>
                              {alert.pharmacyName && (
                                <p className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                                  <PhoneCall className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400" />
                                  {alert.pharmacyName}
                                </p>
                              )}
                            </div>

                            <span className="text-[10px] font-semibold text-slate-400 whitespace-nowrap">
                              Due: {alert.refillDate}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <button
                      onClick={() => {
                        setShowAlertsDropdown(false);
                        onOpenRefillDrawer();
                      }}
                      className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
                    >
                      <span>Configure Reminders (Email/SMS)</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => setShowAlertsDropdown(false)}
                      className="text-xs font-medium text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile & Role Indicator */}
            {user ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2.5 p-1.5 pr-3 rounded-2xl hover:bg-slate-100/80 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700 transition-all cursor-pointer"
                >
                  <img
                    src={user.avatarUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=128'}
                    alt={user.name}
                    className="w-8 h-8 rounded-xl object-cover ring-2 ring-emerald-500/20"
                  />
                  <div className="text-left hidden sm:block">
                    <div className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight truncate max-w-[130px]">
                      {user.name}
                    </div>
                    <div className="flex items-center gap-1">
                      <span className={`inline-block w-1.5 h-1.5 rounded-full ${user.role === 'primary_user' ? 'bg-emerald-500' : 'bg-teal-500'}`} />
                      <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        {user.role === 'primary_user' ? 'Primary Supv' : 'Family Member'}
                      </span>
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
                </button>

                {/* Profile menu dropdown */}
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200/80 dark:border-slate-800 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/70 rounded-xl mb-2">
                      <div className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">{user.name}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user.email}</div>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-[10px] px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-bold rounded-md uppercase">
                          {user.role === 'primary_user' ? 'Supervisor Access' : 'Member Read-Write'}
                        </span>
                        <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-mono flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" /> JWT Active
                        </span>
                      </div>
                    </div>

                    <div className="px-2 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Switch Demo Role
                    </div>
                    <button
                      onClick={() => {
                        onSwitchUser('primary_user');
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-800 dark:hover:text-emerald-300 flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        Sarah Jenkins (Primary Supervisor)
                      </span>
                      {user.role === 'primary_user' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
                    </button>

                    <button
                      onClick={() => {
                        onSwitchUser('family_member');
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-800 dark:hover:text-emerald-300 flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <UserIcon className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                        Ethan Jenkins (Family Member)
                      </span>
                      {user.role === 'family_member' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
                    </button>

                    {/* Theme Mode Option in Dropdown */}
                    <div className="my-1.5 border-t border-slate-100 dark:border-slate-800" />
                    <button
                      onClick={() => {
                        toggleTheme();
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-500" />}
                        Theme: {isDark ? 'Dark (Charcoal/Emerald)' : 'Light (Slate/Emerald)'}
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                        {isDark ? 'Dark' : 'Light'}
                      </span>
                    </button>

                    <div className="my-1.5 border-t border-slate-100 dark:border-slate-800" />

                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        onLogout();
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      <span>Sign Out from Portal</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-all cursor-pointer"
              >
                Sign In
              </button>
            )}

          </div>

        </div>
      </div>

      {/* Mobile nav bar */}
      <div className="md:hidden border-t border-slate-200/70 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/90 px-4 py-2 flex items-center justify-between overflow-x-auto gap-2">
        <button
          onClick={() => setActiveTab('prescriptions')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all ${
            activeTab === 'prescriptions'
              ? 'bg-emerald-600 text-white'
              : 'text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800'
          }`}
        >
          Prescriptions
        </button>
        <button
          onClick={() => setActiveTab('family')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all ${
            activeTab === 'family'
              ? 'bg-emerald-600 text-white'
              : 'text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800'
          }`}
        >
          Family ({alerts.length})
        </button>
        <button
          onClick={() => setActiveTab('records')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all ${
            activeTab === 'records'
              ? 'bg-emerald-600 text-white'
              : 'text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800'
          }`}
        >
          Health Records
        </button>
        <button
          onClick={() => setActiveTab('schedule')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all ${
            activeTab === 'schedule'
              ? 'bg-emerald-600 text-white'
              : 'text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800'
          }`}
        >
          Pill Tracker
        </button>
      </div>
    </header>
  );
};
