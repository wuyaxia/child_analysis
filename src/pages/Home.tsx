import { Baby, Flower2, Sun } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen pb-28">
      {/* 顶部hero区域 */}
      <div className="relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full dots-bg opacity-60" />
        
        <div className="relative z-10 px-6 pt-10 pb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="bg-[#F2D5D0] rounded-2xl p-2 animate-float">
              <Flower2 className="w-6 h-6 text-[#D4836C]" />
            </div>
            <h1 className="text-3xl font-bold text-[#5D4559]">
              儿童成长中心
            </h1>
            <div className="bg-[#AAB794]/20 rounded-2xl p-2">
              <Sun className="w-6 h-6 text-[#AAB794]" />
            </div>
          </div>
          
          <p className="text-center text-[#5D4559]/70 text-lg mt-2">
            用心记录，陪伴成长 💛
          </p>
        </div>

        {/* 统计卡片 */}
        <div className="px-6 pb-6">
          <div className="organic-card p-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold text-[#D4836C] mb-1">0</div>
                <p className="text-xs text-[#5D4559]/60">记录</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#AAB794] mb-1">0</div>
                <p className="text-xs text-[#5D4559]/60">任务</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#5D4559] mb-1">3</div>
                <p className="text-xs text-[#5D4559]/60">年龄</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="px-6 space-y-6">
        {/* 欢迎卡片 */}
        <div className="organic-card p-6">
          <div className="flex items-start gap-4">
            <div className="bg-gradient-to-br from-[#F2D5D0] to-[#FDF8F3] rounded-3xl p-4">
              <Baby className="w-12 h-12 text-[#D4836C]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#5D4559] mb-1">
                美好的一天开始了！
              </h2>
              <p className="text-[#5D4559]/70">
                记录孩子的每一点成长
              </p>
            </div>
          </div>
        </div>

        {/* 快捷操作 */}
        <div className="grid grid-cols-2 gap-4">
          <button className="organic-card p-5 text-left">
            <div className="bg-gradient-to-br from-[#D4836C]/10 to-[#D4836C]/20 rounded-2xl p-3 mb-3 inline-block">
              <Flower2 className="w-8 h-8 text-[#D4836C]" />
            </div>
            <h3 className="font-bold text-[#5D4559] mb-1">添加记录</h3>
            <p className="text-xs text-[#5D4559]/60">今天有什么新鲜事？</p>
          </button>
          
          <button className="organic-card p-5 text-left">
            <div className="bg-gradient-to-br from-[#AAB794]/10 to-[#AAB794]/20 rounded-2xl p-3 mb-3 inline-block">
              <Sun className="w-8 h-8 text-[#AAB794]" />
            </div>
            <h3 className="font-bold text-[#5D4559] mb-1">任务打卡</h3>
            <p className="text-xs text-[#5D4559]/60">今日任务进度</p>
          </button>
        </div>

        {/* 育儿智慧 */}
        <div className="organic-card p-6">
          <h3 className="text-lg font-bold text-[#5D4559] mb-4 flex items-center gap-2">
            <Flower2 className="w-5 h-5 text-[#D4836C]" />
            今日育儿智慧
          </h3>
          <div className="bg-gradient-to-r from-[#F2D5D0]/40 to-[#F7DBA7]/40 rounded-2xl p-4">
            <p className="text-[#5D4559]/80 leading-relaxed italic">
              "给孩子时间和空间，让他们以自己的方式去探索这个世界。"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
