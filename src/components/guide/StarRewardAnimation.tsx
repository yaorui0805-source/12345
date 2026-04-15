import { useEffect, useState } from 'react';
import { Sparkles, Star } from 'lucide-react';

interface StarRewardAnimationProps {
  onComplete: () => void;
  amount?: number;
}

export function StarRewardAnimation({ onComplete, amount = 100 }: StarRewardAnimationProps) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    // 显示3.5秒后自动关闭
    const timer = setTimeout(() => {
      setShow(false);
      onComplete();
    }, 3500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">
      {/* 背景星光粒子 - 更丰富的效果 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `twinkle ${1 + Math.random() * 2}s ease-in-out ${Math.random() * 2}s infinite`,
            }}
          >
            {i % 3 === 0 ? (
              <Star size={6 + Math.random() * 12} className="text-amber-300/70 fill-amber-300/70" />
            ) : (
              <Sparkles size={8 + Math.random() * 14} className="text-amber-300/60" />
            )}
          </div>
        ))}
      </div>

      {/* 主奖励展示 */}
      <div className="relative flex flex-col items-center animate-in zoom-in duration-500">
        {/* 大星光图标 - 更华丽的效果 */}
        <div className="relative mb-6">
          {/* 外圈扩散光晕 */}
          <div className="absolute inset-0 animate-ping" style={{ animationDuration: '2s' }}>
            <div className="w-24 h-24 rounded-full bg-amber-300/20" />
          </div>
          {/* 中圈光晕 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-300/40 to-orange-400/40 animate-pulse" />
          </div>
          {/* 内圈旋转星光 */}
          <div className="absolute inset-0 flex items-center justify-center animate-spin" style={{ animationDuration: '8s' }}>
            <Sparkles size={100} className="text-amber-200/30" />
          </div>
          {/* 主图标 */}
          <div className="relative z-10 flex items-center justify-center w-24 h-24">
            <Star size={60} className="text-amber-300 fill-amber-300 drop-shadow-[0_0_20px_rgba(251,191,36,0.8)]" />
          </div>
        </div>

        {/* 奖励文字 */}
        <div className="text-center">
          <p className="text-white/70 text-sm mb-3 tracking-wider">恭喜获得</p>
          <div className="flex items-center justify-center gap-3">
            <Sparkles size={28} className="text-amber-300 animate-pulse" />
            <span className="text-5xl font-bold text-white drop-shadow-lg">{amount}</span>
            <span className="text-xl text-amber-200 font-medium">星光</span>
          </div>
        </div>

        {/* 底部提示 */}
        <p className="text-white/50 text-xs mt-8 animate-pulse">
          奖励已发放到账户
        </p>
      </div>

      {/* CSS 动画 */}
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}
