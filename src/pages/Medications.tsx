import { Link } from 'react-router-dom';
import { ArrowLeft, Pill, AlertCircle } from 'lucide-react';

export default function Medications() {
  return (
    <div className="max-w-4xl mx-auto p-6 mt-4">
      <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 transition-colors">
        <ArrowLeft size={20} /> Back to Dashboard
      </Link>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Active Prescriptions</h2>
        <button className="bg-teal-50 text-teal-700 font-medium py-2 px-4 rounded-lg hover:bg-teal-100 transition-colors">
          + Request Refill
        </button>
      </div>

      <div className="space-y-4">
        {/* Medication Card 1 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-blue-50 p-3 rounded-full text-blue-500">
              <Pill size={24} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-lg">Metformin (500mg)</h3>
              <p className="text-slate-500 text-sm">Take 1 tablet twice daily with meals</p>
            </div>
          </div>
          <div className="text-right">
            <span className="inline-flex items-center gap-1 text-amber-600 bg-amber-50 px-3 py-1 rounded-full text-sm font-medium mb-1">
              <AlertCircle size={14} /> 5 days left
            </span>
            <p className="text-slate-400 text-xs">Prescribed by Dr. Sharma</p>
          </div>
        </div>

        {/* Medication Card 2 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-teal-50 p-3 rounded-full text-teal-500">
              <Pill size={24} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-lg">Atorvastatin (20mg)</h3>
              <p className="text-slate-500 text-sm">Take 1 tablet daily at bedtime</p>
            </div>
          </div>
          <div className="text-right">
            <span className="inline-block text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full text-sm font-medium mb-1">
              28 days left
            </span>
            <p className="text-slate-400 text-xs">Prescribed by Dr. Sharma</p>
          </div>
        </div>
      </div>
    </div>
  );
}