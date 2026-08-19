import React from 'react';
import { 
  Pill, 
  Users, 
  Clock, 
  FileText, 
  CheckCircle2, 
  AlertTriangle,
  TrendingUp
} from 'lucide-react';
import { FamilyMember, Prescription, HealthRecord, RefillAlert } from '../../types';

interface StatCardsProps {
  members: FamilyMember[];
  prescriptions: Prescription[];
  records: HealthRecord[];
  alerts: RefillAlert[];
  onSelectTab: (tab: string) => void;
}

export const StatCards: React.FC<StatCardsProps> = ({
  members,
  prescriptions,
  records,
  alerts,
  onSelectTab,
}) => {
  const activeRxCount = prescriptions.filter(p => p.status !== 'Completed').length;
  const urgentRefillCount = alerts.filter(a => a.urgency === 'urgent').length;
  const warningRefillCount = alerts.filter(a => a.urgency === 'warning').length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      
      {/* 1. Active Prescriptions */}
      <div 
        onClick={() => onSelectTab('prescriptions')}
        className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-emerald-300 dark:hover:border-emerald-500/50 transition-all cursor-pointer group"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Active Prescriptions
          </span>
          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
            <Pill className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{activeRxCount}</span>
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
            <TrendingUp className="w-3.5 h-3.5" /> All members
          </span>
        </div>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 truncate">
          Across {members.length} registered household profiles
        </p>
      </div>

      {/* 2. Refills Due & Alerts */}
      <div 
        onClick={() => onSelectTab('prescriptions')}
        className={`p-5 rounded-2xl border transition-all cursor-pointer group ${
          urgentRefillCount > 0
            ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/60 shadow-xs hover:border-rose-300 dark:hover:border-rose-700'
            : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-amber-300 dark:hover:border-amber-500/50'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Refills Needed
          </span>
          <div className={`p-2.5 rounded-xl transition-colors ${
            urgentRefillCount > 0
              ? 'bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300 group-hover:bg-rose-600 group-hover:text-white'
              : 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 group-hover:bg-amber-600 group-hover:text-white'
          }`}>
            <Clock className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{alerts.length}</span>
          {urgentRefillCount > 0 ? (
            <span className="text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1 bg-rose-100/80 dark:bg-rose-950/80 px-2 py-0.5 rounded-full border border-rose-200 dark:border-rose-900">
              <AlertTriangle className="w-3 h-3" /> {urgentRefillCount} Urgent
            </span>
          ) : warningRefillCount > 0 ? (
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-100/80 dark:bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-900">
              {warningRefillCount} Due this week
            </span>
          ) : (
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Stock optimal</span>
          )}
        </div>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          {urgentRefillCount > 0 ? 'Action required for refill requests' : 'Automated supply threshold active'}
        </p>
      </div>

      {/* 3. Family Members Under Supervision */}
      <div 
        onClick={() => onSelectTab('family')}
        className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-teal-300 dark:hover:border-teal-500/50 transition-all cursor-pointer group"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Family Network
          </span>
          <div className="p-2.5 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 group-hover:bg-teal-600 group-hover:text-white transition-colors">
            <Users className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{members.length}</span>
          <span className="text-xs font-semibold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded-md border border-teal-200 dark:border-teal-800">
            Supervised
          </span>
        </div>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 truncate">
          1 Primary Supervisor &bull; {members.length - 1} dependents
        </p>
      </div>

      {/* 4. Health Records Logged */}
      <div 
        onClick={() => onSelectTab('records')}
        className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-all cursor-pointer group"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Health Records
          </span>
          <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
            <FileText className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{records.length}</span>
          <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">Allergies & Labs</span>
        </div>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 truncate">
          Chronological medical history records
        </p>
      </div>

    </div>
  );
};
