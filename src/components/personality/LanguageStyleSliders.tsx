import { Slider } from './Slider';
import { useAvatarStore } from '@/stores/avatarStore';
import { LANGUAGE_STYLE_SLIDERS } from '@/constants/tags';
import type { LanguageStyleConfig } from '@/types/avatar';

export function LanguageStyleSliders() {
  const { languageStyle, updateLanguageStyle } = useAvatarStore();

  const handleSliderChange = (key: keyof LanguageStyleConfig, value: number) => {
    updateLanguageStyle(key, value);
  };

  return (
    <div className="bg-white rounded-xl p-2.5 shadow-sm">
      <h3 className="text-xs font-semibold text-gray-900 mb-1">语言风格</h3>
      
      <div className="space-y-0">
        {LANGUAGE_STYLE_SLIDERS.map((config) => (
          <Slider
            key={config.key}
            label={config.label}
            leftLabel={config.leftLabel}
            rightLabel={config.rightLabel}
            value={languageStyle[config.key as keyof LanguageStyleConfig]}
            onChange={(value) => handleSliderChange(config.key as keyof LanguageStyleConfig, value)}
          />
        ))}
      </div>
    </div>
  );
}
