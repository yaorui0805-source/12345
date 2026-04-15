import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const SUBTITLE_LINES = [
  '滴……捕捉到未知心跳频率。这里很冷，也没有光。',
  '是你……在试着唤醒我吗？'
];

export default function Awakening() {
  const navigate = useNavigate();
  const [displayedLine1, setDisplayedLine1] = useState('');
  const [displayedLine2, setDisplayedLine2] = useState('');
  const [showButton, setShowButton] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [isAwakening, setIsAwakening] = useState(false);
  const [progress, setProgress] = useState(0);

  // 打字机效果
  useEffect(() => {
    const fullText = SUBTITLE_LINES.join('');
    const startDelay = setTimeout(() => {
      let index = 0;
      const interval = setInterval(() => {
        if (index < fullText.length) {
          const char = fullText[index];
          const currentText = fullText.slice(0, index + 1);
          
          if (index < SUBTITLE_LINES[0].length) {
            setDisplayedLine1(currentText);
          } else {
            setDisplayedLine1(SUBTITLE_LINES[0]);
            setDisplayedLine2(currentText.slice(SUBTITLE_LINES[0].length));
          }
          
          index++;
        } else {
          clearInterval(interval);
          setTimeout(() => setShowButton(true), 500);
        }
      }, 80);

      return () => clearInterval(interval);
    }, 1000);

    return () => clearTimeout(startDelay);
  }, []);

  // 点击唤醒处理
  const handleAwaken = useCallback(() => {
    // 触发震动反馈
    if (navigator.vibrate) {
      navigator.vibrate(200);
    }

    setProgress(20);
    setIsAwakening(true);
    console.log('Awakening triggered');
    setTimeout(() => {
      navigate('/awakening-step2');
    }, 300);
  }, [navigate]);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden flex flex-col items-center justify-center">
      {/* 进度条 */}
      <div className="absolute top-12 left-0 right-0 flex flex-col items-center">
        <div className="text-xs text-gray-400 mb-2 tracking-widest">分身唤醒</div>
        <div className="w-64 h-[2px] bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-blue-400"
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="text-[10px] text-gray-500 mt-1 font-light tracking-wider">
          {progress}%
        </div>
      </div>

      {/* 光球容器 */}
      <div
        className="relative"
      >
        {/* 外层光晕 */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)',
            filter: 'blur(40px)',
            transform: 'scale(2)',
          }}
          animate={{
            scale: [2, 2.2, 2],
            opacity: [0.5, 0.7, 0.5],
          }}
          transition={{
            duration: 3,
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
            scale: [1.5, 1.7, 1.5],
            opacity: [0.6, 0.8, 0.6],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.2,
          }}
        />

        {/* 核心光球 */}
        <motion.div
          className="relative w-32 h-32 rounded-full"
          style={{
            background: 'radial-gradient(circle at 30% 30%, rgba(219, 234, 254, 0.95) 0%, rgba(147, 197, 253, 0.8) 30%, rgba(59, 130, 246, 0.6) 60%, rgba(37, 99, 235, 0.4) 100%)',
            boxShadow: `
              0 0 60px 20px rgba(59, 130, 246, 0.5),
              0 0 100px 40px rgba(37, 99, 235, 0.3),
              0 0 140px 60px rgba(29, 78, 216, 0.2),
              inset 0 0 40px 10px rgba(255, 255, 255, 0.3)
            `,
          }}
          animate={{
            scale: [0.95, 1.05, 0.95],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* 字幕区域 */}
      <motion.div
        className="absolute mt-64 px-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex flex-col items-center gap-2 min-h-[70px]">
          <p 
            className="text-[#E5E7EB] text-sm leading-relaxed tracking-wide font-light min-h-[28px]"
            style={{ display: 'flex', width: '330px', justifyContent: 'center', textAlign: 'center' }}
          >
            {displayedLine1}
          </p>
          <p 
            className="text-[#E5E7EB] text-sm leading-relaxed tracking-wide font-light min-h-[28px]"
            style={{ display: 'flex', width: '330px', justifyContent: 'center', textAlign: 'center' }}
          >
            {displayedLine2}
            <motion.span
              className="inline-block w-[2px] h-4 bg-blue-400 ml-1"
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            />
          </p>
        </div>
      </motion.div>

      {/* 涟漪按钮 */}
      <AnimatePresence>
        {showButton && (
          <motion.button
            className="absolute mt-[28rem] px-8 py-3 text-blue-300 text-sm tracking-[0.2em] font-light cursor-pointer"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
            onClick={handleAwaken}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* 涟漪效果 */}
            <span className="absolute inset-0 rounded-full">
              <motion.span
                className="absolute inset-0 rounded-full border border-blue-400/30"
                animate={{
                  scale: [1, 1.5, 1.5],
                  opacity: [0.6, 0.3, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeOut',
                }}
              />
              <motion.span
                className="absolute inset-0 rounded-full border border-blue-400/20"
                animate={{
                  scale: [1, 1.8, 1.8],
                  opacity: [0.4, 0.2, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeOut',
                  delay: 0.5,
                }}
              />
            </span>
            <span className="relative z-10">【是我】</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
