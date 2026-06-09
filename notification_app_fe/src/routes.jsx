import { Routes, Route } from 'react-router-dom';
import NotificationsPage from './pages/NotificationsPage';
import PriorityPage from './pages/PriorityPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<NotificationsPage />} />
      <Route path="/priority" element={<PriorityPage />} />
    </Routes>
  );
};

export default AppRoutes;
