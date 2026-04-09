import { Sparkles, X } from 'lucide-react';
import { useGuideStore } from '@/stores/guideStore';

export function SyncProgressBar() {
  const { totalProgress, rewardUnlocked, showProgressBar, skipGuide } = useGuideStore();

  if (!showProgressBar && !rewardUnlocked) return null;

  return (
    <div className="fixed top-[calc(env(safe-area-inset-top,0px)+60px)] left-4 right-4 z-40 max-w-md mx-auto">
      <div className="flex items-center gap-3">
        {/* 左侧：图标和文字 */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <Sparkles size={14} className="text-white/80" />
          <span className="text-xs text-white/80 font-medium">
            分身同频值
          </span>
        </div>

        {/* 进度条 */}
        <div className="flex-1 relative h-1.5 bg-white/20 rounded-full overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-400 via-pink-400 to-amber-300 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${totalProgress}%` }}
          />
        </div>

        {/* 右侧：百分比和关闭按钮 */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span className="text-xs text-white/90 font-bold">
            {totalProgress}%
          </span>
          {!rewardUnlocked && (
            <button
              onClick={skipGuide}
              className="p-0.5 hover:bg-white/10 rounded-full transition-colors"
              aria-label="跳过引导"
            >
              <X size={12} className="text-white/60" />
            </button>
          )}
        </div>
      </div>

      {/* 奖励提示 */}
      {rewardUnlocked && (
        <div className="mt-1.5 flex items-center justify-center gap-1">
          <Sparkles size={12} className="text-amber-300 animate-bounce" />
          <span className="text-xs text-amber-200 font-medium">
            星光奖励已解锁！
          </span>
          <Sparkles size={12} className="text-amber-300 animate-bounce" />
        </div>
      )}
    </div>
  );
}
