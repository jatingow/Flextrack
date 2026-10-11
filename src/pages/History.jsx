import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle } from 'lucide-react';

function History() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('flextrack_history') || '[]');
    // Sort by date descending
    saved.sort((a, b) => new Date(b.date) - new Date(a.date));
    setHistory(saved);
  }, []);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    return `${m} min`;
  };

  const formatDate = (isoStr) => {
    const d = new Date(isoStr);
    return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }) + 
           ' at ' + 
           d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  };

  const clearHistory = () => {
    if (window.confirm("Are you sure you want to clear all history?")) {
      localStorage.removeItem('flextrack_history');
      setHistory([]);
    }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Workout History</h1>
          <p className="page-subtitle">Track your consistency and progress over time.</p>
        </div>
        {history.length > 0 && (
          <button className="btn btn-secondary" onClick={clearHistory}>
            Clear History
          </button>
        )}
      </div>

      <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
        {history.map(log => (
          <div key={log.id} className="card glass" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <div>
              <h3 style={{marginBottom: '8px', fontSize: '20px'}}>{log.planName}</h3>
              <div style={{display: 'flex', gap: '16px', color: 'var(--text-muted)', fontSize: '14px'}}>
                <span style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
                  <Calendar size={14} /> {formatDate(log.date)}
                </span>
              </div>
            </div>
            
            <div style={{display: 'flex', gap: '24px'}}>
              <div style={{textAlign: 'center'}}>
                <div style={{color: 'var(--text-muted)', fontSize: '12px', marginBottom: '4px'}}>DURATION</div>
                <div style={{display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600', color: 'var(--text-main)'}}>
                  <Clock size={16} className="text-accent" />
                  {formatTime(log.duration)}
                </div>
              </div>
              
              <div style={{textAlign: 'center'}}>
                <div style={{color: 'var(--text-muted)', fontSize: '12px', marginBottom: '4px'}}>SETS</div>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', fontWeight: '600', color: 'var(--text-main)'}}>
                  <CheckCircle size={16} color="var(--accent-primary)" />
                  {log.setsCompleted}
                </div>
              </div>
            </div>
          </div>
        ))}

        {history.length === 0 && (
          <div className="card glass" style={{textAlign: 'center', padding: '48px'}}>
            <p style={{color: 'var(--text-muted)', marginBottom: '16px'}}>You haven't logged any workouts yet.</p>
            <p>Start a workout and smash it to see it here!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default History;
