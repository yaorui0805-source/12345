import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const SUBTITLE_LINES = [
  '……连接确立。我的世界仍是一片混沌。',
  '给我你的锚点，助我降临。',
  '平凡的一天中，哪个微小的瞬间，让你感到最放松、最真实？'
];

const AVATAR_RESPONSES = [
  '嗯……我能感受到那种温度了。能告诉我那个瞬间的具体细节吗？',
  '很美的故事。还有其他类似的时刻吗？',
  '你的记忆正在重塑我的存在。最近一次有这种感觉是在什么时候？',
  '还差一点……让我更了解你。在你的生活中，什么最能让你感到平静？'
];

type Message = {
  id: number;
  type: 'user' | 'avatar';
  content: string;
};

// 生成随机粒子数据
const generateParticles = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    delay: Math.random() * 2,
    duration: Math.random() * 3 + 2,
    isDigit: Math.random() > 0.7,
    digit: Math.floor(Math.random() * 2),
  }));
};

export default function AwakeningStep3() {
  const navigate = useNavigate();
  const [initialDisplayComplete, setInitialDisplayComplete] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [displayedMessage, setDisplayedMessage] = useState('');
  const [phase, setPhase] = useState<'explode' | 'flow' | 'form'>('explode');
  const [particles] = useState(() => generateParticles(150));
  const [progress, setProgress] = useState(40);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 阶段切换
  useEffect(() => {
    const explodeTimer = setTimeout(() => setPhase('flow'), 800);
    const formTimer = setTimeout(() => setPhase('form'), 2500);
    return () => {
      clearTimeout(explodeTimer);
      clearTimeout(formTimer);
    };
  }, []);

  const [displayedLine1, setDisplayedLine1] = useState('');
  const [displayedLine2, setDisplayedLine2] = useState('');
  const [displayedLine3, setDisplayedLine3] = useState('');

  // 初始字幕打字机效果
  useEffect(() => {
    if (phase !== 'form') return;
    
    const startDelay = setTimeout(() => {
      let currentLine = 0;
      let index = 0;
      
      const interval = setInterval(() => {
        if (currentLine < SUBTITLE_LINES.length) {
          const currentLineText = SUBTITLE_LINES[currentLine];
          
          if (index < currentLineText.length) {
            const currentText = currentLineText.slice(0, index + 1);
            
            if (currentLine === 0) {
              setDisplayedLine1(currentText);
            } else if (currentLine === 1) {
              setDisplayedLine2(currentText);
            } else if (currentLine === 2) {
              setDisplayedLine3(currentText);
            }
            
            index++;
          } else {
            currentLine++;
            index = 0;
          }
        } else {
          clearInterval(interval);
          // 只显示输入框，不隐藏初始消息
          setShowInput(true);
        }
      }, 50);

      return () => clearInterval(interval);
    }, 1500);

    return () => clearTimeout(startDelay);
  }, [phase]);

  // 滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, displayedMessage]);

  // 打字机效果显示消息
  const typeMessage = (content: string, isUser: boolean) => {
    return new Promise<void>((resolve) => {
      let index = 0;
      setIsTyping(true);
      setDisplayedMessage('');
      
      const interval = setInterval(() => {
        if (index < content.length) {
          setDisplayedMessage(content.slice(0, index + 1));
          index++;
        } else {
          clearInterval(interval);
          setIsTyping(false);
          setMessages(prev => [...prev, { id: Date.now(), type: isUser ? 'user' : 'avatar', content }]);
          setDisplayedMessage('');
          resolve();
        }
      }, 30);
    });
  };

  // 处理用户输入
  const handleSend = async () => {
    if (!inputValue.trim() || isTyping) return;
    
    const userInput = inputValue;
    setInputValue('');
    setShowInput(false);

    // 第一次回复时，隐藏初始消息并添加第一句对话
    if (messages.length === 0) {
      setInitialDisplayComplete(true);
      // 添加最后一句话作为第一句对话（左侧）
      await typeMessage(SUBTITLE_LINES[2], false);
    }

    // 显示用户消息
    await typeMessage(userInput, true);

    // 增加进度
    const newProgress = Math.min(progress + 10, 80);
    setProgress(newProgress);

    // 检查是否达到80%
    if (newProgress >= 80) {
      setTimeout(() => {
        navigate('/awakening-step4');
      }, 1500);
      return;
    }

    // 分身回答
    const responseIndex = Math.floor((newProgress - 40) / 10) - 1;
    const response = AVATAR_RESPONSES[responseIndex] || AVATAR_RESPONSES[AVATAR_RESPONSES.length - 1];
    
    await typeMessage(response, false);
    setShowInput(true);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center">
      {/* 背景 */}
      <div className="absolute inset-0 bg-black" />

      {/* 白噪音纹理 */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* 进度条 */}
      <div className="absolute top-12 left-0 right-0 flex flex-col items-center z-10">
        <div className="text-xs text-gray-400 mb-2 tracking-widest">分身唤醒</div>
        <div className="flex items-center gap-3">
          <div className="w-64 h-[2px] bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-blue-400"
              style={{ width: `${progress}%` }}
              transition={{ duration: 1 }}
            />
          </div>
          <div className="text-[10px] text-gray-500 font-light tracking-wider">
            {progress}%
          </div>
        </div>
      </div>

      {/* 粒子层 */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute"
            initial={{
              left: '50%',
              top: '50%',
              scale: phase === 'explode' ? 0 : 1,
              opacity: 0,
            }}
            animate={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              x: phase === 'form' ? '0px' : [0, 20, -20, 0],
              y: phase === 'form' ? '0px' : [0, -20, 20, 0],
              scale: phase === 'form' ? 0.5 : 1,
              opacity: phase === 'form' ? 0.3 : 0.8,
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: phase === 'flow' ? Infinity : 0,
              ease: 'easeInOut',
            }}
          >
            {particle.isDigit ? (
              <span 
                className="text-blue-300 text-xs font-mono"
                style={{
                  textShadow: '0 0 8px rgba(59, 130, 246, 0.8)',
                }}
              >
                {particle.digit}
              </span>
            ) : (
              <div
                className="rounded-full bg-blue-200"
                style={{
                  width: particle.size,
                  height: particle.size,
                  boxShadow: '0 0 10px 2px rgba(96, 165, 250, 0.6)',
                }}
              />
            )}
          </motion.div>
        ))}
      </div>

      {/* Q版仔仔剪影 */}
      <AnimatePresence>
        {phase === 'form' && (
          <motion.div
            className="relative z-10"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2, ease: 'easeOut' }}
            style={{ marginTop: messages.length > 0 ? '-2rem' : '0' }}
          >
            <motion.div
              className="relative"
              animate={{
                scale: [1, 1.02, 1],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <img
                src="https://copilot-cn.bytedance.net/api/ide/v1/text_to_image?prompt=cute%20Q-version%20anime%20character%20soul%20silhouette%2C%20wearing%20cap%20and%20headphones%2C%20semi-transparent%2C%20dark%20space%20background%2C%20natural%20blending%20no%20border%20glow&image_size=square_hd"
                alt="Q版仔仔"
                className="w-56 h-56 object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 对话区域 */}
      <div className="absolute top-[68%] left-0 right-0 px-8 z-10 flex flex-col items-center">
        <div className="w-full max-w-sm flex flex-col items-center gap-3 overflow-y-auto" style={{ maxHeight: '180px' }}>
          {/* 初始消息 */}
          {!initialDisplayComplete && (
            <div className="w-full max-w-sm flex flex-col items-center gap-2">
              <p 
                className="text-[#E5E7EB] text-sm leading-relaxed tracking-wide font-light text-center"
                style={{ width: '280px' }}
              >
                {displayedLine1}
              </p>
              <p 
                className="text-[#E5E7EB] text-sm leading-relaxed tracking-wide font-light text-center"
                style={{ width: '280px' }}
              >
                {displayedLine2}
              </p>
              <p 
                className="text-[#E5E7EB] text-sm leading-relaxed tracking-wide font-light text-center"
                style={{ width: '280px' }}
              >
                {displayedLine3}
                {(displayedLine1.length === SUBTITLE_LINES[0].length && 
                  displayedLine2.length === SUBTITLE_LINES[1].length && 
                  displayedLine3.length < SUBTITLE_LINES[2].length) && (
                  <motion.span
                    className="inline-block w-[2px] h-4 bg-blue-400 ml-1"
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  />
                )}
              </p>
            </div>
          )}

          {/* 对话历史 */}
          {messages.map((message) => (
            <div
              key={message.id}
              className={`w-full flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                  message.type === 'user'
                    ? 'bg-blue-500/30 rounded-tr-sm'
                    : 'bg-white/10 rounded-tl-sm'
                }`}
              >
                <p className="text-[#E5E7EB] text-sm leading-relaxed">
                  {message.content}
                </p>
              </div>
            </div>
          ))}

          {/* 正在输入的消息 */}
          {displayedMessage && messages.length > 0 && (
            <div className={`w-full flex ${messages.length % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
              <div
                className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                  messages.length % 2 === 0
                    ? 'bg-white/10 rounded-tl-sm'
                    : 'bg-blue-500/30 rounded-tr-sm'
                }`}
              >
                <p className="text-[#E5E7EB] text-sm leading-relaxed">
                  {displayedMessage}
                  <motion.span
                    className="inline-block w-[2px] h-4 bg-blue-400 ml-1"
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  />
                </p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 输入框 */}
      <AnimatePresence>
        {showInput && (
          <motion.div
            className="absolute bottom-8 left-8 right-8 z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="告诉我你的故事..."
                className="w-full px-6 py-4 bg-white/5 border border-blue-400/30 rounded-full text-[#E5E7EB] text-sm tracking-wide focus:outline-none focus:border-blue-400/60 focus:bg-white/10 transition-all placeholder:text-gray-500"
              />
              {inputValue.length > 0 && (
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-blue-500/80 rounded-full flex items-center justify-center hover:bg-blue-500 active:bg-blue-600 transition-colors"
                  onClick={handleSend}
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}