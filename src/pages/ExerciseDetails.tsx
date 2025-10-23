import { useParams, Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockExercises, type Exercise } from "@/data/mockData";

export default function ExerciseDetails() {
  const { id } = useParams<{ id: string }>();
  const [customExercises, setCustomExercises] = useState<Exercise[]>([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("customExercises") || "[]");
    setCustomExercises(saved);
  }, []);

  const allExercises = useMemo(
    () => [...mockExercises, ...customExercises],
    [customExercises]
  );

  const exercise = allExercises.find(e => String(e.id) === String(id)); // safe match

  if (!exercise) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Exercise Not Found</h1>
        <Link to="/exercises" className="underline">Back to Exercise Library</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-3xl font-bold">{exercise.name}</h1>
        <Link to="/exercises" className="underline">Back to Exercise Library</Link>
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge variant="outline" className="capitalize">{exercise.category}</Badge>
        <Badge variant="secondary" className="capitalize">{exercise.difficulty}</Badge>
        {exercise.equipment?.map(eq => <Badge key={eq} variant="outline">{eq}</Badge>)}
        {exercise.sets && exercise.reps && (
          <Badge variant="outline">{exercise.sets} sets × {exercise.reps} reps</Badge>
        )}
        {exercise.duration && <Badge variant="outline">{exercise.duration} min</Badge>}
        {exercise.caloriesBurned && <Badge variant="outline">~{exercise.caloriesBurned} cal</Badge>}
      </div>

      <Card>
        <CardHeader><CardTitle>Description</CardTitle></CardHeader>
        <CardContent><p className="text-muted-foreground">{exercise.description}</p></CardContent>
      </Card>

      {!!exercise.targetMuscles?.length && (
        <Card>
          <CardHeader><CardTitle>Target muscles</CardTitle></CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {exercise.targetMuscles.map(m => <Badge key={m} variant="secondary">{m}</Badge>)}
          </CardContent>
        </Card>
      )}

      {!!exercise.instructions?.length && (
        <Card>
          <CardHeader><CardTitle>How to perform</CardTitle></CardHeader>
          <CardContent>
            <ol className="list-decimal ml-6 space-y-2">
              {exercise.instructions.map((s, i) => <li key={i}>{s}</li>)}
            </ol>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
