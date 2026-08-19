import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Sun, 
  Sunset, 
  Moon, 
  Sparkles, 
  Pill, 
  Users, 
  AlertCircle,
  Calendar,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Prescription, FamilyMember } from '../../types';

interface DailyScheduleTrackerProps {
  prescriptions: Prescription[];
  members: FamilyMember[];
  onLogDose: (prescriptionId: string, timeSlot: string) => void;
}

const TIME_SLOTS = [
  { id: 'Morning', label: 'Morning Doses', icon: <Sun className="w-5 h-5 text-amber-500" />, time: '08:00 AM', desc: 'Breakfast & early routine' },
  { id: 'Afternoon', label: 'Afternoon Doses', icon: <Sun className="w-5 h-5 text-orange-500" />, time: '01:00 PM', desc: 'Lunch & mid-day' },
  { id: 'Evening', label: 'Evening Doses', icon: <Sunset className="w-5 h-5 text-indigo-400" />, time: '06:30 PM', desc: 'Dinner & evening routine' },
  { id: 'Bedtime', label: 'Bedtime Doses', icon: <Moon className="w-5 h-5 text-purple-400" />, time: '10:00 PM', desc: 'Before sleep' },
];

export const DailyScheduleTracker: React.FC<DailyScheduleTrackerProps> = ({
  prescriptions,
  members,
  onLogDose,
}) => {
  const [selectedMemberFilter, setSelectedMemberFilter] = useState<string>('All');
  const todayStr = new Date().toISOString().split('T')[0];

  // Format today display
  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const activePrescriptions = prescriptions.filter(p => p.status !== 'Completed');

  const filteredRx = activePrescriptions.filter(rx => {
    if (selectedMemberFilter !== 'All' && rx.memberId !== selectedMemberFilter) {
      return false;
    }
    return true;
  });

  // Calculate stats
  let totalDosesForDay = 0;
  let completedDosesToday = 0;

  filteredRx.forEach(rx => {
    if (rx.frequency !== 'As needed (PRN)') {
      totalDosesForDay += rx.scheduleTimes.length;
      completedDosesToday += rx.takenHistory.filter(h => h.date === todayStr).length;
    }
  });

  const progressPercent = totalDosesForDay > 0 ? Math.min(100, Math.round((completedDosesToday / totalDosesForDay) * 100)) : 100;

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <Calendar className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Daily Household Medication Tracker</h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {todayFormatted} &bull; Supervisor view for daily family dosing adherence
          </p>
        </div>

        {/* Progress pill */}
        <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-700 flex items-center gap-4">
          <div>
            <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Today's Adherence
            </div>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xl font-extrabold text-slate-900 dark:text-white">{progressPercent}%</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                ({completedDosesToday}/{totalDosesForDay} doses)
              </span>
            </div>
          </div>

          <div className="w-24 bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                progressPercent === 100 ? 'bg-emerald-500' : 'bg-teal-500'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Member Selector Bar */}
      <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between gap-3 overflow-x-auto transition-colors">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 px-2">Filter Member:</span>
          <button
            onClick={() => setSelectedMemberFilter('All')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedMemberFilter === 'All'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            All Family ({members.length})
          </button>

          {members.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedMemberFilter(m.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedMemberFilter === m.id
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {m.name} ({m.relation})
            </button>
          ))}
        </div>
      </div>

      {/* Time Slots 4 Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {TIME_SLOTS.map((slot) => {
          const slotMeds = filteredRx.filter(rx => rx.scheduleTimes && rx.scheduleTimes.includes(slot.id));

          return (
            <div
              key={slot.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between overflow-hidden transition-colors"
            >
              {/* Slot Header */}
              <div className="p-4 bg-slate-50/80 dark:bg-slate-800/80 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-white dark:bg-slate-900 shadow-xs border border-slate-200/60 dark:border-slate-700">
                    {slot.icon}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      {slot.id}
                    </h3>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-none mt-0.5">
                      {slot.time}
                    </p>
                  </div>
                </div>

                <span className="text-[11px] font-bold px-2 py-0.5 bg-slate-200/70 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full">
                  {slotMeds.length} meds
                </span>
              </div>

              {/* Slot Medications List */}
              <div className="p-3 space-y-2.5 flex-1 divide-y divide-slate-100 dark:divide-slate-800 max-h-96 overflow-y-auto">
                {slotMeds.length === 0 ? (
                  <div className="py-8 text-center text-slate-400 dark:text-slate-500">
                    <CheckCircle2 className="w-6 h-6 mx-auto mb-1 text-slate-300 dark:text-slate-600" />
                    <p className="text-xs">No doses scheduled for this window.</p>
                  </div>
                ) : (
                  slotMeds.map((rx) => {
                    const isTaken = rx.takenHistory.some(h => h.date === todayStr && h.timeSlot === slot.id);

                    return (
                      <div key={rx.id} className="pt-2.5 first:pt-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300">
                                {rx.memberName}
                              </span>
                              <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                {rx.medicineName}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                              {rx.dosage} &bull; {rx.form}
                            </p>
                            {rx.instructions && (
                              <p className="text-[10px] text-slate-400 dark:text-slate-500 italic mt-0.5 line-clamp-1">
                                {rx.instructions}
                              </p>
                            )}
                          </div>

                          <button
                            onClick={() => onLogDose(rx.id, slot.id)}
                            className={`p-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1 ${
                              isTaken
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-800 dark:hover:text-emerald-300 border border-slate-200/80 dark:border-slate-700'
                            }`}
                            title={isTaken ? 'Dose already marked taken (Click to toggle)' : 'Mark dose as taken now'}
                          >
                            {isTaken ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Taken</span>
                              </>
                            ) : (
                              <span>Take</span>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Slot Footer Advice */}
              <div className="p-2.5 bg-slate-50/50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 dark:text-slate-500 text-center">
                {slot.desc}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
