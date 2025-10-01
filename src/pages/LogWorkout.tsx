import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Check } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { mockWorkouts } from '@/data/mockData';

export default function LogWorkout() {
  const navigate = useNavigate();
  const [date, setDate] = useState<Date>(new Date());
  const [formData, setFormData] = useState({
    workoutId: '',
    duration: '',
    caloriesBurned: '',
    notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.workoutId) {
      newErrors.workoutId = 'Please select a workout';
    }
    if (!formData.duration || parseInt(formData.duration) <= 0) {
      newErrors.duration = 'Duration must be greater than 0';
    }
    if (!formData.caloriesBurned || parseInt(formData.caloriesBurned) <= 0) {
      newErrors.caloriesBurned = 'Calories must be greater than 0';
    }
    if (formData.notes.length > 500) {
      newErrors.notes = 'Notes must be less than 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    // Simulate saving the workout log
    const selectedWorkout = mockWorkouts.find((w) => w.id === formData.workoutId);
    
    toast.success(
      <div className="flex items-center gap-2">
        <Check className="h-4 w-4" />
        <span>Workout logged successfully!</span>
      </div>
    );

    // Reset form
    setFormData({
      workoutId: '',
      duration: '',
      caloriesBurned: '',
      notes: '',
    });
    setDate(new Date());

    // Navigate to progress page after a short delay
    setTimeout(() => {
      navigate('/progress');
    }, 1500);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-destructive bg-clip-text text-transparent">
            Log New Workout
          </h1>
          <p className="text-lg text-muted-foreground">
            Record your workout session and track your progress
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Workout Details</CardTitle>
            <CardDescription>
              Fill in the details of your completed workout session
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Workout Selection */}
              <div className="space-y-2">
                <Label htmlFor="workout">Workout *</Label>
                <Select
                  value={formData.workoutId}
                  onValueChange={(value) => handleInputChange('workoutId', value)}
                >
                  <SelectTrigger className={errors.workoutId ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Select a workout" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockWorkouts.map((workout) => (
                      <SelectItem key={workout.id} value={workout.id}>
                        {workout.name} ({workout.duration} min)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.workoutId && (
                  <p className="text-sm text-destructive">{errors.workoutId}</p>
                )}
              </div>

              {/* Date Selection */}
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
                    <Calendar mode="single" selected={date} onSelect={(date) => date && setDate(date)} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes) *</Label>
                <Input
                  id="duration"
                  type="number"
                  placeholder="e.g., 45"
                  value={formData.duration}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                  className={errors.duration ? 'border-destructive' : ''}
                  min="1"
                />
                {errors.duration && (
                  <p className="text-sm text-destructive">{errors.duration}</p>
                )}
              </div>

              {/* Calories Burned */}
              <div className="space-y-2">
                <Label htmlFor="calories">Calories Burned *</Label>
                <Input
                  id="calories"
                  type="number"
                  placeholder="e.g., 350"
                  value={formData.caloriesBurned}
                  onChange={(e) => handleInputChange('caloriesBurned', e.target.value)}
                  className={errors.caloriesBurned ? 'border-destructive' : ''}
                  min="1"
                />
                {errors.caloriesBurned && (
                  <p className="text-sm text-destructive">{errors.caloriesBurned}</p>
                )}
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="How did you feel during the workout? Any achievements or challenges?"
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  className={errors.notes ? 'border-destructive' : ''}
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">
                  {formData.notes.length}/500 characters
                </p>
                {errors.notes && <p className="text-sm text-destructive">{errors.notes}</p>}
              </div>

              {/* Submit Button */}
              <div className="flex gap-4">
                <Button type="submit" className="flex-1">
                  Log Workout
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/dashboard')}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
