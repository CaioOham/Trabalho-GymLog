import { Dumbbell } from 'lucide-react';
import { useNavigate } from 'react-router';
import { StatusBar } from '../components/StatusBar';
import { NavBar } from '../components/NavBar';
import { useWorkouts } from '../context/WorkoutsContext';
import { useProfile } from '../context/ProfileContext';

export default function Progress() {
  const navigate = useNavigate();
  const { workouts } = useWorkouts();
  const { profile } = useProfile();

  const uniqueExercises = new Set(workouts.map((w) => w.exercise)).size;
  const totalWeight = workouts.reduce((sum, w) => sum + w.weight * w.sets * w.reps, 0);
  const formatWeight = (kg: number) => {
    if (kg >= 1000) return `${(kg / 1000).toFixed(1)}t`;
    return `${kg}kg`;
  };

  // Barra por exercício baseada nos dados reais
  const exerciseMap = new Map<string, number>();
  workouts.forEach((w) => {
    const prev = exerciseMap.get(w.exercise) || 0;
    exerciseMap.set(w.exercise, Math.max(prev, w.weight));
  });
  const exerciseList = Array.from(exerciseMap.entries()).slice(0, 4);
  const maxWeight = exerciseList.reduce((m, [, v]) => Math.max(m, v), 1);

  // Último treino
  const lastWorkout = workouts.length > 0 ? workouts[workouts.length - 1] : null;
  const formatDate = (d: string) => {
    if (!d) return '';
    const dt = new Date(d);
    return isNaN(dt.getTime()) ? d : dt.toLocaleDateString('pt-BR');
  };


  return (
    <div className="min-h-screen bg-[#0f0f1a] flex items-center justify-center p-4">
      <div className="w-[390px] h-[844px] bg-[#1E1E2E] rounded-[44px] border-[8px] border-[#2a2a3e] overflow-hidden flex flex-col shadow-2xl">
        <StatusBar />

        <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/profile')}
              className="text-[#6C63FF] text-sm min-h-[44px] px-1 flex items-center"
            >
              ← Voltar
            </button>
            <h2 className="text-white text-base font-semibold">Meu Progresso</h2>
            <span className="w-14" />
          </div>

          {/* Stats */}
          <div className="flex gap-2">
            <div className="flex-1 bg-[#2a2a42] rounded-xl p-3 text-center">
              <div className="text-[#6C63FF] text-xl font-semibold">{workouts.length}</div>
              <div className="text-[#888] text-[10px] mt-0.5">Treinos</div>
            </div>
            <div className="flex-1 bg-[#2a2a42] rounded-xl p-3 text-center">
              <div className="text-[#00D4AA] text-xl font-semibold">{uniqueExercises}</div>
              <div className="text-[#888] text-[10px] mt-0.5">Exercícios</div>
            </div>
            <div className="flex-1 bg-[#2a2a42] rounded-xl p-3 text-center">
              <div className="text-[#E24B4A] text-xl font-semibold">{formatWeight(totalWeight)}</div>
              <div className="text-[#888] text-[10px] mt-0.5">Carga total</div>
            </div>
          </div>

          {/* Perfil — peso e objetivo */}
          {profile && (
            <div className="flex gap-2">
              {profile.weight && (
                <div className="flex-1 bg-[#2a2a42] rounded-xl p-3 text-center">
                  <div className="text-[#6C63FF] text-lg font-semibold">{profile.weight}kg</div>
                  <div className="text-[#888] text-[10px] mt-0.5">Peso atual</div>
                </div>
              )}
              {profile.goal && (
                <div className="flex-1 bg-[#2a2a42] rounded-xl p-3 text-center">
                  <div className="text-[#6C63FF] text-xs font-semibold leading-tight">{profile.goal}</div>
                  <div className="text-[#888] text-[10px] mt-0.5">Objetivo</div>
                </div>
              )}
            </div>
          )}

          {/* CARGA POR EXERCÍCIO */}
          <div className="text-[#888] text-[11px] tracking-wide">CARGA POR EXERCÍCIO</div>

          {exerciseList.length > 0 ? (
            <div className="flex flex-col gap-3">
              {exerciseList.map(([name, weight], i) => {
                const pct = Math.round((weight / maxWeight) * 100);
                const color = i % 2 === 0 ? '#6C63FF' : '#00D4AA';
                return (
                  <div key={name} className="flex flex-col gap-1.5">
                    <div className="flex justify-between">
                      <span className="text-white text-xs">{name}</span>
                      <span className="text-[#00D4AA] text-xs font-medium">{weight}kg</span>
                    </div>
                    <div className="bg-[#1E1E2E] rounded-full h-1.5">
                      <div
                        className="h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%`, background: color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-[#555] text-xs text-center py-2">Nenhum exercício cadastrado ainda</div>
          )}

          {/* ÚLTIMO TREINO */}
          <div className="text-[#888] text-[11px] tracking-wide">ÚLTIMO TREINO</div>

          {lastWorkout ? (
            <div className="bg-[#2a2a42] rounded-xl px-4 min-h-[60px] flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#6C63FF22] flex items-center justify-center flex-shrink-0">
                <Dumbbell className="w-4 h-4 text-[#6C63FF]" />
              </div>
              <div className="flex-1">
                <div className="text-white text-sm font-medium">{lastWorkout.exercise}</div>
                <div className="text-[#888] text-[10px] mt-0.5">
                  {lastWorkout.sets}x{lastWorkout.reps} · {lastWorkout.weight}kg · {formatDate(lastWorkout.date)}
                </div>
              </div>
              <span className="text-[#00D4AA] text-xs font-medium">{lastWorkout.weight}kg</span>
            </div>
          ) : (
            <div className="bg-[#2a2a42] rounded-xl px-4 min-h-[60px] flex items-center justify-center">
              <span className="text-[#555] text-xs">Nenhum treino registrado ainda</span>
            </div>
          )}

          <div className="h-2" />
        </div>

        <NavBar />
      </div>
    </div>
  );
}
