export type UserRole = 'primary_user' | 'family_member';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  avatarUrl?: string;
  memberId?: string; // If role is 'family_member', points to their FamilyMember profile
  createdAt: string;
  token?: string; // Simulated JWT token
}

export type RelationType =
  | 'Self (Supervisor)'
  | 'Spouse'
  | 'Son'
  | 'Daughter'
  | 'Mother'
  | 'Father'
  | 'Grandparent'
  | 'Sibling'
  | 'Other Dependent';

export interface FamilyMember {
  id: string;
  name: string;
  relation: RelationType;
  age: number;
  dateOfBirth?: string;
  gender: 'Female' | 'Male' | 'Other';
  bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | 'Unknown';
  allergies: string[];
  emergencyContact?: string;
  avatarColor: string; // Tailwind color token or hex
  isPrimary?: boolean;
  notes?: string;
  createdAt: string;
}

export type MedicationForm = 'Tablet' | 'Capsule' | 'Syrup' | 'Injection' | 'Inhaler' | 'Drops' | 'Cream/Ointment' | 'Patch';

export type MedicationFrequency =
  | 'Once daily'
  | 'Twice daily'
  | 'Three times daily'
  | 'Four times daily'
  | 'Every 8 hours'
  | 'Every 12 hours'
  | 'Every other day'
  | 'Weekly'
  | 'As needed (PRN)';

export interface DoseTimeSlot {
  id: string;
  timeLabel: 'Morning' | 'Afternoon' | 'Evening' | 'Bedtime';
  timeString: string; // e.g. "08:00 AM"
  takenToday?: boolean;
}

export interface Prescription {
  id: string;
  memberId: string; // ID of family member or 'primary'
  memberName: string;
  memberRelation: RelationType;
  medicineName: string;
  genericName?: string;
  dosage: string; // e.g. "500mg", "10ml"
  form: MedicationForm;
  frequency: MedicationFrequency;
  scheduleTimes: ('Morning' | 'Afternoon' | 'Evening' | 'Bedtime')[];
  instructions?: string; // e.g. "Take with meals, do not consume alcohol"
  prescribedBy?: string; // Doctor name e.g. "Dr. Keith Vance, MD"
  prescribedDate: string;
  startDate: string;
  endDate?: string;
  
  // Refill Reminder System Fields
  enableRefillReminder: boolean;
  refillReminderDate?: string; // e.g. "2026-08-25"
  totalQuantity: number; // e.g. 60 pills
  remainingQuantity: number; // e.g. 8 pills
  lowStockThreshold: number; // e.g. 10 pills
  refillRxNumber?: string;
  pharmacyName?: string;
  pharmacyPhone?: string;
  
  // Tracking
  status: 'Active' | 'Refill Due' | 'Urgent Refill' | 'Completed' | 'Paused';
  takenHistory: { date: string; timeSlot: string; loggedAt: string }[];
  createdAt: string;
  updatedAt: string;
}

export type HealthRecordCategory =
  | 'Allergy & Adverse Reaction'
  | 'Doctor Visit & Consultation'
  | 'Lab & Diagnostic Report'
  | 'Past Illness & Surgery'
  | 'Vaccination / Immunization'
  | 'Vitals & Daily Biometrics'
  | 'Chronic Condition Management';

export interface HealthRecord {
  id: string;
  memberId: string;
  memberName: string;
  memberRelation: RelationType;
  title: string;
  category: HealthRecordCategory;
  dateRecorded: string;
  doctorOrClinic?: string;
  details: string;
  severity?: 'Mild' | 'Moderate' | 'Severe' | 'Critical';
  vitals?: {
    bloodPressure?: string; // e.g. "120/80 mmHg"
    heartRate?: string; // e.g. "72 bpm"
    bloodGlucose?: string; // e.g. "98 mg/dL"
    temperature?: string; // e.g. "98.6 °F"
    weight?: string; // e.g. "68 kg"
    spO2?: string; // e.g. "99%"
  };
  attachments?: {
    name: string;
    size: string;
    type: string;
  }[];
  capturedImage?: string; // Data URL or photo link of physical note/label
  imageType?: 'doctor_note' | 'prescription_label' | 'medical_report' | 'other';
  tags?: string[];
  createdAt: string;
}

export interface RefillAlert {
  id: string;
  prescriptionId: string;
  memberId: string;
  memberName: string;
  medicineName: string;
  dosage: string;
  refillDate: string;
  remainingDays: number;
  remainingPills: number;
  urgency: 'urgent' | 'warning' | 'info';
  pharmacyName?: string;
  pharmacyPhone?: string;
  isRead: boolean;
  notifiedAt: string;
}
