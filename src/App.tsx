import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { AuthModal } from './components/auth/AuthModal';
import { StatCards } from './components/dashboard/StatCards';
import { FamilyManagement } from './components/family/FamilyManagement';
import { PrescriptionList } from './components/prescriptions/PrescriptionList';
import { PrescriptionFormModal } from './components/prescriptions/PrescriptionFormModal';
import { HealthRecordsSection } from './components/records/HealthRecordsSection';
import { DailyScheduleTracker } from './components/compliance/DailyScheduleTracker';
import { RefillNotificationDrawer } from './components/reminders/RefillNotificationDrawer';

import { 
  FamilyMember, 
  Prescription, 
  HealthRecord, 
  User, 
  RefillAlert, 
  HealthRecordCategory 
} from './types';
import { storage } from './services/storageService';
import { 
  Pill, 
  ShieldCheck, 
  Sparkles, 
  Heart, 
  Activity, 
  RefreshCcw, 
  Plus, 
  FileText, 
  Users, 
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function App() {
  // Application State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([]);
  const [refillAlerts, setRefillAlerts] = useState<RefillAlert[]>([]);
  
  // Navigation
  const [activeTab, setActiveTab] = useState<string>('prescriptions');
  const [selectedMemberFilter, setSelectedMemberFilter] = useState<string | null>(null);

  // Modals
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
  const [editingPrescription, setEditingPrescription] = useState<Prescription | null>(null);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [isRefillDrawerOpen, setIsRefillDrawerOpen] = useState(false);

  // Toast notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Load all initial state
  const loadData = () => {
    const user = storage.getCurrentUser();
    const mems = storage.getMembers();
    const rxs = storage.getPrescriptions();
    const recs = storage.getHealthRecords();
    const alerts = storage.computeRefillAlerts();

    setCurrentUser(user);
    setMembers(mems);
    setPrescriptions(rxs);
    setHealthRecords(recs);
    setRefillAlerts(alerts);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handlers for Auth
  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
    loadData();
    showToast(`Signed in as ${user.name} (${user.role === 'primary_user' ? 'Supervisor' : 'Member'})`);
  };

  const handleLogout = () => {
    storage.setCurrentUser(null);
    setCurrentUser(null);
    showToast('Signed out from DawaaiiRx family portal.');
    setTimeout(() => {
      setIsAuthModalOpen(true);
    }, 400);
  };

  const handleSwitchUser = (role: 'primary_user' | 'family_member') => {
    const registered = storage.getRegisteredUsers();
    let target = registered.find(u => u.role === role) || registered[0];
    storage.setCurrentUser(target);
    setCurrentUser(target);
    loadData();
    showToast(`Switched account to ${target.name}`);
  };

  // Handlers for Family Members
  const handleAddMember = (newMem: Omit<FamilyMember, 'id' | 'createdAt'>) => {
    const created = storage.saveMember(newMem);
    loadData();
    showToast(`Added ${created.name} to family network.`);
  };

  const handleUpdateMember = (updated: FamilyMember) => {
    storage.saveMember(updated);
    loadData();
    showToast(`Updated details for ${updated.name}.`);
  };

  const handleDeleteMember = (id: string) => {
    storage.deleteMember(id);
    if (selectedMemberFilter === id) {
      setSelectedMemberFilter(null);
    }
    loadData();
    showToast('Family member removed.');
  };

  // Handlers for Prescriptions
  const handleSavePrescription = (rxData: Partial<Prescription> & { medicineName: string; dosage: string; memberId: string }) => {
    const saved = storage.savePrescription(rxData);
    loadData();
    showToast(`Prescription for ${saved.medicineName} saved successfully.`);
  };

  const handleDeletePrescription = (id: string) => {
    storage.deletePrescription(id);
    loadData();
    showToast('Prescription removed from active list.');
  };

  const handleLogDose = (prescriptionId: string, timeSlot: string) => {
    const updated = storage.logDoseTaken(prescriptionId, timeSlot);
    if (updated) {
      loadData();
      showToast(`Updated daily dose for ${updated.medicineName}.`);
    }
  };

  const handleRecordRefill = (prescriptionId: string, addedPills: number) => {
    const updated = storage.recordRefillProcessed(prescriptionId, addedPills);
    if (updated) {
      loadData();
      showToast(`Refill recorded! Added ${addedPills} units to ${updated.medicineName}.`);
    }
  };

  // Handlers for Health Records
  const handleAddHealthRecord = (recordData: Partial<HealthRecord> & { title: string; category: HealthRecordCategory; memberId: string; details: string }) => {
    const saved = storage.saveHealthRecord(recordData);
    loadData();
    showToast(`Health record "${saved.title}" saved.`);
  };

  const handleDeleteHealthRecord = (id: string) => {
    storage.deleteHealthRecord(id);
    loadData();
    showToast('Health record removed.');
  };

  // Reset demo data
  const handleResetData = () => {
    if (confirm('Reset all demo family members, prescriptions, and health records to default sample data?')) {
      storage.resetAllData();
      loadData();
      showToast('Demo dataset reset to defaults.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      
      {/* Top Header Navigation */}
      <Navbar
        user={currentUser}
        alerts={refillAlerts}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        onSwitchUser={handleSwitchUser}
        onOpenNewPrescription={() => {
          setEditingPrescription(null);
          setIsPrescriptionModalOpen(true);
        }}
        onOpenNewMember={() => setIsMemberModalOpen(true)}
        onOpenNewRecord={() => setIsRecordModalOpen(true)}
        onOpenRefillDrawer={() => setIsRefillDrawerOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Stat Overview Cards */}
        <StatCards
          members={members}
          prescriptions={prescriptions}
          records={healthRecords}
          alerts={refillAlerts}
          onSelectTab={setActiveTab}
        />

        {/* Dynamic Tab Views */}
        {activeTab === 'prescriptions' && (
          <PrescriptionList
            prescriptions={prescriptions}
            members={members}
            onOpenAddModal={() => {
              setEditingPrescription(null);
              setIsPrescriptionModalOpen(true);
            }}
            onEditPrescription={(rx) => {
              setEditingPrescription(rx);
              setIsPrescriptionModalOpen(true);
            }}
            onDeletePrescription={handleDeletePrescription}
            onLogDose={handleLogDose}
            onRecordRefill={handleRecordRefill}
            selectedMemberFilter={selectedMemberFilter}
            onSelectMemberFilter={setSelectedMemberFilter}
          />
        )}

        {activeTab === 'family' && (
          <FamilyManagement
            members={members}
            prescriptions={prescriptions}
            onAddMember={handleAddMember}
            onUpdateMember={handleUpdateMember}
            onDeleteMember={handleDeleteMember}
            onFilterByMember={(memberId) => {
              setSelectedMemberFilter(memberId);
              setActiveTab('prescriptions');
            }}
            selectedMemberFilter={selectedMemberFilter}
            isAddModalOpen={isMemberModalOpen}
            setIsAddModalOpen={setIsMemberModalOpen}
          />
        )}

        {activeTab === 'records' && (
          <HealthRecordsSection
            records={healthRecords}
            members={members}
            prescriptions={prescriptions}
            onAddRecord={handleAddHealthRecord}
            onDeleteRecord={handleDeleteHealthRecord}
            isAddModalOpen={isRecordModalOpen}
            setIsAddModalOpen={setIsRecordModalOpen}
          />
        )}

        {activeTab === 'schedule' && (
          <DailyScheduleTracker
            prescriptions={prescriptions}
            members={members}
            onLogDose={handleLogDose}
          />
        )}

      </main>

      {/* Modals & Drawers */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      <PrescriptionFormModal
        isOpen={isPrescriptionModalOpen}
        onClose={() => {
          setIsPrescriptionModalOpen(false);
          setEditingPrescription(null);
        }}
        onSave={handleSavePrescription}
        members={members}
        editingPrescription={editingPrescription}
      />

      <RefillNotificationDrawer
        isOpen={isRefillDrawerOpen}
        onClose={() => setIsRefillDrawerOpen(false)}
        alerts={refillAlerts}
        prescriptions={prescriptions}
        currentUser={currentUser}
        onRecordRefill={handleRecordRefill}
      />

      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 dark:bg-slate-800 text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-800 dark:border-slate-700 flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 mt-12 py-6 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px]">
              Dx
            </div>
            <span className="font-semibold text-slate-700 dark:text-slate-200">DawaaiiRx Health Portal</span>
            <span>&bull; HIPAA Compliant Family Health Platform</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleResetData}
              className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <RefreshCcw className="w-3.5 h-3.5" />
              <span>Reset Sample Data</span>
            </button>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span className="text-emerald-700 dark:text-emerald-400 font-medium">JWT Secure Session Active</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
