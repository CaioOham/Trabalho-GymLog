import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Loader2 } from 'lucide-react';
import { StatusBar } from '../components/StatusBar';
import { NavBar } from '../components/NavBar';
import { useWorkouts } from '../context/WorkoutsContext';

const inputClass =
  'bg-[#2a2a42] border border-[#3a3a5c] rounded-xl px-4 text-[#6C63FF] text-sm min-h-[44px] focus:outline-none focus:border-[#6C63FF] w-full';

export default function EditWorkout() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { getWorkout, updateWorkout, deleteWorkout, loading, initialLoaded } = useWorkouts();
  const [localError, setLocalError] = useState<string | null>(null);
  const [rowNumber, setRowNumber] = useState<number>(0);

  const [formData, setFormData] = useState({
    exercise: '',
    sets: '',
    reps: '',
    weight: '',
    date: '',
    notes: '',
  });

  useEffect(() => {
    if (id && initialLoaded) {
      const workout = getWorkout(id);
      if (workout) {
        setRowNumber(workout.rowNumber);
        setFormData({
          exercise: workout.exercise,
          sets:     workout.sets.toString(),
          reps:     workout.reps.toString(),
          weight:   workout.weight.toString(),
          date:     workout.date,
          notes:    workout.notes || '',
        });
      } else {
        navigate('/workouts');
      }
    }
  }, [id, initialLoaded, getWorkout, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!formData.exercise || !formData.sets || !formData.reps || !formData.weight || !formData.date) {
      setLocalError('Preencha todos os campos obrigatórios.');
      return;
    }

    try {
      await updateWorkout(rowNumber, {
        exercise: formData.exercise,
        sets:     parseInt(formData.sets),
        reps:     parseInt(formData.reps),
        weight:   parseFloat(formData.weight),
        date:     formData.date,
        notes:    formData.notes,
      });
      navigate('/workouts');
    } catch (e) {
      setLocalError(e instanceof Error ? e.message : 'Erro ao salvar alterações');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Tem certeza? Este registro será removido.')) return;
    try {
      await deleteWorkout(rowNumber);
      navigate('/workouts');
    } catch (e) {
      setLocalError(e instanceof Error ? e.message : 'Erro ao excluir treino');
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f1a] flex items-center justify-center p-4">
      <div className="w-[390px] h-[844px] bg-[#1E1E2E] rounded-[44px] border-[8px] border-[#2a2a3e] overflow-hidden flex flex-col shadow-2xl">
        <StatusBar />

        <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-4">
          {/* Header */}
          <div className="relative flex items-center justify-center py-2 min-h-[44px]">
            <button
              onClick={() => navigate(-1)}
              className="absolute left-0 text-[#6C63FF] text-sm flex items-center min-h-[44px]"
            >
              ← Voltar
            </button>
            <h2 className="text-white text-base font-semibold">Editar Treino</h2>
          </div>

          {/* Pill center alignment */}
          {rowNumber > 0 && (
            <div className="flex justify-center mt-[-8px] mb-1">
              <div className="bg-[#6C63FF1A] border border-[#6C63FF33] text-[#a09bff] text-xs px-5 py-1.5 rounded-full">
                Editando Registro #{rowNumber}
              </div>
            </div>
          )}

          {localError && (
            <div className="bg-[#E24B4A22] border border-[#E24B4A55] rounded-xl px-4 py-3 text-[#E24B4A] text-xs">
              {localError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[#888] text-xs">Exercícios</label>
              <input
                type="text"
                placeholder="Ex: Supino Reto"
                value={formData.exercise}
                onChange={(e) => setFormData({ ...formData, exercise: e.target.value })}
                className={inputClass}
              />
            </div>

            <div className="flex gap-3">
              <div className="flex-1 flex flex-col gap-1.5">
                <label className="text-[#888] text-xs">Séries</label>
                <input
                  type="number"
                  value={formData.sets}
                  onChange={(e) => setFormData({ ...formData, sets: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div className="flex-1 flex flex-col gap-1.5">
                <label className="text-[#888] text-xs">Repetições</label>
                <input
                  type="number"
                  value={formData.reps}
                  onChange={(e) => setFormData({ ...formData, reps: e.target.value })}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-1 flex flex-col gap-1.5">
                <label className="text-[#888] text-xs">Carga (kg)</label>
                <input
                  type="number"
                  step="0.5"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div className="flex-1 flex flex-col gap-1.5">
                <label className="text-[#888] text-xs">Data</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[#888] text-xs">Observação</label>
              <input
                type="text"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className={inputClass}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-[#6C63FF] text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 min-h-[44px] mt-2 disabled:opacity-60 w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                'Salvar Alterações'
              )}
            </button>

            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              className="border border-[#E24B4A] text-[#E24B4A] rounded-xl text-sm flex items-center justify-center min-h-[44px] disabled:opacity-60 w-full"
            >
              Excluir Registro
            </button>
          </form>
        </div>

        <NavBar />
      </div>
    </div>
  );
}
