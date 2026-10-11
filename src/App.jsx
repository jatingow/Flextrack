import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home, Dumbbell, PlayCircle, Clock } from 'lucide-react';
import './App.css';

// Placeholder components - we'll create real ones next
import Dashboard from './pages/Dashboard';
import WorkoutPlanner from './pages/WorkoutPlanner';
import ActiveWorkout from './pages/ActiveWorkout';
import History from './pages/History';

function Sidebar() {
  const location = useLocation();
  
  return (
    <div className="sidebar">
      <div className="brand">
        <Dumbbell className="brand-icon" size={32} />
        <span className="brand-text text-gradient">FlexTrack</span>
      </div>
      
      <div className="nav-links">
        <Link to="/" className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
          <Home size={20} />
          <span>Dashboard</span>
        </Link>
        <Link to="/planner" className={`nav-item ${location.pathname === '/planner' ? 'active' : ''}`}>
          <Dumbbell size={20} />
          <span>Plan Workout</span>
        </Link>
        <Link to="/workout" className={`nav-item ${location.pathname === '/workout' ? 'active' : ''}`}>
          <PlayCircle size={20} />
          <span>Start Workout</span>
        </Link>
        <Link to="/history" className={`nav-item ${location.pathname === '/history' ? 'active' : ''}`}>
          <Clock size={20} />
          <span>History</span>
        </Link>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/planner" element={<WorkoutPlanner />} />
            <Route path="/workout" element={<ActiveWorkout />} />
            <Route path="/history" element={<History />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
