import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Calendar, 
  User, 
  AlertCircle, 
  Activity, 
  Stethoscope, 
  Syringe, 
  HeartPulse, 
  ClipboardList, 
  Trash2, 
  Search, 
  Filter, 
  Paperclip, 
  Eye, 
  X, 
  ChevronRight,
  Sparkles,
  Download,
  CheckCircle2,
  Share2,
  Camera,
  Image as ImageIcon,
  Maximize2,
  Scan,
  RotateCcw,
  ExternalLink
} from 'lucide-react';
import { HealthRecord, HealthRecordCategory, FamilyMember, RelationType, Prescription } from '../../types';
import { ExportSummaryModal } from './ExportSummaryModal';
import { CameraCaptureModal } from './CameraCaptureModal';
import { ImageLightboxModal } from './ImageLightboxModal';

interface HealthRecordsSectionProps {
  records: HealthRecord[];
  members: FamilyMember[];
  prescriptions?: Prescription[];
  onAddRecord: (record: Partial<HealthRecord> & { title: string; category: HealthRecordCategory; memberId: string; details: string; capturedImage?: string; imageType?: 'doctor_note' | 'prescription_label' | 'medical_report' | 'other' }) => void;
  onDeleteRecord: (id: string) => void;
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
}

const CATEGORIES: HealthRecordCategory[] = [
  'Allergy & Adverse Reaction',
  'Doctor Visit & Consultation',
  'Lab & Diagnostic Report',
  'Past Illness & Surgery',
  'Vaccination / Immunization',
  'Vitals & Daily Biometrics',
  'Chronic Condition Management',
];

const CATEGORY_ICONS: Record<HealthRecordCategory, React.ReactNode> = {
  'Allergy & Adverse Reaction': <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />,
  'Doctor Visit & Consultation': <Stethoscope className="w-4 h-4 text-teal-600 dark:text-teal-400" />,
  'Lab & Diagnostic Report': <ClipboardList className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />,
  'Past Illness & Surgery': <HeartPulse className="w-4 h-4 text-amber-600 dark:text-amber-400" />,
  'Vaccination / Immunization': <Syringe className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
  'Vitals & Daily Biometrics': <Activity className="w-4 h-4 text-sky-600 dark:text-sky-400" />,
  'Chronic Condition Management': <FileText className="w-4 h-4 text-purple-600 dark:text-purple-400" />,
};

const CATEGORY_COLORS: Record<HealthRecordCategory, string> = {
  'Allergy & Adverse Reaction': 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-900/60',
  'Doctor Visit & Consultation': 'bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300 border-teal-200 dark:border-teal-900/60',
  'Lab & Diagnostic Report': 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-900/60',
  'Past Illness & Surgery': 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-900/60',
  'Vaccination / Immunization': 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/60',
  'Vitals & Daily Biometrics': 'bg-sky-50 dark:bg-sky-950/40 text-sky-800 dark:text-sky-300 border-sky-200 dark:border-sky-900/60',
  'Chronic Condition Management': 'bg-purple-50 dark:bg-purple-950/40 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-900/60',
};

