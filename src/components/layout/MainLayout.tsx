import { Outlet, useNavigate } from 'react-router-dom';
import BottomNav from './BottomNav';
import { Baby, ChevronDown } from 'lucide-react';
import { useChildrenStore } from '../../store/useChildrenStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useAppStore } from '../../store/useAppStore';
import { useEffect } from 'react';

export default function MainLayout() {
  const navigate = useNavigate();
  const { currentChild, children, fetchChildren, setCurrentChild } = useChildrenStore();
  const { family } = useAuthStore();
  const { initializeData, isInitialized } = useAppStore();

  useEffect(() => {
    if (family?.id) {
      fetchChildren();
    }
  }, [family?.id]);

  useEffect(() => {
    if (family?.id && currentChild?.id) {
      initializeData(currentChild.id);
    }
  }, [family?.id, currentChild?.id, initializeData]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部孩子切换栏 */}
      <div className="bg-white shadow-sm px-4 py-3 sticky top-0 z-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {currentChild ? (
              <button
                onClick={() => navigate('/children')}
                className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded-2xl transition-all"
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-lg ${
                  currentChild.gender === 'boy' ? 'bg-blue-100' : 'bg-pink-100'
                }`}>
                  {currentChild.gender === 'boy' ? '👦' : '👧'}
                </div>
                <span className="font-semibold text-[#5D4559]">{currentChild.name}</span>
                <ChevronDown className="w-4 h-4 text-[#5D4559]/50" />
              </button>
            ) : (
              <button
                onClick={() => navigate('/children')}
                className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded-2xl transition-all text-[#5D4559]/60"
              >
                <Baby className="w-5 h-5" />
                <span className="font-medium">添加孩子</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 页面内容 */}
      <Outlet />

      {/* 底部导航 */}
      <BottomNav />
    </div>
  );
}
