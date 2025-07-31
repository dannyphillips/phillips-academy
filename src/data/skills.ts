import { Child } from '../types/types';

export interface Skill {
  id: string;
  name: string;
  description: string;
  ageRange: [number, number]; // [minAge, maxAge]
  category: SkillCategory;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  badge: string; // Icon name for the badge
  estimatedDuration: string; // e.g., "2-3 weeks", "1 month"
  prerequisites?: string[]; // IDs of skills that should be completed first
  // Progress tracking configuration
  progressType: 'boolean' | 'counter';
  targetValue?: number; // For counter-based skills (e.g., "Read 20 books")
  progressDescription?: string; // Human-readable description of progress (e.g., "books read")
}

export type SkillCategory = 
  | 'self-care'
  | 'motor-skills'
  | 'academic'
  | 'social'
  | 'life-skills'
  | 'creative'
  | 'technology'
  | 'safety'
  | 'organization'
  | 'communication';

export const SKILLS: Skill[] = [
  // Age 4-5 Skills
  {
    id: 'potty-training',
    name: 'Potty Training',
    description: 'Learn to use the toilet independently',
    ageRange: [3, 5],
    category: 'self-care',
    difficulty: 'beginner',
    badge: 'droplets',
    estimatedDuration: '2-4 weeks',
    progressType: 'boolean'
  },
  {
    id: 'hand-washing',
    name: 'Proper Hand Washing',
    description: 'Learn to wash hands thoroughly with soap',
    ageRange: [4, 6],
    category: 'self-care',
    difficulty: 'beginner',
    badge: 'hand',
    estimatedDuration: '1 week',
    progressType: 'boolean'
  },
  {
    id: 'zipper',
    name: 'Using Zippers',
    description: 'Learn to zip and unzip clothing',
    ageRange: [4, 6],
    category: 'motor-skills',
    difficulty: 'beginner',
    badge: 'zap',
    estimatedDuration: '1-2 weeks',
    progressType: 'boolean'
  },
  {
    id: 'buttons',
    name: 'Buttoning Clothes',
    description: 'Learn to button and unbutton clothing',
    ageRange: [4, 6],
    category: 'motor-skills',
    difficulty: 'beginner',
    badge: 'circle',
    estimatedDuration: '2-3 weeks',
    progressType: 'boolean'
  },
  {
    id: 'scissors',
    name: 'Using Scissors Safely',
    description: 'Learn to cut paper with scissors',
    ageRange: [4, 6],
    category: 'motor-skills',
    difficulty: 'beginner',
    badge: 'scissors',
    estimatedDuration: '2-3 weeks',
    progressType: 'boolean'
  },
  {
    id: 'tying-shoes',
    name: 'Tying Shoes',
    description: 'Learn to tie shoelaces',
    ageRange: [5, 7],
    category: 'motor-skills',
    difficulty: 'intermediate',
    badge: 'shoe',
    estimatedDuration: '3-4 weeks',
    progressType: 'boolean'
  },
  {
    id: 'phone-number',
    name: 'Memorize Phone Number',
    description: 'Learn parent\'s phone number',
    ageRange: [4, 6],
    category: 'safety',
    difficulty: 'beginner',
    badge: 'Phone',
    estimatedDuration: '1 week',
    progressType: 'boolean'
  },
  {
    id: 'address',
    name: 'Memorize Address',
    description: 'Learn home address',
    ageRange: [4, 6],
    category: 'safety',
    difficulty: 'beginner',
    badge: 'Home',
    estimatedDuration: '1 week',
    progressType: 'boolean'
  },
  {
    id: 'crossing-street',
    name: 'Crossing Street Safely',
    description: 'Learn to look both ways and cross with adult',
    ageRange: [4, 6],
    category: 'safety',
    difficulty: 'beginner',
    badge: 'Car',
    estimatedDuration: '2-3 weeks',
    progressType: 'boolean'
  },
  {
    id: 'stranger-danger',
    name: 'Stranger Safety',
    description: 'Learn about stranger danger and safety rules',
    ageRange: [4, 6],
    category: 'safety',
    difficulty: 'beginner',
    badge: 'Shield',
    estimatedDuration: '1 week',
    progressType: 'boolean'
  },
  {
    id: 'sharing',
    name: 'Sharing Toys',
    description: 'Learn to share toys with others',
    ageRange: [4, 6],
    category: 'social',
    difficulty: 'beginner',
    badge: 'Gift',
    estimatedDuration: 'Ongoing',
    progressType: 'counter',
    targetValue: 10,
    progressDescription: 'times shared toys'
  },
  {
    id: 'taking-turns',
    name: 'Taking Turns',
    description: 'Learn to wait for turn in games',
    ageRange: [4, 6],
    category: 'social',
    difficulty: 'beginner',
    badge: 'Clock',
    estimatedDuration: 'Ongoing',
    progressType: 'counter',
    targetValue: 15,
    progressDescription: 'times waited for turn'
  },
  {
    id: 'apologizing',
    name: 'Saying Sorry',
    description: 'Learn to apologize when wrong',
    ageRange: [4, 6],
    category: 'social',
    difficulty: 'beginner',
    badge: 'Heart',
    estimatedDuration: 'Ongoing',
    progressType: 'counter',
    targetValue: 5,
    progressDescription: 'times apologized appropriately'
  },
  {
    id: 'cleaning-room',
    name: 'Cleaning Room',
    description: 'Learn to put toys away',
    ageRange: [4, 6],
    category: 'organization',
    difficulty: 'beginner',
    badge: 'Trash2',
    estimatedDuration: '2-3 weeks',
    progressType: 'counter',
    targetValue: 7,
    progressDescription: 'days room cleaned'
  },
  {
    id: 'making-bed',
    name: 'Making Bed',
    description: 'Learn to make bed in morning',
    ageRange: [4, 6],
    category: 'organization',
    difficulty: 'beginner',
    badge: 'Bed',
    estimatedDuration: '1-2 weeks',
    progressType: 'counter',
    targetValue: 7,
    progressDescription: 'days bed made'
  },
  {
    id: 'coloring-inside-lines',
    name: 'Coloring Inside Lines',
    description: 'Learn to color within boundaries',
    ageRange: [4, 6],
    category: 'creative',
    difficulty: 'beginner',
    badge: 'palette',
    estimatedDuration: '2-3 weeks',
    progressType: 'counter',
    targetValue: 10,
    progressDescription: 'pictures colored neatly'
  },
  {
    id: 'drawing-shapes',
    name: 'Drawing Basic Shapes',
    description: 'Learn to draw circles, squares, triangles',
    ageRange: [4, 6],
    category: 'creative',
    difficulty: 'beginner',
    badge: 'square',
    estimatedDuration: '2-3 weeks',
    progressType: 'boolean'
  },
  {
    id: 'counting-20',
    name: 'Counting to 20',
    description: 'Learn to count from 1 to 20',
    ageRange: [4, 6],
    category: 'academic',
    difficulty: 'beginner',
    badge: 'hash',
    estimatedDuration: '2-3 weeks',
    progressType: 'boolean'
  },
  {
    id: 'alphabet',
    name: 'Learning Alphabet',
    description: 'Learn all 26 letters',
    ageRange: [4, 6],
    category: 'academic',
    difficulty: 'beginner',
    badge: 'type',
    estimatedDuration: '3-4 weeks',
    progressType: 'boolean'
  },
  {
    id: 'writing-name',
    name: 'Writing Name',
    description: 'Learn to write first name',
    ageRange: [4, 6],
    category: 'academic',
    difficulty: 'intermediate',
    badge: 'pen-tool',
    estimatedDuration: '3-4 weeks',
    progressType: 'boolean'
  },

  // Age 6-7 Skills
  {
    id: 'reading-sight-words',
    name: 'Reading Sight Words',
    description: 'Learn common sight words',
    ageRange: [6, 7],
    category: 'academic',
    difficulty: 'intermediate',
    badge: 'book-open',
    estimatedDuration: '2-3 months',
    progressType: 'counter',
    targetValue: 100,
    progressDescription: 'sight words learned'
  },
  {
    id: 'basic-math',
    name: 'Basic Addition',
    description: 'Learn simple addition facts',
    ageRange: [6, 7],
    category: 'academic',
    difficulty: 'intermediate',
    badge: 'plus',
    estimatedDuration: '2-3 months',
    progressType: 'counter',
    targetValue: 50,
    progressDescription: 'addition problems solved'
  },
  {
    id: 'telling-time',
    name: 'Telling Time',
    description: 'Learn to read analog clock',
    ageRange: [6, 7],
    category: 'academic',
    difficulty: 'intermediate',
    badge: 'clock',
    estimatedDuration: '1-2 months',
    progressType: 'boolean'
  },
  {
    id: 'tying-double-knot',
    name: 'Double Knot',
    description: 'Learn to tie double knot',
    ageRange: [6, 7],
    category: 'motor-skills',
    difficulty: 'intermediate',
    badge: 'knot',
    estimatedDuration: '2-3 weeks',
    progressType: 'boolean'
  },
  {
    id: 'brushing-teeth',
    name: 'Brushing Teeth Properly',
    description: 'Learn proper brushing technique',
    ageRange: [6, 7],
    category: 'self-care',
    difficulty: 'intermediate',
    badge: 'tooth',
    estimatedDuration: '2-3 weeks',
    progressType: 'counter',
    targetValue: 14,
    progressDescription: 'days teeth brushed properly'
  },
  {
    id: 'showering',
    name: 'Showering Independently',
    description: 'Learn to shower alone',
    ageRange: [6, 7],
    category: 'self-care',
    difficulty: 'intermediate',
    badge: 'droplets',
    estimatedDuration: '2-3 weeks',
    progressType: 'boolean'
  },
  {
    id: 'packing-backpack',
    name: 'Packing Backpack',
    description: 'Learn to pack school bag',
    ageRange: [6, 7],
    category: 'organization',
    difficulty: 'intermediate',
    badge: 'briefcase',
    estimatedDuration: '1-2 weeks',
    progressType: 'counter',
    targetValue: 5,
    progressDescription: 'days backpack packed correctly'
  },
  {
    id: 'homework-routine',
    name: 'Homework Routine',
    description: 'Learn to do homework independently',
    ageRange: [6, 7],
    category: 'organization',
    difficulty: 'intermediate',
    badge: 'book',
    estimatedDuration: '1-2 months',
    progressType: 'counter',
    targetValue: 10,
    progressDescription: 'days homework completed independently'
  },
  {
    id: 'saving-money',
    name: 'Saving Money',
    description: 'Learn to save allowance',
    ageRange: [6, 7],
    category: 'life-skills',
    difficulty: 'intermediate',
    badge: 'piggy-bank',
    estimatedDuration: 'Ongoing',
    progressType: 'counter',
    targetValue: 10,
    progressDescription: 'dollars saved'
  },
  {
    id: 'phone-call',
    name: 'Making Phone Call',
    description: 'Learn to call parent if needed',
    ageRange: [6, 7],
    category: 'communication',
    difficulty: 'intermediate',
    badge: 'phone',
    estimatedDuration: '1-2 weeks',
    progressType: 'boolean'
  },

  // Age 8-9 Skills
  {
    id: 'multiplication',
    name: 'Multiplication Tables',
    description: 'Learn times tables 1-5',
    ageRange: [8, 9],
    category: 'academic',
    difficulty: 'intermediate',
    badge: 'x',
    estimatedDuration: '2-3 months',
    progressType: 'counter',
    targetValue: 25,
    progressDescription: 'multiplication facts memorized'
  },
  {
    id: 'cursive-writing',
    name: 'Cursive Writing',
    description: 'Learn cursive handwriting',
    ageRange: [8, 9],
    category: 'academic',
    difficulty: 'intermediate',
    badge: 'pen-tool',
    estimatedDuration: '3-4 months',
    progressType: 'boolean'
  },
  {
    id: 'cooking-basic',
    name: 'Basic Cooking',
    description: 'Learn to make simple meals',
    ageRange: [8, 9],
    category: 'life-skills',
    difficulty: 'intermediate',
    badge: 'utensils',
    estimatedDuration: '2-3 months',
    progressType: 'counter',
    targetValue: 5,
    progressDescription: 'meals cooked independently'
  },
  {
    id: 'laundry',
    name: 'Doing Laundry',
    description: 'Learn to wash and fold clothes',
    ageRange: [8, 9],
    category: 'life-skills',
    difficulty: 'intermediate',
    badge: 'shirt',
    estimatedDuration: '1-2 months',
    progressType: 'counter',
    targetValue: 3,
    progressDescription: 'loads of laundry completed'
  },
  {
    id: 'bike-riding',
    name: 'Riding Bike',
    description: 'Learn to ride bicycle',
    ageRange: [8, 9],
    category: 'motor-skills',
    difficulty: 'intermediate',
    badge: 'bike',
    estimatedDuration: '2-4 weeks',
    progressType: 'boolean'
  },
  {
    id: 'swimming',
    name: 'Swimming',
    description: 'Learn to swim',
    ageRange: [8, 9],
    category: 'motor-skills',
    difficulty: 'intermediate',
    badge: 'waves',
    estimatedDuration: '2-3 months',
    progressType: 'boolean'
  },
  {
    id: 'computer-basics',
    name: 'Computer Basics',
    description: 'Learn to use computer safely',
    ageRange: [8, 9],
    category: 'technology',
    difficulty: 'intermediate',
    badge: 'monitor',
    estimatedDuration: '1-2 months',
    progressType: 'boolean'
  },
  {
    id: 'email',
    name: 'Using Email',
    description: 'Learn to send and read emails',
    ageRange: [8, 9],
    category: 'technology',
    difficulty: 'intermediate',
    badge: 'mail',
    estimatedDuration: '1-2 weeks',
    progressType: 'boolean'
  },
  {
    id: 'internet-safety',
    name: 'Internet Safety',
    description: 'Learn online safety rules',
    ageRange: [8, 9],
    category: 'safety',
    difficulty: 'intermediate',
    badge: 'shield',
    estimatedDuration: '1-2 weeks',
    progressType: 'boolean'
  },
  {
    id: 'budgeting',
    name: 'Basic Budgeting',
    description: 'Learn to manage allowance',
    ageRange: [8, 9],
    category: 'life-skills',
    difficulty: 'intermediate',
    badge: 'calculator',
    estimatedDuration: '2-3 months',
    progressType: 'counter',
    targetValue: 4,
    progressDescription: 'weeks budget followed'
  },

  // Age 10 Skills
  {
    id: 'advanced-cooking',
    name: 'Advanced Cooking',
    description: 'Learn to cook full meals',
    ageRange: [10, 10],
    category: 'life-skills',
    difficulty: 'advanced',
    badge: 'chef-hat',
    estimatedDuration: '3-4 months',
    progressType: 'counter',
    targetValue: 10,
    progressDescription: 'full meals cooked'
  },
  {
    id: 'sewing',
    name: 'Basic Sewing',
    description: 'Learn to sew buttons and simple repairs',
    ageRange: [10, 10],
    category: 'life-skills',
    difficulty: 'advanced',
    badge: 'needle',
    estimatedDuration: '2-3 months',
    progressType: 'counter',
    targetValue: 5,
    progressDescription: 'items sewn or repaired'
  },
  {
    id: 'gardening',
    name: 'Gardening',
    description: 'Learn to plant and care for garden',
    ageRange: [10, 10],
    category: 'life-skills',
    difficulty: 'advanced',
    badge: 'sprout',
    estimatedDuration: '3-4 months',
    progressType: 'counter',
    targetValue: 3,
    progressDescription: 'plants successfully grown'
  },
  {
    id: 'first-aid',
    name: 'Basic First Aid',
    description: 'Learn basic first aid skills',
    ageRange: [10, 10],
    category: 'safety',
    difficulty: 'advanced',
    badge: 'heart-pulse',
    estimatedDuration: '1-2 months',
    progressType: 'boolean'
  },
  {
    id: 'map-reading',
    name: 'Reading Maps',
    description: 'Learn to read maps and directions',
    ageRange: [10, 10],
    category: 'life-skills',
    difficulty: 'advanced',
    badge: 'map',
    estimatedDuration: '1-2 months',
    progressType: 'boolean'
  },
  {
    id: 'public-speaking',
    name: 'Public Speaking',
    description: 'Learn to speak confidently in front of others',
    ageRange: [10, 10],
    category: 'communication',
    difficulty: 'advanced',
    badge: 'mic',
    estimatedDuration: '3-4 months',
    progressType: 'counter',
    targetValue: 5,
    progressDescription: 'presentations given'
  },
  {
    id: 'coding-basics',
    name: 'Basic Coding',
    description: 'Learn simple programming concepts',
    ageRange: [10, 10],
    category: 'technology',
    difficulty: 'advanced',
    badge: 'code',
    estimatedDuration: '3-4 months',
    progressType: 'counter',
    targetValue: 3,
    progressDescription: 'coding projects completed'
  },
  {
    id: 'photography',
    name: 'Basic Photography',
    description: 'Learn to take good photos',
    ageRange: [10, 10],
    category: 'creative',
    difficulty: 'advanced',
    badge: 'camera',
    estimatedDuration: '2-3 months',
    progressType: 'counter',
    targetValue: 20,
    progressDescription: 'quality photos taken'
  },
  {
    id: 'music-instrument',
    name: 'Learning Musical Instrument',
    description: 'Learn to play an instrument',
    ageRange: [10, 10],
    category: 'creative',
    difficulty: 'advanced',
    badge: 'music',
    estimatedDuration: '6-12 months',
    progressType: 'counter',
    targetValue: 5,
    progressDescription: 'songs learned to play'
  },
  {
    id: 'leadership',
    name: 'Leadership Skills',
    description: 'Learn to lead group activities',
    ageRange: [10, 10],
    category: 'social',
    difficulty: 'advanced',
    badge: 'crown',
    estimatedDuration: '3-4 months',
    progressType: 'counter',
    targetValue: 3,
    progressDescription: 'group activities led'
  }
];

