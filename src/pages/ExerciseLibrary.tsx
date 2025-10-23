import { useState, useEffect } from 'react';
import { Search, Filter, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Link } from "react-router-dom";
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
  const [newExerciseEquipment, setNewExerciseEquipment] = useState('');
  const [newExerciseTargetMuscles, setNewExerciseTargetMuscles] = useState('');
  const [newExerciseSets, setNewExerciseSets] = useState('');
  const [newExerciseReps, setNewExerciseReps] = useState('');
  const [newExerciseDuration, setNewExerciseDuration] = useState('');

  // 🔹 Load saved custom exercises on first mount
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("customExercises") || "[]");
    setCustomExercises(saved);
  }, []);

  // Merge default + custom exercises
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
      targetMuscles: newExerciseTargetMuscles
        ? newExerciseTargetMuscles.split(',').map(m => m.trim()).filter(Boolean)
        : ['Custom'],
      equipment: newExerciseEquipment
        ? newExerciseEquipment.split(',').map(e => e.trim()).filter(Boolean)
        : [],
      instructions: ['Perform exercise as needed'],
      sets: newExerciseSets ? parseInt(newExerciseSets) : undefined,
      reps: newExerciseReps ? parseInt(newExerciseReps) : undefined,
      duration: newExerciseDuration ? parseInt(newExerciseDuration) : undefined,
      caloriesBurned: newExerciseDuration
        ? parseInt(newExerciseDuration) * 10
        : (newExerciseSets && newExerciseReps)
          ? parseInt(newExerciseSets) * 20
          : 50,
    };

    const updated = [...customExercises, newExercise];
    setCustomExercises(updated);
    localStorage.setItem("customExercises", JSON.stringify(updated)); // 🔹 persist

    // reset form
    setIsCreateDialogOpen(false);
    setNewExerciseName('');
    setNewExerciseDescription('');
    setNewExerciseCategory('strength');
    setNewExerciseDifficulty('beginner');
    setNewExerciseEquipment('');
    setNewExerciseTargetMuscles('');
    setNewExerciseSets('');
    setNewExerciseReps('');
    setNewExerciseDuration('');

    toast({
      title: "Success",
      description: "Custom exercise created successfully!",
    });
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-destructive bg-clip-text text-transparent">
            Exercise Library
          </h1>
          <p className="text-lg text-muted-foreground">
            Explore our comprehensive collection of exercises with detailed instructions
          </p>
        </div>

        {/* Search & Filters */}
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
                <DialogTitle className="text-2xl mb-2">{selectedExercise.name}</DialogTitle>
                <DialogDescription className="text-base">
                  {selectedExercise.description}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                {/* Info badges */}
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="capitalize">
                    {selectedExercise.category}
                  </Badge>
                  <Badge variant="secondary" className="capitalize">
                    {selectedExercise.difficulty}
                  </Badge>
                  {selectedExercise.sets && selectedExercise.reps && (
                    <Badge variant="outline">
                      {selectedExercise.sets} sets × {selectedExercise.reps} reps
                    </Badge>
                  )}
                  {selectedExercise.duration && (
                    <Badge variant="outline">
                      {selectedExercise.duration} min
                    </Badge>
                  )}
                  {selectedExercise.caloriesBurned && (
                    <Badge variant="outline">
                      ~{selectedExercise.caloriesBurned} cal
                    </Badge>
                  )}
                </div>

                {/* Target muscles */}
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

                {/* 🔹 View full page link */}
                <div className="flex justify-end pt-4">
                  <Link to={`/exercise/${selectedExercise.id}`}>
                    <Button variant="secondary">View full page</Button>
                  </Link>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

    {/* Create Exercise Dialog */}
    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
      <DialogContent className="sm:max-w-3xl max-h-[85vh] p-0">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle>Create Custom Exercise</DialogTitle>
          <DialogDescription>Add a new exercise to your library.</DialogDescription>
        </DialogHeader>
    
        {/* Scrollable form body */}
        <div className="px-6 pb-6 overflow-y-auto">
          {/* 2-column responsive layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left column */}
            <div className="space-y-4">
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
                  rows={5}
                />
              </div>
    
              {/* Category & Difficulty side-by-side */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="exercise-category">Category</Label>
                  <Select
                    value={newExerciseCategory}
                    onValueChange={setNewExerciseCategory}
                  >
                    <SelectTrigger id="exercise-category">
                      <SelectValue placeholder="Category" />
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
                  <Select
                    value={newExerciseDifficulty}
                    onValueChange={setNewExerciseDifficulty}
                  >
                    <SelectTrigger id="exercise-difficulty">
                      <SelectValue placeholder="Difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
    
            {/* Right column */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="exercise-equipment">Equipment (comma-separated)</Label>
                <Input
                  id="exercise-equipment"
                  placeholder="e.g., Dumbbells, Bench"
                  value={newExerciseEquipment}
                  onChange={(e) => setNewExerciseEquipment(e.target.value)}
                />
              </div>
    
              <div>
                <Label htmlFor="exercise-target-muscles">Target Muscles (comma-separated)</Label>
                <Input
                  id="exercise-target-muscles"
                  placeholder="e.g., Chest, Triceps, Shoulders"
                  value={newExerciseTargetMuscles}
                  onChange={(e) => setNewExerciseTargetMuscles(e.target.value)}
                />
              </div>
    
              {/* Sets / Reps / Duration in one horizontal row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="exercise-sets">Sets</Label>
                  <Input
                    id="exercise-sets"
                    type="number"
                    placeholder="e.g., 3"
                    value={newExerciseSets}
                    onChange={(e) => setNewExerciseSets(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="exercise-reps">Reps</Label>
                  <Input
                    id="exercise-reps"
                    type="number"
                    placeholder="e.g., 12"
                    value={newExerciseReps}
                    onChange={(e) => setNewExerciseReps(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="exercise-duration">Duration (min)</Label>
                  <Input
                    id="exercise-duration"
                    type="number"
                    placeholder="e.g., 20"
                    value={newExerciseDuration}
                    onChange={(e) => setNewExerciseDuration(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
    
          {/* Footer */}
          <div className="flex justify-end gap-2 pt-6">
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateExercise}>Create Exercise</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
    </div>
  );
}
