import React, { useState, useEffect } from 'react';
import { Plus, Save, Trash2 } from 'lucide-react';

function WorkoutPlanner() {
  const [plans, setPlans] = useState([]);
  const [currentPlan, setCurrentPlan] = useState({ name: '', exercises: [] });

  useEffect(() => {
    const savedPlans = JSON.parse(localStorage.getItem('flextrack_plans') || '[]');
    setPlans(savedPlans);
  }, []);

  const savePlan = () => {
    if (!currentPlan.name) return alert('Please enter a plan name');
    
    const newPlans = [...plans, { ...currentPlan, id: Date.now() }];
    setPlans(newPlans);
    localStorage.setItem('flextrack_plans', JSON.stringify(newPlans));
    setCurrentPlan({ name: '', exercises: [] }); // Reset
  };

  const addExercise = () => {
    setCurrentPlan({
      ...currentPlan,
      exercises: [...currentPlan.exercises, { name: '', sets: 3, reps: 10 }]
    });
  };

  const updateExercise = (index, field, value) => {
    const newEx = [...currentPlan.exercises];
    newEx[index][field] = value;
    setCurrentPlan({ ...currentPlan, exercises: newEx });
  };

  const removeExercise = (index) => {
    const newEx = [...currentPlan.exercises];
    newEx.splice(index, 1);
    setCurrentPlan({ ...currentPlan, exercises: newEx });
  };
  
  const deletePlan = (id) => {
    const newPlans = plans.filter(p => p.id !== id);
    setPlans(newPlans);
    localStorage.setItem('flextrack_plans', JSON.stringify(newPlans));
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Workout Planner</h1>
          <p className="page-subtitle">Design your routines and hit your goals.</p>
        </div>
      </div>

      <div className="grid-2">
        {/* Create Plan Section */}
        <div className="card glass">
          <h2 style={{marginBottom: '24px'}}>Create New Plan</h2>
          
          <div className="form-group">
            <label className="form-label">Plan Name</label>
            <input 
              type="text" 
              placeholder="e.g., Push Day, Full Body"
              value={currentPlan.name}
              onChange={e => setCurrentPlan({...currentPlan, name: e.target.value})}
            />
          </div>

          <div style={{marginTop: '24px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <h3>Exercises</h3>
            <button className="btn btn-secondary" onClick={addExercise} style={{padding: '8px 16px', fontSize: '14px'}}>
              <Plus size={16} /> Add
            </button>
          </div>

          <div style={{display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px'}}>
            {currentPlan.exercises.map((ex, idx) => (
              <div key={idx} style={{display: 'flex', gap: '8px', alignItems: 'center'}}>
                <input 
                  type="text" 
                  placeholder="Exercise Name" 
                  style={{flex: 2}}
                  value={ex.name}
                  onChange={e => updateExercise(idx, 'name', e.target.value)}
                />
                <input 
                  type="number" 
                  placeholder="Sets" 
                  style={{flex: 1}}
                  value={ex.sets}
                  onChange={e => updateExercise(idx, 'sets', parseInt(e.target.value))}
                />
                <input 
                  type="number" 
                  placeholder="Reps" 
                  style={{flex: 1}}
                  value={ex.reps}
                  onChange={e => updateExercise(idx, 'reps', parseInt(e.target.value))}
                />
                <button className="btn-icon" onClick={() => removeExercise(idx)}>
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
            {currentPlan.exercises.length === 0 && (
              <p style={{color: 'var(--text-muted)', fontSize: '14px', textAlign: 'center', padding: '16px'}}>
                No exercises added yet.
              </p>
            )}
          </div>

          <button className="btn btn-primary" style={{width: '100%'}} onClick={savePlan}>
            <Save size={18} /> Save Plan
          </button>
        </div>

        {/* Saved Plans Section */}
        <div>
          <h2 style={{marginBottom: '24px'}}>Your Routines</h2>
          <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
            {plans.map(plan => (
              <div key={plan.id} className="card">
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px'}}>
                  <h3 className="text-gradient">{plan.name}</h3>
                  <button className="btn-icon" onClick={() => deletePlan(plan.id)} style={{color: '#ff4444'}}>
                    <Trash2 size={16} />
                  </button>
                </div>
                <p style={{color: 'var(--text-muted)', fontSize: '14px', marginBottom: '12px'}}>
                  {plan.exercises.length} exercises
                </p>
                <div style={{display: 'flex', flexWrap: 'wrap', gap: '8px'}}>
                  {plan.exercises.map((ex, idx) => (
                    <span key={idx} style={{background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '4px', fontSize: '12px'}}>
                      {ex.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
            {plans.length === 0 && (
              <div className="card" style={{textAlign: 'center', color: 'var(--text-muted)'}}>
                No routines created yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WorkoutPlanner;
