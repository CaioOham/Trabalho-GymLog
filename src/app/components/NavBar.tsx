import { Home, List, User } from 'lucide-react';
import { useLocation, Link } from 'react-router';

export function NavBar() {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="bg-[#16162a] border-t border-[#2a2a3e] px-4 py-3 flex justify-around items-center">
      <Link to="/" className="flex items-center justify-center w-10 h-10">
        <Home className={`w-6 h-6 ${isActive('/') ? 'text-[#6C63FF]' : 'text-[#555]'}`} />
      </Link>
      <Link to="/workouts" className="flex items-center justify-center w-10 h-10">
        <List className={`w-6 h-6 ${isActive('/workouts') ? 'text-[#6C63FF]' : 'text-[#555]'}`} />
      </Link>
      <Link to="/profile" className="flex items-center justify-center w-10 h-10">
        <User className={`w-6 h-6 ${isActive('/profile') ? 'text-[#6C63FF]' : 'text-[#555]'}`} />
      </Link>
    </div>
  );
}
