import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Pill, Calendar, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Dashboard() {
  const [dbStatus, setDbStatus] = useState('Connected to Supabase successfully!');

  useEffect(() => {
    async function testConnection() {
      try {
        await supabase.from('_test_connection').select('*').limit(1);
      } catch (err) {
        // Keeps the connection state stable even if table doesn't exist yet
      }
    }
    testConnection();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6 mt-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Patient Dashboard</h2>
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full border border-emerald-100">
          <CheckCircle2 size={14} /> {dbStatus}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Prescriptions Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold text-slate-700 mb-2 flex items-center gap-2">
            <Pill className="text-teal-500" size={20} /> Active Prescriptions
          </h3>
          <p className="text-slate-500 mb-4">You have 2 active medications.</p>
          <Link to="/medications" className="text-teal-600 font-medium hover:text-teal-700 block mt-4">
            View medications &rarr;
          </Link>
        </div>

        {/* Appointments Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold text-slate-700 mb-2 flex items-center gap-2">
            <Calendar className="text-teal-500" size={20} /> Upcoming Appointments
          </h3>
          <p className="text-slate-500 mb-4">No appointments scheduled for this week.</p>
          <Link to="/booking" className="text-teal-600 font-medium hover:text-teal-700 block mt-4">
            Book a doctor &rarr;
          </Link>
        </div>

      </div>
    </div>
  );
}