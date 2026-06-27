import { createBrowserRouter, Outlet } from 'react-router';
import { WorkoutsProvider } from './context/WorkoutsContext';
import { ProfileProvider } from './context/ProfileContext';
import Home from './pages/Home';
import WorkoutsList from './pages/WorkoutsList';
import NewWorkout from './pages/NewWorkout';
import EditWorkout from './pages/EditWorkout';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import Progress from './pages/Progress';

function AppLayout() {
  return (
    <WorkoutsProvider>
      <ProfileProvider>
        <Outlet />
      </ProfileProvider>
    </WorkoutsProvider>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    Component: AppLayout,
    children: [
      {
        path: '',
        Component: Home,
      },
      {
        path: 'workouts',
        Component: WorkoutsList,
      },
      {
        path: 'workouts/new',
        Component: NewWorkout,
      },
      {
        path: 'workouts/edit/:id',
        Component: EditWorkout,
      },
      {
        path: 'profile',
        Component: Profile,
      },
      {
        path: 'profile/edit',
        Component: EditProfile,
      },
      {
        path: 'profile/progress',
        Component: Progress,
      },
    ],
  },
]);
