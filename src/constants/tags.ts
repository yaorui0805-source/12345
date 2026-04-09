import type { TagCategory, SliderConfig } from '@/types/avatar';

export const TAG_CATEGORIES: TagCategory[] = [
  {
    id: 'identity',
    name: '身份',
    icon: '👤',
    tags: ['社恐', '社牛', '打工人', '学生党', '熬夜冠军', '早八人', '铲屎官', '二次元', '佛系青年', '卷王', '躺平族', '斜杠青年', '数字游民', '全职儿女', 'Gap Year中']
  },
  {
    id: 'region',
    name: '地域',
    icon: '📍',
    tags: ['川渝', '东北', '广东', '江浙沪', '北京', '湖南', '湖北', '西安', '山东', '福建', '云南', '新疆', '内蒙古', '港澳台', '海外党']
  },
  {
    id: 'culture',
    name: '文化',
    icon: '🎨',
    tags: ['二次元', '古风', '嘻哈', '摇滚', '国风', '街舞', '说唱', '电音', 'JK制服', '汉服党', '洛丽塔', '赛博朋克', 'Y2K', 'Vintage', '极简主义']
  },
  {
    id: 'lifestyle',
    name: '生活',
    icon: '☕',
    tags: ['美食', '旅行', '摄影', '健身', '萌宠', '穿搭', '护肤', '养生', '露营', '骑行', '滑雪', '潜水', '瑜伽', '冥想', '园艺', '手工', '咖啡', '茶文化', '品酒']
  },
  {
    id: 'entertainment',
    name: '娱乐',
    icon: '🎬',
    tags: ['追星', '追剧', '综艺', '电影', '音乐', '动漫', '小说', '直播', 'Kpop', 'Jpop', '欧美圈', '内娱', '泰腐', '广播剧', '剧本杀', '密室逃脱', '桌游', '盲盒', '乐高']
  }
];

export const PERSONALITY_SLIDERS: SliderConfig[] = [
  {
    key: 'extraversion',
    label: '性格倾向',
    leftLabel: '外向',
    rightLabel: '内向'
  },
  {
    key: 'rationality',
    label: '思维方式',
    leftLabel: '感性',
    rightLabel: '理性'
  },
  {
    key: 'seriousness',
    label: '处事风格',
    leftLabel: '随和',
    rightLabel: '严谨'
  }
];

export const LANGUAGE_STYLE_SLIDERS: SliderConfig[] = [
  {
    key: 'praiseCritical',
    label: '表达方式',
    leftLabel: '夸夸',
    rightLabel: '锐评'
  },
  {
    key: 'abstractLiterary',
    label: '内容风格',
    leftLabel: '抽象',
    rightLabel: '文艺'
  },
  {
    key: 'coldShowy',
    label: '语气态度',
    leftLabel: '高冷',
    rightLabel: '显眼'
  }
];

export const DEFAULT_QUESTIONS = [
  '如果你能拥有一种超能力，你会选择什么？为什么？',
  '描述一下你理想中的周末是怎样的？',
  '你最看重朋友身上的什么品质？',
  '如果可以给五年前的自己一条建议，你会说什么？',
  '你最近一直在思考的一个问题是什么？',
  '什么事情会让你感到真正的快乐？',
  '你觉得自己最大的优点和缺点分别是什么？',
  '如果可以选择任何地方生活，你会选择哪里？'
];

export const MEMORY_CATEGORIES = [
  { id: 'interest', name: '兴趣爱好', color: 'bg-blue-100 text-blue-700' },
  { id: 'value', name: '价值观', color: 'bg-purple-100 text-purple-700' },
  { id: 'attitude', name: '生活态度', color: 'bg-green-100 text-green-700' },
  { id: 'relationship', name: '人际关系', color: 'bg-orange-100 text-orange-700' }
];
