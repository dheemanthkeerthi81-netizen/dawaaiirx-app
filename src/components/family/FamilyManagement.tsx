import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Heart, 
  AlertCircle, 
  Trash2, 
  Edit3, 
  Pill, 
  ShieldCheck, 
  Phone, 
  Droplet, 
  Calendar,
  X,
  CheckCircle2,
  Sparkles,
  FileText
} from 'lucide-react';
import { FamilyMember, Prescription, RelationType, HealthRecord } from '../../types';

interface FamilyManagementProps {
  members: FamilyMember[];
  prescriptions: Prescription[];
  records?: HealthRecord[];
  onAddMember: (member: Omit<FamilyMember, 'id' | 'createdAt'>) => void;
  onUpdateMember: (member: FamilyMember) => void;
  onDeleteMember: (id: string) => void;
  onSelectMemberForPrescriptions?: (memberId: string) => void;
  onFilterByMember?: (memberId: string) => void;
  selectedMemberFilter?: string | null;
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
}

const RELATION_OPTIONS: RelationType[] = [
  'Spouse',
  'Son',
  'Daughter',
  'Mother',
  'Father',
  'Grandparent',
  'Sibling',
  'Other Dependent',
];

const AVATAR_COLORS = [
  'bg-emerald-600 text-white',
  'bg-teal-600 text-white',
  'bg-indigo-600 text-white',
  'bg-rose-500 text-white',
  'bg-amber-500 text-white',
  'bg-purple-600 text-white',
  'bg-sky-600 text-white',
  'bg-cyan-700 text-white',
];

