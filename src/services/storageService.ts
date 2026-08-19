import { 
  FamilyMember, 
  Prescription, 
  HealthRecord, 
  User, 
  RefillAlert 
} from '../types';
import { 
  INITIAL_USER, 
  INITIAL_MEMBERS, 
  INITIAL_PRESCRIPTIONS, 
  INITIAL_HEALTH_RECORDS,
  DEMO_FAMILY_USERS
} from './mockData';

const STORAGE_KEYS = {
  CURRENT_USER: 'dawaaiirx_current_user',
  ALL_USERS: 'dawaaiirx_users',
  MEMBERS: 'dawaaiirx_family_members',
  PRESCRIPTIONS: 'dawaaiirx_prescriptions',
  HEALTH_RECORDS: 'dawaaiirx_health_records',
  NOTIFICATION_PREFS: 'dawaaiirx_notif_prefs',
  EMAIL_LOGS: 'dawaaiirx_email_dispatch_logs',
};

// Simple JWT token generator for frontend simulation
export function generateMockJWT(user: Partial<User>): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(
    JSON.stringify({
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      memberId: user.memberId || null,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 7 days
    })
  );
  const signature = 'dawaaiirx_sec_' + Math.random().toString(36).substring(2, 10);
  return `${header}.${payload}.${signature}`;
}

export function parseMockJWT(token: string): { sub: string; email: string; name: string; role: string; exp: number } | null {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    return JSON.parse(atob(parts[1]));
  } catch (err) {
    console.error('Error parsing token:', err);
    return null;
  }
}

