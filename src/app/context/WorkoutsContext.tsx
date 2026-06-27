import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface Workout {
  id: string;
  rowNumber: number;
  exercise: string;
  sets: number;
  reps: number;
  weight: number;
  date: string;
  notes?: string;
}

const URLS = {
  CREATE: 'http://localhost:3001/api/workouts/create',
  READ:   'http://localhost:3001/api/workouts/read',
  UPDATE: 'http://localhost:3001/api/workouts/update',
  DELETE: 'http://localhost:3001/api/workouts/delete',
};

async function postJson<T = unknown>(url: string, body?: object): Promise<T> {
  const res = await fetch(url, {
    method: 'POST',
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`Erro ${res.status}`);
  const text = await res.text();
  if (!text.trim()) return undefined as unknown as T;
  try { return JSON.parse(text) as T; } catch { return text as unknown as T; }
}

function fromRow(row: Record<string, unknown>, index: number): Workout {
  const rowNumber = Number(row['RowNumber'] ?? row['rownumber'] ?? index + 1);
  return {
    id:       String(rowNumber),
    rowNumber,
    exercise: String(row['Exercicio']  ?? row['exercicio']  ?? ''),
    sets:     Number(row['Series']     ?? row['series']     ?? 0),
    reps:     Number(row['Repeticoes'] ?? row['repeticoes'] ?? 0),
    weight:   Number(row['Carga']      ?? row['carga']      ?? 0),
    date:     String(row['Data']       ?? row['data']       ?? ''),
    notes:    String(row['Observacao'] ?? row['observacao'] ?? ''),
  };
}

interface WorkoutsContextType {
  workouts: Workout[];
  loading: boolean;
  error: string | null;
  initialLoaded: boolean;
  fetchWorkouts: () => Promise<void>;
  addWorkout: (workout: Omit<Workout, 'id' | 'rowNumber'>) => Promise<void>;
  updateWorkout: (rowNumber: number, workout: Omit<Workout, 'id' | 'rowNumber'>) => Promise<void>;
  deleteWorkout: (rowNumber: number) => Promise<void>;
  getWorkout: (id: string) => Workout | undefined;
}

const WorkoutsContext = createContext<WorkoutsContextType | undefined>(undefined);

export function WorkoutsProvider({ children }: { children: React.ReactNode }) {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [initialLoaded, setInitialLoaded] = useState(false);

  const fetchWorkouts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(URLS.READ, { method: 'POST' });
      // Make retorna 500 quando a planilha está vazia — tratar como lista vazia
      if (res.status === 500) {
        setWorkouts([]);
        setInitialLoaded(true);
        return;
      }
      if (!res.ok) throw new Error(`Erro ${res.status} ao carregar dados`);
      const text = await res.text();
      console.log('[GymLog READ] raw response:', text);
      if (!text.trim()) { setWorkouts([]); setInitialLoaded(true); return; }
      let data: unknown;
      try { data = JSON.parse(text); } catch { setWorkouts([]); setInitialLoaded(true); return; }
      console.log('[GymLog READ] parsed:', data);

      let rows: Workout[] = [];
      if (Array.isArray(data)) {
        rows = data.map((row, i) => fromRow(row as Record<string, unknown>, i));
      } else if (data && typeof data === 'object') {
        // Pode vir como objeto único (1 linha) ou { data: [...] }
        const obj = data as Record<string, unknown>;
        if (Array.isArray(obj['data'])) {
          rows = (obj['data'] as Record<string, unknown>[]).map((row, i) => fromRow(row, i));
        } else {
          // objeto único — trata como array de 1
          rows = [fromRow(obj, 0)];
        }
      }
      setWorkouts(rows);
      setInitialLoaded(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao carregar treinos');
      setInitialLoaded(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchWorkouts(); }, [fetchWorkouts]);

  const addWorkout = async (workout: Omit<Workout, 'id' | 'rowNumber'>) => {
    setLoading(true);
    setError(null);
    try {
      await postJson(URLS.CREATE, {
        Exercicio:  workout.exercise,
        Series:     workout.sets,
        Repeticoes: workout.reps,
        Carga:      workout.weight,
        Data:       workout.date,
        Observacao: workout.notes ?? '',
      });
      // Recarrega do banco para pegar RowNumbers reais
      await fetchWorkouts();
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Erro ao criar treino';
      setError(msg);
      setLoading(false);
      throw new Error(msg);
    }
  };

  const updateWorkout = async (rowNumber: number, workout: Omit<Workout, 'id' | 'rowNumber'>) => {
    setLoading(true);
    setError(null);
    try {
      await postJson(URLS.UPDATE, {
        RowNumber:  rowNumber,
        Exercicio:  workout.exercise,
        Series:     workout.sets,
        Repeticoes: workout.reps,
        Carga:      workout.weight,
        Data:       workout.date,
        Observacao: workout.notes ?? '',
      });
      await fetchWorkouts();
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Erro ao atualizar treino';
      setError(msg);
      setLoading(false);
      throw new Error(msg);
    }
  };

  const deleteWorkout = async (rowNumber: number) => {
    setLoading(true);
    setError(null);
    try {
      await postJson(URLS.DELETE, { RowNumber: rowNumber });
      await fetchWorkouts();
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Erro ao excluir treino';
      setError(msg);
      setLoading(false);
      throw new Error(msg);
    }
  };

  const getWorkout = (id: string) => workouts.find((w) => w.id === id);

  return (
    <WorkoutsContext.Provider
      value={{ workouts, loading, error, initialLoaded, fetchWorkouts, addWorkout, updateWorkout, deleteWorkout, getWorkout }}
    >
      {children}
    </WorkoutsContext.Provider>
  );
}

export function useWorkouts() {
  const ctx = useContext(WorkoutsContext);
  if (!ctx) throw new Error('useWorkouts must be used within WorkoutsProvider');
  return ctx;
}
