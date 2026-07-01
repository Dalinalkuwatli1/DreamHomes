import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import ToastContainer from '../components/ui/ToastContainer';

export default function MainLayout() {
  const location = useLocation();
  const noFooter = ['/messages'].includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16">
        <Outlet />
      </main>
      {!noFooter && <Footer />}
      <ToastContainer />
    </div>
  );
}
