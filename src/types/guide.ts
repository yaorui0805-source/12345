export type GuideStep = 
  | 'send_first_query'
  | 'companion_diary'
  | 'multiplayer_interaction'
  | 'click_suggestion'
  | 'return_to_space';

export interface GuideTask {
  id: GuideStep;
  title: string;
  description: string;
  progressValue: number;
  completed: boolean;
  targetElement: string;
  tooltipPosition: 'top' | 'bottom' | 'left' | 'right';
}

export interface GuideState {
  isActive: boolean;
  currentStepIndex: number;
  tasks: GuideTask[];
  totalProgress: number;
  rewardUnlocked: boolean;
  showProgressBar: boolean;
}

export const GUIDE_TASKS: GuideTask[] = [
  {
    id: 'send_first_query',
    title: '发送第一条消息',
    description: '[SPOT]',
    progressValue: 20,
    completed: false,
    targetElement: 'chat-input',
    tooltipPosition: 'top',
  },
  {
    id: 'companion_diary',
    title: '查看陪伴日记',
    description: '[SPOT]',
    progressValue: 20,
    completed: false,
    targetElement: 'companion-diary',
    tooltipPosition: 'left',
  },
  {
    id: 'multiplayer_interaction',
    title: '进入多人互动',
    description: '[SPOT]',
    progressValue: 20,
    completed: false,
    targetElement: 'multiplayer-btn',
    tooltipPosition: 'left',
  },
  {
    id: 'click_suggestion',
    title: '点击互动建议',
    description: '[SPOT]',
    progressValue: 20,
    completed: false,
    targetElement: 'suggestion-chips',
    tooltipPosition: 'bottom',
  },
  {
    id: 'return_to_space',
    title: '返回专属空间',
    description: '[SPOT]',
    progressValue: 20,
    completed: false,
    targetElement: 'exclusive-companion',
    tooltipPosition: 'left',
  },
];
