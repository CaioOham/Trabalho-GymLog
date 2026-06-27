import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Loader2 } from 'lucide-react';
import { StatusBar } from '../components/StatusBar';
import { NavBar } from '../components/NavBar';
import { useWorkouts } from '../context/WorkoutsContext';

const inputClass =
  'bg-[#2a2a42] border border-[#3a3a5c] rounded-xl px-4 text-white text-sm placeholder:text-[#555] min-h-[44px] focus:outline-none focus:border-[#6C63FF] w-full';

export default function NewWorkout() {
  const navigate = useNavigate();
  const { addWorkout, loading } = useWorkouts();
  const [localError, setLocalError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    exercise: '',
    sets: '',
    reps: '',
    weight: '',
    date: '',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!formData.exercise || !formData.sets || !formData.reps || !formData.weight || !formData.date) {
      setLocalError('Preencha todos os campos obrigatórios.');
      return;
    }

    try {
      await addWorkout({
        exercise: formData.exercise,
        sets:     parseInt(formData.sets),
        reps:     parseInt(formData.reps),
        weight:   parseFloat(formData.weight),
        date:     formData.date,
        notes:    formData.notes,
      });
      navigate('/workouts');
    } catch (e) {
      setLocalError(e instanceof Error ? e.message : 'Erro ao salvar treino');
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f1a] flex items-center justify-center p-4">
      <div className="w-[390px] h-[844px] bg-[#1E1E2E] rounded-[44px] border-[8px] border-[#2a2a3e] overflow-hidden flex flex-col shadow-2xl">
        <StatusBar />

        <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="text-[#6C63FF] text-sm min-h-[44px] px-1 flex items-center"
            >
              ← Voltar
            </button>
            <h2 className="text-white text-base font-semibold">Novo Treino</h2>
            <span className="w-14" />
          </div>

          {localError && (
            <div className="bg-[#E24B4A22] border border-[#E24B4A55] rounded-xl px-4 py-3 text-[#E24B4A] text-xs">
              {localError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[#888] text-xs">Exercício *</label>
              <input
                type="text"
                value={formData.exercise}
                onChange={(e) => setFormData({ ...formData, exercise: e.target.value })}
                placeholder="Ex: Supino Reto"
                className={inputClass}
              />
            </div>

            <div className="flex gap-3">
              <div className="flex-1 flex flex-col gap-1.5">
                <label className="text-[#888] text-xs">Séries *</label>
                <input
                  type="number"
                  value={formData.sets}
                  onChange={(e) => setFormData({ ...formData, sets: e.target.value })}
                  placeholder="4"
                  className={inputClass}
                />
              </div>
              <div className="flex-1 flex flex-col gap-1.5">
                <label className="text-[#888] text-xs">Repetições *</label>
                <input
                  type="number"
                  value={formData.reps}
                  onChange={(e) => setFormData({ ...formData, reps: e.target.value })}
                  placeholder="12"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-1 flex flex-col gap-1.5">
                <label className="text-[#888] text-xs">Carga (kg) *</label>
                <input
                  type="number"
                  step="0.5"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  placeholder="80"
                  className={inputClass}
                />
              </div>
              <div className="flex-1 flex flex-col gap-1.5">
                <label className="text-[#888] text-xs">Data *</label>
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
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Aumentar carga na próxima sessão..."
                className="bg-[#2a2a42] border border-[#3a3a5c] rounded-xl px-4 py-3 text-white text-sm placeholder:text-[#555] h-24 resize-none focus:outline-none focus:border-[#6C63FF] w-full"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-[#6C63FF] text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 min-h-[44px] mt-2 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                'Salvar Treino'
              )}
            </button>
          </form>
        </div>

        <NavBar />
      </div>
    </div>
  );
}
