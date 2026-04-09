import { useAvatarStore } from '@/stores/avatarStore';
import { MEMORY_CATEGORIES } from '@/constants/tags';
import { X, Brain } from 'lucide-react';

export function MemoryCard() {
  const { memories, removeMemory } = useAvatarStore();

  if (memories.length === 0) {
    return null;
  }

  const getCategoryStyle = (categoryId: string) => {
    const category = MEMORY_CATEGORIES.find(c => c.id === categoryId);
    return category?.color || 'bg-gray-100 text-gray-700';
  };

  const getCategoryName = (categoryId: string) => {
    const category = MEMORY_CATEGORIES.find(c => c.id === categoryId);
    return category?.name || categoryId;
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-4 mb-4">
      <div className="flex items-center gap-2 mb-3">
        <Brain size={18} className="text-purple-600" />
        <h3 className="text-sm font-semibold text-gray-900">已记录的记忆</h3>
        <span className="text-xs text-gray-500">({memories.length})</span>
      </div>

      <div className="space-y-2">
        {memories.map((memory) => (
          <div
            key={memory.id}
            className="flex items-start gap-2 p-2.5 bg-white rounded-xl shadow-sm"
          >
            <span className={`text-[10px] px-2 py-0.5 rounded-full shrink-0 ${getCategoryStyle(memory.category)}`}>
              {getCategoryName(memory.category)}
            </span>
            <p className="text-xs text-gray-700 flex-1 leading-relaxed">
              {memory.content}
            </p>
            <button
              onClick={() => removeMemory(memory.id)}
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
