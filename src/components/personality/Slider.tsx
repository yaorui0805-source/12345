import { useCallback } from 'react';

interface SliderProps {
  label: string;
  leftLabel: string;
  rightLabel: string;
  value: number;
  onChange: (value: number) => void;
}

export function Slider({ label, leftLabel, rightLabel, value, onChange }: SliderProps) {
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value));
  }, [onChange]);

  const getPositionColor = () => {
    if (value < 30) return 'text-blue-600';
    if (value > 70) return 'text-purple-600';
    return 'text-gray-500';
  };

  const getCurrentLabel = () => {
    if (value < 30) return leftLabel;
    if (value > 70) return rightLabel;
    return '平衡';
  };

  return (
    <div className="w-full py-1">
      <div className="flex items-center justify-between mb-0.5">
        <span className="text-[10px] font-medium text-gray-700">{label}</span>
        <span className={`text-[9px] font-medium ${getPositionColor()}`}>
          {getCurrentLabel()}
        </span>
      </div>
      
      <div className="relative flex items-center">
        <span className="text-[9px] text-gray-400 w-6 text-left shrink-0">{leftLabel}</span>
        
        <div className="flex-1 mx-1.5">
          <input
            type="range"
            min="0"
            max="100"
            value={value}
            onChange={handleChange}
            className="w-full h-1 rounded-lg appearance-none cursor-pointer slider-simple"
            style={{
              background: `linear-gradient(to right, #3B82F6 0%, #8B5CF6 ${value}%, #E5E7EB ${value}%, #E5E7EB 100%)`
            }}
          />
        </div>
        
        <span className="text-[9px] text-gray-400 w-6 text-right shrink-0">{rightLabel}</span>
      </div>
    </div>
  );
}
