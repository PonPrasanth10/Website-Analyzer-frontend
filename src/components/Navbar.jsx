import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface-2)' }}>
      <Link to="/dashboard" className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-indigo-500 flex items-center justify-center text-white font-bold text-xs">V</div>
        <span className="font-semibold text-white text-sm">VisionAudit AI</span>
      </Link>
      <div className="flex items-center gap-4">
        <span className="text-slate-400 text-sm hidden sm:block">{user?.email}</span>
        <button onClick={handleLogout} className="text-sm text-slate-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5">
          Sign out
        </button>
      </div>
    </nav>
  );
}
