import { Dumbbell, Loader2 } from 'lucide-react';
import { Link } from 'react-router';
import { StatusBar } from '../components/StatusBar';
import { NavBar } from '../components/NavBar';
import { useWorkouts } from '../context/WorkoutsContext';

export default function Home() {
  const { workouts, loading, error } = useWorkouts();

  const uniqueExercises = new Set(workouts.map((w) => w.exercise)).size;

  return (
    <div className="min-h-screen bg-[#0f0f1a] flex items-center justify-center p-4">
      <div className="w-[390px] h-[844px] bg-[#1E1E2E] rounded-[44px] border-[8px] border-[#2a2a3e] overflow-hidden flex flex-col shadow-2xl">
        <StatusBar />

        <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-4">
          <div className="h-4" />

          <div className="w-16 h-16 bg-[#6C63FF22] rounded-full flex items-center justify-center mx-auto">
            <Dumbbell className="w-7 h-7 text-[#6C63FF]" />
          </div>

          <div className="text-center">
            <h1 className="text-[#6C63FF] text-xl font-semibold">GymLog</h1>
            <p className="text-[#888] text-sm mt-1">Seu diário de treinos</p>
          </div>

          <div className="h-2" />

          {error && (
            <div className="bg-[#E24B4A22] border border-[#E24B4A55] rounded-xl px-4 py-3 text-[#E24B4A] text-xs text-center">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <div className="flex-1 bg-[#2a2a42] rounded-xl p-4 text-center">
              {loading ? (
                <Loader2 className="w-5 h-5 text-[#00D4AA] animate-spin mx-auto" />
              ) : (
                <div className="text-[#00D4AA] text-2xl font-semibold">{workouts.length}</div>
              )}
              <div className="text-[#888] text-xs mt-1">Treinos</div>
            </div>
            <div className="flex-1 bg-[#2a2a42] rounded-xl p-4 text-center">
              {loading ? (
                <Loader2 className="w-5 h-5 text-[#00D4AA] animate-spin mx-auto" />
              ) : (
                <div className="text-[#00D4AA] text-2xl font-semibold">{uniqueExercises}</div>
              )}
              <div className="text-[#888] text-xs mt-1">Exercícios</div>
            </div>
          </div>

          <div className="flex flex-col gap-3 mt-2">
            <Link
              to="/workouts/new"
              className="bg-[#6C63FF] text-white rounded-xl text-center text-sm font-medium flex items-center justify-center min-h-[44px]"
            >
              + Novo Treino
            </Link>

            <Link
              to="/workouts"
              className="bg-transparent border border-[#6C63FF] text-[#6C63FF] rounded-xl text-center text-sm font-medium flex items-center justify-center min-h-[44px]"
            >
              Ver Meus Treinos
            </Link>
          </div>
        </div>

        <NavBar />
      </div>
    </div>
  );
}
