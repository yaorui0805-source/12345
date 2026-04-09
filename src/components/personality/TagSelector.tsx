import { useState } from 'react';
import { useAvatarStore } from '@/stores/avatarStore';
import { TAG_CATEGORIES } from '@/constants/tags';
import { X, Plus, Tag } from 'lucide-react';

const categoryColors: Record<string, { bg: string; active: string; light: string }> = {
  identity: { bg: 'bg-blue-100 text-blue-700', active: 'bg-blue-500 text-white', light: 'bg-blue-50' },
  region: { bg: 'bg-green-100 text-green-700', active: 'bg-green-500 text-white', light: 'bg-green-50' },
  culture: { bg: 'bg-purple-100 text-purple-700', active: 'bg-purple-500 text-white', light: 'bg-purple-50' },
  lifestyle: { bg: 'bg-orange-100 text-orange-700', active: 'bg-orange-500 text-white', light: 'bg-orange-50' },
  entertainment: { bg: 'bg-pink-100 text-pink-700', active: 'bg-pink-500 text-white', light: 'bg-pink-50' },
};

export function TagSelector() {
  const { selectedTags, customTags, toggleTag, addCustomTag, removeCustomTag } = useAvatarStore();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [customTagInput, setCustomTagInput] = useState('');

  const currentCategory = TAG_CATEGORIES.find(c => c.id === activeCategory);
  const colors = activeCategory ? categoryColors[activeCategory] : null;

  const handleAddCustomTag = () => {
    if (customTagInput.trim() && customTagInput.trim().length <= 6) {
      addCustomTag(customTagInput.trim());
      setCustomTagInput('');
      setIsAddingCustom(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddCustomTag();
    } else if (e.key === 'Escape') {
      setIsAddingCustom(false);
      setCustomTagInput('');
    }
  };

  const allSelectedTags = [...new Set([...selectedTags, ...customTags])];

  return (
    <div className="bg-white rounded-xl p-2.5 shadow-sm">
      {/* 头部 */}
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Tag size={10} className="text-white" />
          </div>
          <h3 className="text-[11px] font-semibold text-gray-900">个人标签</h3>
        </div>
        <div className="flex items-center gap-1.5">
          {allSelectedTags.length > 0 && (
            <span className="text-[9px] text-white font-medium bg-gradient-to-r from-blue-500 to-purple-500 px-1.5 py-0 rounded-full">
              {allSelectedTags.length}
            </span>
          )}
          <button
            onClick={() => setIsAddingCustom(true)}
            className="flex items-center gap-0.5 px-1.5 py-0.5 bg-gray-900 text-white rounded-full text-[9px] font-medium hover:bg-gray-800 transition-colors"
          >
            <Plus size={8} />
            自定义
          </button>
        </div>
      </div>

      {/* 已选标签展示 */}
      {allSelectedTags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-1.5 p-1.5 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-100 max-h-[50px] overflow-y-auto">
          {allSelectedTags.map((tag) => {
            const isCustom = customTags.includes(tag);
            return (
              <span
                key={tag}
                className={`inline-flex items-center gap-0.5 px-1.5 py-0 text-[9px] rounded-full transition-all ${
                  isCustom
                    ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white'
                    : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                }`}
              >
                {tag}
                <button
                  onClick={() => isCustom ? removeCustomTag(tag) : toggleTag(tag)}
                  className="hover:bg-white/20 rounded-full p-0.5 ml-0.5"
                >
                  <X size={7} />
                </button>
              </span>
            );
          })}
        </div>
      )}

      {/* 自定义标签输入 */}
      {isAddingCustom && (
        <div className="flex items-center gap-1.5 mb-1.5 p-1.5 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-100">
          <input
            type="text"
            value={customTagInput}
            onChange={(e) => setCustomTagInput(e.target.value.slice(0, 6))}
            onKeyDown={handleKeyPress}
            placeholder="输入标签（最多6字）"
            className="flex-1 px-2 py-1 text-[9px] bg-white rounded border border-gray-200 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-100"
            autoFocus
          />
          <button
            onClick={handleAddCustomTag}
            disabled={!customTagInput.trim()}
            className="px-2 py-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-[9px] rounded font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
          >
            添加
          </button>
          <button
            onClick={() => {
              setIsAddingCustom(false);
              setCustomTagInput('');
            }}
            className="px-1.5 py-1 text-gray-400 hover:text-gray-600 text-[9px]"
          >
            取消
          </button>
        </div>
      )}

      {/* 分类标签页 - 胶囊样式 */}
      <div className="flex gap-1 overflow-x-auto pb-0.5 scrollbar-hide">
        {TAG_CATEGORIES.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(activeCategory === category.id ? null : category.id)}
            className={`flex items-center gap-0.5 px-2 py-1 rounded-full whitespace-nowrap transition-all ${
              activeCategory === category.id
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <span className="text-[10px]">{category.icon}</span>
            <span className="text-[9px] font-medium">{category.name}</span>
          </button>
        ))}
      </div>

      {/* 标签选择区 - 流式布局，仅在选中分类时展示 */}
      {activeCategory && currentCategory && (
        <div className="flex flex-wrap gap-1.5 mt-1.5">
          {currentCategory.tags.map((tag) => {
            const isSelected = selectedTags.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`py-1 px-2 text-[9px] rounded-full border transition-all font-medium ${
                  isSelected
                    ? `${colors?.active} border-transparent`
                    : `${colors?.bg} border-transparent hover:opacity-80`
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
