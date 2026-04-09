import { useEffect, useState, useRef } from 'react';
import { useGuideStore } from '@/stores/guideStore';
import type { GuideTask } from '@/types/guide';

interface GuideTooltipProps {
  targetId: string;
  children?: React.ReactNode;
}

// 光圈+光点引导组件
function SpotGuide({ targetId }: { targetId: string }) {
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0, height: 0 });

  useEffect(() => {
    const updatePosition = () => {
      const targetElement = document.getElementById(targetId);
      if (!targetElement) return;

      const targetRect = targetElement.getBoundingClientRect();
      setPosition({
        top: targetRect.top + targetRect.height / 2,
        left: targetRect.left + targetRect.width / 2,
        width: targetRect.width,
        height: targetRect.height,
      });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    const interval = setInterval(updatePosition, 100);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
      clearInterval(interval);
    };
  }, [targetId]);

  const maxRadius = Math.max(position.width, position.height) * 1.5;

  return (
    <div
      className="fixed pointer-events-none"
      style={{
        top: position.top - maxRadius,
        left: position.left - maxRadius,
        width: maxRadius * 2,
        height: maxRadius * 2,
        zIndex: 9999,
      }}
    >
      {/* 外圈光晕 */}
      <div 
        className="absolute inset-0 rounded-full animate-pulse"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.2) 30%, rgba(255,255,255,0.05) 60%, transparent 70%)',
        }}
      />
      {/* 中圈 */}
      <div 
        className="absolute rounded-full animate-ping"
        style={{
          top: maxRadius * 0.25,
          left: maxRadius * 0.25,
          width: maxRadius * 1.5,
          height: maxRadius * 1.5,
          background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 40%, transparent 60%)',
        }}
      />
      {/* 内圈 */}
      <div 
        className="absolute rounded-full animate-pulse"
        style={{
          top: maxRadius * 0.4,
          left: maxRadius * 0.4,
          width: maxRadius * 1.2,
          height: maxRadius * 1.2,
          background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 50%)',
        }}
      />
      {/* 中心光点 */}
      <div 
        className="absolute rounded-full bg-white animate-pulse"
        style={{
          top: maxRadius - 6,
          left: maxRadius - 6,
          width: 12,
          height: 12,
          boxShadow: '0 0 20px 6px rgba(255,255,255,0.9), 0 0 40px 12px rgba(255,255,255,0.4)',
        }}
      />
    </div>
  );
}

export function GuideTooltip({ targetId, children }: GuideTooltipProps) {
  const { shouldShowTooltip, getCurrentTask } = useGuideStore();
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [tooltipSize, setTooltipSize] = useState({ width: 0, height: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);
  const currentTask = getCurrentTask();
  const showTooltip = shouldShowTooltip(targetId);

  useEffect(() => {
    if (!showTooltip || !currentTask) return;

    const updatePosition = () => {
      const targetElement = document.getElementById(targetId);
      if (!targetElement || !tooltipRef.current) return;

      const targetRect = targetElement.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      
      setTooltipSize({ width: tooltipRect.width, height: tooltipRect.height });

      let top = 0;
      let left = 0;

      switch (currentTask.tooltipPosition) {
        case 'top':
          top = targetRect.top - tooltipRect.height - 12;
          left = targetRect.left + (targetRect.width - tooltipRect.width) / 2;
          break;
        case 'bottom':
          top = targetRect.bottom + 12;
          left = targetRect.left + (targetRect.width - tooltipRect.width) / 2;
          break;
        case 'left':
          top = targetRect.top + (targetRect.height - tooltipRect.height) / 2;
          left = targetRect.left - tooltipRect.width - 12;
          break;
        case 'right':
          top = targetRect.top + (targetRect.height - tooltipRect.height) / 2;
          left = targetRect.right + 12;
          break;
      }

      const padding = 8;
      left = Math.max(padding, Math.min(left, window.innerWidth - tooltipRect.width - padding));
      top = Math.max(padding, Math.min(top, window.innerHeight - tooltipRect.height - padding));

      setPosition({ top, left });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    const interval = setInterval(updatePosition, 100);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
      clearInterval(interval);
    };
  }, [showTooltip, currentTask, targetId]);

  if (!showTooltip || !currentTask) {
    return children ? <>{children}</> : null;
  }

  // 如果是光圈引导模式
  if (currentTask.description === '[SPOT]') {
    return (
      <>
        {children}
        <SpotGuide targetId={targetId} />
      </>
    );
  }

  return (
    <>
      {children}
      <div
        ref={tooltipRef}
        className="fixed z-50 pointer-events-none"
        style={{
          top: position.top,
          left: position.left,
        }}
      >
        <div className="relative">
          {/* 极简文字提示，无背景 */}
          <div className="animate-fade-in">
            <span className="text-sm font-medium text-white whitespace-nowrap drop-shadow-lg">
              {currentTask.description}
            </span>
          </div>
        </div>
      </div>

      <div 
        className="fixed inset-0 bg-black/20 z-40 pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${position.left + tooltipSize.width/2}px ${position.top + tooltipSize.height/2}px, transparent 0%, rgba(0,0,0,0.15) 100%)`
        }}
      />
    </>
  );
}

interface GuideHighlightProps {
  targetId: string;
  children: React.ReactNode;
}

export function GuideHighlight({ targetId, children }: GuideHighlightProps) {
  const { shouldShowTooltip } = useGuideStore();
  const showHighlight = shouldShowTooltip(targetId);

  return (
    <div 
      id={targetId}
      className={`relative ${
        showHighlight ? 'z-50' : ''
      }`}
    >
      {children}
    </div>
  );
}
