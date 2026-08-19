import React, { useState } from 'react';
import { 
  Pill, 
  Clock, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  AlertTriangle, 
  Calendar, 
  Phone, 
  Search, 
  Filter, 
  Plus, 
  RefreshCw, 
  ShieldCheck, 
  Check, 
  Sparkles, 
  Building2,
  ExternalLink,
  X,
  Send
} from 'lucide-react';
import { Prescription, FamilyMember, RelationType } from '../../types';

interface PrescriptionListProps {
  prescriptions: Prescription[];
  members: FamilyMember[];
  onAddNew?: () => void;
  onOpenAddModal?: () => void;
  onEdit?: (rx: Prescription) => void;
  onEditPrescription?: (rx: Prescription) => void;
  onDelete?: (id: string) => void;
  onDeletePrescription?: (id: string) => void;
  onLogDose: (prescriptionId: string, timeSlot: string) => void;
  onRecordRefill?: (prescriptionId: string, addedPills: number) => void;
  onOpenRefillDrawer?: () => void;
  selectedMemberId?: string | null;
  selectedMemberFilter?: string | null;
  onSelectMemberFilter: (memberId: string | null) => void;
}

export const PrescriptionList: React.FC<PrescriptionListProps> = ({
  prescriptions,
  members,
  onAddNew,
  onOpenAddModal,
  onEdit,
  onEditPrescription,
  onDelete,
  onDeletePrescription,
  onLogDose,
  onRecordRefill,
  onOpenRefillDrawer,
  selectedMemberId,
  selectedMemberFilter,
  onSelectMemberFilter,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Needs Refill' | 'Active'>('All');
  
  // Refill Modal state
  const [refillModalRx, setRefillModalRx] = useState<Prescription | null>(null);
  const [refillQuantity, setRefillQuantity] = useState(30);
  const [refillSentSuccess, setRefillSentSuccess] = useState(false);

  const activeMemberFilter = selectedMemberId !== undefined ? selectedMemberId : selectedMemberFilter;
  const handleEdit = onEdit || onEditPrescription || (() => {});
  const handleDelete = onDelete || onDeletePrescription || (() => {});
  const handleOpenAdd = onAddNew || onOpenAddModal || (() => {});

  const todayStr = new Date().toISOString().split('T')[0];

  // Filtering
  const filteredPrescriptions = prescriptions.filter(rx => {
    // Member filter
    if (activeMemberFilter && rx.memberId !== activeMemberFilter) {
      return false;
    }
    // Status filter
    if (statusFilter === 'Needs Refill' && rx.status !== 'Refill Due' && rx.status !== 'Urgent Refill') {
      return false;
    }
    if (statusFilter === 'Active' && (rx.status === 'Completed' || rx.status === 'Paused')) {
      return false;
    }
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = rx.medicineName.toLowerCase().includes(q);
      const matchGeneric = rx.genericName?.toLowerCase().includes(q);
      const matchMember = rx.memberName.toLowerCase().includes(q);
      const matchDoctor = rx.prescribedBy?.toLowerCase().includes(q);
      if (!matchName && !matchGeneric && !matchMember && !matchDoctor) return false;
    }
    return true;
  });

  const handleProcessRefillSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!refillModalRx) return;
    if (onRecordRefill) {
      onRecordRefill(refillModalRx.id, Number(refillQuantity));
    }
    setRefillSentSuccess(true);
    setTimeout(() => {
      setRefillSentSuccess(false);
      setRefillModalRx(null);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Filter & Search Controls Bar */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 transition-colors">
        
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by medication, active ingredient, family member, doctor..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-xl text-xs focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
          />
        </div>

        {/* Member filter & Status Pill Filters */}
        <div className="flex items-center gap-3 flex-wrap">
          
          {/* Member Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap hidden sm:inline">
              Filter Member:
            </span>
            <select
              value={activeMemberFilter || 'All'}
              onChange={(e) => onSelectMemberFilter(e.target.value === 'All' ? null : e.target.value)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-medium focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="All">All Household Members ({prescriptions.length})</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.relation})
                </option>
              ))}
            </select>
          </div>

          {/* Status Tabs */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200/80 dark:border-slate-700">
            <button
              onClick={() => setStatusFilter('All')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === 'All'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter('Needs Refill')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                statusFilter === 'Needs Refill'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40'
              }`}
            >
              <AlertTriangle className="w-3 h-3" />
              <span>Needs Refill</span>
            </button>
            <button
              onClick={() => setStatusFilter('Active')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === 'Active'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Active Only
            </button>
          </div>

          {/* Add Prescription Button */}
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-semibold rounded-xl text-xs shadow-md shadow-emerald-600/20 transition-all cursor-pointer ml-auto sm:ml-0"
          >
            <Plus className="w-4 h-4" />
            <span>New Prescription</span>
          </button>
        </div>

      </div>

      {/* Prescription Cards Grid */}
      {filteredPrescriptions.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 p-12 text-center">
          <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Pill className="w-8 h-8 opacity-80" />
          </div>
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No Prescriptions Found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1 mb-4">
            {searchQuery || activeMemberFilter || statusFilter !== 'All'
              ? 'No medications match your selected filters. Try clearing your search parameters.'
              : 'Keep track of daily medications, refill deadlines, and dosing compliance for your whole family.'}
          </p>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white font-semibold rounded-xl text-xs hover:bg-emerald-700 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add First Prescription</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filteredPrescriptions.map((rx) => {
            const isUrgent = rx.status === 'Urgent Refill';
            const isDueSoon = rx.status === 'Refill Due';
            const supplyPercent = rx.totalQuantity > 0 ? Math.min(100, Math.round((rx.remainingQuantity / rx.totalQuantity) * 100)) : 100;

            return (
              <div
                key={rx.id}
                className={`bg-white dark:bg-slate-900 rounded-2xl border transition-all relative overflow-hidden flex flex-col justify-between ${
                  isUrgent
                    ? 'border-rose-300 dark:border-rose-900/80 shadow-sm ring-1 ring-rose-200 dark:ring-rose-900/50'
                    : isDueSoon
                    ? 'border-amber-300 dark:border-amber-900/80 shadow-sm'
                    : 'border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {/* Status indicator bar */}
                <div className={`h-1.5 w-full ${
                  isUrgent ? 'bg-rose-500' : isDueSoon ? 'bg-amber-500' : 'bg-emerald-500'
                }`} />

                <div className="p-5">
                  
                  {/* Top Bar: Family Member Tag & Actions */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    {/* Visual Tag for Family Member */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider ${
                        rx.memberRelation === 'Self (Supervisor)'
                          ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                          : rx.memberRelation === 'Spouse'
                          ? 'bg-teal-100 dark:bg-teal-950/80 text-teal-900 dark:text-teal-300 border border-teal-200 dark:border-teal-800'
                          : rx.memberRelation === 'Son' || rx.memberRelation === 'Daughter'
                          ? 'bg-purple-100 dark:bg-purple-950/80 text-purple-900 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                          : 'bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                      }`}>
                        <span>For: {rx.memberName}</span>
                        <span className="opacity-75">({rx.memberRelation})</span>
                      </span>

                      {/* Medicine Form Tag */}
                      <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                        {rx.form}
                      </span>
                    </div>

                    {/* Edit / Delete Buttons */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEdit(rx)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                        title="Edit Prescription"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete prescription for "${rx.medicineName}"?`)) {
                            handleDelete(rx.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                        title="Delete Prescription"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Main Medicine Name & Dosage */}
                  <div className="mb-3">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                      {rx.medicineName}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800/60">
                        {rx.dosage}
                      </span>
                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        &bull; {rx.frequency}
                      </span>
                    </div>
                  </div>

                  {/* Instructions */}
                  {rx.instructions && (
                    <div className="p-2.5 bg-slate-50 dark:bg-slate-800/70 rounded-xl text-xs text-slate-600 dark:text-slate-300 mb-4 border border-slate-100/80 dark:border-slate-750">
                      <strong className="text-slate-800 dark:text-slate-200">Instructions: </strong>
                      {rx.instructions}
                    </div>
                  )}

                  {/* Daily Dosing Times & "Take Dose" action */}
                  <div className="mb-4">
                    <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                      <span>Today's Dosing Compliance:</span>
                      <span className="text-[10px] text-slate-400 font-normal">Click slot to log intake</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                      {(rx.scheduleTimes || ['Morning']).map((timeSlot) => {
                        const isTaken = rx.takenHistory.some(h => h.date === todayStr && h.timeSlot === timeSlot);
                        return (
                          <button
                            key={timeSlot}
                            onClick={() => onLogDose(rx.id, timeSlot)}
                            className={`p-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                              isTaken
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-800 dark:hover:text-emerald-300'
                            }`}
                          >
                            <span>{timeSlot}</span>
                            {isTaken ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                            ) : (
                              <span className="w-3 h-3 rounded-full border border-slate-300 dark:border-slate-600" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Refill Reminder Tracker & Pill Supply Bar */}
                  {rx.enableRefillReminder && (
                    <div className={`p-3 rounded-xl border ${
                      isUrgent
                        ? 'bg-rose-50/80 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/60 text-rose-900 dark:text-rose-200'
                        : isDueSoon
                        ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-200'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200/70 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}>
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <div className="flex items-center gap-1.5">
                          <Clock className={`w-3.5 h-3.5 ${isUrgent ? 'text-rose-600 dark:text-rose-400' : isDueSoon ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`} />
                          <span className="font-bold">
                            {isUrgent ? 'Urgent Refill Reminder' : isDueSoon ? 'Refill Due Soon' : 'Next Refill Date:'}
                          </span>
                          <span className="font-semibold text-slate-800 dark:text-slate-100">
                            {rx.refillReminderDate || 'Not scheduled'}
                          </span>
                        </div>
                        <span className="font-mono text-[11px] font-bold">
                          {rx.remainingQuantity} / {rx.totalQuantity} units
                        </span>
                      </div>

                      {/* Progress bar */}
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            isUrgent ? 'bg-rose-500' : isDueSoon ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${supplyPercent}%` }}
                        />
                      </div>

                      {/* Pharmacy info & Refill CTA */}
                      <div className="mt-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-700 flex items-center justify-between text-[11px]">
                        <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 truncate max-w-[200px]">
                          <Building2 className="w-3 h-3 shrink-0 text-slate-400" />
                          <span className="truncate">{rx.pharmacyName || 'Pharmacy on File'}</span>
                        </div>
                        <button
                          onClick={() => setRefillModalRx(rx)}
                          className={`font-bold px-2.5 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                            isUrgent || isDueSoon
                              ? 'bg-rose-600 text-white hover:bg-rose-700 shadow-xs'
                              : 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-900/80 border border-emerald-300 dark:border-emerald-700'
                          }`}
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>Request Refill</span>
                        </button>
                      </div>
                    </div>
                  )}

                </div>

                {/* Card Footer: Doctor Name & Rx ID */}
                <div className="px-5 py-3 bg-slate-50/80 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <div className="truncate">
                    Prescribed by: <strong className="text-slate-700 dark:text-slate-200">{rx.prescribedBy || 'Primary Care'}</strong>
                  </div>
                  {rx.refillRxNumber && (
                    <span className="font-mono text-[10px] text-slate-400 bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                      {rx.refillRxNumber}
                    </span>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Refill Request Simulator Modal */}
      {refillModalRx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 w-full max-w-md overflow-hidden">
            
            <div className="bg-gradient-to-r from-emerald-700 to-teal-700 p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <RefreshCw className="w-5 h-5 text-emerald-200 animate-spin-slow" />
                <div>
                  <h3 className="text-sm font-bold">Prescription Refill Dispatch</h3>
                  <p className="text-[11px] text-emerald-100">Send electronic refill authorization to pharmacy</p>
                </div>
              </div>
              <button
                onClick={() => setRefillModalRx(null)}
                className="p-1 rounded-lg text-emerald-100 hover:bg-white/20 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {refillSentSuccess ? (
              <div className="p-8 text-center">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">Refill Request Dispatched!</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Pill supply updated and refill alert resolved for {refillModalRx.memberName}.
                </p>
              </div>
            ) : (
              <form onSubmit={handleProcessRefillSubmit} className="p-6 space-y-4">
                
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700">
                  <div className="text-xs font-bold text-slate-900 dark:text-white">{refillModalRx.medicineName}</div>
                  <div className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                    For: <strong>{refillModalRx.memberName}</strong> &bull; {refillModalRx.dosage}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-mono">
                    Rx #: {refillModalRx.refillRxNumber || 'RX-992841'}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Pharmacy on Record
                  </label>
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs text-slate-700 dark:text-slate-200 flex items-center justify-between border border-slate-200/60 dark:border-slate-700">
                    <span>{refillModalRx.pharmacyName || 'Walgreens Pharmacy #4412'}</span>
                    <span className="text-slate-500 dark:text-slate-400 text-[11px]">{refillModalRx.pharmacyPhone || '+1 (555) 892-3000'}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Refill Supply Quantity (Pills / Doses)
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="180"
                    value={refillQuantity}
                    onChange={(e) => setRefillQuantity(parseInt(e.target.value) || 30)}
                    required
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl text-sm focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Will add {refillQuantity} pills and reset next reminder to +30 days.
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setRefillModalRx(null)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs shadow-md shadow-emerald-600/20 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Authorize & Update Stock</span>
                  </button>
                </div>

              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
