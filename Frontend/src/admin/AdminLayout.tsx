import { useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Calendar, Users, MessageSquare, LogOut, Home } from 'lucide-react';
import { useAdmin } from './useAdmin';

const NAV = [
  { to: '/connect/evenements', label: 'Événements',     Icon: Calendar },
  { to: '/connect/admins',     label: 'Administrateurs', Icon: Users },
  { to: '/connect/messages',   label: 'Messages',        Icon: MessageSquare },
];

export default function AdminLayout() {
  const { user, loading, checkSession, logout } = useAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  useEffect(() => {
    if (!loading && !user) navigate('/connect/login', { replace: true });
  }, [user, loading, navigate]);

  async function handleLogout() {
    await logout();
    navigate('/connect/login', { replace: true });
  }

  if (loading || !user) return null;

  return (
    <div className="flex min-h-screen bg-cloud">
      {/* Sidebar */}
      <aside className="flex w-56 flex-col bg-navy text-white">
        <div className="px-6 py-6">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
            ÉduSport Connect
          </span>
          <p className="mt-1 text-sm font-bold">Administration</p>
        </div>

        <nav className="flex-1 space-y-1 px-3">
          {NAV.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-orange text-white'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="space-y-1 border-t border-white/10 p-3">
          <p className="px-3 py-2 text-xs text-white/40 truncate">{user.name}</p>
          <a
            href="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-colors"
          >
            <Home className="h-4 w-4 shrink-0" />
            Voir le site
          </a>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-colors"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Contenu */}
      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}
