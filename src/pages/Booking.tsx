import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, MapPin, CheckCircle } from 'lucide-react';

export default function Booking() {
  // This state tracks if the form has been successfully submitted
  const [isSubmitted, setIsSubmitted] = useState(false);

  // If the user clicked confirm, show this beautiful success screen instead of the form
  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto p-6 mt-12 text-center fade-in">
        <div className="bg-white p-10 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center">
          <CheckCircle size={64} className="text-teal-500 mb-6" />
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Appointment Confirmed!</h2>
          <p className="text-slate-500 mb-8">
            Your visit to DawaaiiRx Central Clinic has been successfully scheduled. We will send you a reminder soon.
          </p>
          <Link to="/" className="bg-slate-100 text-slate-700 font-semibold py-3 px-8 rounded-lg hover:bg-slate-200 transition-colors">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Otherwise, show the standard booking form
  return (
    <div className="max-w-2xl mx-auto p-6 mt-4">
      <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 transition-colors">
        <ArrowLeft size={20} /> Back to Dashboard
      </Link>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Book an Appointment</h2>
        <p className="text-slate-500 mb-6 flex items-center gap-2">
          <MapPin size={18} className="text-teal-500"/> DawaaiiRx Central Clinic, Bengaluru
        </p>
        
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Select Date</label>
            <input type="date" className="w-full border border-slate-300 rounded-lg p-3 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-shadow" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Reason for Visit</label>
            <select className="w-full border border-slate-300 rounded-lg p-3 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-shadow">
              <option>General Checkup</option>
              <option>Prescription Refill</option>
              <option>Specialist Consultation</option>
            </select>
          </div>

          <button 
            onClick={() => setIsSubmitted(true)}
            className="w-full bg-teal-600 text-white font-semibold py-3 rounded-lg hover:bg-teal-700 transition-colors mt-6 shadow-sm hover:shadow-md"
          >
            Confirm Appointment
          </button>
        </div>
      </div>
    </div>
  );
}