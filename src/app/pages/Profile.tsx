import { User, BarChart2, Bell, ChevronRight, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router';
import { StatusBar } from '../components/StatusBar';
import { NavBar } from '../components/NavBar';
import { useWorkouts } from '../context/WorkoutsContext';
import { useProfile } from '../context/ProfileContext';

export default function Profile() {
  const { workouts } = useWorkouts();
  const { profile } = useProfile();
  const navigate = useNavigate();

  const uniqueExercises = new Set(workouts.map((w) => w.exercise)).size;
  const totalWeight = workouts.reduce((sum, w) => sum + w.weight * w.sets * w.reps, 0);

  const formatWeight = (kg: number) => {
    if (kg >= 1000) return `${(kg / 1000).toFixed(1)}t`;
    return `${kg}kg`;
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 0 || !parts[0]) return '??';
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const displayName = profile?.name || 'Carregando...';
  const displayMemberSince = profile?.memberSince ? `Membro desde ${profile.memberSince}` : 'Carregando...';
  const initials = profile ? getInitials(profile.name) : 'JS';

  return (
    <div className="min-h-screen bg-[#0f0f1a] flex items-center justify-center p-4">
      <div className="w-[390px] h-[844px] bg-[#1E1E2E] rounded-[44px] border-[8px] border-[#2a2a3e] overflow-hidden flex flex-col shadow-2xl">
        <StatusBar />

        <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-4">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-2 pt-2 pb-1">
            <div className="w-[72px] h-[72px] rounded-full bg-[#6C63FF22] border-2 border-[#6C63FF] flex items-center justify-center text-[#6C63FF] text-2xl font-medium">
              {initials}
            </div>
            <div className="text-white text-lg font-medium">{displayName}</div>
            <div className="text-[#888] text-xs">{displayMemberSince}</div>
          </div>

          {/* Stats */}
          <div className="flex gap-3">
            <div className="flex-1 bg-[#2a2a42] rounded-xl p-3 text-center">
              <div className="text-[#00D4AA] text-xl font-semibold">{workouts.length}</div>
              <div className="text-[#888] text-[10px] mt-0.5">Treinos</div>
            </div>
            <div className="flex-1 bg-[#2a2a42] rounded-xl p-3 text-center">
              <div className="text-[#00D4AA] text-xl font-semibold">{uniqueExercises}</div>
              <div className="text-[#888] text-[10px] mt-0.5">Exercícios</div>
            </div>
            <div className="flex-1 bg-[#2a2a42] rounded-xl p-3 text-center">
              <div className="text-[#00D4AA] text-xl font-semibold">{formatWeight(totalWeight)}</div>
              <div className="text-[#888] text-[10px] mt-0.5">Carga total</div>
            </div>
          </div>

          {/* Conta */}
          <div>
            <div className="text-[#888] text-[11px] tracking-wide mb-2">CONTA</div>
            <div className="flex flex-col gap-2">
              <button onClick={() => navigate('/profile/edit')} className="bg-[#2a2a42] rounded-xl px-4 min-h-[56px] flex items-center gap-3 w-full">
                <div className="w-8 h-8 rounded-lg bg-[#6C63FF22] flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-[#6C63FF]" />
                </div>
                <div className="flex-1 text-left">
                  <div className="text-white text-sm">Editar perfil</div>
                  <div className="text-[#888] text-[10px] mt-0.5">Nome e informações pessoais</div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#555]" />
              </button>

              <button onClick={() => navigate('/profile/progress')} className="bg-[#2a2a42] rounded-xl px-4 min-h-[56px] flex items-center gap-3 w-full">
                <div className="w-8 h-8 rounded-lg bg-[#00D4AA22] flex items-center justify-center flex-shrink-0">
                  <BarChart2 className="w-4 h-4 text-[#00D4AA]" />
                </div>
                <div className="flex-1 text-left">
                  <div className="text-white text-sm">Meu progresso</div>
                  <div className="text-[#888] text-[10px] mt-0.5">Histórico e evolução</div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#555]" />
              </button>
            </div>
          </div>

          {/* Preferências */}
          <div>
            <div className="text-[#888] text-[11px] tracking-wide mb-2">PREFERÊNCIAS</div>
            <div className="flex flex-col gap-2">
              <div className="bg-[#2a2a42] rounded-xl px-4 min-h-[56px] flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#6C63FF22] flex items-center justify-center flex-shrink-0">
                  <Bell className="w-4 h-4 text-[#6C63FF]" />
                </div>
                <div className="flex-1 text-left">
                  <div className="text-white text-sm">Notificações</div>
                  <div className="text-[#888] text-[10px] mt-0.5">Lembretes de treino</div>
                </div>
                <span className="bg-[#6C63FF22] text-[#a09bff] text-[10px] px-2.5 py-1 rounded-full">Ativo</span>
              </div>

            </div>
          </div>

          {/* Logout */}
          <button className="border border-[#E24B4A] text-[#E24B4A] rounded-xl text-sm flex items-center justify-center gap-2 min-h-[44px] mt-2">
            <LogOut className="w-4 h-4" />
            Sair da conta
          </button>

          <div className="h-2" />
        </div>

        <NavBar />
      </div>
    </div>
  );
}
