import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAvatarStore } from '@/stores/avatarStore';
import { PersonalitySliders } from '@/components/personality/PersonalitySliders';
import { LanguageStyleSliders } from '@/components/personality/LanguageStyleSliders';
import { StylePreview } from '@/components/personality/StylePreview';
import { TagSelector } from '@/components/personality/TagSelector';
import { DeepSoulQA } from '@/components/qa/DeepSoulQA';
import { AvatarAwakening } from '@/components/awakening/AvatarAwakening';
import { Sparkles, Check, Music, MessageCircle } from 'lucide-react';

export default function CreateAvatar() {
  const [currentPage, setCurrentPage] = useState<1 | 2>(1);
  const navigate = useNavigate();
  const { importFromDouyin } = useAvatarStore();

  const handleCreate = () => {
    setCurrentPage(2);
  };

  const handleEnterSpace = () => {
    navigate('/space');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* 头部 */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Sparkles size={16} className="text-white" />
            </div>
            <h1 className="text-base font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              创建AI分身
            </h1>
          </div>
          {currentPage !== 2 && (
            <button
              onClick={importFromDouyin}
              className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-blue-400 to-cyan-400 text-white text-xs font-medium rounded-full hover:opacity-90 transition-opacity shadow-sm shadow-blue-200"
            >
              <Music size={12} />
              还原抖音人设
            </button>
          )}
        </div>
      </div>

      {currentPage === 1 ? (
        /* 第一页：基础设置 + 深度灵魂问答 */
        <div className="max-w-md mx-auto px-3 py-2 space-y-2">
          {/* 性格维度 */}
          <PersonalitySliders />

          {/* 语言风格 */}
          <LanguageStyleSliders />

          {/* 风格预览 */}
          <StylePreview />

          {/* 个人标签 */}
          <TagSelector />

          {/* 深度灵魂问答 */}
          <DeepSoulQA />

          {/* 人设创建完成按钮 */}
          <div className="flex justify-end pt-2">
            <button
              onClick={handleCreate}
              className="flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium rounded-full shadow-lg shadow-purple-200 hover:shadow-xl hover:shadow-purple-300 transition-all active:scale-[0.98]"
            >
              <Check size={16} />
              人设创建完成
            </button>
          </div>
        </div>
      ) : (
        /* 第二页：声音和形象设置 */
        <div className="max-w-md mx-auto px-3 py-2 space-y-2 flex flex-col h-[calc(100vh-60px)]">
          <div className="flex-1 overflow-y-auto">
            <AvatarAwakening onBack={() => setCurrentPage(1)} />
          </div>
          
          {/* 进入虚拟互动空间按钮 */}
          <div className="flex justify-center pt-4 pb-8 flex-shrink-0">
            <button
              onClick={handleEnterSpace}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-medium rounded-full shadow-lg shadow-purple-200 hover:shadow-xl hover:shadow-purple-300 transition-all active:scale-[0.98]"
            >
              <MessageCircle size={20} />
              进入虚拟互动空间
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
