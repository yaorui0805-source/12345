import { useState, useEffect } from 'react';
import { 
  Users, 
  BookHeart, 
  X,
  ChevronLeft,
  Sparkles
} from 'lucide-react';
import { useGuideStore } from '@/stores/guideStore';
import { SyncProgressBar } from '@/components/guide/SyncProgressBar';
import { GuideTooltip, GuideHighlight } from '@/components/guide/GuideTooltip';
import { StarRewardAnimation } from '@/components/guide/StarRewardAnimation';
import type { GuideStep } from '@/types/guide';

interface Message {
  id: string;
  role: 'ai' | 'user';
  content: string;
  timestamp: number;
  username?: string;
  avatar?: string;
}

const SUGGESTIONS = [
  '讲个冷知识✨',
  '猜个字谜✨',
  '抖个机灵✨',
];

const MOCK_MESSAGES: Message[] = [
  {
    id: '1',
    role: 'ai',
    content: '小手动一动，回个消息好不好？',
    timestamp: Date.now() - 300000,
  },
  {
    id: '2',
    role: 'ai',
    content: '想确认你一切都好，看到的话吱一声就行。',
    timestamp: Date.now() - 240000,
  },
  {
    id: '3',
    role: 'ai',
    content: '我给对话框点了蜡烛，它还是一片寂静。',
    timestamp: Date.now() - 180000,
  },
  {
    id: '4',
    role: 'ai',
    content: '你好呀，很高兴能和你聊天。为了之后更好地交流，你希望我怎么称呼你呢？',
    timestamp: Date.now() - 60000,
  },
];

const MULTIPLAYER_MESSAGES: Message[] = [
  {
    id: '1',
    role: 'user',
    content: '你今天怎么不开心呀？',
    timestamp: Date.now() - 60000,
    username: 'cuicui',
    avatar: 'https://copilot-cn.bytedance.net/api/ide/v1/text_to_image?prompt=anime+girl+avatar%2C+cute+style%2C+pink+hair%2C+small+icon+size%2C+simple+background&image_size=square',
  },
];

