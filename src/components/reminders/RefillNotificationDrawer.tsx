import React, { useState } from 'react';
import { 
  Clock, 
  Bell, 
  Mail, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  Pill, 
  X, 
  ChevronRight, 
  PhoneCall, 
  RefreshCw,
  Sparkles,
  Code2,
  Calendar
} from 'lucide-react';
import { RefillAlert, Prescription, User } from '../../types';

interface RefillNotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: RefillAlert[];
  prescriptions: Prescription[];
  currentUser: User | null;
  onRecordRefill: (prescriptionId: string, addedPills: number) => void;
}

export const RefillNotificationDrawer: React.FC<RefillNotificationDrawerProps> = ({
  isOpen,
  onClose,
  alerts,
  prescriptions,
  currentUser,
  onRecordRefill,
}) => {
  const [testModalAlert, setTestModalAlert] = useState<RefillAlert | null>(null);
  const [notificationType, setNotificationType] = useState<'email' | 'sms' | 'webhook'>('email');
  const [isDispatched, setIsDispatched] = useState(false);

  if (!isOpen) return null;

  const urgentAlerts = alerts.filter(a => a.urgency === 'urgent');
  const warningAlerts = alerts.filter(a => a.urgency === 'warning');
  const upcomingAlerts = alerts.filter(a => a.urgency === 'info');

  const handleSendTestNotification = (alert: RefillAlert) => {
    setTestModalAlert(alert);
    setIsDispatched(false);
  };

  const handleExecuteDispatch = () => {
    setIsDispatched(true);
    setTimeout(() => {
      // Keep state
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-xl bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col transition-colors">
          
          {/* Drawer Header */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 p-6 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-500/20 rounded-xl border border-emerald-500/30 text-emerald-400">
                <Bell className="w-5 h-5 animate-bounce" />
              </div>
              <div>
                <h3 className="text-base font-bold">Prescription Refill Alert Center</h3>
                <p className="text-xs text-slate-300">
                  Automated notifications, email dispatch, & pharmacy coordination
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="p-6 overflow-y-auto flex-1 space-y-6">
            
            {/* System Status Banner */}
            <div className="p-4 bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <div>
                  <span className="text-xs font-bold text-emerald-950 dark:text-emerald-200 block">
                    Cron Job & Alert Engine: Operational
                  </span>
                  <span className="text-[11px] text-emerald-700 dark:text-emerald-400">
                    Evaluating daily medication supplies & refill dates at 08:00 AM
                  </span>
                </div>
              </div>
              <span className="text-xs font-mono font-bold bg-white dark:bg-slate-800 px-2 py-1 rounded-md border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300">
                {alerts.length} Alerts Active
              </span>
            </div>

            {/* List of Alerts */}
            {alerts.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">No Prescriptions Require Refills</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
                  All family prescriptions have sufficient pill supply and future refill dates.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                
                {/* Urgent Refills */}
                {urgentAlerts.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider mb-2">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Urgent Refills (1-2 Days Remaining)</span>
                    </div>
                    <div className="space-y-2">
                      {urgentAlerts.map(alert => (
                        <div key={alert.id} className="p-4 bg-rose-50/70 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-2xl">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-rose-900 dark:text-rose-200">{alert.medicineName}</span>
                                <span className="text-[10px] font-bold px-2 py-0.5 bg-rose-600 text-white rounded-md uppercase">
                                  {alert.remainingPills} Units Left
                                </span>
                              </div>
                              <p className="text-xs text-slate-700 dark:text-slate-300 mt-1">
                                Prescribed to: <strong>{alert.memberName}</strong> &bull; Refill target: {alert.refillDate}
                              </p>
                              {alert.pharmacyName && (
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1">
                                  <PhoneCall className="w-3 h-3 text-rose-600 dark:text-rose-400" />
                                  {alert.pharmacyName} ({alert.pharmacyPhone || 'No phone'})
                                </p>
                              )}
                            </div>

                            <div className="flex flex-col gap-1.5 shrink-0">
                              <button
                                onClick={() => onRecordRefill(alert.prescriptionId, 30)}
                                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                              >
                                <RefreshCw className="w-3 h-3" />
                                <span>Refill Now</span>
                              </button>
                              <button
                                onClick={() => handleSendTestNotification(alert)}
                                className="px-2.5 py-1 bg-white dark:bg-slate-800 hover:bg-rose-100 dark:hover:bg-slate-700 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800 text-[11px] font-semibold rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
                              >
                                <Mail className="w-3 h-3" />
                                <span>Preview Alert</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Due Soon */}
                {warningAlerts.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-2">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Refills Due Soon (3-7 Days)</span>
                    </div>
                    <div className="space-y-2">
                      {warningAlerts.map(alert => (
                        <div key={alert.id} className="p-4 bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-2xl">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-amber-950 dark:text-amber-200">{alert.medicineName}</span>
                                <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-500 text-white rounded-md">
                                  {alert.remainingPills} Units
                                </span>
                              </div>
                              <p className="text-xs text-slate-700 dark:text-slate-300 mt-1">
                                For: <strong>{alert.memberName}</strong> &bull; Scheduled Date: {alert.refillDate} ({alert.remainingDays} days)
                              </p>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                onClick={() => onRecordRefill(alert.prescriptionId, 30)}
                                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                              >
                                <span>Refill +30</span>
                              </button>
                              <button
                                onClick={() => handleSendTestNotification(alert)}
                                className="p-1.5 bg-white dark:bg-slate-800 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-slate-700 rounded-xl cursor-pointer"
                                title="Preview email/SMS notification"
                              >
                                <Mail className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Upcoming */}
                {upcomingAlerts.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Upcoming Refills (8-14 Days)</span>
                    </div>
                    <div className="space-y-2">
                      {upcomingAlerts.map(alert => (
                        <div key={alert.id} className="p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-between">
                          <div>
                            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{alert.medicineName}</span>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                              For: {alert.memberName} &bull; Refill on {alert.refillDate}
                            </p>
                          </div>
                          <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700">
                            {alert.remainingDays} days
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* Backend Integration Guide Snippet */}
            <div className="p-4 bg-slate-900 dark:bg-slate-950 text-slate-200 rounded-2xl border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-emerald-400 font-mono font-bold">
                <Code2 className="w-4 h-4" />
                <span>Backend Scheduling Architecture</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Refill calculations query active prescriptions daily. When <code>remainingPills &lt;= 5</code> or <code>refillReminderDate &lt;= 3 days</code>, automated alerts dispatch to family supervisor emails and SMS gateways.
              </p>
            </div>

          </div>

          {/* Drawer Footer */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>

        </div>
      </div>

      {/* Dispatch Preview Modal */}
      {testModalAlert && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-700 to-teal-700 p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <h4 className="text-sm font-bold">Simulate Refill Dispatch</h4>
              </div>
              <button
                onClick={() => setTestModalAlert(null)}
                className="text-white/80 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="flex gap-2">
                {(['email', 'sms', 'webhook'] as const).map(type => (
                  <button
                    key={type}
                    onClick={() => setNotificationType(type)}
                    className={`flex-1 py-1.5 font-bold uppercase rounded-lg border text-[10px] cursor-pointer ${
                      notificationType === type
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              {notificationType === 'email' && (
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    <strong>To:</strong> {currentUser ? currentUser.email : 'sarah.jenkins@familyrx.com'}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    <strong>Subject:</strong> ⚠️ Action Required: Refill Reminder for {testModalAlert.memberName} ({testModalAlert.medicineName})
                  </div>
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 leading-relaxed">
                    Hello {currentUser ? currentUser.name : 'Sarah'},<br />
                    This is an automated alert from <strong>DawaaiiRx</strong>. {testModalAlert.memberName}'s prescription for <strong>{testModalAlert.medicineName}</strong> has only <strong>{testModalAlert.remainingPills} pills</strong> remaining. Target refill date is <strong>{testModalAlert.refillDate}</strong>.
                  </div>
                </div>
              )}

              {notificationType === 'sms' && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200 leading-relaxed font-mono text-[11px]">
                  [DawaaiiRx Alert]: Refill notice for {testModalAlert.memberName}'s {testModalAlert.medicineName}. Only {testModalAlert.remainingPills} doses left. Refill by {testModalAlert.refillDate}. Reply 1 to auto-refill at {testModalAlert.pharmacyName || 'Pharmacy'}.
                </div>
              )}

              {notificationType === 'webhook' && (
                <pre className="p-3 bg-slate-900 text-emerald-400 rounded-xl text-[10px] overflow-x-auto">
{JSON.stringify({
  event: 'rx.refill_alert',
  patient: testModalAlert.memberName,
  medication: testModalAlert.medicineName,
  remainingUnits: testModalAlert.remainingPills,
  refillDate: testModalAlert.refillDate,
  urgency: testModalAlert.urgency,
  timestamp: new Date().toISOString()
}, null, 2)}
                </pre>
              )}

              {isDispatched && (
                <div className="p-3 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 rounded-xl border border-emerald-300 dark:border-emerald-700 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Notification successfully transmitted to subscriber!</span>
                </div>
              )}

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setTestModalAlert(null)}
                  className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-200 cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleExecuteDispatch}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Send className="w-3 h-3" />
                  <span>Send Notification</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
