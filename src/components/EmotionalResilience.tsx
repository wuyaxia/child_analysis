import { Heart, Clock, MessageSquare, AlertTriangle } from 'lucide-react';

export default function EmotionalResilience() {
  const practices = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: '情绪先接住，不急着讲道理',
      wrong: ['别哭了', '这有什么', '男子汉不能这样'],
      right: ['你本来想让爸爸拿', '结果姥姥拿了，你很难受', '你现在很生气'],
      explanation: '这叫情绪命名，它会让孩子的大脑从情绪区回到语言区。'
    },
    {
      icon: <AlertTriangle className="w-8 h-8" />,
      title: '崩溃时不要立刻满足',
      wrong: ['哭 → 达成要求'],
      right: ['共情', '陪伴', '允许哭', '但不一定重来'],
      explanation: '如果每次都重来，大脑会强化「崩溃可以改变世界」。正确方式是：共情、陪伴、允许哭，但不一定满足。'
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: '训练「等待能力」',
      wrong: ['立刻满足'],
      right: ['等10秒', '等30秒', '等1分钟'],
      explanation: '从极小开始，并明确倒计时。这是未来情绪稳定的底层能力。'
    }
  ];

  return (
    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl shadow-xl p-6 md:p-8 mb-8 text-white">
      <div className="flex items-center gap-3 mb-6">
        <MessageSquare className="w-6 h-6" />
        <h2 className="text-2xl font-bold">情绪恢复力培养（第一优先级）</h2>
      </div>
      
      <div className="bg-white/10 rounded-xl p-4 mb-6">
        <p className="text-center text-lg">
          不是「不哭」，而是从崩溃恢复的速度越来越快
        </p>
      </div>
      
      <div className="space-y-6">
        {practices.map((practice, index) => (
          <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="bg-white/20 rounded-xl p-3">
                {practice.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-4">{practice.title}</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-red-500/20 rounded-xl p-4">
                    <p className="text-red-200 text-sm font-medium mb-2">错误方式</p>
                    <ul className="space-y-1">
                      {practice.wrong.map((item, i) => (
                        <li key={i} className="text-sm text-red-100">- {item}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-green-500/20 rounded-xl p-4">
                    <p className="text-green-200 text-sm font-medium mb-2">正确做法</p>
                    <ul className="space-y-1">
                      {practice.right.map((item, i) => (
                        <li key={i} className="text-sm text-green-100">- {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <p className="mt-4 text-indigo-200 text-sm">{practice.explanation}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}