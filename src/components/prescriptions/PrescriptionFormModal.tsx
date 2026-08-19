import React, { useState, useEffect } from 'react';
import { 
  Pill, 
  X, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  Building2, 
  Phone, 
  Sparkles, 
  Check, 
  ShieldAlert,
  HelpCircle,
  FileSpreadsheet
} from 'lucide-react';
import { 
  FamilyMember, 
  Prescription, 
  MedicationForm, 
  MedicationFrequency, 
  RelationType 
} from '../../types';

interface PrescriptionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (prescription: Partial<Prescription> & { medicineName: string; dosage: string; memberId: string }) => void;
  members: FamilyMember[];
  editingPrescription?: Prescription | null;
}

const COMMON_FREQUENCIES: MedicationFrequency[] = [
  'Once daily',
  'Twice daily',
  'Three times daily',
  'Four times daily',
  'Every 8 hours',
  'Every 12 hours',
  'Every other day',
  'Weekly',
  'As needed (PRN)',
];

const MED_FORMS: MedicationForm[] = [
  'Tablet',
  'Capsule',
  'Syrup',
  'Inhaler',
  'Injection',
  'Drops',
  'Cream/Ointment',
  'Patch',
];

const COMMON_DRUG_SUGGESTIONS = [
  { name: 'Amoxicillin 500mg', generic: 'Amoxicillin', form: 'Capsule' as MedicationForm, defaultDose: '500 mg' },
  { name: 'Metformin HCl 500mg ER', generic: 'Metformin ER', form: 'Tablet' as MedicationForm, defaultDose: '500 mg' },
  { name: 'Lisinopril 20mg', generic: 'Lisinopril', form: 'Tablet' as MedicationForm, defaultDose: '20 mg' },
  { name: 'Atorvastatin Calcium 20mg', generic: 'Atorvastatin', form: 'Tablet' as MedicationForm, defaultDose: '20 mg' },
  { name: 'Albuterol Sulfate HFA Inhaler', generic: 'Albuterol', form: 'Inhaler' as MedicationForm, defaultDose: '90 mcg (2 puffs)' },
  { name: 'Levothyroxine 75mcg', generic: 'Levothyroxine Sodium', form: 'Tablet' as MedicationForm, defaultDose: '75 mcg' },
  { name: 'Omeprazole 20mg DR', generic: 'Omeprazole', form: 'Capsule' as MedicationForm, defaultDose: '20 mg' },
  { name: 'Cetirizine HCl 10mg (Zyrtec)', generic: 'Cetirizine', form: 'Tablet' as MedicationForm, defaultDose: '10 mg' },
  { name: 'Montelukast Sodium 10mg (Singulair)', generic: 'Montelukast', form: 'Tablet' as MedicationForm, defaultDose: '10 mg' },
  { name: 'Children Multivitamin Gummies', generic: 'Pediatric Daily Gummies', form: 'Tablet' as MedicationForm, defaultDose: '1 gummy' },
];

