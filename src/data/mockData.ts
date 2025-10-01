export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  joinDate: string;
  goals: string;
  profileImage?: string;
}

export interface Exercise {
  id: string;
  name: string;
  category: 'strength' | 'cardio' | 'flexibility' | 'sports';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  description: string;
  targetMuscles: string[];
  equipment: string[];
  instructions: string[];
}

export interface Workout {
  id: string;
  name: string;
  category: 'strength' | 'cardio' | 'flexibility' | 'sports';
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  exercises: string[];
  description: string;
  caloriesBurned: number;
  imageUrl?: string;
}

export interface ProgressLog {
  id: string;
  userId: string;
  workoutId: string;
  date: string;
  duration: number;
  caloriesBurned: number;
  notes: string;
  completed: boolean;
}

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    joinDate: '2024-01-15',
    goals: 'Build muscle and increase strength',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    joinDate: '2024-02-20',
    goals: 'Improve cardiovascular fitness',
  },
];

export const mockExercises: Exercise[] = [
  {
    id: 'ex1',
    name: 'Bench Press',
    category: 'strength',
    difficulty: 'intermediate',
    description: 'A compound upper body exercise that primarily targets the chest muscles.',
    targetMuscles: ['Chest', 'Triceps', 'Shoulders'],
    equipment: ['Barbell', 'Bench'],
    instructions: [
      'Lie flat on the bench with feet firmly on the ground',
      'Grip the bar slightly wider than shoulder width',
      'Lower the bar to your chest in a controlled manner',
      'Press the bar back up to starting position',
      'Repeat for desired reps',
    ],
  },
  {
    id: 'ex2',
    name: 'Squats',
    category: 'strength',
    difficulty: 'intermediate',
    description: 'A fundamental compound exercise that targets the lower body.',
    targetMuscles: ['Quadriceps', 'Glutes', 'Hamstrings', 'Core'],
    equipment: ['Barbell', 'Squat Rack'],
    instructions: [
      'Position the bar on your upper back',
      'Stand with feet shoulder-width apart',
      'Lower your body by bending your knees and hips',
      'Go down until thighs are parallel to the ground',
      'Drive through your heels to return to starting position',
    ],
  },
  {
    id: 'ex3',
    name: 'Running',
    category: 'cardio',
    difficulty: 'beginner',
    description: 'Classic cardiovascular exercise that improves endurance and burns calories.',
    targetMuscles: ['Legs', 'Core', 'Cardiovascular System'],
    equipment: ['Running Shoes'],
    instructions: [
      'Start with a 5-minute warm-up walk',
      'Begin running at a comfortable pace',
      'Maintain proper form with upright posture',
      'Breathe rhythmically',
      'Cool down with a 5-minute walk',
    ],
  },
  {
    id: 'ex4',
    name: 'Deadlifts',
    category: 'strength',
    difficulty: 'advanced',
    description: 'A powerful full-body compound exercise focusing on the posterior chain.',
    targetMuscles: ['Back', 'Glutes', 'Hamstrings', 'Core', 'Forearms'],
    equipment: ['Barbell', 'Weight Plates'],
    instructions: [
      'Stand with feet hip-width apart, bar over mid-foot',
      'Bend at the hips and knees to grip the bar',
      'Keep your back straight and chest up',
      'Drive through your heels to lift the bar',
      'Stand up fully, then lower the bar in a controlled manner',
    ],
  },
  {
    id: 'ex5',
    name: 'Push-ups',
    category: 'strength',
    difficulty: 'beginner',
    description: 'A classic bodyweight exercise for upper body strength.',
    targetMuscles: ['Chest', 'Triceps', 'Shoulders', 'Core'],
    equipment: ['None'],
    instructions: [
      'Start in a plank position with hands shoulder-width apart',
      'Lower your body until chest nearly touches the ground',
      'Keep your body in a straight line',
      'Push back up to starting position',
      'Repeat for desired reps',
    ],
  },
  {
    id: 'ex6',
    name: 'Yoga Sun Salutation',
    category: 'flexibility',
    difficulty: 'beginner',
    description: 'A flowing sequence of poses that warms up the body and improves flexibility.',
    targetMuscles: ['Full Body', 'Core', 'Flexibility'],
    equipment: ['Yoga Mat'],
    instructions: [
      'Start in mountain pose',
      'Raise arms overhead',
      'Forward fold to touch toes',
      'Step back to plank position',
      'Lower to cobra pose',
      'Push up to downward dog',
      'Step forward and return to standing',
    ],
  },
  {
    id: 'ex7',
    name: 'Burpees',
    category: 'cardio',
    difficulty: 'intermediate',
    description: 'High-intensity full-body exercise that combines strength and cardio.',
    targetMuscles: ['Full Body', 'Cardiovascular System'],
    equipment: ['None'],
    instructions: [
      'Start standing',
      'Drop into a squat position with hands on the ground',
      'Kick feet back into plank position',
      'Perform a push-up',
      'Jump feet back to squat position',
      'Jump up with arms overhead',
    ],
  },
  {
    id: 'ex8',
    name: 'Plank',
    category: 'strength',
    difficulty: 'beginner',
    description: 'An isometric core exercise that builds endurance and stability.',
    targetMuscles: ['Core', 'Shoulders', 'Back'],
    equipment: ['None'],
    instructions: [
      'Start in a forearm plank position',
      'Keep body in a straight line from head to heels',
      'Engage your core',
      'Hold the position',
      'Breathe steadily',
    ],
  },
];

