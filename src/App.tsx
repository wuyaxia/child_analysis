import { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Home from './pages/Home';
import GrowthLog from './pages/GrowthLog';
import TasksPage from './pages/TasksPage';
import KnowledgeBase from './pages/KnowledgeBase';
import ProfilePage from './pages/ProfilePage';
import ReviewPage from './pages/ReviewPage';
import GrowthCurve from './pages/GrowthCurve';
import LoginPage from './pages/LoginPage';
import FamilySetupPage from './pages/FamilySetupPage';
import ChildrenPage from './pages/ChildrenPage';
import { useAuthStore } from './store/useAuthStore';

// 路由守卫组件
const ProtectedRoute = ({ children, requireFamily = true }: { children: React.ReactNode, requireFamily?: boolean }) => {
  const { user, family } = useAuthStore();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (requireFamily && !family) {
    return <Navigate to="/family-setup" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  const initAuth = useAuthStore((state) => state.initAuth);

  useEffect(() => {
    const unsubscribe = initAuth();
    return unsubscribe;
  }, [initAuth]);

  return (
    <HashRouter>
      <Routes>
        {/* 公开路由 */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* 家庭设置路由（需要登录但不需要家庭） */}
        <Route 
          path="/family-setup" 
          element={
            <ProtectedRoute requireFamily={false}>
              <FamilySetupPage />
            </ProtectedRoute>
          } 
        />
        
        {/* 受保护的路由（需要登录和家庭） */}
        <Route path="/" element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Home />} />
          <Route path="growth" element={<GrowthLog />} />
          <Route path="tasks" element={<TasksPage />} />
          <Route path="review" element={<ReviewPage />} />
          <Route path="growth-curve" element={<GrowthCurve />} />
          <Route path="knowledge" element={<KnowledgeBase />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="children" element={<ChildrenPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
