import { useState, useRef, useEffect } from 'react';
import { useAvatarStore } from '@/stores/avatarStore';
import { MessageSquare, Send, Sparkles, Brain, RefreshCw } from 'lucide-react';
import { analyzeAnswer, generateAIResponse } from '@/utils/qaEngine';

export function DeepSoulQA() {
  const { 
    messages, 
    addMessage, 
    isQAActive, 
    startQA, 
    endQA, 
    generateNextQuestion,
    addMemory,
    personality,
    languageStyle,
    updatePersonality,
    updateLanguageStyle
  } = useAvatarStore();
  
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || isProcessing) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    
    // 添加用户消息
    addMessage({
      id: Date.now().toString(),
      role: 'user',
      content: userMessage,
      timestamp: Date.now(),
    });

    setIsProcessing(true);

    // 分析回答
    const analysis = analyzeAnswer(userMessage);
    
    // 添加记忆
    analysis.memories.forEach(memory => addMemory(memory));
    
    // 调整人设（平滑过渡）
    const blendFactor = 0.3;
    
    Object.entries(analysis.personalityAdjustments).forEach(([key, value]) => {
      const currentValue = personality[key as keyof typeof personality];
      const newValue = Math.round(currentValue + (value - currentValue) * blendFactor);
      updatePersonality(key as keyof typeof personality, newValue);
    });
    
    Object.entries(analysis.languageStyleAdjustments).forEach(([key, value]) => {
      const currentValue = languageStyle[key as keyof typeof languageStyle];
      const newValue = Math.round(currentValue + (value - currentValue) * blendFactor);
      updateLanguageStyle(key as keyof typeof languageStyle, newValue);
    });

    // 生成AI回复
    const aiResponse = generateAIResponse(analysis.insights);
    
    setTimeout(() => {
      addMessage({
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: aiResponse,
        timestamp: Date.now(),
      });
      
      // 继续问下一个问题
      setTimeout(() => {
        const nextQuestion = generateNextQuestion();
        addMessage({
          id: (Date.now() + 2).toString(),
          role: 'ai',
          content: nextQuestion,
          timestamp: Date.now(),
        });
        setIsProcessing(false);
      }, 600);
    }, 800);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleNextQuestion = () => {
    const question = generateNextQuestion();
    addMessage({
      id: Date.now().toString(),
      role: 'ai',
      content: question,
      timestamp: Date.now(),
    });
  };

  if (!isQAActive) {
    return (
      <div className="bg-white rounded-xl p-2.5 shadow-sm">
        <div className="flex items-center gap-1.5 mb-1.5">
          <div className="w-5 h-5 bg-gradient-to-br from-purple-500 to-pink-500 rounded flex items-center justify-center">
            <Brain size={10} className="text-white" />
          </div>
          <h3 className="text-[11px] font-semibold text-gray-900">深度灵魂问答</h3>
        </div>
        
        <p className="text-[9px] text-gray-500 mb-2 leading-relaxed">
          通过多轮对话，AI分身将主动提问并根据你的回答自动优化人设。
        </p>
        
        <button
          onClick={startQA}
          className="w-full py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[10px] font-medium rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-1"
        >
          <Sparkles size={10} />
          开始灵魂问答
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* 头部 */}
      <div className="px-2.5 py-1.5 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-100 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded flex items-center justify-center">
            <Brain size={9} className="text-white" />
          </div>
          <h3 className="text-[11px] font-semibold text-gray-900">深度灵魂问答</h3>
        </div>
        <div className="flex items-center gap-0.5">
          <button
            onClick={handleNextQuestion}
            disabled={isProcessing}
            className="p-0.5 text-purple-600 hover:bg-purple-100 rounded transition-colors disabled:opacity-50"
          >
            <RefreshCw size={10} />
          </button>
          <button
            onClick={endQA}
            className="text-[9px] text-gray-500 hover:text-gray-700 px-1.5 py-0.5"
          >
            结束
          </button>
        </div>
      </div>

      {/* 消息列表 */}
      <div className="h-28 overflow-y-auto px-2.5 py-1.5 space-y-1.5 bg-gray-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] px-2.5 py-1.5 rounded-xl text-[10px] leading-relaxed ${
                message.role === 'user'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-br-sm'
                  : 'bg-white text-gray-800 shadow-sm rounded-bl-sm'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        {isProcessing && (
          <div className="flex justify-start">
            <div className="bg-white px-2.5 py-1.5 rounded-xl rounded-bl-sm shadow-sm flex items-center gap-1">
              <div className="w-1 h-1 bg-purple-400 rounded-full animate-bounce" />
              <div className="w-1 h-1 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
              <div className="w-1 h-1 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 输入框 */}
      <div className="px-2.5 py-1.5 border-t border-gray-100 bg-white">
        <div className="flex items-center gap-1.5">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="输入你的回答..."
            className="flex-1 px-2.5 py-1.5 text-[10px] bg-gray-100 rounded-full border-0 focus:outline-none focus:ring-1 focus:ring-purple-200"
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || isProcessing}
            className="w-7 h-7 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
          >
            <Send size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
