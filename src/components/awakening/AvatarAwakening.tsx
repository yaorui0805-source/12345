import { useState } from 'react';
import { ChevronLeft, Volume2, Image as ImageIcon } from 'lucide-react';

interface AvatarAwakeningProps {
  onBack: () => void;
}

export function AvatarAwakening({ onBack }: AvatarAwakeningProps) {
  const [activeTab, setActiveTab] = useState<'voice' | 'avatar' | null>(null);

  // 声音设置页面
  const VoiceSettings = () => (
    <div className="flex-1 bg-gray-50 p-4">
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">录入你的专属音色</h3>
        <p className="text-sm text-gray-500 mb-6">按照提示朗读文字，让AI学习你的声音特征</p>
        
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full flex items-center justify-center">
            <Volume2 size={40} className="text-white" />
          </div>
        </div>
        
        <button className="w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium rounded-xl">
          开始录音
        </button>
      </div>
    </div>
  );

  // 虚拟形象设置页面
  const AvatarSettings = () => (
    <div className="flex-1 bg-gray-50 p-4">
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">生成你的专属Q版形象</h3>
        <p className="text-sm text-gray-500 mb-6">AI将根据你的特征生成专属虚拟形象</p>
        
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center">
            <ImageIcon size={40} className="text-white" />
          </div>
        </div>
        
        <button className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-xl">
          生成形象
        </button>
      </div>
    </div>
  );

  // 主页面
  const MainPage = () => (
    <div className="flex-1 bg-gray-50 overflow-y-auto">
      <div className="p-4 space-y-4">
        {/* 返回按钮 */}
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800"
        >
          <ChevronLeft size={16} />
          返回人设创建
        </button>

        {/* 声音设置 */}
        <div 
          onClick={() => setActiveTab('voice')}
          className="bg-white rounded-2xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-xl flex items-center justify-center">
                <Volume2 size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-800">声音</h3>
                <p className="text-xs text-gray-500">录入你的专属音色</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-400">
              去设置
              <ChevronLeft size={16} className="rotate-180" />
            </div>
          </div>
        </div>

        {/* 虚拟形象设置 */}
        <div 
          onClick={() => setActiveTab('avatar')}
          className="bg-white rounded-2xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-400 rounded-xl flex items-center justify-center">
                <ImageIcon size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-800">虚拟形象</h3>
                <p className="text-xs text-gray-500">生成你的专属Q版形象</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-400">
              去设置
              <ChevronLeft size={16} className="rotate-180" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (activeTab === 'voice') {
    return (
      <div className="max-w-md mx-auto h-[calc(100vh-80px)] flex flex-col bg-white">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center">
          <button onClick={() => setActiveTab(null)} className="flex items-center gap-1 text-sm text-gray-600">
            <ChevronLeft size={16} />
            返回
          </button>
          <span className="ml-4 text-base font-semibold">声音设置</span>
        </div>
        <VoiceSettings />
      </div>
    );
  }

  if (activeTab === 'avatar') {
    return (
      <div className="max-w-md mx-auto h-[calc(100vh-80px)] flex flex-col bg-white">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center">
          <button onClick={() => setActiveTab(null)} className="flex items-center gap-1 text-sm text-gray-600">
            <ChevronLeft size={16} />
            返回
          </button>
          <span className="ml-4 text-base font-semibold">虚拟形象</span>
        </div>
        <AvatarSettings />
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto h-[calc(100vh-80px)] flex flex-col bg-white">
      <MainPage />
    </div>
  );
}
