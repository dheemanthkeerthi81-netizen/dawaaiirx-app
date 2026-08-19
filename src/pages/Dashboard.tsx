import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [family, setFamily] = useState<any[]>([]);
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [selectedMember, setSelectedMember] = useState<string>('me');
  
  // Form states
  const [name, setName] = useState('');
  const [relation, setRelation] = useState('');
  const [medicine, setMedicine] = useState('');
  const [dosage, setDosage] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) navigate('/login');
      else {
        setUser(session.user);
        fetchData(session.user.id);
      }
    }
    init();
  }, [navigate]);

  async function fetchData(userId: string) {
    const { data: fam } = await supabase.from('family_members').select('*').eq('supervisor_id', userId);
    setFamily(fam || []);
    
    const { data: meds } = await supabase.from('prescriptions').select('*').eq('user_id', userId);
    setPrescriptions(meds || []);
  }

  const addFamilyMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !relation) return;
    await supabase.from('family_members').insert([{ supervisor_id: user.id, name, relation }]);
    setName(''); setRelation('');
    fetchData(user.id);
  };

  const addPrescription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!medicine || !dosage) return;
    await supabase.from('prescriptions').insert([{ 
      user_id: user.id, 
      medicine_name: medicine, 
      dosage, 
      family_member_id: selectedMember === 'me' ? null : selectedMember 
    }]);
    setMedicine(''); setDosage('');
    fetchData(user.id);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-emerald-600">DawaaiiRx Family Portal</h1>
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

      <main className="p-6 max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Add Family Member Form */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Add Family Member</h2>
          <form onSubmit={addFamilyMember} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Name</label>
              <input 
                type="text"
                placeholder="e.g. John Jr." 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Relation</label>
              <input 
                type="text"
                placeholder="e.g. Son, Mother, Spouse" 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                value={relation} 
                onChange={e => setRelation(e.target.value)} 
                required
              />
            </div>
            <button className="w-full bg-emerald-600 text-white font-medium py-2.5 rounded-lg hover:bg-emerald-700 transition text-sm">
              Add Member
            </button>
          </form>

          {/* List of family members */}
          <div className="mt-6">
            <h3 className="text-xs font-semibold uppercase text-gray-500 mb-2">Registered Members</h3>
            {family.length === 0 ? (
              <p className="text-sm text-gray-400">No family members added yet.</p>
            ) : (
              <ul className="space-y-2">
                {family.map(f => (
                  <li key={f.id} className="bg-gray-50 p-3 rounded-lg border border-gray-100 text-sm flex justify-between items-center">
                    <span className="font-medium text-gray-800">{f.name}</span>
                    <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">{f.relation}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Prescription Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Assign Medication</h2>
          <form onSubmit={addPrescription} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Select Patient</label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                value={selectedMember}
                onChange={e => setSelectedMember(e.target.value)}
              >
                <option value="me">For Me (Supervisor)</option>
                {family.map(f => <option key={f.id} value={f.id}>{f.name} ({f.relation})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Medicine Name</label>
              <input 
                type="text"
                placeholder="e.g. Syrup / Tablet" 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                value={medicine} 
                onChange={e => setMedicine(e.target.value)} 
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Dosage</label>
              <input 
                type="text"
                placeholder="e.g. 5ml or 250mg" 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                value={dosage} 
                onChange={e => setDosage(e.target.value)} 
                required
              />
            </div>
            <button className="w-full bg-blue-600 text-white font-medium py-2.5 rounded-lg hover:bg-blue-700 transition text-sm">
              Save Medication
            </button>
          </form>

          {/* List of assigned meds */}
          <div className="mt-6">
            <h3 className="text-xs font-semibold uppercase text-gray-500 mb-2">Active Prescriptions List</h3>
            {prescriptions.length === 0 ? (
              <p className="text-sm text-gray-400">No prescriptions added yet.</p>
            ) : (
              <ul className="space-y-2">
                {prescriptions.map(p => {
                  const member = family.find(f => f.id === p.family_member_id);
                  return (
                    <li key={p.id} className="bg-gray-50 p-3 rounded-lg border border-gray-100 text-sm flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-gray-800">{p.medicine_name} <span className="text-xs font-normal text-gray-500">({p.dosage})</span></p>
                        <p className="text-xs text-emerald-600 font-medium mt-0.5">For: {member ? `${member.name} (${member.relation})` : 'Me'}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}