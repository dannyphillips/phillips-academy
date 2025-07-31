import React, { useState, useMemo } from 'react';
import { Search, Filter, Trophy, Target, CheckCircle, Circle, TrendingUp } from 'lucide-react';
import { Child } from '../types/types';
import { Skill, SkillCategory, SKILL_CATEGORIES, getSkillsForAge, DIFFICULTY_COLORS } from '../data/skills';
import { ChildSkill, SkillProgress } from '../types/types';
import { getIcon } from '../utils/iconUtils';
import { SortSelect } from './SortSelect';
import { sortSkills, SkillSortOption, SortDirection } from '../utils/sortUtils';
import { SkillProgressModal } from './SkillProgressModal';
import { calculateProgressPercentage, getProgressDisplayText } from '../utils/skillUtils';

interface SkillsViewProps {
  selectedChild: Child | null;
  childSkills: ChildSkill[];
  onSkillToggle: (skillId: string, isCompleted: boolean) => Promise<void>;
  onSkillAdd: (skillId: string) => void;
  onUpdateSkillProgress: (skillId: string, newValue: number, notes?: string) => Promise<void>;
}

export const SkillsView: React.FC<SkillsViewProps> = ({
  selectedChild,
  childSkills,
  onSkillToggle,
  onSkillAdd,
  onUpdateSkillProgress
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<SkillCategory | 'all'>('all');
  const [showCompleted, setShowCompleted] = useState(true);
  const [selectedSkillForProgress, setSelectedSkillForProgress] = useState<{ childSkill: ChildSkill; skill: Skill } | null>(null);

  // Sort state
  const [sortField, setSortField] = useState<SkillSortOption>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const sortOptions = [
    { value: 'name', label: 'Name' },
    { value: 'completion', label: 'Completion' },
    { value: 'category', label: 'Category' },
  ];

  const handleSortChange = (field: string, direction: SortDirection) => {
    setSortField(field as SkillSortOption);
    setSortDirection(direction);
  };

  // Memoize expensive calculations
  const {
    availableSkills,
    skillProgressMap,
    currentSkills,
    completedSkills,
    availableSkillsToAdd,
    filteredCompletedSkills
  } = useMemo(() => {
    const availableSkills = selectedChild ? getSkillsForAge(selectedChild.age) : [];
    
    const skillProgressMap = new Map<string, ChildSkill>();
    childSkills.forEach(cs => skillProgressMap.set(cs.skillId, cs));

    const currentSkills = availableSkills
      .filter(skill => {
        const progress = skillProgressMap.get(skill.id);
        return progress && !progress.isCompleted;
      })
      .slice(0, 3);

    const completedSkills = availableSkills
      .filter(skill => {
        const progress = skillProgressMap.get(skill.id);
        return progress && progress.isCompleted;
      });

    const availableSkillsToAdd = sortSkills(
      availableSkills
        .filter(skill => !skillProgressMap.has(skill.id))
        .filter(skill => {
          if (searchTerm && !skill.name.toLowerCase().includes(searchTerm.toLowerCase())) {
            return false;
          }
          if (selectedCategory !== 'all' && skill.category !== selectedCategory) {
            return false;
          }
          return true;
        }),
      sortField,
      sortDirection
    );

    const filteredCompletedSkills = sortSkills(
      completedSkills
        .filter(skill => {
          if (searchTerm && !skill.name.toLowerCase().includes(searchTerm.toLowerCase())) {
            return false;
          }
          if (selectedCategory !== 'all' && skill.category !== selectedCategory) {
            return false;
          }
          return true;
        }),
      sortField,
      sortDirection
    );

    return {
      availableSkills,
      skillProgressMap,
      currentSkills,
      completedSkills,
      availableSkillsToAdd,
      filteredCompletedSkills
    };
  }, [selectedChild, childSkills, searchTerm, selectedCategory, sortField, sortDirection]);

  const getCategoryColor = (category: SkillCategory) => {
    const cat = SKILL_CATEGORIES.find(c => c.value === category);
    return cat?.color || 'bg-gray-500';
  };

  const getDifficultyColor = (difficulty: string) => {
    return DIFFICULTY_COLORS[difficulty as keyof typeof DIFFICULTY_COLORS] || 'bg-gray-100 text-gray-800';
  };

  const handleProgressClick = (childSkill: ChildSkill, skill: Skill) => {
    setSelectedSkillForProgress({ childSkill, skill });
  };

  const handleCloseProgressModal = () => {
    setSelectedSkillForProgress(null);
  };

  const renderProgressDisplay = (childSkill: ChildSkill, skill: Skill) => {
    if (skill.progressType === 'counter') {
      const progressPercentage = calculateProgressPercentage(childSkill, skill);
      const progressText = getProgressDisplayText(childSkill, skill);
      
      return (
        <div className="mt-2">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-gray-600">{progressText}</span>
            <span className="text-gray-500">{Math.round(progressPercentage)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      );
    }
    
    return null;
  };

  if (!selectedChild) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Please select a child to view their skills</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Skills Section */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Currently Working On</h2>
        </div>
        
        {currentSkills.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            No skills currently in progress. Add some skills to get started!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {currentSkills.map(skill => {
              const progress = skillProgressMap.get(skill.id)!;
              return (
                <div key={skill.id} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`p-2 rounded-full ${getCategoryColor(skill.category)} text-white`}>
                        {getIcon(skill.badge, 16)}
                      </div>
                      <span className="text-sm font-medium text-gray-900">{skill.name}</span>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleProgressClick(progress, skill)}
                        className="text-blue-600 hover:text-blue-700 p-1"
                        title="Update Progress"
                      >
                        <TrendingUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onSkillToggle(skill.id, true)}
                        className="text-green-600 hover:text-green-700 p-1"
                        title="Mark Complete"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{skill.description}</p>
                  {renderProgressDisplay(progress, skill)}
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(skill.difficulty)}`}>
                      {skill.difficulty}
                    </span>
                    <span className="text-xs text-gray-500">{skill.estimatedDuration}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as SkillCategory | 'all')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {SKILL_CATEGORIES.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
            
            <button
              onClick={() => setShowCompleted(!showCompleted)}
              className={`px-3 py-2 rounded-lg border transition-colors ${
                showCompleted 
                  ? 'bg-blue-100 border-blue-300 text-blue-700' 
                  : 'bg-gray-100 border-gray-300 text-gray-700'
              }`}
            >
              <Trophy className="w-4 h-4" />
            </button>

            <SortSelect
              options={sortOptions}
              value={sortField}
              direction={sortDirection}
              onSortChange={handleSortChange}
              placeholder="Sort skills by..."
            />
          </div>
        </div>
      </div>

      {/* Available Skills to Add */}
      {availableSkillsToAdd.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Skills</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableSkillsToAdd.map(skill => (
              <div key={skill.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-full ${getCategoryColor(skill.category)} text-white`}>
                      {getIcon(skill.badge, 16)}
                    </div>
                    <span className="font-medium text-gray-900">{skill.name}</span>
                  </div>
                  <button
                    onClick={() => onSkillAdd(skill.id)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <Circle className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-sm text-gray-600 mb-2">{skill.description}</p>
                {skill.progressType === 'counter' && (
                  <p className="text-xs text-gray-500 mb-2">
                    Target: {skill.targetValue} {skill.progressDescription}
                  </p>
                )}
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(skill.difficulty)}`}>
                    {skill.difficulty}
                  </span>
                  <span className="text-xs text-gray-500">{skill.estimatedDuration}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completed Skills */}
      {showCompleted && filteredCompletedSkills.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-5 h-5 text-yellow-600" />
            <h3 className="text-lg font-semibold text-gray-900">Completed Skills</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCompletedSkills.map(skill => {
              const progress = skillProgressMap.get(skill.id)!;
              return (
                <div key={skill.id} className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-full ${getCategoryColor(skill.category)} text-white`}>
                        {getIcon(skill.badge, 16)}
                      </div>
                      <span className="font-medium text-gray-900">{skill.name}</span>
                    </div>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{skill.description}</p>
                  {renderProgressDisplay(progress, skill)}
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(skill.difficulty)}`}>
                      {skill.difficulty}
                    </span>
                    {progress.completedAt && (
                      <span className="text-xs text-gray-500">
                        Completed {new Date(progress.completedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Progress Modal */}
      {selectedSkillForProgress && (
        <SkillProgressModal
          isOpen={!!selectedSkillForProgress}
          onClose={handleCloseProgressModal}
          childSkill={selectedSkillForProgress.childSkill}
          skill={selectedSkillForProgress.skill}
          onUpdateProgress={onUpdateSkillProgress}
          onToggleCompletion={onSkillToggle}
        />
      )}
    </div>
  );
}; 
