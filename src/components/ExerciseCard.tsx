import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import type { Exercise } from '@/data/mockData';

interface ExerciseCardProps {
  exercise: Exercise;
  onClick?: () => void;
}

export const ExerciseCard = ({ exercise, onClick }: ExerciseCardProps) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'strength':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'cardio':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'flexibility':
        return 'bg-accent/10 text-accent border-accent/20';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return '';
    }
  };

  return (
    <Card 
      className="overflow-hidden hover:shadow-lg transition-all duration-300 border-2 cursor-pointer"
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg">{exercise.name}</CardTitle>
          <Badge className={getCategoryColor(exercise.category)} variant="outline">
            {exercise.category}
          </Badge>
        </div>
        <CardDescription className="line-clamp-2">{exercise.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-3">
          {exercise.targetMuscles.slice(0, 3).map((muscle) => (
            <Badge key={muscle} variant="secondary" className="text-xs">
              {muscle}
            </Badge>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2 mb-2">
          {exercise.sets && exercise.reps && (
            <span className="text-xs text-muted-foreground">
              {exercise.sets}×{exercise.reps}
            </span>
          )}
          {exercise.duration && (
            <span className="text-xs text-muted-foreground">
              {exercise.duration} min
            </span>
          )}
          {exercise.caloriesBurned && (
            <span className="text-xs text-muted-foreground">
              ~{exercise.caloriesBurned} cal
            </span>
          )}
        </div>
        <div className="flex items-center justify-between">
          <Badge className={getDifficultyColor(exercise.difficulty)} variant="secondary">
            {exercise.difficulty}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {exercise.equipment.length > 0 ? exercise.equipment[0] : 'No equipment'}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
