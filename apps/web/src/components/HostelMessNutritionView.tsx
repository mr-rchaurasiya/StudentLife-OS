import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Utensils,
  Coffee,
  Droplets,
  Star,
  Plus,
  Moon
} from 'lucide-react';
import { HostelDailyMenu, NutrientIntakeLog, LogNutrientIntakeDto, RateMealDto } from '@studentlife/shared';

interface HostelMessNutritionViewProps {
  onAddXp?: (xp: number, reason: string) => void;
}

export const HostelMessNutritionView: React.FC<HostelMessNutritionViewProps> = ({ onAddXp }) => {
  const [menus, setMenus] = useState<HostelDailyMenu[]>([]);
  const [activeDay, setActiveDay] = useState<string>('MONDAY');
  const [nutrientLog, setNutrientLog] = useState<NutrientIntakeLog | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dishInput, setDishInput] = useState<string>('');
  const [calInput, setCalInput] = useState<number>(350);
  const [proteinInput, setProteinInput] = useState<number>(18);
  const [waterInput, setWaterInput] = useState<number>(300);

  useEffect(() => {
    fetchNutritionData();
  }, []);

  const fetchNutritionData = async () => {
    try {
      setIsLoading(true);
      const [menuRes, logRes] = await Promise.all([
        fetch('/api/hostel-nutrition/menu'),
        fetch('/api/hostel-nutrition/log')
      ]);
      const menuData = await menuRes.json();
      const logData = await logRes.json();
      if (menuData.success && menuData.data) {
        setMenus(menuData.data);
      }
      if (logData.success && logData.data) {
        setNutrientLog(logData.data);
      }
    } catch (err) {
      console.error('Failed to fetch hostel nutrition data', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogMeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dishInput.trim()) return;
    try {
      const dto: LogNutrientIntakeDto = {
        dishName: dishInput,
        caloriesKcal: calInput,
        proteinGrams: proteinInput,
        waterMl: waterInput
      };
      const res = await fetch('/api/hostel-nutrition/log-intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dto)
      });
      const data = await res.json();
      if (data.success && data.data) {
        setNutrientLog(data.data);
        setDishInput('');
        onAddXp?.(15, 'Logged Healthy Brain-Fuel Meal');
      }
    } catch (err) {
      console.error('Failed to log meal intake', err);
    }
  };

  const handleRateMeal = async (dishId: string, rating: number) => {
    try {
      const dto: RateMealDto = { dishId, rating };
      await fetch('/api/hostel-nutrition/rate-meal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dto)
      });
      await fetchNutritionData();
      onAddXp?.(10, `Rated Hostel Dish: ${rating} Stars`);
    } catch (err) {
      console.error('Failed to rate meal', err);
    }
  };

  if (isLoading || !nutrientLog) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
        <Utensils size={36} className="animate-pulse" style={{ margin: '0 auto 16px', color: 'var(--accent-primary)' }} />
        <p>Loading Smart Hostel Mess & Brain-Fuel Nutrition Tracker...</p>
      </div>
    );
  }

  const currentDayMenu = menus.find(m => m.dayOfWeek === activeDay) || menus[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Banner */}
      <div className="glass-panel" style={{
        padding: '24px 32px',
        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.6) 0%, rgba(15, 23, 42, 0.9) 100%)',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '16px'
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="badge badge-active" style={{ backgroundColor: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24' }}>
              <Sparkles size={12} /> PHASE 58 &bull; SMART HOSTEL MESS & NUTRITION
            </span>
            <span className="badge badge-completed">Cognitive Brain Fuel Optimization</span>
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>
            Hostel Mess Menu <span className="gradient-text">& Brain-Fuel Tracker 🥗</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            Weekly mess dining schedules, student peer ratings, protein balance, and caffeine-sleep latency protection.
          </p>
        </div>

        {/* Top Summary Cards */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <div className="glass-panel" style={{ padding: '8px 14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Utensils size={16} color="#fbbf24" />
            <div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>PROTEIN TODAY</div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff' }}>
                {nutrientLog.proteinGramsToday} / {nutrientLog.targetProteinGrams}g
              </div>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '8px 14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Droplets size={16} color="#38bdf8" />
            <div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>HYDRATION</div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#38bdf8' }}>
                {nutrientLog.hydrationLitersToday} L
              </div>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '8px 14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Coffee size={16} color="#f59e0b" />
            <div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>CAFFEINE</div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff' }}>
                {nutrientLog.caffeineMgToday} mg
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Weekly Menu Board & Log Custom Meal */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '20px' }}>
        {/* Left: Weekly Dining Schedule */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Utensils size={18} color="#fbbf24" />
              {currentDayMenu?.messHallName || 'Central Hostel Mess'}
            </h4>
            <div style={{ display: 'flex', gap: '6px' }}>
              {(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'] as const).map((day) => (
                <button
                  key={day}
                  onClick={() => setActiveDay(day)}
                  className={`glass-pill ${activeDay === day ? 'badge-active' : ''}`}
                  style={{
                    padding: '4px 10px',
                    fontSize: '0.7rem',
                    border: activeDay === day ? '1px solid #fbbf24' : '1px solid var(--border-glass)',
                    backgroundColor: activeDay === day ? 'rgba(245, 158, 11, 0.2)' : 'transparent',
                    color: activeDay === day ? '#fbbf24' : 'var(--text-secondary)',
                    cursor: 'pointer'
                  }}
                >
                  {day.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>

          {/* Meals for selected day */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {currentDayMenu?.meals.map((meal) => (
              <div
                key={meal.id}
                style={{
                  padding: '14px 16px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(9, 13, 22, 0.8)',
                  border: '1px solid var(--border-glass)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span className="badge badge-active" style={{ fontSize: '0.65rem' }}>
                      {meal.slot}
                    </span>
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ffffff' }}>
                      {meal.dishName}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <span>⚡ {meal.caloriesKcal} kcal</span>
                    <span>🥩 {meal.proteinGrams}g protein</span>
                    {meal.brainFuelTag && (
                      <span style={{ color: '#fbbf24', fontWeight: 600 }}>🧠 {meal.brainFuelTag}</span>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleRateMeal(meal.id, star)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '2px',
                        color: star <= Math.round(meal.avgStudentRating) ? '#fbbf24' : 'var(--text-muted)'
                      }}
                    >
                      <Star size={14} fill={star <= Math.round(meal.avgStudentRating) ? '#fbbf24' : 'none'} />
                    </button>
                  ))}
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#ffffff', marginLeft: '4px' }}>
                    {meal.avgStudentRating.toFixed(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Log Meal & Sleep Latency Alert */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Sleep Latency Warning */}
          {nutrientLog.sleepLatencyImpactWarning && (
            <div className="glass-panel" style={{ padding: '16px', borderLeft: '3px solid #f59e0b', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Moon size={22} color="#fbbf24" style={{ flexShrink: 0 }} />
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                {nutrientLog.sleepLatencyImpactWarning}
              </div>
            </div>
          )}

          {/* Quick Log Form */}
          <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Plus size={16} color="var(--accent-primary)" />
              Quick Log Intake (Food / Water)
            </h4>

            <form onSubmit={handleLogMeal} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Dish / Food Item</label>
                <input
                  type="text"
                  value={dishInput}
                  onChange={(e) => setDishInput(e.target.value)}
                  placeholder="E.g., Almonds, Paneer Roll, Boiled Eggs..."
                  className="glass-input"
                  style={{ width: '100%', padding: '8px 12px', fontSize: '0.85rem', marginTop: '4px' }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Calories (kcal)</label>
                  <input
                    type="number"
                    value={calInput}
                    onChange={(e) => setCalInput(Number(e.target.value))}
                    className="glass-input"
                    style={{ width: '100%', padding: '8px 12px', fontSize: '0.85rem', marginTop: '4px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Protein (g)</label>
                  <input
                    type="number"
                    value={proteinInput}
                    onChange={(e) => setProteinInput(Number(e.target.value))}
                    className="glass-input"
                    style={{ width: '100%', padding: '8px 12px', fontSize: '0.85rem', marginTop: '4px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Water Added (ml)</label>
                <input
                  type="number"
                  value={waterInput}
                  onChange={(e) => setWaterInput(Number(e.target.value))}
                  className="glass-input"
                  style={{ width: '100%', padding: '8px 12px', fontSize: '0.85rem', marginTop: '4px' }}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ padding: '8px 16px', fontSize: '0.85rem', marginTop: '4px' }}
              >
                Log to Brain-Fuel Engine (+15 XP)
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