export const HealthRecordsSection: React.FC<HealthRecordsSectionProps> = ({
  records,
  members,
  prescriptions = [],
  onAddRecord,
  onDeleteRecord,
  isAddModalOpen,
  setIsAddModalOpen,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');
  const [selectedMemberFilter, setSelectedMemberFilter] = useState<string>('All');
  
  // Modals state
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [viewRecord, setViewRecord] = useState<HealthRecord | null>(null);
  const [lightboxData, setLightboxData] = useState<{ url: string; title: string; type?: string; record?: HealthRecord } | null>(null);

  // Form State
  const [memberId, setMemberId] = useState(members[0]?.id || 'primary');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<HealthRecordCategory>('Doctor Visit & Consultation');
  const [dateRecorded, setDateRecorded] = useState(new Date().toISOString().split('T')[0]);
  const [doctorOrClinic, setDoctorOrClinic] = useState('');
  const [details, setDetails] = useState('');
  const [severity, setSeverity] = useState<'Mild' | 'Moderate' | 'Severe' | 'Critical'>('Mild');
  const [tagsInput, setTagsInput] = useState('');
  const [attachedFileName, setAttachedFileName] = useState('');
  
  // Camera & Image State for Form
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [capturedImageType, setCapturedImageType] = useState<'doctor_note' | 'prescription_label' | 'medical_report' | 'other'>('doctor_note');
  const [manualImageUrl, setManualImageUrl] = useState('');
  const [showManualUrlInput, setShowManualUrlInput] = useState(false);

  // Optional Vitals Fields
  const [includeVitals, setIncludeVitals] = useState(false);
  const [bloodPressure, setBloodPressure] = useState('');
  const [heartRate, setHeartRate] = useState('');
  const [bloodGlucose, setBloodGlucose] = useState('');
  const [temperature, setTemperature] = useState('');
  const [weight, setWeight] = useState('');
  const [spO2, setSpO2] = useState('');

  const resetForm = () => {
    setMemberId(members[0]?.id || 'primary');
    setTitle('');
    setCategory('Doctor Visit & Consultation');
    setDateRecorded(new Date().toISOString().split('T')[0]);
    setDoctorOrClinic('');
    setDetails('');
    setSeverity('Mild');
    setTagsInput('');
    setAttachedFileName('');
    setIncludeVitals(false);
    setBloodPressure('');
    setHeartRate('');
    setBloodGlucose('');
    setTemperature('');
    setWeight('');
    setSpO2('');
    setCapturedImage(null);
    setCapturedImageType('doctor_note');
    setManualImageUrl('');
    setShowManualUrlInput(false);
  };

  const handleOpenAddModal = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const handleQuickCameraLaunch = () => {
    setIsCameraModalOpen(true);
  };

  const handleCameraCapture = (imageDataUrl: string, type: 'doctor_note' | 'prescription_label' | 'medical_report' | 'other') => {
    setCapturedImage(imageDataUrl);
    setCapturedImageType(type);
    setIsCameraModalOpen(false);
    
    // Auto populate title & category based on document type
    if (!title) {
      if (type === 'doctor_note') {
        setTitle("Doctor's Handwritten Note");
        setCategory('Doctor Visit & Consultation');
      } else if (type === 'prescription_label') {
        setTitle('Prescription Medication Label');
        setCategory('Chronic Condition Management');
      } else if (type === 'medical_report') {
        setTitle('Diagnostic Lab Test Slip');
        setCategory('Lab & Diagnostic Report');
      }
    }
    
    setIsAddModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !details.trim()) return;

    const member = members.find(m => m.id === memberId) || members[0];
    const memberName = member ? member.name : 'Sarah Jenkins';
    const memberRelation = member ? member.relation : 'Self (Supervisor)';

    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const attachments = attachedFileName.trim()
      ? [{ name: attachedFileName.trim(), size: '1.2 MB', url: '#' }]
      : undefined;

    const vitalsObj = includeVitals ? {
      bloodPressure: bloodPressure.trim() || undefined,
      heartRate: heartRate.trim() ? `${heartRate.trim()} bpm` : undefined,
      bloodGlucose: bloodGlucose.trim() ? `${bloodGlucose.trim()} mg/dL` : undefined,
      temperature: temperature.trim() ? `${temperature.trim()} °F` : undefined,
      weight: weight.trim() ? `${weight.trim()} kg` : undefined,
      spO2: spO2.trim() ? `${spO2.trim()}%` : undefined,
    } : undefined;

    const finalImage = capturedImage || (manualImageUrl.trim() ? manualImageUrl.trim() : undefined);

    onAddRecord({
      memberId,
      memberName,
      memberRelation,
      title,
      category,
      dateRecorded,
      doctorOrClinic,
      details,
      severity,
      tags,
      vitals: vitalsObj,
      attachments,
      capturedImage: finalImage,
      imageType: finalImage ? capturedImageType : undefined,
    });

    setIsAddModalOpen(false);
    resetForm();
  };

  // Sort chronological descending (latest date first)
  const sortedRecords = [...records].sort((a, b) => {
    return new Date(b.dateRecorded).getTime() - new Date(a.dateRecorded).getTime();
  });

  // Filter records
  const filteredRecords = sortedRecords.filter(rec => {
    if (selectedMemberFilter !== 'All' && rec.memberId !== selectedMemberFilter) {
      return false;
    }
    if (selectedCategoryFilter !== 'All' && rec.category !== selectedCategoryFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = rec.title.toLowerCase().includes(q);
      const matchDetails = rec.details.toLowerCase().includes(q);
      const matchDoctor = rec.doctorOrClinic?.toLowerCase().includes(q);
      const matchMember = rec.memberName.toLowerCase().includes(q);
      const matchTags = rec.tags?.some(t => t.toLowerCase().includes(q));
      if (!matchTitle && !matchDetails && !matchDoctor && !matchMember && !matchTags) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs transition-colors">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <FileText className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Family Health & Medical Records</h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Chronological documentation for allergies, past illnesses, doctor consultations, camera-scanned notes, and lab reports.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Quick Camera Snapshot Button */}
          <button
            onClick={handleQuickCameraLaunch}
            className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-semibold rounded-xl text-xs border border-emerald-300 dark:border-emerald-700 shadow-xs transition-all cursor-pointer"
            title="Open camera to photograph a doctor note or prescription label"
          >
            <Camera className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
            <span>Scan / Take Photo</span>
          </button>

          {/* Export Records Button */}
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold rounded-xl text-xs border border-slate-200 dark:border-slate-700 shadow-xs transition-all cursor-pointer hover:border-slate-300"
            title="Export summary of health history & prescriptions as JSON or PDF"
          >
            <Download className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Export Records</span>
          </button>

          {/* Add Health Record Button */}
          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-semibold rounded-xl text-xs shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Health Record</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-stretch md:items-center gap-3 transition-colors">
        
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search records, notes, prescriptions, doctor notes, allergies..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-xl text-xs focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
        </div>

        {/* Member filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap hidden sm:inline">
            Member:
          </span>
          <select
            value={selectedMemberFilter}
            onChange={(e) => setSelectedMemberFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-medium focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="All">All Family Members</option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} ({m.relation})
              </option>
            ))}
          </select>
        </div>

        {/* Category filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap hidden sm:inline">
            Type:
          </span>
          <select
            value={selectedCategoryFilter}
            onChange={(e) => setSelectedCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-medium focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

      </div>

      {/* Chronological List of Records */}
      {filteredRecords.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 p-12 text-center">
          <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <FileText className="w-8 h-8 opacity-80" />
          </div>
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No Health Records Found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1 mb-5">
            {searchQuery || selectedCategoryFilter !== 'All' || selectedMemberFilter !== 'All'
              ? 'No records match your selected filters. Try clearing your search parameters.'
              : 'Log allergies, doctor visits, photograph physical prescription labels, or upload lab reports.'}
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={handleQuickCameraLaunch}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 font-semibold rounded-xl text-xs hover:bg-emerald-100 transition-colors cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <span>Photograph Doctor Note</span>
            </button>
            <button
              onClick={handleOpenAddModal}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white font-semibold rounded-xl text-xs hover:bg-emerald-700 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create First Health Record</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4 relative before:absolute before:inset-0 before:left-6 md:before:left-8 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800 before:pointer-events-none">
          {filteredRecords.map((record) => {
            const categoryColor = CATEGORY_COLORS[record.category] || 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700';
            const categoryIcon = CATEGORY_ICONS[record.category] || <FileText className="w-4 h-4" />;

            return (
              <div
                key={record.id}
                className="relative pl-12 md:pl-16 group"
              >
                {/* Timeline icon node */}
                <div className="absolute left-4 md:left-6 -translate-x-1/2 top-4 w-7 h-7 rounded-full bg-white dark:bg-slate-900 border-2 border-emerald-500 flex items-center justify-center shadow-xs z-10 group-hover:scale-110 transition-transform">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                </div>

                {/* Record Card */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all p-5">
                  
                  {/* Top Bar: Category badge, Member badge, Date */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      
                      {/* Category Badge */}
                      <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-lg border ${categoryColor}`}>
                        {categoryIcon}
                        <span>{record.category}</span>
                      </span>

                      {/* Member Tag */}
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg ${
                        record.memberRelation === 'Self (Supervisor)'
                          ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                          : record.memberRelation === 'Spouse'
                          ? 'bg-teal-100 dark:bg-teal-950/80 text-teal-900 dark:text-teal-300 border border-teal-200 dark:border-teal-800'
                          : 'bg-purple-100 dark:bg-purple-950/80 text-purple-900 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                      }`}>
                        For: {record.memberName} ({record.memberRelation})
                      </span>

                      {record.severity && record.severity !== 'Mild' && (
                        <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                          record.severity === 'Critical'
                            ? 'bg-rose-600 text-white'
                            : record.severity === 'Severe'
                            ? 'bg-orange-500 text-white'
                            : 'bg-amber-500 text-white'
                        }`}>
                          {record.severity}
                        </span>
                      )}

                      {record.capturedImage && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 rounded-md border border-emerald-200 dark:border-emerald-800">
                          <Camera className="w-3 h-3 text-emerald-700 dark:text-emerald-400" />
                          <span>Photo Attached</span>
                        </span>
                      )}
                    </div>

                    {/* Date & Actions */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-100 dark:border-slate-750">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{record.dateRecorded}</span>
                      </div>

                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete this record "${record.title}"?`)) {
                            onDeleteRecord(record.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                        title="Delete Record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Title & Clinic */}
                  <div className="mb-2">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {record.title}
                    </h3>
                    {record.doctorOrClinic && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                        <Stethoscope className="w-3.5 h-3.5 text-slate-400" />
                        <span>{record.doctorOrClinic}</span>
                      </p>
                    )}
                  </div>

                  {/* Details / Notes snippet */}
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50/70 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                    {record.details}
                  </p>

                  {/* Camera / Scanned Image Preview Card */}
                  {record.capturedImage && (
                    <div className="mt-3 p-3 bg-gradient-to-r from-emerald-50/70 to-teal-50/60 dark:from-emerald-950/30 dark:to-teal-950/20 border border-emerald-200 dark:border-emerald-800/80 rounded-xl flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div 
                          onClick={() => setLightboxData({ url: record.capturedImage!, title: record.title, type: record.imageType, record })}
                          className="relative w-16 h-16 rounded-lg overflow-hidden border border-emerald-300 dark:border-emerald-700 cursor-pointer group/img shrink-0 shadow-xs bg-slate-900"
                        >
                          <img
                            src={record.capturedImage}
                            alt="Scanned note or label"
                            className="w-full h-full object-cover group-hover/img:scale-110 transition-transform"
                          />
                          <div className="absolute inset-0 bg-black/30 group-hover/img:bg-black/10 flex items-center justify-center text-white">
                            <Eye className="w-4 h-4 opacity-80" />
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-emerald-950 dark:text-emerald-200">
                              {record.imageType === 'prescription_label' 
                                ? 'Prescription Bottle Label Photo' 
                                : record.imageType === 'medical_report'
                                ? 'Physical Lab Report Scan'
                                : "Doctor's Handwritten Note Photo"}
                            </span>
                          </div>
                          <p className="text-[11px] text-emerald-800 dark:text-emerald-400 mt-0.5">
                            High resolution document image saved directly to patient profile.
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => setLightboxData({ url: record.capturedImage!, title: record.title, type: record.imageType, record })}
                        className="px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-slate-700 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 text-xs font-semibold rounded-lg flex items-center gap-1 shadow-xs transition-colors shrink-0 cursor-pointer"
                      >
                        <Maximize2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span>View Photo</span>
                      </button>
                    </div>
                  )}

                  {/* Vitals snapshot if available */}
                  {record.vitals && Object.keys(record.vitals).length > 0 && (
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                      {record.vitals.bloodPressure && (
                        <div className="px-2.5 py-1 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 rounded-lg border border-rose-200/60 dark:border-rose-900/60 font-semibold flex items-center gap-1">
                          <Activity className="w-3 h-3 text-rose-500" />
                          <span>BP: {record.vitals.bloodPressure}</span>
                        </div>
                      )}
                      {record.vitals.heartRate && (
                        <div className="px-2.5 py-1 bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-300 rounded-lg border border-red-200/60 dark:border-red-900/60 font-semibold">
                          HR: {record.vitals.heartRate}
                        </div>
                      )}
                      {record.vitals.bloodGlucose && (
                        <div className="px-2.5 py-1 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 rounded-lg border border-amber-200/60 dark:border-amber-900/60 font-semibold">
                          Glucose: {record.vitals.bloodGlucose}
                        </div>
                      )}
                      {record.vitals.weight && (
                        <div className="px-2.5 py-1 bg-sky-50 dark:bg-sky-950/40 text-sky-800 dark:text-sky-300 rounded-lg border border-sky-200/60 dark:border-sky-900/60 font-semibold">
                          Weight: {record.vitals.weight}
                        </div>
                      )}
                      {record.vitals.temperature && (
                        <div className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 rounded-lg border border-emerald-200/60 dark:border-emerald-900/60 font-semibold">
                          Temp: {record.vitals.temperature}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Tags and Attachments row */}
                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
                    {/* Tags */}
                    <div className="flex items-center gap-1 flex-wrap">
                      {record.tags && record.tags.map((tag, idx) => (
                        <span key={idx} className="text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-md">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Attachments preview button */}
                    {record.attachments && record.attachments.length > 0 ? (
                      <div className="flex items-center gap-1">
                        {record.attachments.map((att, i) => (
                          <button
                            key={i}
                            onClick={() => setViewRecord(record)}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/50 px-2.5 py-1 rounded-lg border border-indigo-200 dark:border-indigo-800 transition-colors cursor-pointer"
                          >
                            <Paperclip className="w-3 h-3" />
                            <span className="truncate max-w-[150px]">{att.name}</span>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <button
                        onClick={() => setViewRecord(record)}
                        className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
                      >
                        <span>View Full Record</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Record Full View Modal */}
      {viewRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 w-full max-w-xl overflow-hidden">
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-5 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold truncate max-w-[360px]">{viewRecord.title}</h3>
              </div>
              <button
                onClick={() => setViewRecord(null)}
                className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="flex items-center justify-between text-xs bg-slate-50 dark:bg-slate-800/80 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                <div>
                  <span className="text-slate-500 dark:text-slate-400">Patient: </span>
                  <strong className="text-slate-800 dark:text-slate-200">{viewRecord.memberName}</strong> ({viewRecord.memberRelation})
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400">Date: </span>
                  <strong className="text-slate-800 dark:text-slate-200">{viewRecord.dateRecorded}</strong>
                </div>
              </div>

              {/* Photo View inside Record Modal */}
              {viewRecord.capturedImage && (
                <div className="p-3 bg-slate-900 rounded-xl text-white space-y-2 border border-slate-800">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                      <Camera className="w-3.5 h-3.5" />
                      <span>Captured Doctor Note / Rx Label</span>
                    </span>
                    <button
                      onClick={() => setLightboxData({ url: viewRecord.capturedImage!, title: viewRecord.title, type: viewRecord.imageType, record: viewRecord })}
                      className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer font-semibold"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>Fullscreen View</span>
                    </button>
                  </div>
                  <div 
                    onClick={() => setLightboxData({ url: viewRecord.capturedImage!, title: viewRecord.title, type: viewRecord.imageType, record: viewRecord })}
                    className="relative max-h-52 rounded-lg overflow-hidden cursor-pointer group bg-black flex items-center justify-center"
                  >
                    <img
                      src={viewRecord.capturedImage}
                      alt="Doctor note or label"
                      className="max-h-52 w-auto object-contain group-hover:scale-105 transition-transform"
                    />
                  </div>
                </div>
              )}

              <div>
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Category & Provider
                </div>
                <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {viewRecord.category}
                </div>
                {viewRecord.doctorOrClinic && (
                  <div className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                    {viewRecord.doctorOrClinic}
                  </div>
                )}
              </div>

              <div>
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Clinical Details & Summary
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap bg-slate-50 dark:bg-slate-800/70 p-3.5 rounded-xl border border-slate-100 dark:border-slate-700">
                  {viewRecord.details}
                </p>
              </div>

              {viewRecord.vitals && Object.keys(viewRecord.vitals).length > 0 && (
                <div>
                  <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Recorded Biometrics
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                    {Object.entries(viewRecord.vitals).map(([key, val]) => val ? (
                      <div key={key} className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700">
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase block">{key}</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{val}</span>
                      </div>
                    ) : null)}
                  </div>
                </div>
              )}

              {viewRecord.attachments && viewRecord.attachments.length > 0 && (
                <div>
                  <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Attached Medical Documents
                  </div>
                  <div className="space-y-2">
                    {viewRecord.attachments.map((file, i) => (
                      <div key={i} className="p-3 bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <Paperclip className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          <div>
                            <div className="font-bold text-emerald-950 dark:text-emerald-300">{file.name}</div>
                            <div className="text-[10px] text-slate-500 dark:text-slate-400">{file.size} &bull; PDF Report</div>
                          </div>
                        </div>
                        <button
                          onClick={() => alert(`Downloading document "${file.name}"...`)}
                          className="px-2.5 py-1 bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 rounded-md border border-emerald-300 dark:border-emerald-700 font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <Download className="w-3 h-3" />
                          <span>Download</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setViewRecord(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Health Record Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-teal-700 p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-indigo-200" />
                <div>
                  <h3 className="text-base font-bold">New Family Health Record</h3>
                  <p className="text-xs text-indigo-100">Log doctor visits, allergies, labs, or scan physical notes</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-indigo-100 hover:bg-white/20 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
              
              {/* Camera Photo Capture Section Box */}
              <div className="p-4 bg-gradient-to-r from-slate-900 to-slate-850 rounded-2xl text-white space-y-3 border border-slate-750">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      <Camera className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">Photograph Physical Note or Rx Label</span>
                      <span className="text-[11px] text-slate-400">Use device camera to attach prescription bottle or doctor's slip</span>
                    </div>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => setIsCameraModalOpen(true)}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/30 transition-all cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>{capturedImage ? 'Retake Photo' : 'Take Photo'}</span>
                  </button>
                </div>

                {/* If image is captured / attached */}
                {capturedImage ? (
                  <div className="p-3 bg-slate-800 rounded-xl border border-slate-700 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={capturedImage}
                        alt="Captured doc"
                        className="w-14 h-14 object-cover rounded-lg border border-emerald-500/40"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-xs font-bold text-white">Document Photo Attached</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <select
                            value={capturedImageType}
                            onChange={(e) => setCapturedImageType(e.target.value as any)}
                            className="bg-slate-900 text-slate-200 text-[11px] px-2 py-0.5 rounded border border-slate-600"
                          >
                            <option value="doctor_note">Doctor Note</option>
                            <option value="prescription_label">Rx Label</option>
                            <option value="medical_report">Lab Report</option>
                            <option value="other">Other Document</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setLightboxData({ url: capturedImage, title: title || 'Scanned Document', type: capturedImageType })}
                        className="p-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-xs cursor-pointer"
                        title="Preview Full Size"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setCapturedImage(null)}
                        className="p-1.5 bg-rose-900/60 hover:bg-rose-800 text-rose-300 rounded-lg text-xs cursor-pointer"
                        title="Remove Photo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span>Or enter an online image URL link directly:</span>
                    <button
                      type="button"
                      onClick={() => setShowManualUrlInput(!showManualUrlInput)}
                      className="text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer"
                    >
                      {showManualUrlInput ? 'Hide URL field' : '+ Enter Image Link'}
                    </button>
                  </div>
                )}

                {showManualUrlInput && !capturedImage && (
                  <div className="pt-2">
                    <input
                      type="url"
                      value={manualImageUrl}
                      onChange={(e) => setManualImageUrl(e.target.value)}
                      placeholder="https://example.com/prescription_label_sample.jpg"
                      className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                )}
              </div>

              {/* Assign to Member */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Family Member Profile *
                </label>
                <select
                  value={memberId}
                  onChange={(e) => setMemberId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl text-sm font-medium focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.isPrimary ? `For Me (Primary Supervisor) - ${m.name}` : `For: ${m.name} (${m.relation})`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Record Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Doctor's Note or Rx Bottle Label"
                    required
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl text-sm focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as HealthRecordCategory)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl text-sm focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Date & Doctor / Clinic */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Date Recorded *
                  </label>
                  <input
                    type="date"
                    value={dateRecorded}
                    onChange={(e) => setDateRecorded(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl text-sm focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Doctor / Clinic / Hospital (Optional)
                  </label>
                  <input
                    type="text"
                    value={doctorOrClinic}
                    onChange={(e) => setDoctorOrClinic(e.target.value)}
                    placeholder="e.g. Dr. Keith Vance, MD"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl text-sm focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Details & Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Clinical Details & Notes *
                </label>
                <textarea
                  rows={3}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Record summary of diagnosis, instructions transcribed from the doctor's handwritten note, or label notes..."
                  required
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl text-sm focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Severity & Tags */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Severity / Alert Level
                  </label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl text-sm focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Mild">Mild / Routine</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Severe">Severe</option>
                    <option value="Critical">Critical Alert</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Tags (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="e.g. Handwritten, Prescription Label, Pharmacy"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl text-sm focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Vitals Accordion Toggle */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    Record Vitals / Biometrics (Optional)
                  </span>
                  <button
                    type="button"
                    onClick={() => setIncludeVitals(!includeVitals)}
                    className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 cursor-pointer"
                  >
                    {includeVitals ? 'Hide Vitals' : '+ Add Vitals'}
                  </button>
                </div>

                {includeVitals && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3 pt-2 border-t border-slate-200 dark:border-slate-700">
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400">Blood Pressure</label>
                      <input
                        type="text"
                        value={bloodPressure}
                        onChange={(e) => setBloodPressure(e.target.value)}
                        placeholder="120/80 mmHg"
                        className="w-full px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400">Heart Rate (bpm)</label>
                      <input
                        type="text"
                        value={heartRate}
                        onChange={(e) => setHeartRate(e.target.value)}
                        placeholder="72"
                        className="w-full px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400">Blood Glucose (mg/dL)</label>
                      <input
                        type="text"
                        value={bloodGlucose}
                        onChange={(e) => setBloodGlucose(e.target.value)}
                        placeholder="95"
                        className="w-full px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400">Temperature (°F)</label>
                      <input
                        type="text"
                        value={temperature}
                        onChange={(e) => setTemperature(e.target.value)}
                        placeholder="98.6"
                        className="w-full px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400">Weight (kg)</label>
                      <input
                        type="text"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        placeholder="70"
                        className="w-full px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400">Oxygen (SpO2 %)</label>
                      <input
                        type="text"
                        value={spO2}
                        onChange={(e) => setSpO2(e.target.value)}
                        placeholder="99"
                        className="w-full px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg text-xs"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Attachment simulator */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Document / Lab Report File Name (Optional)
                </label>
                <div className="flex items-center gap-2">
                  <Paperclip className="w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={attachedFileName}
                    onChange={(e) => setAttachedFileName(e.target.value)}
                    placeholder="e.g. Blood_Test_Report_Aug2026.pdf"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl text-sm focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs shadow-md shadow-emerald-600/20 flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save Health Record</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Export Records Modal */}
      <ExportSummaryModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        members={members}
        records={records}
        prescriptions={prescriptions}
        initialMemberId={selectedMemberFilter !== 'All' ? selectedMemberFilter : undefined}
      />

      {/* Camera Capture Modal */}
      <CameraCaptureModal
        isOpen={isCameraModalOpen}
        onClose={() => setIsCameraModalOpen(false)}
        onCapture={handleCameraCapture}
        defaultType="doctor_note"
      />

      {/* Fullscreen Image Lightbox Modal */}
      {lightboxData && (
        <ImageLightboxModal
          isOpen={Boolean(lightboxData)}
          onClose={() => setLightboxData(null)}
          imageUrl={lightboxData.url}
          recordTitle={lightboxData.title}
          imageType={lightboxData.type}
          record={lightboxData.record}
        />
      )}

    </div>
  );
};
