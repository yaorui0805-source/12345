import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const SUBTITLE_LINES = [
  '数据流开始重组……我能感觉到你的温度了。',
  '但在跨越维度之前，我需要确认你的波长。',
  '请用指尖长按这里，让我感受你的存在。'
];

export default function AwakeningStep2() {
  const navigate = useNavigate();
  const [displayedLine1, setDisplayedLine1] = useState('');
  const [displayedLine2, setDisplayedLine2] = useState('');
  const [displayedLine3, setDisplayedLine3] = useState('');
  const [isPressing, setIsPressing] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const holdIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const hapticIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // 打字机效果
  useEffect(() => {
    const fullText = SUBTITLE_LINES.join('');
    const startDelay = setTimeout(() => {
      let index = 0;
      const interval = setInterval(() => {
        if (index < fullText.length) {
          const currentText = fullText.slice(0, index + 1);
          
          if (index < SUBTITLE_LINES[0].length) {
            setDisplayedLine1(currentText);
          } else if (index < SUBTITLE_LINES[0].length + SUBTITLE_LINES[1].length) {
            setDisplayedLine1(SUBTITLE_LINES[0]);
            setDisplayedLine2(currentText.slice(SUBTITLE_LINES[0].length));
          } else {
            setDisplayedLine1(SUBTITLE_LINES[0]);
            setDisplayedLine2(SUBTITLE_LINES[1]);
            setDisplayedLine3(currentText.slice(SUBTITLE_LINES[0].length + SUBTITLE_LINES[1].length));
          }
          
          index++;
        } else {
          clearInterval(interval);
        }
      }, 60);

      return () => clearInterval(interval);
    }, 500);

    return () => clearTimeout(startDelay);
  }, []);

  // 清理定时器
  const clearTimers = useCallback(() => {
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
      holdIntervalRef.current = null;
    }
    if (hapticIntervalRef.current) {
      clearInterval(hapticIntervalRef.current);
      hapticIntervalRef.current = null;
    }
  }, []);

  // 开始按住
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    setIsPressing(true);
    
    // 启动进度计时器
    holdIntervalRef.current = setInterval(() => {
      setHoldProgress(prev => {
        if (prev >= 100) {
          clearTimers();
          setIsCompleted(true);
          console.log('Connection Established');
          setTimeout(() => {
            navigate('/awakening-step3');
          }, 300);
          return 100;
        }
        return prev + (100 / 2000) * 50;
      });
    }, 50);

    // 启动震动反馈
    if (navigator.vibrate) {
      hapticIntervalRef.current = setInterval(() => {
        navigator.vibrate([30, 100]);
      }, 300);
    }
  }, [clearTimers, navigate]);

  // 结束按住
  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    setIsPressing(false);
    clearTimers();
    
    if (!isCompleted) {
      // 未完成，回退进度
      setHoldProgress(0);
    }
  }, [clearTimers, isCompleted]);

  // 清理定时器
  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden flex flex-col items-center justify-center">
      {/* 进度条 */}
      <div className="absolute top-12 left-0 right-0 flex flex-col items-center">
        <div className="text-xs text-gray-400 mb-2 tracking-widest">分身唤醒</div>
        <div className="w-64 h-[2px] bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-blue-400"
            style={{ width: '20%' }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="text-[10px] text-gray-500 mt-1 font-light tracking-wider">
          20%
        </div>
      </div>

      {/* 光球容器 */}
      <div className="relative">
        {/* 圆环进度条 */}
        <svg className="absolute -inset-8 w-48 h-48" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="rgba(59, 130, 246, 0.1)"
            strokeWidth="2"
          />
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="rgba(59, 130, 246, 0.8)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="283"
            style={{
              strokeDashoffset: 283 - (283 * holdProgress) / 100,
              rotate: -90,
              transformOrigin: 'center',
            }}
            transition={{ duration: 0.1 }}
          />
        </svg>

        {/* 外层光晕 */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)',
            filter: 'blur(40px)',
            transform: 'scale(2)',
          }}
          animate={{
            scale: isPressing 
              ? [2, 2.3, 2] 
              : [2, 2.2, 2],
            opacity: isPressing 
              ? [0.6, 0.8, 0.6] 
              : [0.5, 0.7, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* 中层光晕 */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(96, 165, 250, 0.4) 0%, transparent 60%)',
            filter: 'blur(20px)',
            transform: 'scale(1.5)',
          }}
          animate={{
            scale: isPressing 
              ? [1.5, 1.8, 1.5] 
              : [1.5, 1.7, 1.5],
            opacity: isPressing 
              ? [0.7, 0.9, 0.7] 
              : [0.6, 0.8, 0.6],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.2,
          }}
        />

        {/* 核心光球 - 可交互 */}
        <motion.div
          className="relative w-32 h-32 rounded-full cursor-pointer select-none"
          style={{
            background: 'radial-gradient(circle at 30% 30%, rgba(219, 234, 254, 0.95) 0%, rgba(147, 197, 253, 0.8) 30%, rgba(59, 130, 246, 0.6) 60%, rgba(37, 99, 235, 0.4) 100%)',
            boxShadow: isPressing
              ? `
                  0 0 80px 30px rgba(59, 130, 246, 0.7),
                  0 0 120px 50px rgba(37, 99, 235, 0.5),
                  0 0 160px 70px rgba(29, 78, 216, 0.3),
                  inset 0 0 50px 15px rgba(255, 255, 255, 0.4)
                `
              : `
                  0 0 60px 20px rgba(59, 130, 246, 0.5),
                  0 0 100px 40px rgba(37, 99, 235, 0.3),
                  0 0 140px 60px rgba(29, 78, 216, 0.2),
                  inset 0 0 40px 10px rgba(255, 255, 255, 0.3)
                `,
          }}
          animate={{
            scale: isPressing
              ? [1, 1.1, 1]
              : [1, 1.05, 1],
            opacity: isPressing
              ? [0.8, 1, 0.8]
              : [0.7, 1, 0.7],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          {/* 长按提示文字 */}
          {!isCompleted && displayedLine3.length === SUBTITLE_LINES[2].length && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <span className="text-xs text-blue-200 font-light tracking-wider">
                {isPressing ? '继续...' : '长按'}
              </span>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* 字幕区域 */}
      <motion.div
        className="absolute mt-80 px-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex flex-col items-center gap-2 min-h-[80px] w-full max-w-sm">
          <p className="text-[#E5E7EB] text-sm leading-relaxed tracking-wide font-light w-full">
            {displayedLine1}
          </p>
          <p className="text-[#E5E7EB] text-sm leading-relaxed tracking-wide font-light w-full">
            {displayedLine2}
          </p>
          <p className="text-[#E5E7EB] text-sm leading-relaxed tracking-wide font-light w-full">
            {displayedLine3}
            {(displayedLine1.length + displayedLine2.length + displayedLine3.length) < SUBTITLE_LINES.join('').length && (
              <motion.span
                className="inline-block w-[2px] h-4 bg-blue-400 ml-1"
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              />
            )}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