export const mockWorkouts: Workout[] = [
  {
    id: 'w1',
    name: 'Upper Body Blast',
    category: 'strength',
    duration: 45,
    difficulty: 'intermediate',
    exercises: ['ex1', 'ex5'],
    description: 'Intense upper body workout focusing on chest, shoulders, and arms.',
    caloriesBurned: 350,
  },
  {
    id: 'w2',
    name: 'Leg Day Power',
    category: 'strength',
    duration: 60,
    difficulty: 'intermediate',
    exercises: ['ex2', 'ex4'],
    description: 'Build powerful legs with squats and deadlifts.',
    caloriesBurned: 450,
  },
  {
    id: 'w3',
    name: 'Cardio Burn',
    category: 'cardio',
    duration: 30,
    difficulty: 'beginner',
    exercises: ['ex3', 'ex7'],
    description: 'Get your heart pumping with this cardio-focused workout.',
    caloriesBurned: 400,
  },
  {
    id: 'w4',
    name: 'Flexibility Flow',
    category: 'flexibility',
    duration: 45,
    difficulty: 'beginner',
    exercises: ['ex6'],
    description: 'Improve flexibility and reduce stress with yoga.',
    caloriesBurned: 200,
  },
  {
    id: 'w5',
    name: 'Full Body Strength',
    category: 'strength',
    duration: 60,
    difficulty: 'advanced',
    exercises: ['ex2', 'ex4', 'ex1'],
    description: 'Complete full body strength training for maximum gains.',
    caloriesBurned: 500,
  },
  {
    id: 'w6',
    name: 'HIIT Cardio',
    category: 'cardio',
    duration: 25,
    difficulty: 'intermediate',
    exercises: ['ex7'],
    description: 'High-intensity interval training to maximize calorie burn.',
    caloriesBurned: 450,
  },
  {
    id: 'w7',
    name: 'Core Crusher',
    category: 'strength',
    duration: 30,
    difficulty: 'beginner',
    exercises: ['ex8', 'ex5'],
    description: 'Strengthen your core with targeted exercises.',
    caloriesBurned: 250,
  },
  {
    id: 'w8',
    name: 'Endurance Run',
    category: 'cardio',
    duration: 45,
    difficulty: 'intermediate',
    exercises: ['ex3'],
    description: 'Build cardiovascular endurance with steady-state running.',
    caloriesBurned: 500,
  },
];

export const mockProgressLogs: ProgressLog[] = [
  {
    id: 'p1',
    userId: '1',
    workoutId: 'w1',
    date: '2024-09-28',
    duration: 45,
    caloriesBurned: 350,
    notes: 'Great workout! Felt strong today.',
    completed: true,
  },
  {
    id: 'p2',
    userId: '1',
    workoutId: 'w2',
    date: '2024-09-26',
    duration: 60,
    caloriesBurned: 450,
    notes: 'Legs are sore but it was worth it!',
    completed: true,
  },
  {
    id: 'p3',
    userId: '1',
    workoutId: 'w3',
    date: '2024-09-25',
    duration: 30,
    caloriesBurned: 400,
    notes: 'Quick and effective cardio session.',
    completed: true,
  },
  {
    id: 'p4',
    userId: '1',
    workoutId: 'w5',
    date: '2024-09-23',
    duration: 60,
    caloriesBurned: 500,
    notes: 'Challenging full body workout!',
    completed: true,
  },
  {
    id: 'p5',
    userId: '1',
    workoutId: 'w7',
    date: '2024-09-22',
    duration: 30,
    caloriesBurned: 250,
    notes: 'Core feels stronger every day.',
    completed: true,
  },
];
