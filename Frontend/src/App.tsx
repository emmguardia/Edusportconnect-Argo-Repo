import { Routes, Route } from 'react-router-dom';
import PublicLayout from './components/PublicLayout';
import Home from './pages/Home';
import NotreHistoire from './pages/NotreHistoire';
import Evenements from './pages/Evenements';
import Benevole from './pages/Benevole';
import Partenaires from './pages/Partenaires';
import Faq from './pages/Faq';
import MentionsLegales from './pages/MentionsLegales';
import PolitiqueConfidentialite from './pages/PolitiqueConfidentialite';
import NotFound from './pages/NotFound';
import AdminLogin from './admin/AdminLogin';
import AdminLayout from './admin/AdminLayout';
import AdminEvents from './admin/pages/AdminEvents';
import AdminAdmins from './admin/pages/AdminAdmins';
import AdminMessages from './admin/pages/AdminMessages';

export default function App() {
  return (
    <Routes>
      {/* ── Admin ─────────────────────────────────────────────────────── */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminEvents />} />
        <Route path="evenements" element={<AdminEvents />} />
        <Route path="admins" element={<AdminAdmins />} />
        <Route path="messages" element={<AdminMessages />} />
      </Route>

      {/* ── Site public ───────────────────────────────────────────────── */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/notre-histoire" element={<NotreHistoire />} />
        <Route path="/evenements" element={<Evenements />} />
        <Route path="/benevole" element={<Benevole />} />
        <Route path="/partenaires" element={<Partenaires />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/mentions-legales" element={<MentionsLegales />} />
        <Route path="/politique-de-confidentialite" element={<PolitiqueConfidentialite />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
