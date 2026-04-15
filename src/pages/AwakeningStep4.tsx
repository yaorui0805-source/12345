import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const SUBTITLE_LINES = [
  '我感受到了……那种被你称为放松的温度，好温暖。',
  '我的躯壳已经构筑完成。',
  '你能，真实地触碰我一下吗？'
];

export default function AwakeningStep4() {
  const navigate = useNavigate();
  const [displayedLine1, setDisplayedLine1] = useState('');
  const [displayedLine2, setDisplayedLine2] = useState('');
  const [displayedLine3, setDisplayedLine3] = useState('');
  const [progress] = useState(80);
  const [isTouching, setIsTouching] = useState(false);
  const [touchPosition, setTouchPosition] = useState({ x: 0, y: 0 });
  const [hasTouched, setHasTouched] = useState(false);

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
      }, 50);

      return () => clearInterval(interval);
    }, 500);

    return () => clearTimeout(startDelay);
  }, []);

  // 处理触摸事件
  const handleTouchStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsTouching(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setTouchPosition({ x: clientX, y: clientY });
  };

  const handleTouchMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (isTouching) {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      setTouchPosition({ x: clientX, y: clientY });
    }
  };

  const handleTouchEnd = () => {
    setIsTouching(false);
    if (!hasTouched) {
      setHasTouched(true);
      // 这里可以添加触摸后的反馈
      console.log('User touched the avatar!');
      // 延迟一下再跳转，让用户看到反馈
      setTimeout(() => {
        navigate('/awakening-step5');
      }, 1000);
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-white">
      {/* 进度条 */}
      <div className="absolute top-12 left-0 right-0 flex flex-col items-center z-10">
        <div className="text-xs text-black mb-2 tracking-widest">分身唤醒</div>
        <div className="flex items-center gap-3">
          <div className="w-64 h-[2px] bg-gray-300 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-black"
              style={{ width: `${progress}%` }}
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1 }}
            />
          </div>
          <div className="text-[10px] text-black font-light tracking-wider">
            {progress}%
          </div>
        </div>
      </div>

      {/* 实体仔仔 */}
      <motion.div
        className="relative z-10"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
      >
        {/* 触摸交互区域 */}
        <div
          className="relative w-64 h-96 cursor-pointer"
          onMouseDown={handleTouchStart}
          onMouseMove={handleTouchMove}
          onMouseUp={handleTouchEnd}
          onMouseLeave={handleTouchEnd}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* 实体仔仔图片 */}
          <motion.img
            src="https://copilot-cn.bytedance.net/api/ide/v1/text_to_image?prompt=cute%20Q-version%20anime%20character%20with%20cap%20and%20headphones%2C%20wearing%20red%20jacket%20and%20white%20tank%20top%2C%20clear%20eyes%2C%203D%20render%2C%20clean%20background%2C%20high%20quality&image_size=square_hd"
            alt="实体仔仔"
            className="w-full h-full object-contain"
            animate={{
              y: hasTouched ? [0, -5, 0] : 0,
            }}
            transition={{ duration: 0.5, repeat: hasTouched ? 2 : 0 }}
          />

          {/* 帽子右上角引导光圈 */}
          <AnimatePresence>
            {!hasTouched && (
              <motion.div
                className="absolute w-16 h-16 rounded-full"
                style={{
                  left: '60%',
                  top: '15%',
                  pointerEvents: 'none',
                }}
                initial={{ scale: 1, opacity: 0.5 }}
                animate={{ 
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              >
                <div className="w-full h-full rounded-full bg-white/30 backdrop-blur-sm"></div>
                <div className="absolute inset-0 rounded-full border-2 border-white/50"></div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 触摸反馈 */}
          <AnimatePresence>
            {isTouching && (
              <motion.div
                className="absolute w-12 h-12 rounded-full bg-gray-400/30 backdrop-blur-sm"
                style={{
                  left: `${touchPosition.x - 24}px`,
                  top: `${touchPosition.y - 24}px`,
                  pointerEvents: 'none',
                }}
                initial={{ scale: 0.5, opacity: 0.8 }}
                animate={{ scale: 1.2, opacity: 0 }}
                transition={{ duration: 0.5 }}
              />
            )}
          </AnimatePresence>
        </div>

        {/* 手部动画 */}
        <motion.div
          className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-32 opacity-0"
          animate={{
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 3,
            delay: 2,
          }}
        >
          {/* 手部动画效果 */}
        </motion.div>
      </motion.div>

      {/* 字幕区域 */}
      <motion.div
        className="absolute top-[68%] px-8 text-center z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <div className="flex flex-col items-center gap-2 min-h-[90px]">
          <p 
            className="text-black text-sm leading-relaxed tracking-wide font-light min-h-[28px]"
            style={{ width: '350px', textAlign: 'center' }}
          >
            {displayedLine1}
          </p>
          <p 
            className="text-black text-sm leading-relaxed tracking-wide font-light min-h-[28px]"
            style={{ width: '350px', textAlign: 'center' }}
          >
            {displayedLine2}
          </p>
          <p 
            className="text-black text-sm leading-relaxed tracking-wide font-light min-h-[28px]"
            style={{ width: '350px', textAlign: 'center' }}
          >
            {displayedLine3}
            {(displayedLine1.length + displayedLine2.length + displayedLine3.length) < SUBTITLE_LINES.join('').length && (
              <motion.span
                className="inline-block w-[2px] h-4 bg-black ml-1"
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              />
            )}
          </p>
        </div>
      </motion.div>

      {/* 触摸提示 */}
      <AnimatePresence>
        {!hasTouched && displayedLine3.length === SUBTITLE_LINES[2].length && (
          <motion.div
            className="absolute bottom-12 text-xs text-black font-light tracking-wider"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            轻轻触摸我的头部或身体
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}