export const SKILL_CATEGORIES: { value: SkillCategory; label: string; color: string }[] = [
  { value: 'self-care', label: 'Self Care', color: 'bg-blue-500' },
  { value: 'motor-skills', label: 'Motor Skills', color: 'bg-green-500' },
  { value: 'academic', label: 'Academic', color: 'bg-purple-500' },
  { value: 'social', label: 'Social', color: 'bg-pink-500' },
  { value: 'life-skills', label: 'Life Skills', color: 'bg-orange-500' },
  { value: 'creative', label: 'Creative', color: 'bg-yellow-500' },
  { value: 'technology', label: 'Technology', color: 'bg-indigo-500' },
  { value: 'safety', label: 'Safety', color: 'bg-red-500' },
  { value: 'organization', label: 'Organization', color: 'bg-teal-500' },
  { value: 'communication', label: 'Communication', color: 'bg-gray-500' }
];

export const DIFFICULTY_COLORS = {
  beginner: 'bg-green-100 text-green-800',
  intermediate: 'bg-yellow-100 text-yellow-800',
  advanced: 'bg-red-100 text-red-800'
};

export function getSkillsForAge(age: number): Skill[] {
  return SKILLS.filter(skill => age >= skill.ageRange[0] && age <= skill.ageRange[1]);
}

export function getSkillsByCategory(category: SkillCategory): Skill[] {
  return SKILLS.filter(skill => skill.category === category);
}

export function getSkillById(id: string): Skill | undefined {
  return SKILLS.find(skill => skill.id === id);
} 
