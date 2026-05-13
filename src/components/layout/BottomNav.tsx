import { NavLink } from 'react-router-dom';
import { Home, BookOpen, CheckCircle, BookOpen as BookIcon, Calendar, User } from 'lucide-react';

export default function BottomNav() {
  const navItems = [
    { path: '/', icon: Home, label: '首页' },
    { path: '/growth', icon: BookOpen, label: '记录' },
    { path: '/tasks', icon: CheckCircle, label: '打卡' },
    { path: '/review', icon: Calendar, label: '复盘' },
    { path: '/knowledge', icon: BookIcon, label: '知识' },
    { path: '/profile', icon: User, label: '我的' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-[rgba(212,131,108,0.2)] z-50">
      <div className="max-w-md mx-auto px-2 py-3">
        <div className="flex justify-around items-center">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-2 px-3 rounded-2xl transition-all duration-300 relative group ${
                  isActive
                    ? 'text-[#D4836C] bg-gradient-to-t from-[rgba(212,131,108,0.08)] to-transparent'
                    : 'text-[#5D4559]/60 hover:text-[#5D4559]/90'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`relative transition-all duration-300 ${isActive ? 'scale-110' : ''}`}>
                    <item.icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
                    {isActive && (
                      <div className="absolute -top-2 -right-2 w-2 h-2 bg-[#D4836C] rounded-full animate-pulse" />
                    )}
                  </div>
                  <span className={`text-xs font-medium mt-1 ${isActive ? 'font-semibold' : ''}`}>
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}
