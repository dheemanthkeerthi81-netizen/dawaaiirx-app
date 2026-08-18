import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Booking from './pages/Booking';
import Medications from './pages/Medications';
import Login from './pages/Login';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth page stands alone without the top navbar */}
        <Route path="/login" element={<Login />} />

        {/* Main app pages wrapped in the layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="booking" element={<Booking />} />
          <Route path="medications" element={<Medications />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}