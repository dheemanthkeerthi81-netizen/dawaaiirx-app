import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [medicineName, setMedicineName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
      } else {
        setUser(session.user);
        fetchPrescriptions(session.user.id);
      }
    }
    init();
  }, [navigate]);

  const fetchPrescriptions = async (userId: string) => {
    const { data, error } = await supabase
      .from('prescriptions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      setPrescriptions(data);
    }
  };

  const handleAddPrescription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!medicineName || !dosage || !frequency) return;
    setLoading(true);

    const { error } = await supabase.from('prescriptions').insert([
      {
        user_id: user.id,
        medicine_name: medicineName,
        dosage,
        frequency,
      },
    ]);

    if (error) {
      alert(error.message);
    } else {
      setMedicineName('');
      setDosage('');
      setFrequency('');
      fetchPrescriptions(user.id);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-emerald-600">DawaaiiRx Dashboard</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">{user?.email}</span>
          <button 
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="p-6 max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Add Prescription Form */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Add Prescription</h2>
          <form onSubmit={handleAddPrescription} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Medicine Name</label>
              <input 
                type="text" 
                value={medicineName}
                onChange={(e) => setMedicineName(e.target.value)}
                required
                placeholder="e.g. Paracetamol"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Dosage</label>
              <input 
                type="text" 
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                required
                placeholder="e.g. 500mg"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Frequency</label>
              <input 
                type="text" 
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                required
                placeholder="e.g. Twice a day"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm"
              />
            </div>
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 text-white font-medium py-2.5 rounded-lg hover:bg-emerald-700 transition disabled:opacity-50 text-sm"
            >
              {loading ? 'Adding...' : 'Save Prescription'}
            </button>
          </form>
        </div>

        {/* Prescription List */}
        <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Your Prescriptions</h2>
          {prescriptions.length === 0 ? (
            <p className="text-gray-500 text-sm">No prescriptions added yet. Add one using the form!</p>
          ) : (
            <div className="space-y-3">
              {prescriptions.map((p) => (
                <div key={p.id} className="p-4 border border-gray-100 rounded-lg bg-gray-50 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-gray-800">{p.medicine_name}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Dosage: {p.dosage} | Frequency: {p.frequency}</p>
                  </div>
                  <span className="text-xs bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full font-medium">Active</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}