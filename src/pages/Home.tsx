import HeaderSection from '../components/HeaderSection';
import ConclusionSection from '../components/ConclusionSection';
import ProblemAnalysis from '../components/ProblemAnalysis';
import EmotionalResilience from '../components/EmotionalResilience';
import SportsSection from '../components/SportsSection';
import AnimationSection from '../components/AnimationSection';
import FamilySection from '../components/FamilySection';
import RoadmapSection from '../components/RoadmapSection';
import ActionSection from '../components/ActionSection';
import { Baby, Sparkles } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen pb-24">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-8 px-6 rounded-b-3xl shadow-lg mb-6">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Baby className="w-8 h-8" />
          <h1 className="text-2xl font-bold">儿童成长中心</h1>
          <Sparkles className="w-8 h-8" />
        </div>
        <p className="text-center text-blue-100">3岁男孩 · 家庭养育</p>
      </div>
      
      <div className="max-w-4xl mx-auto px-4">
        <HeaderSection />
        <ConclusionSection />
        <ProblemAnalysis />
        <EmotionalResilience />
        <SportsSection />
        <AnimationSection />
        <FamilySection />
        <RoadmapSection />
        <ActionSection />
      </div>
    </div>
  );
}
