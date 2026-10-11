import React, { useState, useEffect, useRef } from 'react';
import { Play, Square, CheckSquare, Square as SquareIcon, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function ActiveWorkout() {
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  
  // Timer state
  const [isActive, setIsActive] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0); // in seconds
  const timerRef = useRef(null);

  // Workout state
  const [completedSets, setCompletedSets] = useState({}); // { "exIdx-setIdx": true }
  
  const navigate = useNavigate();

  useEffect(() => {
    const savedPlans = JSON.parse(localStorage.getItem('flextrack_plans') || '[]');
    setPlans(savedPlans);
  }, []);

  // Timer logic
  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isActive]);

  const toggleTimer = () => setIsActive(!isActive);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    const h = Math.floor(seconds / 3600);
    if (h > 0) {
      return `${h.toString().padStart(2, '0')}:${m}:${s}`;
    }
    return `${m}:${s}`;
  };

  const toggleSet = (exIdx, setIdx) => {
    const key = `${exIdx}-${setIdx}`;
    setCompletedSets(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const finishWorkout = () => {
    setIsActive(false);
    
    // Save to history
    const history = JSON.parse(localStorage.getItem('flextrack_history') || '[]');
    const totalSetsCompleted = Object.values(completedSets).filter(Boolean).length;
    
    const newLog = {
      id: Date.now(),
      date: new Date().toISOString(),
      planName: selectedPlan.name,
      duration: timeElapsed,
      setsCompleted: totalSetsCompleted
    };
    
    localStorage.setItem('flextrack_history', JSON.stringify([...history, newLog]));
    alert('Workout saved successfully!');
    navigate('/history');
  };

  if (!selectedPlan) {
    return (
      <div>
        <div className="page-header">
          <h1 className="page-title">Start Workout</h1>
        </div>
        <div className="card glass">
          <h2 style={{marginBottom: '20px'}}>Choose a Routine</h2>
          <div className="grid-2">
            {plans.map(plan => (
              <div 
                key={plan.id} 
                className="card" 
                style={{cursor: 'pointer'}}
                onClick={() => {
                  setSelectedPlan(plan);
                  setIsActive(true); // Auto-start timer
                }}
              >
                <h3>{plan.name}</h3>
                <p style={{color: 'var(--text-muted)'}}>{plan.exercises.length} exercises</p>
              </div>
            ))}
          </div>
          {plans.length === 0 && (
            <p>No routines available. Please create one in the Planner first.</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header" style={{marginBottom: '20px'}}>
        <div>
          <h1 className="page-title text-gradient">{selectedPlan.name}</h1>
          <p className="page-subtitle">Crush your goals today.</p>
        </div>
        <button className="btn btn-primary" onClick={finishWorkout}>
          <Save size={18} /> Finish & Save
        </button>
      </div>

      <div className="card glass" style={{marginBottom: '32px', textAlign: 'center'}}>
        <div className="timer-display" style={{color: isActive ? 'var(--accent-primary)' : 'var(--text-main)'}}>
          {formatTime(timeElapsed)}
        </div>
        <button 
          className={`btn ${isActive ? 'btn-danger' : 'btn-primary'}`} 
          onClick={toggleTimer}
          style={{minWidth: '160px'}}
        >
          {isActive ? (
            <><Square size={18} /> Pause Timer</>
          ) : (
            <><Play size={18} /> Resume Timer</>
          )}
        </button>
      </div>

      <div style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
        {selectedPlan.exercises.map((ex, exIdx) => (
          <div key={exIdx} className="card">
            <h3 style={{marginBottom: '16px', fontSize: '20px'}}>{ex.name}</h3>
            <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
              {Array.from({length: ex.sets}).map((_, setIdx) => {
                const key = `${exIdx}-${setIdx}`;
                const isCompleted = completedSets[key];
                return (
                  <div 
                    key={setIdx} 
                    className={`workout-item ${isCompleted ? 'completed' : ''}`}
                    onClick={() => toggleSet(exIdx, setIdx)}
                    style={{cursor: 'pointer'}}
                  >
                    <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
                      <span style={{color: 'var(--text-muted)', width: '60px'}}>Set {setIdx + 1}</span>
                      <span style={{fontSize: '18px', fontWeight: '500'}}>{ex.reps} Reps</span>
                    </div>
                    <div>
                      {isCompleted ? (
                        <CheckSquare size={24} color="var(--accent-primary)" />
                      ) : (
                        <SquareIcon size={24} color="var(--text-muted)" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ActiveWorkout;