export const PrescriptionFormModal: React.FC<PrescriptionFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  members,
  editingPrescription,
}) => {
  const [memberId, setMemberId] = useState<string>('primary');
  const [medicineName, setMedicineName] = useState('');
  const [genericName, setGenericName] = useState('');
  const [dosage, setDosage] = useState('');
  const [form, setForm] = useState<MedicationForm>('Tablet');
  const [frequency, setFrequency] = useState<MedicationFrequency>('Once daily');
  const [scheduleTimes, setScheduleTimes] = useState<('Morning' | 'Afternoon' | 'Evening' | 'Bedtime')[]>(['Morning']);
  const [instructions, setInstructions] = useState('');
  const [prescribedBy, setPrescribedBy] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('');
  
  // Refill Reminder System State
  const [enableRefillReminder, setEnableRefillReminder] = useState(true);
  const [refillReminderDate, setRefillReminderDate] = useState(
    new Date(Date.now() + 25 * 24 * 3600 * 1000).toISOString().split('T')[0]
  );
  const [totalQuantity, setTotalQuantity] = useState(30);
  const [remainingQuantity, setRemainingQuantity] = useState(30);
  const [lowStockThreshold, setLowStockThreshold] = useState(5);
  const [refillRxNumber, setRefillRxNumber] = useState('');
  const [pharmacyName, setPharmacyName] = useState('Walgreens Pharmacy #4412');
  const [pharmacyPhone, setPharmacyPhone] = useState('+1 (555) 892-3000');

  // Allergy warning detector
  const [allergyAlert, setAllergyAlert] = useState<string | null>(null);

  useEffect(() => {
    if (editingPrescription) {
      setMemberId(editingPrescription.memberId);
      setMedicineName(editingPrescription.medicineName);
      setGenericName(editingPrescription.genericName || '');
      setDosage(editingPrescription.dosage);
      setForm(editingPrescription.form);
      setFrequency(editingPrescription.frequency);
      setScheduleTimes(editingPrescription.scheduleTimes || ['Morning']);
      setInstructions(editingPrescription.instructions || '');
      setPrescribedBy(editingPrescription.prescribedBy || '');
      setStartDate(editingPrescription.startDate);
      setEndDate(editingPrescription.endDate || '');
      setEnableRefillReminder(Boolean(editingPrescription.refillReminderDate));
      setRefillReminderDate(editingPrescription.refillReminderDate || new Date(Date.now() + 25 * 24 * 3600 * 1000).toISOString().split('T')[0]);
      setTotalQuantity(editingPrescription.totalQuantity || 30);
      setRemainingQuantity(editingPrescription.remainingQuantity ?? 30);
      setLowStockThreshold(editingPrescription.lowStockThreshold || 5);
      setRefillRxNumber(editingPrescription.refillRxNumber || '');
      setPharmacyName(editingPrescription.pharmacyName || 'Walgreens Pharmacy #4412');
      setPharmacyPhone(editingPrescription.pharmacyPhone || '+1 (555) 892-3000');
    } else {
      resetForm();
    }
  }, [editingPrescription, isOpen]);

  // Check allergy conflicts
  useEffect(() => {
    if (!medicineName || !memberId) {
      setAllergyAlert(null);
      return;
    }

    const selectedMember = members.find(m => m.id === memberId);
    if (!selectedMember || !selectedMember.allergies || selectedMember.allergies.length === 0) {
      setAllergyAlert(null);
      return;
    }

    const medLower = medicineName.toLowerCase();
    const genLower = genericName.toLowerCase();

    for (const allergy of selectedMember.allergies) {
      const aLower = allergy.toLowerCase();
      if (
        medLower.includes(aLower) ||
        genLower.includes(aLower) ||
        (aLower.includes('penicillin') && (medLower.includes('amoxicillin') || medLower.includes('augmentin'))) ||
        (aLower.includes('sulfa') && (medLower.includes('bactrim') || medLower.includes('sulfamethoxazole'))) ||
        (aLower.includes('aspirin') && (medLower.includes('nsaid') || medLower.includes('ibuprofen')))
      ) {
        setAllergyAlert(`Warning: ${selectedMember.name} has a recorded allergy to "${allergy}" which may cross-react with this medication.`);
        return;
      }
    }

    setAllergyAlert(null);
  }, [medicineName, genericName, memberId, members]);

  const resetForm = () => {
    setMemberId(members[0]?.id || 'primary');
    setMedicineName('');
    setGenericName('');
    setDosage('');
    setForm('Tablet');
    setFrequency('Once daily');
    setScheduleTimes(['Morning']);
    setInstructions('');
    setPrescribedBy('');
    setStartDate(new Date().toISOString().split('T')[0]);
    setEndDate('');
    setEnableRefillReminder(true);
    setRefillReminderDate(new Date(Date.now() + 25 * 24 * 3600 * 1000).toISOString().split('T')[0]);
    setTotalQuantity(30);
    setRemainingQuantity(30);
    setLowStockThreshold(5);
    setRefillRxNumber(`RX-${Math.floor(100000 + Math.random() * 900000)}`);
    setPharmacyName('Walgreens Pharmacy #4412');
    setPharmacyPhone('+1 (555) 892-3000');
    setAllergyAlert(null);
  };

  const handleSelectQuickSuggestion = (sug: typeof COMMON_DRUG_SUGGESTIONS[0]) => {
    setMedicineName(sug.name);
    setGenericName(sug.generic);
    setForm(sug.form);
    setDosage(sug.defaultDose);
  };

  const toggleScheduleTime = (slot: 'Morning' | 'Afternoon' | 'Evening' | 'Bedtime') => {
    if (scheduleTimes.includes(slot)) {
      if (scheduleTimes.length > 1) {
        setScheduleTimes(scheduleTimes.filter(s => s !== slot));
      }
    } else {
      setScheduleTimes([...scheduleTimes, slot]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!medicineName.trim() || !dosage.trim()) return;

    const selectedMember = members.find(m => m.id === memberId) || members[0];
    const memberName = selectedMember ? selectedMember.name : 'Sarah Jenkins';
    const memberRelation = selectedMember ? selectedMember.relation : 'Self (Supervisor)';

    onSave({
      memberId,
      memberName,
      memberRelation,
      medicineName: medicineName.trim(),
      genericName: genericName.trim() || undefined,
      dosage: dosage.trim(),
      form,
      frequency,
      scheduleTimes,
      instructions: instructions.trim(),
      prescribedBy: prescribedBy.trim() || undefined,
      startDate,
      endDate: endDate || undefined,
      refillReminderDate: enableRefillReminder ? refillReminderDate : undefined,
      totalQuantity: Number(totalQuantity),
      remainingQuantity: Number(remainingQuantity),
      lowStockThreshold: Number(lowStockThreshold),
      refillRxNumber: refillRxNumber.trim() || undefined,
      pharmacyName: pharmacyName.trim() || undefined,
      pharmacyPhone: pharmacyPhone.trim() || undefined,
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] transition-colors">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl">
              <Pill className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h3 className="text-base font-bold">
                {editingPrescription ? 'Edit Prescription Medication' : 'Prescribe & Schedule New Medication'}
              </h3>
              <p className="text-xs text-emerald-100">
                Configure dosage, dosing regimen, automated refill reminders, and pharmacy contact.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-emerald-100 hover:bg-white/20 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          
          {/* Allergy Safety Warning Alert */}
          {allergyAlert && (
            <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl text-rose-800 dark:text-rose-300 text-xs flex items-start gap-2.5 animate-pulse">
              <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold">Patient Allergy Conflict Warning:</strong>
                <p className="mt-0.5">{allergyAlert}</p>
              </div>
            </div>
          )}

          {/* Section 1: Who is this prescription for? */}
          <div className="bg-slate-50 dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200/80 dark:border-slate-700">
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2">
              1. Assign Prescription To Family Member *
            </label>
            <select
              value={memberId}
              onChange={(e) => setMemberId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            >
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.isPrimary ? `For Me (Primary Supervisor) - ${m.name}` : `For: ${m.name} (${m.relation})`}
                </option>
              ))}
            </select>
          </div>

          {/* Section 2: Medication Details & Quick suggestions */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Medicine / Drug Name *
                </label>
                <span className="text-[11px] text-slate-400 dark:text-slate-500">Brand or generic name</span>
              </div>
              <input
                type="text"
                value={medicineName}
                onChange={(e) => setMedicineName(e.target.value)}
                placeholder="e.g. Amoxicillin 500mg, Lisinopril, Metformin"
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl text-sm focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Quick Suggestions Chips */}
            <div>
              <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                <Sparkles className="w-3 h-3 text-amber-500" /> Common Quick Select:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {COMMON_DRUG_SUGGESTIONS.slice(0, 5).map((sug, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSelectQuickSuggestion(sug)}
                    className="text-[11px] px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 hover:text-emerald-700 dark:hover:text-emerald-300 hover:border-emerald-200 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                  >
                    {sug.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Dosage, Form & Generic Name */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Dosage *
                </label>
                <input
                  type="text"
                  value={dosage}
                  onChange={(e) => setDosage(e.target.value)}
                  placeholder="e.g. 500mg, 10ml, 2 puffs"
                  required
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl text-sm focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Form
                </label>
                <select
                  value={form}
                  onChange={(e) => setForm(e.target.value as MedicationForm)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl text-sm focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {MED_FORMS.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Generic Name (Optional)
                </label>
                <input
                  type="text"
                  value={genericName}
                  onChange={(e) => setGenericName(e.target.value)}
                  placeholder="e.g. Amoxicillin"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl text-sm focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Frequency & Dosing Schedule */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Dosing Frequency *
                </label>
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value as MedicationFrequency)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl text-sm focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {COMMON_FREQUENCIES.map((freq) => (
                    <option key={freq} value={freq}>{freq}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Daily Intake Schedule Slots
                </label>
                <div className="flex items-center gap-1.5">
                  {(['Morning', 'Afternoon', 'Evening', 'Bedtime'] as const).map((slot) => {
                    const isSelected = scheduleTimes.includes(slot);
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => toggleScheduleTime(slot)}
                        className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750'
                        }`}
                      >
                        {slot.slice(0, 3)}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Prescribing Doctor & Date Range */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Prescribing Physician
                </label>
                <input
                  type="text"
                  value={prescribedBy}
                  onChange={(e) => setPrescribedBy(e.target.value)}
                  placeholder="e.g. Dr. Keith Vance, MD"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl text-sm focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl text-sm focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  End Date (Optional)
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl text-sm focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Special Instructions */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Special Consumption Instructions
              </label>
              <input
                type="text"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="e.g. Take with a full glass of water with food; avoid citrus."
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl text-sm focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Section 3: Refill Reminder System */}
          <div className="p-4 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-800/80 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-600 text-white">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-emerald-950 dark:text-emerald-200 block">
                    Prescription Refill Reminder System
                  </span>
                  <span className="text-[11px] text-emerald-700 dark:text-emerald-400">
                    Automated email/SMS triggers before supply exhaustion
                  </span>
                </div>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={enableRefillReminder}
                  onChange={(e) => setEnableRefillReminder(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            {enableRefillReminder && (
              <div className="space-y-3 pt-2 border-t border-emerald-200/80 dark:border-emerald-800/60">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-emerald-900 dark:text-emerald-300 mb-1">
                      Target Refill Reminder Date *
                    </label>
                    <input
                      type="date"
                      value={refillReminderDate}
                      onChange={(e) => setRefillReminderDate(e.target.value)}
                      required={enableRefillReminder}
                      className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-700 text-slate-900 dark:text-white rounded-xl text-xs focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-emerald-900 dark:text-emerald-300 mb-1">
                      Total Bottle Quantity
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={totalQuantity}
                      onChange={(e) => setTotalQuantity(parseInt(e.target.value) || 30)}
                      className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-700 text-slate-900 dark:text-white rounded-xl text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-emerald-900 dark:text-emerald-300 mb-1">
                      Remaining Quantity
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={remainingQuantity}
                      onChange={(e) => setRemainingQuantity(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-700 text-slate-900 dark:text-white rounded-xl text-xs"
                    />
                  </div>
                </div>

                {/* Pharmacy Coordination Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-semibold text-emerald-900 dark:text-emerald-300 mb-1">
                      Rx Serial # / Bottle ID
                    </label>
                    <input
                      type="text"
                      value={refillRxNumber}
                      onChange={(e) => setRefillRxNumber(e.target.value)}
                      placeholder="e.g. RX-849102"
                      className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-700 text-slate-900 dark:text-white rounded-xl text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-emerald-900 dark:text-emerald-300 mb-1">
                      Pharmacy Name
                    </label>
                    <input
                      type="text"
                      value={pharmacyName}
                      onChange={(e) => setPharmacyName(e.target.value)}
                      placeholder="e.g. Walgreens, CVS"
                      className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-700 text-slate-900 dark:text-white rounded-xl text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-emerald-900 dark:text-emerald-300 mb-1">
                      Pharmacy Phone
                    </label>
                    <input
                      type="text"
                      value={pharmacyPhone}
                      onChange={(e) => setPharmacyPhone(e.target.value)}
                      placeholder="e.g. +1 (555) 892-3000"
                      className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-700 text-slate-900 dark:text-white rounded-xl text-xs"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
            >
              {editingPrescription ? 'Save Changes' : 'Confirm & Save Prescription'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
