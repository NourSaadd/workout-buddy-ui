import { useState } from 'react';
import { Search, Filter, X, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ExerciseCard } from '@/components/ExerciseCard';
import { mockExercises, type Exercise } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

export default function ExerciseLibrary() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [customExercises, setCustomExercises] = useState<Exercise[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  // Form state for creating custom exercise
  const [newExerciseName, setNewExerciseName] = useState('');
  const [newExerciseDescription, setNewExerciseDescription] = useState('');
  const [newExerciseCategory, setNewExerciseCategory] = useState('strength');
  const [newExerciseDifficulty, setNewExerciseDifficulty] = useState('beginner');

  const allExercises = [...mockExercises, ...customExercises];

  const filteredExercises = allExercises.filter((exercise) => {
    const matchesSearch =
      exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exercise.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exercise.targetMuscles.some((muscle) =>
        muscle.toLowerCase().includes(searchQuery.toLowerCase())
      );
    const matchesCategory = categoryFilter === 'all' || exercise.category === categoryFilter;
    const matchesDifficulty =
      difficultyFilter === 'all' || exercise.difficulty === difficultyFilter;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const handleCreateExercise = () => {
    if (!newExerciseName.trim()) {
      toast({
        title: "Error",
        description: "Exercise name is required",
        variant: "destructive",
      });
      return;
    }

    const newExercise: Exercise = {
      id: `custom-${Date.now()}`,
      name: newExerciseName,
      description: newExerciseDescription || 'Custom exercise',
      category: newExerciseCategory as 'strength' | 'cardio' | 'flexibility' | 'sports',
      difficulty: newExerciseDifficulty as 'beginner' | 'intermediate' | 'advanced',
      targetMuscles: ['Custom'],
      equipment: [],
      instructions: ['Perform exercise as needed'],
    };

    setCustomExercises([...customExercises, newExercise]);
    setIsCreateDialogOpen(false);
    setNewExerciseName('');
    setNewExerciseDescription('');
    setNewExerciseCategory('strength');
    setNewExerciseDifficulty('beginner');

    toast({
      title: "Success",
      description: "Custom exercise created successfully!",
    });
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-destructive bg-clip-text text-transparent">
            Exercise Library
          </h1>
          <p className="text-lg text-muted-foreground">
            Explore our comprehensive collection of exercises with detailed instructions
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-8 space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search exercises by name, muscle group, or equipment..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Custom Exercise
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center gap-2 flex-1">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="strength">Strength</SelectItem>
                  <SelectItem value="cardio">Cardio</SelectItem>
                  <SelectItem value="flexibility">Flexibility</SelectItem>
                  <SelectItem value="sports">Sports</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1">
              <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Difficulties</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            Showing {filteredExercises.length} of {allExercises.length} exercises
            {customExercises.length > 0 && (
              <span className="ml-2 text-primary">
                ({customExercises.length} custom)
              </span>
            )}
          </p>
        </div>

        {/* Exercise Grid */}
        {filteredExercises.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExercises.map((exercise) => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                onClick={() => setSelectedExercise(exercise)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">
              No exercises found matching your criteria. Try adjusting your filters.
            </p>
          </div>
        )}
      </div>

      {/* Exercise Detail Dialog */}
      <Dialog open={!!selectedExercise} onOpenChange={() => setSelectedExercise(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedExercise && (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <DialogTitle className="text-2xl mb-2">{selectedExercise.name}</DialogTitle>
                    <DialogDescription className="text-base">
                      {selectedExercise.description}
                    </DialogDescription>
                  </div>
                  <button
                    onClick={() => setSelectedExercise(null)}
                    className="rounded-full p-1 hover:bg-muted"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                {/* Exercise Info */}
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="capitalize">
                    {selectedExercise.category}
                  </Badge>
                  <Badge variant="secondary" className="capitalize">
                    {selectedExercise.difficulty}
                  </Badge>
                </div>

                {/* Target Muscles */}
                <div>
                  <h3 className="font-semibold mb-2 text-lg">Target Muscles</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedExercise.targetMuscles.map((muscle) => (
                      <Badge key={muscle} variant="secondary">
                        {muscle}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Equipment */}
                <div>
                  <h3 className="font-semibold mb-2 text-lg">Equipment Needed</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedExercise.equipment.length > 0 ? (
                      selectedExercise.equipment.map((item) => (
                        <Badge key={item} variant="outline">
                          {item}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-muted-foreground">No equipment needed</p>
                    )}
                  </div>
                </div>

                {/* Instructions */}
                <div>
                  <h3 className="font-semibold mb-3 text-lg">How to Perform</h3>
                  <ol className="space-y-3">
                    {selectedExercise.instructions.map((instruction, index) => (
                      <li key={index} className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                          {index + 1}
                        </span>
                        <span className="text-muted-foreground pt-0.5">{instruction}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Exercise Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Custom Exercise</DialogTitle>
            <DialogDescription>
              Add a new exercise to your library
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="exercise-name">Exercise Name *</Label>
              <Input
                id="exercise-name"
                placeholder="e.g., Custom Squat Variation"
                value={newExerciseName}
                onChange={(e) => setNewExerciseName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="exercise-description">Description</Label>
              <Textarea
                id="exercise-description"
                placeholder="Describe the exercise..."
                value={newExerciseDescription}
                onChange={(e) => setNewExerciseDescription(e.target.value)}
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="exercise-category">Category</Label>
              <Select value={newExerciseCategory} onValueChange={setNewExerciseCategory}>
                <SelectTrigger id="exercise-category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="strength">Strength</SelectItem>
                  <SelectItem value="cardio">Cardio</SelectItem>
                  <SelectItem value="flexibility">Flexibility</SelectItem>
                  <SelectItem value="sports">Sports</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="exercise-difficulty">Difficulty</Label>
              <Select value={newExerciseDifficulty} onValueChange={setNewExerciseDifficulty}>
                <SelectTrigger id="exercise-difficulty">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateExercise}>
                Create Exercise
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
