import HeaderSection from './components/HeaderSection';
import ConclusionSection from './components/ConclusionSection';
import ProblemAnalysis from './components/ProblemAnalysis';
import EmotionalResilience from './components/EmotionalResilience';
import SportsSection from './components/SportsSection';
import AnimationSection from './components/AnimationSection';
import FamilySection from './components/FamilySection';
import RoadmapSection from './components/RoadmapSection';
import ActionSection from './components/ActionSection';

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <HeaderSection />
        <ConclusionSection />
        <ProblemAnalysis />
        <EmotionalResilience />
        <SportsSection />
        <AnimationSection />
        <FamilySection />
        <RoadmapSection />
        <ActionSection />
        
        <footer className="text-center text-gray-500 text-sm py-8">
          <p>3岁男孩性格与行为发展分析报告 · 家庭养育建议版</p>
        </footer>
      </div>
    </div>
  );
}