import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Outlet />
      <BottomNav />
    </div>
  );
}
