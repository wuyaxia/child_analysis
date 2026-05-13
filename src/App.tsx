import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Home from './pages/Home';
import GrowthLog from './pages/GrowthLog';
import TasksPage from './pages/TasksPage';
import KnowledgeBase from './pages/KnowledgeBase';
import ProfilePage from './pages/ProfilePage';
import ReviewPage from './pages/ReviewPage';

function App() {
  return (
    <BrowserRouter basename="/child_analysis">
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="growth" element={<GrowthLog />} />
          <Route path="tasks" element={<TasksPage />} />
          <Route path="knowledge" element={<KnowledgeBase />} />
          <Route path="review" element={<ReviewPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
