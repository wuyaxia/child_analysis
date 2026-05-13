import { NavLink } from 'react-router-dom';
import { Home, BookOpen, CheckCircle, BookOpen as BookIcon, User } from 'lucide-react';

export default function BottomNav() {
  const navItems = [
    { path: '/', icon: Home, label: '首页' },
    { path: '/growth', icon: BookOpen, label: '成长记录' },
    { path: '/tasks', icon: CheckCircle, label: '任务打卡' },
    { path: '/knowledge', icon: BookIcon, label: '知识库' },
    { path: '/profile', icon: User, label: '我的' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="max-w-md mx-auto px-2 py-2">
        <div className="flex justify-around items-center">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className={`w-6 h-6 mb-1 ${isActive ? '' : ''}`} />
                  <span className="text-xs font-medium">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}