export default function VirtualSpace() {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [showDiary, setShowDiary] = useState(false);
  const [isMultiplayer, setIsMultiplayer] = useState(false);
  const [onlineCount, setOnlineCount] = useState(1);
  const [showRewardAnimation, setShowRewardAnimation] = useState(false);
  const [hideProgressBar, setHideProgressBar] = useState(false);
  
  const { 
    startGuide, 
    completeTask, 
    isActive, 
    rewardUnlocked,
    resetGuide,
    getCurrentTask
  } = useGuideStore();

  useEffect(() => {
    // 每次进入页面都重置引导状态，确保引导正常显示
    localStorage.removeItem('hasSeenGuide');
    setTimeout(() => {
      startGuide();
    }, 500);
  }, []);

  useEffect(() => {
    if (rewardUnlocked) {
      localStorage.setItem('hasSeenGuide', 'true');
      // 显示奖励动画
      setShowRewardAnimation(true);
    }
  }, [rewardUnlocked]);

  const handleRewardAnimationComplete = () => {
    setShowRewardAnimation(false);
    // 动画完成后隐藏进度条
    setHideProgressBar(true);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');

    completeTask('send_first_query' as GuideStep);

    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: '收到你的消息啦！很高兴能和你聊天~',
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion.replace('✨', ''));
    completeTask('click_suggestion' as GuideStep);
  };

  const handleDiaryClick = () => {
    setShowDiary(true);
    completeTask('companion_diary' as GuideStep);
  };

  const handleMultiplayerClick = () => {
    setIsMultiplayer(true);
    setOnlineCount(3);
    setMessages(MULTIPLAYER_MESSAGES);
    completeTask('multiplayer_interaction' as GuideStep);
  };

  const handleReturnToSpace = () => {
    setIsMultiplayer(false);
    setOnlineCount(1);
    setMessages(MOCK_MESSAGES);
    completeTask('return_to_space' as GuideStep);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* 背景图片 */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `url('https://copilot-cn.bytedance.net/api/ide/v1/text_to_image?prompt=cyberpunk+city+night+street+scene%2C+neon+lights%2C+purple+and+pink+tones%2C+blurred+background%2C+dark+atmospheric%2C+futuristic+urban%2C+glowing+signs&image_size=portrait_16_9')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      {/* 渐变遮罩 */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />

      {!hideProgressBar && <SyncProgressBar />}

      {/* 星光奖励动画 */}
      {showRewardAnimation && (
        <StarRewardAnimation onComplete={handleRewardAnimationComplete} />
      )}

      <div className="relative z-10 flex flex-col h-screen">
        {/* 顶部导航栏 */}
        <div className="flex items-center justify-between px-4 py-3 pt-[env(safe-area-inset-top,12px)]">
          {/* 左侧：头像和名字 */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-300 to-purple-400 overflow-hidden border-2 border-white/30">
                <img 
                  src="https://copilot-cn.bytedance.net/api/ide/v1/text_to_image?prompt=anime+character+avatar%2C+white+hair%2C+blue+eyes%2C+soft+lighting%2C+circular+portrait&image_size=square" 
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-[8px] text-white font-bold">+</span>
              </div>
            </div>
            <span className="text-white font-medium text-sm">花傲天</span>
          </div>

          {/* 中间：在线人数（仅多人模式） */}
          {isMultiplayer && (
            <span className="text-white/90 text-sm font-medium">
              {onlineCount}人在线
            </span>
          )}

          {/* 右侧：菜单按钮 */}
          <div className="flex items-center gap-1">
            <button className="p-2 text-white/80 hover:text-white">
              <span className="text-lg">⋯</span>
            </button>
            <button className="p-2 text-white/80 hover:text-white">
              <X size={22} />
            </button>
          </div>
        </div>

        {/* 右侧功能按钮 - 调整位置：多人互动在上，陪伴日记在下 */}
        <div className="absolute right-2 top-20 flex flex-col gap-4 z-20">
          {/* 多人互动 - 移到最上面 */}
          <GuideHighlight targetId="multiplayer-btn">
            <button
              onClick={handleMultiplayerClick}
              className="flex flex-col items-center gap-1"
            >
              <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                <Users size={18} className="text-white" />
              </div>
              <span className="text-[10px] text-white/80">多人互动</span>
            </button>
          </GuideHighlight>

          <GuideTooltip targetId="multiplayer-btn">
            <div />
          </GuideTooltip>

          {/* 陪伴日记 - 移到第二位置 */}
          <GuideHighlight targetId="companion-diary">
            <button
              onClick={handleDiaryClick}
              className="flex flex-col items-center gap-1"
            >
              <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                <BookHeart size={18} className="text-white" />
              </div>
              <span className="text-[10px] text-white/80">陪伴日记</span>
            </button>
          </GuideHighlight>

          <GuideTooltip targetId="companion-diary">
            <div />
          </GuideTooltip>
        </div>

        {/* 底部区域 */}
        <div className="flex-1 flex flex-col justify-end px-4 pb-4">
          {/* sug词 - 仅在多人模式显示 */}
          {isMultiplayer && (
            <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
              {SUGGESTIONS.map((suggestion, index) => (
                <GuideHighlight 
                  key={index} 
                  targetId={index === 0 ? 'suggestion-chips' : `suggestion-${index}`}
                >
                  <button
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="flex-shrink-0 px-4 py-2 bg-white/15 backdrop-blur-sm rounded-full text-white text-sm hover:bg-white/25 transition-colors border border-white/20"
                  >
                    {suggestion}
                  </button>
                </GuideHighlight>
              ))}
              
              <GuideTooltip targetId="suggestion-chips">
                <div />
              </GuideTooltip>
            </div>
          )}

          {/* 输入框 - 新样式 */}
          <div className="flex items-center gap-3">
            {/* 输入框主体 - 无边框 */}
            <div className="flex-1 flex items-center bg-white/10 backdrop-blur-md rounded-full px-4 py-3" id="chat-input">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={getCurrentTask()?.id === 'send_first_query' && isActive ? "打个招呼吧" : "说点什么..."}
                className="flex-1 bg-transparent text-white placeholder-white/50 outline-none text-sm min-w-0"
              />
              <GuideTooltip targetId="chat-input" />
            </div>

            {/* 麦克风按钮 - 移到最右侧，使用 lucide 图标 */}
            <button className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-white/10 backdrop-blur-sm border border-white/20">
              <div className="relative w-6 h-6" style={{ transform: 'rotate(90deg)' }}>
                {/* 中心圆点 */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white rounded-full" />
                {/* 内圈弧线 */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 border-2 border-white rounded-full" style={{ clipPath: 'inset(0 0 50% 0)' }} />
                {/* 外圈弧线 */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 border-2 border-white rounded-full" style={{ clipPath: 'inset(0 0 50% 0)' }} />
              </div>
            </button>

            {/* AI发送按钮 - 透明底色 */}
            <button
              onClick={handleSendMessage}
              className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 bg-white/10 backdrop-blur-sm overflow-hidden"
            >
              <img 
                src="https://copilot-cn.bytedance.net/api/ide/v1/text_to_image?prompt=AI+button%2C+circular+icon%2C+white+AI+text+on+dark+background%2C+glossy+effect%2C+app+style&image_size=square" 
                alt="AI发送"
                className="w-full h-full object-cover rounded-full"
              />
            </button>
          </div>

          <p className="text-center text-[10px] text-white/40 mt-3">
            内容由AI生成 不保证真实准确 使用须知 &gt;
          </p>
        </div>
      </div>

      {/* 陪伴日记弹窗 */}
      {showDiary && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="font-semibold text-gray-800">陪伴日记</h2>
              <button 
                onClick={() => setShowDiary(false)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            <div className="p-4 space-y-4 overflow-y-auto max-h-[60vh]">
              <div className="text-center py-8 text-gray-400">
                <BookHeart size={48} className="mx-auto mb-2 opacity-30" />
                <p>记录着我们的相伴时光</p>
                <p className="text-sm mt-1">开始互动后，这里会记录美好回忆</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 多人互动界面 - 全屏模式 */}
      {isMultiplayer && (
        <div className="fixed inset-0 z-40 bg-black">
          {/* 背景图片 */}
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `url('https://copilot-cn.bytedance.net/api/ide/v1/text_to_image?prompt=cyberpunk+city+night+street+scene%2C+neon+lights%2C+purple+and+pink+tones%2C+blurred+background%2C+dark+atmospheric%2C+futuristic+urban%2C+glowing+signs&image_size=portrait_16_9')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          
          {/* 渐变遮罩 */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />

          <SyncProgressBar />

          <div className="relative z-10 flex flex-col h-screen">
            {/* 顶部导航栏 */}
            <div className="flex items-center justify-between px-4 py-3 pt-[env(safe-area-inset-top,12px)]">
              {/* 左侧：返回按钮 */}
              <button 
                onClick={handleReturnToSpace}
                className="p-2 text-white/80 hover:text-white"
              >
                <ChevronLeft size={24} />
              </button>

              {/* 中间：在线人数 */}
              <span className="text-white/90 text-sm font-medium">
                {onlineCount}人在线
              </span>

              {/* 右侧：菜单按钮 */}
              <div className="flex items-center gap-1">
                <button className="p-2 text-white/80 hover:text-white">
                  <span className="text-lg">⋯</span>
                </button>
                <button 
                  onClick={() => setIsMultiplayer(false)}
                  className="p-2 text-white/80 hover:text-white"
                >
                  <X size={22} />
                </button>
              </div>
            </div>

            {/* 右侧专属陪伴按钮 */}
            <div className="absolute right-2 top-20 flex flex-col gap-4 z-20">
              <GuideHighlight targetId="exclusive-companion">
                <button
                  onClick={handleReturnToSpace}
                  className="flex flex-col items-center gap-1"
                >
                  <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                    <Sparkles size={18} className="text-white" />
                  </div>
                  <span className="text-[10px] text-white/80">专属陪伴</span>
                </button>
              </GuideHighlight>

              <GuideTooltip targetId="exclusive-companion">
                <div />
              </GuideTooltip>
            </div>

            {/* 底部区域 */}
            <div className="flex-1 flex flex-col justify-end px-4 pb-4">
              {/* sug词 */}
              <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
                {SUGGESTIONS.map((suggestion, index) => (
                  <GuideHighlight 
                    key={index} 
                    targetId={index === 0 ? 'suggestion-chips' : `suggestion-${index}`}
                  >
                    <button
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="flex-shrink-0 px-4 py-2 bg-white/15 backdrop-blur-sm rounded-full text-white text-sm hover:bg-white/25 transition-colors border border-white/20"
                    >
                      {suggestion}
                    </button>
                  </GuideHighlight>
                ))}
                
                <GuideTooltip targetId="suggestion-chips">
                  <div />
                </GuideTooltip>
              </div>

              {/* 输入框 */}
              <div className="flex items-center gap-3">
                {/* 输入框主体 */}
                <div className="flex-1 flex items-center bg-white/10 backdrop-blur-md rounded-full px-4 py-3">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="说点什么..."
                    className="flex-1 bg-transparent text-white placeholder-white/50 outline-none text-sm min-w-0"
                  />
                </div>

                {/* 麦克风按钮 */}
                <button className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-white/10 backdrop-blur-sm overflow-hidden">
                  <img 
                    src="https://copilot-cn.bytedance.net/api/ide/v1/text_to_image?prompt=sound+wave+button%2C+circular+icon%2C+white+waves+on+purple+gradient%2C+glossy+effect%2C+app+style&image_size=square" 
                    alt="麦克风"
                    className="w-full h-full object-cover rounded-full"
                  />
                </button>

                {/* AI发送按钮 */}
                <button
                  onClick={handleSendMessage}
                  className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 bg-white/10 backdrop-blur-sm overflow-hidden"
                >
                  <img 
                    src="https://copilot-cn.bytedance.net/api/ide/v1/text_to_image?prompt=AI+button%2C+circular+icon%2C+white+AI+text+on+dark+background%2C+glossy+effect%2C+app+style&image_size=square" 
                    alt="AI发送"
                    className="w-full h-full object-cover rounded-full"
                  />
                </button>
              </div>

              <p className="text-center text-[10px] text-white/40 mt-3">
                内容由AI生成 不保证真实准确 使用须知 &gt;
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
