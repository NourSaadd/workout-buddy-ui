import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { CalendarIcon, Check, Plus, X, Flame, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { mockExercises } from '@/data/mockData';

interface CustomExercise {
  id: string;
  name: string;
  duration: number;
  calories: number;
}

export default function LogWorkout() {
  const navigate = useNavigate();
  const [date, setDate] = useState<Date>(new Date());
  const [selectedExerciseIds, setSelectedExerciseIds] = useState<string[]>([]);
  const [customExercises, setCustomExercises] = useState<CustomExercise[]>([]);
  const [newCustomExercise, setNewCustomExercise] = useState({
    name: '',
    duration: '',
    calories: '',
  });
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const calculateTotals = () => {
    const selectedExercisesDuration = selectedExerciseIds.length * 15; // Assume 15 min per exercise
    const selectedExercisesCalories = selectedExerciseIds.length * 100; // Assume 100 cal per exercise
    
    const customDuration = customExercises.reduce((sum, ex) => sum + ex.duration, 0);
    const customCalories = customExercises.reduce((sum, ex) => sum + ex.calories, 0);
    
    return {
      totalDuration: selectedExercisesDuration + customDuration,
      totalCalories: selectedExercisesCalories + customCalories,
    };
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const totals = calculateTotals();

    if (selectedExerciseIds.length === 0 && customExercises.length === 0) {
      newErrors.exercises = 'Please select at least one exercise or add a custom exercise';
    }
    if (totals.totalDuration === 0) {
      newErrors.duration = 'Total duration must be greater than 0';
    }
    if (notes.length > 500) {
      newErrors.notes = 'Notes must be less than 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddCustomExercise = () => {
    if (!newCustomExercise.name.trim()) {
      toast.error('Please enter an exercise name');
      return;
    }
    if (!newCustomExercise.duration || parseInt(newCustomExercise.duration) <= 0) {
      toast.error('Duration must be greater than 0');
      return;
    }
    if (!newCustomExercise.calories || parseInt(newCustomExercise.calories) <= 0) {
      toast.error('Calories must be greater than 0');
      return;
    }

    const customExercise: CustomExercise = {
      id: `custom-${Date.now()}`,
      name: newCustomExercise.name,
      duration: parseInt(newCustomExercise.duration),
      calories: parseInt(newCustomExercise.calories),
    };

    setCustomExercises([...customExercises, customExercise]);
    setNewCustomExercise({ name: '', duration: '', calories: '' });
    toast.success('Custom exercise added!');
  };

  const handleRemoveCustomExercise = (id: string) => {
    setCustomExercises(customExercises.filter((ex) => ex.id !== id));
  };

  const toggleExerciseSelection = (exerciseId: string) => {
    setSelectedExerciseIds((prev) =>
      prev.includes(exerciseId)
        ? prev.filter((id) => id !== exerciseId)
        : [...prev, exerciseId]
    );
    if (errors.exercises) {
      setErrors((prev) => ({ ...prev, exercises: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    const totals = calculateTotals();
    
    toast.success(
      <div className="flex items-center gap-2">
        <Check className="h-4 w-4" />
        <span>Workout logged successfully!</span>
      </div>
    );

    // Reset form
    setSelectedExerciseIds([]);
    setCustomExercises([]);
    setNotes('');
    setDate(new Date());

    // Navigate to progress page after a short delay
    setTimeout(() => {
      navigate('/progress');
    }, 1500);
  };

  const totals = calculateTotals();

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-destructive bg-clip-text text-transparent">
            Log New Workout
          </h1>
          <p className="text-lg text-muted-foreground">
            Select exercises or create custom ones to track your workout
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Exercise Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Select Exercises</CardTitle>
                <CardDescription>
                  Choose from our exercise library
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="max-h-[400px] overflow-y-auto space-y-2 pr-2">
                  {mockExercises.map((exercise) => (
                    <div
                      key={exercise.id}
                      className={cn(
                        'flex items-start space-x-3 p-3 rounded-lg border transition-colors hover:bg-accent cursor-pointer',
                        selectedExerciseIds.includes(exercise.id) && 'bg-accent border-primary'
                      )}
                      onClick={() => toggleExerciseSelection(exercise.id)}
                    >
                      <Checkbox
                        checked={selectedExerciseIds.includes(exercise.id)}
                        onCheckedChange={() => toggleExerciseSelection(exercise.id)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="font-medium">{exercise.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {exercise.category} • {exercise.difficulty}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {errors.exercises && (
                  <p className="text-sm text-destructive mt-2">{errors.exercises}</p>
                )}
              </CardContent>
            </Card>

            {/* Add Custom Exercise */}
            <Card>
              <CardHeader>
                <CardTitle>Add Custom Exercise</CardTitle>
                <CardDescription>
                  Create your own exercise with name, duration, and calories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="custom-name">Exercise Name *</Label>
                    <Input
                      id="custom-name"
                      placeholder="e.g., Swimming, Boxing, Dance"
                      value={newCustomExercise.name}
                      onChange={(e) =>
                        setNewCustomExercise({ ...newCustomExercise, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="custom-duration">Duration (min) *</Label>
                      <Input
                        id="custom-duration"
                        type="number"
                        placeholder="30"
                        value={newCustomExercise.duration}
                        onChange={(e) =>
                          setNewCustomExercise({ ...newCustomExercise, duration: e.target.value })
                        }
                        min="1"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="custom-calories">Calories *</Label>
                      <Input
                        id="custom-calories"
                        type="number"
                        placeholder="200"
                        value={newCustomExercise.calories}
                        onChange={(e) =>
                          setNewCustomExercise({ ...newCustomExercise, calories: e.target.value })
                        }
                        min="1"
                      />
                    </div>
                  </div>
                  <Button onClick={handleAddCustomExercise} className="w-full" variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Custom Exercise
                  </Button>

                  {/* Custom Exercises List */}
                  {customExercises.length > 0 && (
                    <div className="space-y-2 mt-4">
                      <Label>Custom Exercises Added</Label>
                      {customExercises.map((exercise) => (
                        <div
                          key={exercise.id}
                          className="flex items-center justify-between p-3 rounded-lg border bg-accent"
                        >
                          <div>
                            <div className="font-medium">{exercise.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {exercise.duration} min • {exercise.calories} cal
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRemoveCustomExercise(exercise.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Date and Notes */}
            <Card>
              <CardHeader>
                <CardTitle>Additional Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !date && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, 'PPP') : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(date) => date && setDate(date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="How did you feel during the workout? Any achievements or challenges?"
                    value={notes}
                    onChange={(e) => {
                      setNotes(e.target.value);
                      if (errors.notes) {
                        setErrors((prev) => ({ ...prev, notes: '' }));
                      }
                    }}
                    className={errors.notes ? 'border-destructive' : ''}
                    rows={4}
                  />
                  <p className="text-xs text-muted-foreground">{notes.length}/500 characters</p>
                  {errors.notes && <p className="text-sm text-destructive">{errors.notes}</p>}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Summary Sidebar */}
          <div className="space-y-6">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Workout Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-primary/10">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-primary" />
                      <span className="font-medium">Total Duration</span>
                    </div>
                    <span className="text-2xl font-bold">{totals.totalDuration}</span>
                  </div>
                  <div className="text-xs text-muted-foreground text-center">minutes</div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-destructive/10">
                    <div className="flex items-center gap-2">
                      <Flame className="h-5 w-5 text-destructive" />
                      <span className="font-medium">Total Calories</span>
                    </div>
                    <span className="text-2xl font-bold">{totals.totalCalories}</span>
                  </div>
                  <div className="text-xs text-muted-foreground text-center">calories burned</div>
                </div>

                <div className="pt-4 border-t">
                  <div className="text-sm space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Library Exercises:</span>
                      <span className="font-medium">{selectedExerciseIds.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Custom Exercises:</span>
                      <span className="font-medium">{customExercises.length}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 space-y-2">
                  <Button onClick={handleSubmit} className="w-full" size="lg">
                    <Check className="mr-2 h-4 w-4" />
                    Log Workout
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/dashboard')}
                    className="w-full"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
