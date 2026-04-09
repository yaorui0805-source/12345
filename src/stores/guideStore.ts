import { create } from 'zustand';
import type { GuideStep, GuideTask, GuideState } from '@/types/guide';
import { GUIDE_TASKS } from '@/types/guide';

interface GuideStore extends GuideState {
  startGuide: () => void;
  completeTask: (taskId: GuideStep) => void;
  skipGuide: () => void;
  resetGuide: () => void;
  getCurrentTask: () => GuideTask | null;
  getProgress: () => number;
  shouldShowTooltip: (elementId: string) => boolean;
}

const calculateProgress = (tasks: GuideTask[]): number => {
  const completedCount = tasks.filter(t => t.completed).length;
  return Math.round((completedCount / tasks.length) * 100);
};

const createInitialTasks = (): GuideTask[] =>
  GUIDE_TASKS.map(task => ({ ...task, completed: false }));

export const useGuideStore = create<GuideStore>((set, get) => ({
  isActive: false,
  currentStepIndex: 0,
  tasks: createInitialTasks(),
  totalProgress: 0,
  rewardUnlocked: false,
  showProgressBar: false,

  startGuide: () => {
    set({
      isActive: true,
      currentStepIndex: 0,
      tasks: createInitialTasks(),
      totalProgress: 0,
      rewardUnlocked: false,
      showProgressBar: true,
    });
  },

  completeTask: (taskId: GuideStep) => {
    const state = get();
    if (!state.isActive) return;

    const taskIndex = state.tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1 || state.tasks[taskIndex].completed) return;

    const updatedTasks = state.tasks.map((task, index) =>
      index === taskIndex ? { ...task, completed: true } : task
    );

    const newProgress = calculateProgress(updatedTasks);
    const newRewardUnlocked = newProgress >= 100;
    const newStepIndex = taskIndex + 1;

    set({
      tasks: updatedTasks,
      totalProgress: newProgress,
      currentStepIndex: newStepIndex,
      rewardUnlocked: newRewardUnlocked,
      showProgressBar: !newRewardUnlocked,
    });
  },

  skipGuide: () => {
    set({
      isActive: false,
      showProgressBar: false,
    });
  },

  resetGuide: () => {
    set({
      isActive: false,
      currentStepIndex: 0,
      tasks: createInitialTasks(),
      totalProgress: 0,
      rewardUnlocked: false,
      showProgressBar: false,
    });
  },

  getCurrentTask: () => {
    const state = get();
    if (!state.isActive || state.currentStepIndex >= state.tasks.length) {
      return null;
    }
    return state.tasks[state.currentStepIndex];
  },

  getProgress: () => {
    return get().totalProgress;
  },

  shouldShowTooltip: (elementId: string) => {
    const state = get();
    if (!state.isActive) return false;
    
    const currentTask = state.tasks[state.currentStepIndex];
    if (!currentTask) return false;
    
    return currentTask.targetElement === elementId;
  },
}));
