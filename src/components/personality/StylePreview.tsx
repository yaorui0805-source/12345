import { useMemo } from 'react';
import { useAvatarStore } from '@/stores/avatarStore';
import { Sparkles } from 'lucide-react';

export function StylePreview() {
  const { personality, languageStyle } = useAvatarStore();

  const previewText = useMemo(() => {
    // 根据性格维度生成基础风格
    const getPersonalityTraits = () => {
      const traits: string[] = [];
      
      if (personality.extraversion < 30) traits.push('安静内敛');
      else if (personality.extraversion > 70) traits.push('热情外向');
      
      if (personality.rationality < 30) traits.push('感性细腻');
      else if (personality.rationality > 70) traits.push('理性冷静');
      
      if (personality.seriousness < 30) traits.push('随性洒脱');
      else if (personality.seriousness > 70) traits.push('严谨认真');
      
      return traits.length > 0 ? traits.join('、') : '平和自然';
    };

    // 根据语言风格生成示例句子
    const generateExample = () => {
      const examples: string[] = [];
      
      // 根据表达方式（夸夸-锐评）
      if (languageStyle.praiseCritical < 30) {
        examples.push('哇，这个想法真的太棒了，完全被你惊艳到了！');
      } else if (languageStyle.praiseCritical > 70) {
        examples.push('说实话，这个方案还有很大改进空间，建议重新考虑。');
      }
      
      // 根据内容风格（抽象-文艺）
      if (languageStyle.abstractLiterary < 30) {
        examples.push('就像量子纠缠一样，我们的思维在平行宇宙产生了共振。');
      } else if (languageStyle.abstractLiterary > 70) {
        examples.push('暮色温柔地洒在窗前，时光在这一刻变得格外柔软。');
      }
      
      // 根据语气态度（高冷-显眼）
      if (languageStyle.coldShowy < 30) {
        examples.push('哦。随便。无所谓。');
      } else if (languageStyle.coldShowy > 70) {
        examples.push('家人们谁懂啊！这也太绝了吧！我真的会谢！');
      }
      
      // 如果没有极端值，生成平衡示例
      if (examples.length === 0) {
        return '我觉得这个想法不错，既有趣又有深度，值得尝试一下。';
      }
      
      // 随机选择一个示例
      return examples[Math.floor(Math.random() * examples.length)];
    };

    return {
      traits: getPersonalityTraits(),
      example: generateExample()
    };
  }, [personality, languageStyle]);

  return (
    <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-xl p-2.5 shadow-sm">
      <div className="flex items-center gap-1.5 mb-1.5">
        <div className="w-4 h-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center">
          <Sparkles size={10} className="text-white" />
        </div>
        <h3 className="text-[11px] font-semibold text-gray-900">风格预览</h3>
        <span className="text-[9px] text-blue-600 bg-blue-100 px-1.5 py-0 rounded-full">
          {previewText.traits}
        </span>
      </div>
      
      <div className="bg-white/80 backdrop-blur-sm rounded-lg p-2">
        <p className="text-[9px] text-gray-400 mb-0.5">AI分身可能会这样说：</p>
        <p className="text-[11px] text-gray-800 leading-relaxed">
          "{previewText.example}"
        </p>
      </div>
    </div>
  );
}
