import React, { useState, useEffect } from 'react';
import { PlayCircle, Clock, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

function Dashboard() {
  const [stats, setStats] = useState({ workouts: 0, totalMinutes: 0 });
  const [todayPlan, setTodayPlan] = useState(null);

  useEffect(() => {
    // We'll load data from localStorage here later
    const plans = JSON.parse(localStorage.getItem('flextrack_plans') || '[]');
    const history = JSON.parse(localStorage.getItem('flextrack_history') || '[]');
    
    if (plans.length > 0) {
      setTodayPlan(plans[0]); // Just pick the first plan for now
    }
    
    const totalMins = history.reduce((acc, curr) => acc + (curr.duration || 0), 0) / 60;
    setStats({
      workouts: history.length,
      totalMinutes: Math.round(totalMins)
    });
  }, []);

  return (
    <div className="dashboard">
      <div className="page-header">
        <div>
          <h1 className="page-title">Welcome back, Athlete!</h1>
          <p className="page-subtitle">Here is your summary for today.</p>
        </div>
        <Link to="/workout" className="btn btn-primary">
          <PlayCircle size={20} />
          Start Workout
        </Link>
      </div>

      <div className="grid-3">
        <div className="card glass">
          <div className="flex items-center gap-2 mb-4 text-muted">
            <Activity size={20} className="text-accent" />
            <span style={{color: 'var(--text-muted)'}}>Total Workouts</span>
          </div>
          <h2 style={{fontSize: '36px'}}>{stats.workouts}</h2>
        </div>
        
        <div className="card glass">
          <div className="flex items-center gap-2 mb-4 text-muted">
            <Clock size={20} className="text-accent" />
            <span style={{color: 'var(--text-muted)'}}>Time Spent</span>
          </div>
          <h2 style={{fontSize: '36px'}}>{stats.totalMinutes} <span style={{fontSize: '16px', color: 'var(--text-muted)'}}>min</span></h2>
        </div>
      </div>

      <h2 style={{marginTop: '40px', marginBottom: '20px'}}>Today's Plan</h2>
      {todayPlan ? (
        <div className="card">
          <h3>{todayPlan.name}</h3>
          <p style={{color: 'var(--text-muted)', marginBottom: '16px'}}>
            {todayPlan.exercises?.length || 0} exercises
          </p>
          <div className="grid-2">
            {todayPlan.exercises?.map((ex, idx) => (
              <div key={idx} className="workout-item">
                <span>{ex.name}</span>
                <span style={{color: 'var(--text-muted)'}}>{ex.sets} sets x {ex.reps} reps</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="card" style={{textAlign: 'center', padding: '48px'}}>
          <p style={{color: 'var(--text-muted)', marginBottom: '16px'}}>No routine planned for today.</p>
          <Link to="/planner" className="btn btn-secondary">Create a Plan</Link>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
