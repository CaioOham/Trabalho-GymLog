import { Edit, Trash2, Loader2, RefreshCw } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { StatusBar } from '../components/StatusBar';
import { NavBar } from '../components/NavBar';
import { useWorkouts } from '../context/WorkoutsContext';

export default function WorkoutsList() {
  const { workouts, loading, error, deleteWorkout, fetchWorkouts } = useWorkouts();
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return isNaN(date.getTime())
      ? dateString
      : date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const handleDelete = async (rowNumber: number, exercise: string) => {
    if (!confirm(`Tem certeza? O treino "${exercise}" será removido.`)) return;
    try {
      await deleteWorkout(rowNumber);
    } catch {
      // error already set in context
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f1a] flex items-center justify-center p-4">
      <div className="w-[390px] h-[844px] bg-[#1E1E2E] rounded-[44px] border-[8px] border-[#2a2a3e] overflow-hidden flex flex-col shadow-2xl">
        <StatusBar />

        <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-white text-lg font-semibold">Meus Treinos</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={fetchWorkouts}
                disabled={loading}
                className="text-[#6C63FF] flex items-center justify-center w-8 h-8"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <Link
                to="/workouts/new"
                className="bg-[#6C63FF] text-white text-xs px-4 rounded-full flex items-center min-h-[32px]"
              >
                + Novo
              </Link>
            </div>
          </div>

          {error && (
            <div className="bg-[#E24B4A22] border border-[#E24B4A55] rounded-xl px-4 py-3 text-[#E24B4A] text-xs">
              {error}
            </div>
          )}

          {loading && workouts.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 text-[#888]">
              <Loader2 className="w-8 h-8 text-[#6C63FF] animate-spin" />
              <span className="text-sm">Carregando treinos...</span>
            </div>
          ) : workouts.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-[#888] text-sm">
              Nenhum treino cadastrado
            </div>
          ) : (
            workouts.map((workout) => (
              <div
                key={workout.id}
                className="bg-[#2a2a42] rounded-xl p-4 flex flex-col gap-2"
              >
                <div className="text-white text-sm font-medium">{workout.exercise}</div>
                <div className="text-[#888] text-xs">
                  {workout.sets}x{workout.reps} · {workout.weight}kg · {formatDate(workout.date)}
                </div>
                {workout.notes && (
                  <div className="text-[#555] text-xs italic">{workout.notes}</div>
                )}
                <div className="flex gap-2 mt-1">
                  <button
                    onClick={() => navigate(`/workouts/edit/${workout.id}`)}
                    disabled={loading}
                    className="flex-1 text-center text-xs min-h-[44px] rounded-lg bg-[#6C63FF22] text-[#a09bff] flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(workout.rowNumber, workout.exercise)}
                    disabled={loading}
                    className="flex-1 text-center text-xs min-h-[44px] rounded-lg bg-[#E24B4A22] text-[#E24B4A] flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                    Excluir
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <NavBar />
      </div>
    </div>
  );
}
