import React, { useState } from 'react';
import { 
  Download, 
  FileText, 
  Printer, 
  Check, 
  X, 
  Copy, 
  Share2, 
  ShieldCheck, 
  Pill, 
  AlertTriangle, 
  Activity, 
  Calendar, 
  Stethoscope, 
  Building2, 
  User as UserIcon,
  Phone,
  Code2
} from 'lucide-react';
import { FamilyMember, HealthRecord, Prescription } from '../../types';

interface ExportSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  members: FamilyMember[];
  records: HealthRecord[];
  prescriptions: Prescription[];
  initialMemberId?: string | null;
}

export const ExportSummaryModal: React.FC<ExportSummaryModalProps> = ({
  isOpen,
  onClose,
  members,
  records,
  prescriptions,
  initialMemberId,
}) => {
  const [selectedMemberId, setSelectedMemberId] = useState<string>(initialMemberId || 'All');
  const [includePrescriptions, setIncludePrescriptions] = useState(true);
  const [includeRecords, setIncludeRecords] = useState(true);
  const [includeVitals, setIncludeVitals] = useState(true);
  const [includeAllergies, setIncludeAllergies] = useState(true);
  const [copiedStatus, setCopiedStatus] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'json'>('preview');

  if (!isOpen) return null;

  // Filter data based on selected member
  const targetMembers = selectedMemberId === 'All' 
    ? members 
    : members.filter(m => m.id === selectedMemberId);

  const targetPrescriptions = selectedMemberId === 'All'
    ? prescriptions
    : prescriptions.filter(p => p.memberId === selectedMemberId);

  const targetRecords = selectedMemberId === 'All'
    ? records
    : records.filter(r => r.memberId === selectedMemberId);

  // Generate structured Clinical JSON export
  const generateExportJSON = () => {
    const exportData = {
      portal: "DawaaiiRx Family Health & Prescription Management Portal",
      exportDate: new Date().toISOString(),
      generatedFor: selectedMemberId === 'All' ? 'All Family Members' : targetMembers[0]?.name,
      patientProfiles: targetMembers.map(member => {
        const memRx = targetPrescriptions.filter(p => p.memberId === member.id);
        const memRecords = targetRecords.filter(r => r.memberId === member.id);

        return {
          id: member.id,
          name: member.name,
          relation: member.relation,
          age: member.age,
          gender: member.gender,
          bloodGroup: member.bloodGroup || 'Unknown',
          emergencyContact: member.emergencyContact,
          knownAllergies: member.allergies || [],
          prescriptions: includePrescriptions ? memRx.map(p => ({
            id: p.id,
            medicineName: p.medicineName,
            genericName: p.genericName,
            dosage: p.dosage,
            form: p.form,
            frequency: p.frequency,
            scheduleTimes: p.scheduleTimes,
            instructions: p.instructions,
            prescribedBy: p.prescribedBy,
            startDate: p.startDate,
            endDate: p.endDate,
            remainingQuantity: p.remainingQuantity,
            refillReminderDate: p.refillReminderDate,
            pharmacyName: p.pharmacyName,
            pharmacyPhone: p.pharmacyPhone,
            status: p.status,
          })) : undefined,
          healthRecords: includeRecords ? memRecords.map(r => ({
            id: r.id,
            title: r.title,
            category: r.category,
            dateRecorded: r.dateRecorded,
            doctorOrClinic: r.doctorOrClinic,
            details: r.details,
            severity: r.severity,
            vitals: includeVitals ? r.vitals : undefined,
            tags: r.tags,
            hasPhoto: Boolean(r.capturedImage),
            imageType: r.imageType,
          })) : undefined,
        };
      })
    };
    return JSON.stringify(exportData, null, 2);
  };

  const handleDownloadJSON = () => {
    const jsonStr = generateExportJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const filename = `DawaaiiRx_Medical_Summary_${selectedMemberId === 'All' ? 'Family' : targetMembers[0]?.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.json`;
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePrintOrPDF = () => {
    window.print();
  };

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(generateExportJSON());
    setCopiedStatus(true);
    setTimeout(() => setCopiedStatus(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 w-full max-w-4xl max-h-[92vh] overflow-hidden flex flex-col transition-colors">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-xl">
              <Download className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h3 className="text-base font-bold">Export Medical Records & Prescriptions</h3>
              <p className="text-xs text-emerald-100">
                Generate clinical summaries in PDF printable format or secure JSON structures for doctors & specialists.
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

        {/* Filter Controls Bar */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3 text-xs">
          
          {/* Member select */}
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-600 dark:text-slate-300">Target Member:</span>
            <select
              value={selectedMemberId}
              onChange={(e) => setSelectedMemberId(e.target.value)}
              className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg font-medium focus:ring-2 focus:ring-emerald-500"
            >
              <option value="All">All Family Members ({members.length})</option>
              {members.map(m => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.relation})
                </option>
              ))}
            </select>
          </div>

          {/* Section check items */}
          <div className="flex items-center gap-3 flex-wrap">
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 dark:text-slate-300 font-medium">
              <input
                type="checkbox"
                checked={includePrescriptions}
                onChange={(e) => setIncludePrescriptions(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>Prescriptions</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 dark:text-slate-300 font-medium">
              <input
                type="checkbox"
                checked={includeRecords}
                onChange={(e) => setIncludeRecords(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>Health Records</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 dark:text-slate-300 font-medium">
              <input
                type="checkbox"
                checked={includeAllergies}
                onChange={(e) => setIncludeAllergies(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>Allergies</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 dark:text-slate-300 font-medium">
              <input
                type="checkbox"
                checked={includeVitals}
                onChange={(e) => setIncludeVitals(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>Vitals & Labs</span>
            </label>
          </div>

          {/* View Tab Toggle */}
          <div className="flex rounded-lg bg-slate-200 dark:bg-slate-700 p-0.5">
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'preview' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              Medical PDF Preview
            </button>
            <button
              onClick={() => setActiveTab('json')}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'json' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              JSON Data
            </button>
          </div>

        </div>

        {/* Modal Body Preview Area */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-100/60 dark:bg-slate-950/60 print:bg-white print:p-0">
          
          {activeTab === 'preview' ? (
            /* Printable Clinical Summary Document */
            <div id="printable-medical-summary" className="bg-white dark:bg-slate-900 p-8 rounded-xl shadow-xs border border-slate-200 dark:border-slate-800 print:border-none print:shadow-none max-w-3xl mx-auto space-y-6 transition-colors">
              
              {/* Header Letterhead */}
              <div className="border-b-2 border-emerald-700 pb-4 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                      Dx
                    </div>
                    <h1 className="text-xl font-black text-slate-900 dark:text-white">
                      Dawaaii<span className="text-emerald-600 dark:text-emerald-400">Rx</span> Medical Summary
                    </h1>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Family Health & Comprehensive Medication Management Profile
                  </p>
                </div>
                <div className="text-right text-xs text-slate-500 dark:text-slate-400">
                  <div className="font-bold text-slate-800 dark:text-slate-200">Confidential Medical Document</div>
                  <div>Generated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                  <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold">HIPAA Ready &bull; Verified Portal Data</div>
                </div>
              </div>

              {/* Patient Sections */}
              {targetMembers.map((member) => {
                const memberPrescriptions = targetPrescriptions.filter(p => p.memberId === member.id);
                const memberHealthRecords = targetRecords.filter(r => r.memberId === member.id);

                return (
                  <div key={member.id} className="space-y-4 pb-6 border-b border-slate-200 dark:border-slate-800 last:border-b-0">
                    
                    {/* Patient Demographics Card */}
                    <div className="bg-slate-50 dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <UserIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          <span>{member.name}</span>
                          <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 rounded-md">
                            {member.relation}
                          </span>
                        </div>
                        <div className="text-slate-600 dark:text-slate-300 mt-1">
                          Age: <strong>{member.age} yrs</strong> &bull; Gender: <strong>{member.gender}</strong> &bull; Blood Group: <strong>{member.bloodGroup || 'Unknown'}</strong>
                        </div>
                      </div>

                      {member.emergencyContact && (
                        <div className="text-right text-slate-600 dark:text-slate-300">
                          <div className="text-[11px] text-slate-400 dark:text-slate-500 font-semibold uppercase">Emergency Contact</div>
                          <div className="font-semibold">{member.emergencyContact}</div>
                        </div>
                      )}
                    </div>

                    {/* Allergies Alert Box */}
                    {includeAllergies && member.allergies && member.allergies.length > 0 && (
                      <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl text-xs">
                        <div className="flex items-center gap-1.5 font-bold text-rose-800 dark:text-rose-300 mb-1">
                          <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                          <span>CRITICAL ALLERGIES & ADVERSE DRUG REACTIONS:</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {member.allergies.map((a, i) => (
                            <span key={i} className="px-2 py-0.5 bg-rose-200/80 dark:bg-rose-900/80 text-rose-900 dark:text-rose-200 rounded font-bold">
                              {a}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Active Prescriptions Table */}
                    {includePrescriptions && (
                      <div>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2">
                          <Pill className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          <span>Active Prescriptions & Dosing Protocol</span>
                        </div>

                        {memberPrescriptions.length === 0 ? (
                          <div className="text-xs text-slate-400 italic bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                            No active medications currently assigned.
                          </div>
                        ) : (
                          <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden text-xs">
                            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700 text-left">
                              <thead className="bg-slate-50 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-300">
                                <tr>
                                  <th className="p-2.5">Medication & Form</th>
                                  <th className="p-2.5">Dosage</th>
                                  <th className="p-2.5">Frequency / Times</th>
                                  <th className="p-2.5">Instructions</th>
                                  <th className="p-2.5">Refill Status</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {memberPrescriptions.map(p => (
                                  <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                                    <td className="p-2.5 font-bold text-slate-900 dark:text-white">
                                      {p.medicineName}
                                      {p.genericName && (
                                        <div className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">({p.genericName})</div>
                                      )}
                                    </td>
                                    <td className="p-2.5 text-slate-700 dark:text-slate-300">{p.dosage}</td>
                                    <td className="p-2.5 text-slate-700 dark:text-slate-300">
                                      <div>{p.frequency}</div>
                                      <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold">{p.scheduleTimes?.join(', ')}</div>
                                    </td>
                                    <td className="p-2.5 text-slate-600 dark:text-slate-400 italic max-w-xs">{p.instructions || 'As directed'}</td>
                                    <td className="p-2.5">
                                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                        p.remainingQuantity && p.remainingQuantity <= 5
                                          ? 'bg-rose-100 text-rose-800'
                                          : 'bg-emerald-100 text-emerald-800'
                                      }`}>
                                        {p.remainingQuantity ?? 30} units left
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Health Records Section */}
                    {includeRecords && (
                      <div>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2">
                          <Stethoscope className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                          <span>Clinical Health Records & Doctor Consultations</span>
                        </div>

                        {memberHealthRecords.length === 0 ? (
                          <div className="text-xs text-slate-400 italic bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                            No medical records filed for this member.
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {memberHealthRecords.map(r => (
                              <div key={r.id} className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
                                <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                                  <span>{r.title}</span>
                                  <span className="text-slate-500 dark:text-slate-400 font-normal">{r.dateRecorded} &bull; {r.category}</span>
                                </div>
                                {r.doctorOrClinic && (
                                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Provider: {r.doctorOrClinic}</div>
                                )}
                                <p className="text-slate-700 dark:text-slate-300 mt-1.5 leading-relaxed">{r.details}</p>
                                
                                {includeVitals && r.vitals && Object.keys(r.vitals).length > 0 && (
                                  <div className="mt-2 flex gap-3 flex-wrap text-[11px] text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-700">
                                    {r.vitals.bloodPressure && <span><strong>BP:</strong> {r.vitals.bloodPressure}</span>}
                                    {r.vitals.heartRate && <span><strong>HR:</strong> {r.vitals.heartRate}</span>}
                                    {r.vitals.bloodGlucose && <span><strong>Glucose:</strong> {r.vitals.bloodGlucose}</span>}
                                    {r.vitals.weight && <span><strong>Weight:</strong> {r.vitals.weight}</span>}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                  </div>
                );
              })}

              {/* Document Disclaimer Footer */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-[10px] text-slate-400 dark:text-slate-500 text-center leading-relaxed">
                Notice: This report was prepared via the DawaaiiRx Family Health Platform for healthcare coordination purposes. Always verify critical drug interactions directly with licensed physicians and dispensing pharmacists.
              </div>

            </div>
          ) : (
            /* JSON View */
            <div className="max-w-3xl mx-auto space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span className="font-mono">Export Schema: application/json</span>
                <button
                  onClick={handleCopyJSON}
                  className="flex items-center gap-1 px-3 py-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  {copiedStatus ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedStatus ? 'Copied to Clipboard' : 'Copy JSON'}</span>
                </button>
              </div>
              <pre className="p-4 bg-slate-900 text-emerald-400 rounded-xl text-xs overflow-x-auto max-h-[500px] border border-slate-800">
                {generateExportJSON()}
              </pre>
            </div>
          )}

        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
          <div className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
            {targetMembers.length} {targetMembers.length === 1 ? 'patient profile' : 'patient profiles'} included
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handlePrintOrPDF}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>

            <button
              onClick={handleDownloadJSON}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download JSON File</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
