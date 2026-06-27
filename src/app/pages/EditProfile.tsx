import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Camera } from 'lucide-react';
import { StatusBar } from '../components/StatusBar';
import { NavBar } from '../components/NavBar';
import { useProfile } from '../context/ProfileContext';

const inputClass =
  'bg-[#2a2a42] border border-[#3a3a5c] rounded-[10px] px-4 text-white text-sm min-h-[44px] focus:outline-none focus:border-[#6C63FF] w-full';

export default function EditProfile() {
  const navigate = useNavigate();
  const { profile, updateProfile, loading } = useProfile();
  const [localError, setLocalError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: '',
    email: '',
    age: '',
    weight: '',
    height: '',
    goal: '',
    password: '',
  });

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name,
        email: profile.email,
        age: profile.age !== null ? profile.age.toString() : '',
        weight: profile.weight !== null ? profile.weight.toString() : '',
        height: profile.height !== null ? profile.height.toString() : '',
        goal: profile.goal,
        password: '',
      });
    }
  }, [profile]);

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    setLocalError(null);
    if (!form.name || !form.email) {
      setLocalError('Nome e E-mail são obrigatórios.');
      return;
    }

    try {
      await updateProfile({
        name: form.name,
        email: form.email,
        age: form.age ? parseInt(form.age) : null,
        weight: form.weight ? parseFloat(form.weight) : null,
        height: form.height ? parseInt(form.height) : null,
        goal: form.goal,
      });
      navigate('/profile');
    } catch (e) {
      setLocalError(e instanceof Error ? e.message : 'Erro ao salvar alterações');
    }
  };

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

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
            <h2 className="text-white text-base font-semibold">Editar Perfil</h2>
            <span className="w-14" />
          </div>

          {/* Avatar */}
          <div className="flex flex-col items-center gap-2 py-1">
            <div className="w-[72px] h-[72px] rounded-full bg-[#6C63FF33] border-2 border-[#6C63FF] flex items-center justify-center text-[#6C63FF] text-2xl font-medium">
              JS
            </div>
            <button className="text-[#6C63FF] text-xs flex items-center gap-1">
              <Camera className="w-3.5 h-3.5" />
              Alterar foto
            </button>
          </div>

          {/* Informações pessoais */}
          <div className="text-[#888] text-[11px] tracking-wide">INFORMAÇÕES PESSOAIS</div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[#888] text-[11px]">Nome completo</label>
              <input type="text" value={form.name} onChange={set('name')} className={inputClass} />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[#888] text-[11px]">E-mail</label>
              <input type="email" value={form.email} onChange={set('email')} className={inputClass} />
            </div>

            <div className="flex gap-3">
              <div className="flex-1 flex flex-col gap-1">
                <label className="text-[#888] text-[11px]">Idade</label>
                <input type="number" value={form.age} onChange={set('age')} className={inputClass} />
              </div>
              <div className="flex-1 flex flex-col gap-1">
                <label className="text-[#888] text-[11px]">Peso (kg)</label>
                <input type="number" value={form.weight} onChange={set('weight')} className={inputClass} />
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-1 flex flex-col gap-1">
                <label className="text-[#888] text-[11px]">Altura (cm)</label>
                <input type="number" value={form.height} onChange={set('height')} className={inputClass} />
              </div>
              <div className="flex-1 flex flex-col gap-1">
                <label className="text-[#888] text-[11px]">Objetivo</label>
                <input type="text" value={form.goal} onChange={set('goal')} className={inputClass} />
              </div>
            </div>
          </div>

          {/* Divider + Segurança */}
          <div className="border-t border-[#2a2a3e]" />
          <div className="text-[#888] text-[11px] tracking-wide">SEGURANÇA</div>

          <div className="flex flex-col gap-1">
            <label className="text-[#888] text-[11px]">Nova senha</label>
            <input
              type="password"
              value={form.password}
              onChange={set('password')}
              placeholder="••••••••"
              className={`${inputClass} placeholder:text-[#555]`}
            />
          </div>

          {localError && (
            <div className="bg-[#E24B4A22] border border-[#E24B4A55] rounded-[10px] px-4 py-2.5 text-[#E24B4A] text-xs">
              {localError}
            </div>
          )}

          {/* Actions */}
          <button 
            onClick={handleSave}
            disabled={loading}
            className="bg-[#6C63FF] text-white rounded-[10px] text-sm font-semibold flex items-center justify-center min-h-[44px] mt-1 disabled:opacity-60 w-full"
          >
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </button>

          <button className="border border-[#E24B4A] text-[#E24B4A] rounded-[10px] text-sm flex items-center justify-center min-h-[44px] opacity-50 cursor-not-allowed w-full">
            Excluir conta
          </button>

          <div className="h-2" />
        </div>

        <NavBar />
      </div>
    </div>
  );
}
