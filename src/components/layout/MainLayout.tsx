import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Outlet />
      <BottomNav />
    </div>
  );
}