// Storage helpers
export const storage = {
  // --- AUTH & USERS ---
  getCurrentUser(): User {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!data) {
      this.setCurrentUser(INITIAL_USER);
      return INITIAL_USER;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_USER;
    }
  },

  setCurrentUser(user: User | null): void {
    if (!user) {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    } else {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    }
  },

  getRegisteredUsers(): User[] {
    const data = localStorage.getItem(STORAGE_KEYS.ALL_USERS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.ALL_USERS, JSON.stringify(DEMO_FAMILY_USERS));
      return DEMO_FAMILY_USERS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return DEMO_FAMILY_USERS;
    }
  },

  // --- FAMILY MEMBERS ---
  getMembers(): FamilyMember[] {
    const data = localStorage.getItem(STORAGE_KEYS.MEMBERS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(INITIAL_MEMBERS));
      return INITIAL_MEMBERS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_MEMBERS;
    }
  },

  saveMember(member: Omit<FamilyMember, 'id' | 'createdAt'> & { id?: string }): FamilyMember {
    const list = this.getMembers();
    if (member.id) {
      const idx = list.findIndex(m => m.id === member.id);
      if (idx >= 0) {
        const updated: FamilyMember = { ...list[idx], ...member, id: member.id };
        list[idx] = updated;
        localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(list));
        return updated;
      }
    }
    const newMember: FamilyMember = {
      ...member,
      id: `mem-${Date.now().toString(36)}`,
      createdAt: new Date().toISOString(),
    };
    list.push(newMember);
    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(list));
    return newMember;
  },

  deleteMember(id: string): void {
    const list = this.getMembers().filter(m => m.id !== id);
    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(list));
  },

  // --- PRESCRIPTIONS ---
  getPrescriptions(): Prescription[] {
    const data = localStorage.getItem(STORAGE_KEYS.PRESCRIPTIONS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.PRESCRIPTIONS, JSON.stringify(INITIAL_PRESCRIPTIONS));
      return INITIAL_PRESCRIPTIONS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_PRESCRIPTIONS;
    }
  },

  savePrescription(rx: Partial<Prescription> & { medicineName: string; dosage: string; memberId: string }): Prescription {
    const list = this.getPrescriptions();
    const members = this.getMembers();
    const targetMember = members.find(m => m.id === rx.memberId);

    const memberName = targetMember ? targetMember.name : (rx.memberName || 'Sarah Jenkins (Me)');
    const memberRelation = targetMember ? targetMember.relation : (rx.memberRelation || 'Self (Supervisor)');

    // Calculate initial status based on refill reminder
    let status: Prescription['status'] = rx.status || 'Active';
    if (rx.enableRefillReminder && rx.refillReminderDate) {
      const today = new Date();
      today.setHours(0,0,0,0);
      const refillDate = new Date(rx.refillReminderDate);
      refillDate.setHours(0,0,0,0);
      const diffDays = Math.ceil((refillDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
      
      if (diffDays <= 1 || (rx.remainingQuantity !== undefined && rx.remainingQuantity <= 3)) {
        status = 'Urgent Refill';
      } else if (diffDays <= 5 || (rx.remainingQuantity !== undefined && rx.lowStockThreshold && rx.remainingQuantity <= rx.lowStockThreshold)) {
        status = 'Refill Due';
      } else {
        status = 'Active';
      }
    }

    if (rx.id) {
      const idx = list.findIndex(item => item.id === rx.id);
      if (idx >= 0) {
        const updated: Prescription = {
          ...list[idx],
          ...rx,
          id: rx.id,
          memberName,
          memberRelation,
          status,
          updatedAt: new Date().toISOString(),
        } as Prescription;
        list[idx] = updated;
        localStorage.setItem(STORAGE_KEYS.PRESCRIPTIONS, JSON.stringify(list));
        return updated;
      }
    }

    const newRx: Prescription = {
      id: `rx-${Date.now().toString(36)}`,
      memberId: rx.memberId,
      memberName,
      memberRelation,
      medicineName: rx.medicineName,
      genericName: rx.genericName || '',
      dosage: rx.dosage,
      form: rx.form || 'Tablet',
      frequency: rx.frequency || 'Once daily',
      scheduleTimes: rx.scheduleTimes || ['Morning'],
      instructions: rx.instructions || '',
      prescribedBy: rx.prescribedBy || 'Primary Physician',
      prescribedDate: rx.prescribedDate || new Date().toISOString().split('T')[0],
      startDate: rx.startDate || new Date().toISOString().split('T')[0],
      endDate: rx.endDate,
      enableRefillReminder: rx.enableRefillReminder ?? false,
      refillReminderDate: rx.refillReminderDate,
      totalQuantity: rx.totalQuantity ?? 30,
      remainingQuantity: rx.remainingQuantity ?? 30,
      lowStockThreshold: rx.lowStockThreshold ?? 5,
      refillRxNumber: rx.refillRxNumber || `RX-${Math.floor(100000 + Math.random() * 900000)}`,
      pharmacyName: rx.pharmacyName || 'Local Family Pharmacy',
      pharmacyPhone: rx.pharmacyPhone || '+1 (555) 019-2831',
      status,
      takenHistory: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    list.unshift(newRx);
    localStorage.setItem(STORAGE_KEYS.PRESCRIPTIONS, JSON.stringify(list));
    return newRx;
  },

  deletePrescription(id: string): void {
    const list = this.getPrescriptions().filter(rx => rx.id !== id);
    localStorage.setItem(STORAGE_KEYS.PRESCRIPTIONS, JSON.stringify(list));
  },

  logDoseTaken(prescriptionId: string, timeSlot: string): Prescription | null {
    const list = this.getPrescriptions();
    const idx = list.findIndex(r => r.id === prescriptionId);
    if (idx < 0) return null;

    const todayStr = new Date().toISOString().split('T')[0];
    const rx = list[idx];
    const alreadyTaken = rx.takenHistory.some(h => h.date === todayStr && h.timeSlot === timeSlot);

    let updatedHistory = [...rx.takenHistory];
    let newRemaining = rx.remainingQuantity;

    if (alreadyTaken) {
      // Toggle off
      updatedHistory = updatedHistory.filter(h => !(h.date === todayStr && h.timeSlot === timeSlot));
      newRemaining = Math.min(rx.totalQuantity, newRemaining + 1);
    } else {
      // Toggle on
      updatedHistory.push({
        date: todayStr,
        timeSlot,
        loggedAt: new Date().toISOString(),
      });
      newRemaining = Math.max(0, newRemaining - 1);
    }

    const updatedRx: Prescription = {
      ...rx,
      takenHistory: updatedHistory,
      remainingQuantity: newRemaining,
      updatedAt: new Date().toISOString(),
    };

    list[idx] = updatedRx;
    localStorage.setItem(STORAGE_KEYS.PRESCRIPTIONS, JSON.stringify(list));
    return updatedRx;
  },

  recordRefillProcessed(prescriptionId: string, addedPills: number = 30, nextRefillDate?: string): Prescription | null {
    const list = this.getPrescriptions();
    const idx = list.findIndex(r => r.id === prescriptionId);
    if (idx < 0) return null;

    const rx = list[idx];
    const updatedRx: Prescription = {
      ...rx,
      remainingQuantity: rx.remainingQuantity + addedPills,
      refillReminderDate: nextRefillDate || new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().split('T')[0],
      status: 'Active',
      updatedAt: new Date().toISOString(),
    };

    list[idx] = updatedRx;
    localStorage.setItem(STORAGE_KEYS.PRESCRIPTIONS, JSON.stringify(list));
    return updatedRx;
  },

  // --- HEALTH RECORDS ---
  getHealthRecords(): HealthRecord[] {
    const data = localStorage.getItem(STORAGE_KEYS.HEALTH_RECORDS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.HEALTH_RECORDS, JSON.stringify(INITIAL_HEALTH_RECORDS));
      return INITIAL_HEALTH_RECORDS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_HEALTH_RECORDS;
    }
  },

  saveHealthRecord(record: Partial<HealthRecord> & { title: string; category: HealthRecord['category']; memberId: string; details: string }): HealthRecord {
    const list = this.getHealthRecords();
    const members = this.getMembers();
    const targetMember = members.find(m => m.id === record.memberId);

    const memberName = targetMember ? targetMember.name : (record.memberName || 'Sarah Jenkins (Me)');
    const memberRelation = targetMember ? targetMember.relation : (record.memberRelation || 'Self (Supervisor)');

    if (record.id) {
      const idx = list.findIndex(r => r.id === record.id);
      if (idx >= 0) {
        const updated: HealthRecord = {
          ...list[idx],
          ...record,
          id: record.id,
          memberName,
          memberRelation,
        } as HealthRecord;
        list[idx] = updated;
        localStorage.setItem(STORAGE_KEYS.HEALTH_RECORDS, JSON.stringify(list));
        return updated;
      }
    }

    const newRecord: HealthRecord = {
      id: `rec-${Date.now().toString(36)}`,
      memberId: record.memberId,
      memberName,
      memberRelation,
      title: record.title,
      category: record.category,
      dateRecorded: record.dateRecorded || new Date().toISOString().split('T')[0],
      doctorOrClinic: record.doctorOrClinic || '',
      details: record.details,
      severity: record.severity || 'Mild',
      vitals: record.vitals,
      tags: record.tags || [],
      attachments: record.attachments || [],
      createdAt: new Date().toISOString(),
    };

    list.unshift(newRecord);
    localStorage.setItem(STORAGE_KEYS.HEALTH_RECORDS, JSON.stringify(list));
    return newRecord;
  },

  deleteHealthRecord(id: string): void {
    const list = this.getHealthRecords().filter(r => r.id !== id);
    localStorage.setItem(STORAGE_KEYS.HEALTH_RECORDS, JSON.stringify(list));
  },

  // --- REFILL REMINDER & ALERTS ENGINE ---
  computeRefillAlerts(): RefillAlert[] {
    const prescriptions = this.getPrescriptions();
    const today = new Date();
    today.setHours(0,0,0,0);

    const alerts: RefillAlert[] = [];

    for (const rx of prescriptions) {
      if (!rx.enableRefillReminder || !rx.refillReminderDate) continue;

      const refillDate = new Date(rx.refillReminderDate);
      refillDate.setHours(0,0,0,0);
      const diffMs = refillDate.getTime() - today.getTime();
      const remainingDays = Math.ceil(diffMs / (1000 * 3600 * 24));

      let urgency: RefillAlert['urgency'] = 'info';
      if (remainingDays <= 1 || rx.remainingQuantity <= 3) {
        urgency = 'urgent';
      } else if (remainingDays <= 5 || rx.remainingQuantity <= rx.lowStockThreshold) {
        urgency = 'warning';
      } else if (remainingDays <= 10) {
        urgency = 'info';
      } else {
        continue; // No alert required yet
      }

      alerts.push({
        id: `alert-${rx.id}`,
        prescriptionId: rx.id,
        memberId: rx.memberId,
        memberName: rx.memberName,
        medicineName: rx.medicineName,
        dosage: rx.dosage,
        refillDate: rx.refillReminderDate,
        remainingDays,
        remainingPills: rx.remainingQuantity,
        urgency,
        pharmacyName: rx.pharmacyName,
        pharmacyPhone: rx.pharmacyPhone,
        isRead: false,
        notifiedAt: new Date().toISOString(),
      });
    }

    // Sort by urgency then remaining days
    return alerts.sort((a, b) => {
      const order = { urgent: 0, warning: 1, info: 2 };
      return order[a.urgency] - order[b.urgency] || a.remainingDays - b.remainingDays;
    });
  },

  // Reset demo data
  resetAllData(): void {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(INITIAL_USER));
    localStorage.setItem(STORAGE_KEYS.ALL_USERS, JSON.stringify(DEMO_FAMILY_USERS));
    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(INITIAL_MEMBERS));
    localStorage.setItem(STORAGE_KEYS.PRESCRIPTIONS, JSON.stringify(INITIAL_PRESCRIPTIONS));
    localStorage.setItem(STORAGE_KEYS.HEALTH_RECORDS, JSON.stringify(INITIAL_HEALTH_RECORDS));
  }
};
