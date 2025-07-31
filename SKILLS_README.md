# Skills Feature

## Overview

The Skills feature allows parents to track their children's learning progress on specific skills that are goal-oriented achievements. Unlike daily tasks, skills have concrete endpoints and measurable goals. Each skill represents a specific accomplishment that can be completed once and remains completed forever.

## Features

### Mode Toggle
- Toggle between "Tasks" and "Skills" modes at the top of the app
- Tasks mode shows the existing daily task functionality
- Skills mode shows the new skills tracking interface

### Skills Interface

#### Current Skills Section
- Shows the top 3 skills currently being worked on
- Each skill displays:
  - Badge icon with category color
  - Skill name and description
  - Difficulty level (beginner/intermediate/advanced)
  - Estimated duration
  - Complete button to mark as finished

#### Available Skills Section
- Shows all skills available for the child's age
- Filterable by:
  - Search term
  - Category (Self Care, Motor Skills, Academic, etc.)
- Each skill can be added to the child's current skills

#### Completed Skills Section
- Shows all skills the child has completed
- Displays completion date
- Can be filtered and searched like available skills

### Skill Categories

1. **Self Care** - Personal hygiene, dressing, etc.
2. **Motor Skills** - Physical coordination, tying shoes, etc.
3. **Academic** - Reading, writing, math, etc.
4. **Social** - Sharing, taking turns, apologizing, etc.
5. **Life Skills** - Cooking, laundry, money management, etc.
6. **Creative** - Art, music, drawing, etc.
7. **Technology** - Computer use, email, coding, etc.
8. **Safety** - Stranger danger, crossing streets, etc.
9. **Organization** - Cleaning, packing, homework routines, etc.
10. **Communication** - Public speaking, phone calls, etc.

### Goal-Oriented Skills

The system includes 50+ skills organized by age groups, each with specific measurable goals:

- **Ages 4-5**: Basic self-care, motor skills, safety awareness
  - Examples: "Use toilet independently for 7 days", "Wash hands properly for 10 days"
- **Ages 6-7**: Life skills, organization, academic foundations
  - Examples: "Read 50 sight words", "Save allowance for 30 days"
- **Ages 8-9**: Practical life skills, technology, advanced motor skills
  - Examples: "Cook 5 simple meals", "Ride bike for 30 minutes"
- **Age 10**: Advanced life skills, leadership, specialized abilities
  - Examples: "Cook 10 full meals", "Lead 5 group activities"

### Badge System

Each skill has an associated badge icon that:
- Starts grayed out when not started
- Shows in color when in progress
- Remains colored when completed
- Uses Lucide React icons for consistency

## Database Structure

### ChildSkill Collection
```typescript
interface ChildSkill {
  childId: string;
  skillId: string;
  isCompleted: boolean;
  completedAt?: Date;
  startedAt: Date;
  notes?: string;
}
```

## Usage

1. **Switch to Skills Mode**: Click the "Skills" button in the mode toggle
2. **Select a Child**: Choose which child to view skills for
3. **Add Skills**: Click the circle icon next to available skills to add them
4. **Track Progress**: Skills automatically appear in "Currently Working On" when added
5. **Complete Skills**: Click the checkmark to mark a skill as completed
6. **Filter and Search**: Use the search bar and category filter to find specific skills

## Technical Implementation

- Skills data is stored in `src/data/skills.ts`
- UI components are in `src/components/SkillsView.tsx`
- Database functions are in `src/services/database.ts`
- Mode toggle is in `src/components/ModeToggle.tsx`
- Icon utilities are in `src/utils/iconUtils.ts`

The skills feature integrates seamlessly with the existing task system while providing a distinct interface for tracking one-time learning objectives. 
