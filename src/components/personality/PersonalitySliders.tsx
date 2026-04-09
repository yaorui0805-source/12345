import { Slider } from './Slider';
import { useAvatarStore } from '@/stores/avatarStore';
import { PERSONALITY_SLIDERS } from '@/constants/tags';
import type { PersonalityConfig } from '@/types/avatar';

export function PersonalitySliders() {
  const { personality, updatePersonality } = useAvatarStore();

  const handleSliderChange = (key: keyof PersonalityConfig, value: number) => {
    updatePersonality(key, value);
  };

  return (
    <div className="bg-white rounded-xl p-2.5 shadow-sm">
      <h3 className="text-xs font-semibold text-gray-900 mb-1">性格维度</h3>
      
      <div className="space-y-0">
        {PERSONALITY_SLIDERS.map((config) => (
          <Slider
            key={config.key}
            label={config.label}
            leftLabel={config.leftLabel}
            rightLabel={config.rightLabel}
            value={personality[config.key as keyof PersonalityConfig]}
            onChange={(value) => handleSliderChange(config.key as keyof PersonalityConfig, value)}
          />
        ))}
      </div>
    </div>
  );
}