export const FamilyManagement: React.FC<FamilyManagementProps> = ({
  members,
  prescriptions,
  records = [],
  onAddMember,
  onUpdateMember,
  onDeleteMember,
  onSelectMemberForPrescriptions,
  onFilterByMember,
  selectedMemberFilter,
  isAddModalOpen,
  setIsAddModalOpen,
}) => {
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [relation, setRelation] = useState<RelationType>('Son');
  const [age, setAge] = useState<number | ''>(12);
  const [gender, setGender] = useState<'Female' | 'Male' | 'Other'>('Male');
  const [bloodGroup, setBloodGroup] = useState<FamilyMember['bloodGroup']>('O+');
  const [allergiesText, setAllergiesText] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [notes, setNotes] = useState('');
  const [avatarColor, setAvatarColor] = useState(AVATAR_COLORS[0]);

  const handleFilterClick = onSelectMemberForPrescriptions || onFilterByMember || (() => {});

  const handleOpenAdd = () => {
    setEditingMember(null);
    setName('');
    setRelation('Son');
    setAge(12);
    setGender('Male');
    setBloodGroup('O+');
    setAllergiesText('');
    setEmergencyContact('');
    setNotes('');
    setAvatarColor(AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)]);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (m: FamilyMember) => {
    setEditingMember(m);
    setName(m.name);
    setRelation(m.relation);
    setAge(m.age);
    setGender(m.gender);
    setBloodGroup(m.bloodGroup || 'O+');
    setAllergiesText(m.allergies ? m.allergies.join(', ') : '');
    setEmergencyContact(m.emergencyContact || '');
    setNotes(m.notes || '');
    setAvatarColor(m.avatarColor || AVATAR_COLORS[0]);
    setIsAddModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || age === '') return;

    const allergies = allergiesText
      .split(',')
      .map(a => a.trim())
      .filter(Boolean);

    if (editingMember) {
      onUpdateMember({
        ...editingMember,
        name: name.trim(),
        relation,
        age: Number(age),
        gender,
        bloodGroup,
        allergies,
        emergencyContact: emergencyContact.trim(),
        notes: notes.trim(),
        avatarColor,
      });
    } else {
      onAddMember({
        name: name.trim(),
        relation,
        age: Number(age),
        gender,
        bloodGroup,
        allergies,
        emergencyContact: emergencyContact.trim(),
        notes: notes.trim(),
        avatarColor,
        isPrimary: false,
      });
    }

    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header bar */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Household Family Profiles</h2>
            <span className="px-2.5 py-0.5 text-xs font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 rounded-full border border-emerald-200 dark:border-emerald-800/80">
              {members.length} Supervised
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage dependents, monitor prescription safety, and record vital emergency parameters.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-semibold rounded-xl text-xs shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Family Member</span>
        </button>
      </div>

      {/* Members Grid */}
      {members.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 p-12 text-center">
          <Users className="w-12 h-12 mx-auto text-slate-400 mb-3" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">No Family Members Found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">
            Add children, parents, spouse, or other dependents to start managing their prescriptions.
          </p>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-emerald-700 transition-colors"
          >
            Add Profile
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {members.map((member) => {
            const memberPrescriptions = prescriptions.filter(p => p.memberId === member.id);
            const memberRecords = records.filter(r => r.memberId === member.id);
            const needsRefill = memberPrescriptions.some(p => p.status === 'Refill Due' || p.status === 'Urgent Refill');
            const isSelected = selectedMemberFilter === member.id;

            return (
              <div
                key={member.id}
                className={`bg-white dark:bg-slate-900 rounded-2xl border transition-all relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? 'ring-2 ring-emerald-500 border-emerald-500 shadow-md'
                    : 'border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {/* Top decorative stripe for primary vs dependent */}
                <div className={`h-1.5 w-full ${member.isPrimary ? 'bg-emerald-600' : 'bg-slate-200 dark:bg-slate-800'}`} />

                <div className="p-5">
                  {/* Top Bar: Avatar, Name & Relation Badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-base shadow-xs ${member.avatarColor || 'bg-emerald-600 text-white'}`}>
                        {member.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                            {member.name}
                          </h3>
                          {member.isPrimary && (
                            <span title="Primary Supervisor">
                              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                            </span>
                          )}
                        </div>
                        
                        {/* Relation Badge */}
                        <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                          <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                            member.isPrimary
                              ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                              : member.relation === 'Spouse'
                              ? 'bg-teal-100 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800'
                              : member.relation === 'Son' || member.relation === 'Daughter'
                              ? 'bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                              : member.relation === 'Mother' || member.relation === 'Father'
                              ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                          }`}>
                            {member.relation}
                          </span>

                          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                            {member.age} yrs &bull; {member.gender}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    {!member.isPrimary && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEdit(member)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                          title="Edit member details"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Are you sure you want to remove ${member.name} from family management?`)) {
                              onDeleteMember(member.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                          title="Remove member"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Medical Quick Tags: Blood & Allergies */}
                  <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                      <span className="flex items-center gap-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                        <Droplet className="w-3.5 h-3.5 text-rose-500" /> Blood Type:
                      </span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-[11px]">
                        {member.bloodGroup || 'Unknown'}
                      </span>
                    </div>

                    {/* Allergies list */}
                    <div>
                      <div className="flex items-center gap-1 text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-500" /> Known Allergies:
                      </div>
                      {member.allergies && member.allergies.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {member.allergies.map((allergy, i) => (
                            <span
                              key={i}
                              className="text-[10px] font-semibold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 px-1.5 py-0.5 rounded-md border border-rose-200 dark:border-rose-900/60"
                            >
                              {allergy}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">No known drug/food allergies recorded</span>
                      )}
                    </div>

                    {/* Emergency Contact */}
                    {member.emergencyContact && (
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 pt-1">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span className="truncate">{member.emergencyContact}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer bar with quick prescription counter & filter */}
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Pill className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                      {memberPrescriptions.length} {memberPrescriptions.length === 1 ? 'Prescription' : 'Prescriptions'}
                    </span>
                    {needsRefill && (
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" title="Has pending refill reminder" />
                    )}
                  </div>

                  <button
                    onClick={() => handleFilterClick(member.id)}
                    className={`text-xs font-bold px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-600 text-white'
                        : 'text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100/70 dark:hover:bg-slate-700'
                    }`}
                  >
                    {isSelected ? 'Viewing Active' : 'Filter Prescriptions'}
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Family Member Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 w-full max-w-lg overflow-hidden">
            
            <div className="bg-gradient-to-r from-emerald-700 to-teal-700 p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <UserPlus className="w-5 h-5 text-emerald-200" />
                <h3 className="text-base font-bold">
                  {editingMember ? 'Edit Family Member Profile' : 'Add New Family Member'}
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-emerald-100 hover:bg-white/20 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              
              {/* Name & Relation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. John Jenkins Jr."
                    required
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl text-sm focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Relationship *
                  </label>
                  <select
                    value={relation}
                    onChange={(e) => setRelation(e.target.value as RelationType)}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl text-sm focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {RELATION_OPTIONS.map((rel) => (
                      <option key={rel} value={rel}>{rel}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Age, Gender & Blood Group */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Age (Years)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="120"
                    value={age}
                    onChange={(e) => setAge(e.target.value === '' ? '' : parseInt(e.target.value))}
                    required
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl text-sm focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Gender
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl text-sm focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Blood Group
                  </label>
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl text-sm focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="Unknown">Unknown</option>
                  </select>
                </div>
              </div>

              {/* Known Allergies */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Known Drug & Food Allergies (Comma separated)
                </label>
                <input
                  type="text"
                  value={allergiesText}
                  onChange={(e) => setAllergiesText(e.target.value)}
                  placeholder="e.g. Amoxicillin, Peanuts, Sulfa"
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl text-sm focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Critical alerts will display across prescription assignments.
                </p>
              </div>

              {/* Emergency Contact */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Emergency Contact / Phone
                </label>
                <input
                  type="text"
                  value={emergencyContact}
                  onChange={(e) => setEmergencyContact(e.target.value)}
                  placeholder="e.g. Dr. Vance / Dad: +1 (555) 438-9211"
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl text-sm focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Special Care Instructions or Chronic Conditions (Optional)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Needs reminder for morning inhaler; mild eczema."
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl text-sm focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Avatar Color selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Profile Badge Color
                </label>
                <div className="flex items-center gap-2">
                  {AVATAR_COLORS.map((col, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setAvatarColor(col)}
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform cursor-pointer ${col} ${
                        avatarColor === col ? 'ring-2 ring-offset-2 ring-emerald-600 scale-110' : 'hover:scale-105'
                      }`}
                    >
                      {avatarColor === col && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                >
                  {editingMember ? 'Save Changes' : 'Register Family Member'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
