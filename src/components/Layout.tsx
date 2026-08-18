import { Outlet, Link } from 'react-router-dom';
import { Pill, Search, User } from 'lucide-react';

export default function Layout() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navigation Bar - This stays on every page */}
      <nav className="bg-white shadow-sm border-b p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 text-teal-600 hover:text-teal-700 transition-colors">
            <Pill size={28} />
            <span className="text-2xl font-bold">DawaaiiRx</span>
          </Link>
          <div className="flex gap-4">
            <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
              <Search size={20} />
            </button>
            <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
              <User size={20} />
            </button>
          </div>
        </div>
      </nav>

      {/* This is where the page content gets injected */}
      <Outlet />
    </div>
  );
}