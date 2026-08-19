import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [userEmail, setUserEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function checkUser() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
      } else {
        setUserEmail(session.user.email || '');
      }
    }
    checkUser();
  }, [navigate]);

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: 'green', fontSize: '24px' }}>Dashboard Works!</h1>
      <p>Logged in as: {userEmail}</p>
      <button 
        onClick={async () => {
          await supabase.auth.signOut();
          navigate('/login');
        }}
        style={{ marginTop: '20px', padding: '10px 20px', background: 'red', color: 'white', border: 'none', borderRadius: '5px' }}
      >
        Log Out
      </button>
    </div>
  );
  // testing layout update
}