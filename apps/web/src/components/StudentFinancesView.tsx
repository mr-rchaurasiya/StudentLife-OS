import React, { useState, useEffect } from 'react';
import {
  Wallet,
  Sparkles,
  Plus,
  Briefcase,
  Calculator,
  PieChart
} from 'lucide-react';
import {
  StudentFinancialBudget,
  AddExpenseDto,
  ExpenseCategory,
  CourseRoiCalcDto,
  CourseRoiResult
} from '@studentlife/shared';

interface StudentFinancesViewProps {
  onAddXp?: (xp: number, reason: string) => void;
}

export const StudentFinancesView: React.FC<StudentFinancesViewProps> = ({ onAddXp }) => {
  const [budget, setBudget] = useState<StudentFinancialBudget | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [expenseTitle, setExpenseTitle] = useState<string>('');
  const [expenseAmount, setExpenseAmount] = useState<number>(350);
  const [expenseCategory, setExpenseCategory] = useState<ExpenseCategory>('MESS_FOOD');

  // ROI Calculator State
  const [courseCost, setCourseCost] = useState<number>(45000);
  const [courseDuration, setCourseDuration] = useState<number>(6);
  const [expectedSalary, setExpectedSalary] = useState<number>(1400000);
  const [roiResult, setRoiResult] = useState<CourseRoiResult | null>(null);
  const [isCalculatingRoi, setIsCalculatingRoi] = useState<boolean>(false);

  useEffect(() => {
    fetchBudget();
    handleCalculateRoi();
  }, []);

  const fetchBudget = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/student-finances/budget');
      const data = await res.json();
      if (data.success && data.data) {
        setBudget(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch budget', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dto: AddExpenseDto = {
        category: expenseCategory,
        title: expenseTitle,
        amount: Number(expenseAmount)
      };
      const res = await fetch('/api/student-finances/expense', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dto)
      });
      const data = await res.json();
      if (data.success && data.data) {
        setBudget(data.data);
        setShowAddModal(false);
        setExpenseTitle('');
        onAddXp?.(15, 'Logged Student Expense');
      }
    } catch (err) {
      console.error('Failed to add expense', err);
    }
  };

  const handleCalculateRoi = async () => {
    try {
      setIsCalculatingRoi(true);
      const dto: CourseRoiCalcDto = {
        totalCourseCost: Number(courseCost),
        durationMonths: Number(courseDuration),
        expectedStartingSalaryAnnual: Number(expectedSalary)
      };
      const res = await fetch('/api/student-finances/calculate-roi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dto)
      });
      const data = await res.json();
      if (data.success && data.data) {
        setRoiResult(data.data);
      }
    } catch (err) {
      console.error('Failed to calculate course ROI', err);
    } finally {
      setIsCalculatingRoi(false);
    }
  };

  const getCategoryColor = (cat: ExpenseCategory) => {
    switch (cat) {
      case 'MESS_FOOD': return '#f59e0b';
      case 'BOOKS_STATIONERY': return '#818cf8';
      case 'HOSTEL_RENT': return '#ec4899';
      case 'COURSES_TESTS': return '#38bdf8';
      case 'TRANSPORT': return '#10b981';
      default: return '#a855f7';
    }
  };

  if (isLoading || !budget) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
        <Wallet size={36} className="animate-pulse" style={{ margin: '0 auto 16px', color: 'var(--accent-primary)' }} />
        <p>Loading Student Financial Hub & Budget Optimizer...</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Banner */}
      <div className="glass-panel" style={{
        padding: '24px 32px',
        background: 'linear-gradient(135deg, rgba(6, 78, 59, 0.6) 0%, rgba(15, 23, 42, 0.9) 100%)',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '16px'
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="badge badge-active" style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#34d399' }}>
              <Sparkles size={12} /> PHASE 48 &bull; STUDENT FINTECH ENGINE
            </span>
            <span className="badge badge-completed">₹{budget.remainingAllowance.toLocaleString()} Remaining</span>
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>
            Student Financial & <span className="gradient-text">Expense Tracker 💳</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            Track college allowance, optimize study expenses, discover campus gigs, and calculate test-series/degree ROI.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}
        >
          <Plus size={14} /> Log Expense
        </button>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Monthly Pocket Allowance</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
            ₹{budget.monthlyBudget.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Base college budget</div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Total Spent This Month</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f87171' }}>
            ₹{budget.totalSpentThisMonth.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>{budget.expenses.length} logged items</div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Safe Balance Left</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
            ₹{budget.remainingAllowance.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>{budget.savingsRatePercent}% savings rate</div>
        </div>
      </div>

      {/* Two-Column Grid: Expenses Log & Course ROI / Gigs */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
        {/* Left: Expenses List */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PieChart size={18} color="var(--accent-primary)" />
            Recent College Expenses
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {budget.expenses.map(exp => (
              <div
                key={exp.id}
                className="glow-hover"
                style={{
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid var(--border-glass)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor: getCategoryColor(exp.category)
                    }}
                  />
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{exp.title}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      {exp.category.replace('_', ' ')} &bull; {exp.date}
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#f87171' }}>
                  -₹{exp.amount.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Course ROI Calculator & Gigs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Course ROI Calculator */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calculator size={18} color="#fbbf24" />
              Course / Test Series ROI Calculator
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '12px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Cost (₹)
                </label>
                <input
                  type="number"
                  value={courseCost}
                  onChange={(e) => setCourseCost(Number(e.target.value))}
                  className="glass-input"
                  style={{ width: '100%', padding: '8px 10px', fontSize: '0.85rem' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Duration (Months)
                </label>
                <input
                  type="number"
                  value={courseDuration}
                  onChange={(e) => setCourseDuration(Number(e.target.value))}
                  className="glass-input"
                  style={{ width: '100%', padding: '8px 10px', fontSize: '0.85rem' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Expected CTC (₹)
                </label>
                <input
                  type="number"
                  value={expectedSalary}
                  onChange={(e) => setExpectedSalary(Number(e.target.value))}
                  className="glass-input"
                  style={{ width: '100%', padding: '8px 10px', fontSize: '0.85rem' }}
                />
              </div>
            </div>

            <button
              onClick={handleCalculateRoi}
              disabled={isCalculatingRoi}
              className="btn btn-secondary"
              style={{ width: '100%', padding: '8px', fontSize: '0.8rem', marginBottom: '12px' }}
            >
              Recalculate ROI
            </button>

            {roiResult && (
              <div style={{
                padding: '12px 14px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(9, 13, 22, 0.7)',
                border: '1px solid var(--border-glass)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Estimated Payback:</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
                    {roiResult.paybackPeriodMonths} Months
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>3-Year Net ROI:</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#38bdf8' }}>
                    +{roiResult.threeYearRoiPercentage}%
                  </span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '8px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '6px' }}>
                  {roiResult.recommendations[0]}
                </div>
              </div>
            )}
          </div>

          {/* Student Micro-Gigs Radar */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Briefcase size={16} color="var(--accent-primary)" />
              Part-Time Student Gigs Radar
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {budget.suggestedGigs.map(gig => (
                <div
                  key={gig.id}
                  style={{
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'rgba(15, 23, 42, 0.5)',
                    border: '1px solid var(--border-glass)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>{gig.title}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      {gig.estimatedHours} &bull; {gig.platform}
                    </div>
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
                    +₹{gig.payoutAmount}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Expense Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '440px', padding: '28px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '16px' }}>
              Log College Expense 💸
            </h3>

            <form onSubmit={handleAddExpense} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Title / Description
                </label>
                <input
                  type="text"
                  value={expenseTitle}
                  onChange={(e) => setExpenseTitle(e.target.value)}
                  placeholder="e.g. Graph Theory Reference Book"
                  className="glass-input"
                  style={{ width: '100%', padding: '8px 12px' }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                    Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={expenseAmount}
                    onChange={(e) => setExpenseAmount(Number(e.target.value))}
                    className="glass-input"
                    style={{ width: '100%', padding: '8px 12px' }}
                    required
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                    Category
                  </label>
                  <select
                    value={expenseCategory}
                    onChange={(e) => setExpenseCategory(e.target.value as any)}
                    className="glass-input"
                    style={{ width: '100%', padding: '8px 12px' }}
                  >
                    <option value="MESS_FOOD">Mess & Food</option>
                    <option value="BOOKS_STATIONERY">Books & Notes</option>
                    <option value="HOSTEL_RENT">Hostel & Rent</option>
                    <option value="COURSES_TESTS">Courses & Mocks</option>
                    <option value="TRANSPORT">Metro / Bus</option>
                    <option value="LEISURE">Social & Coffee</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn btn-secondary"
                  style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ padding: '8px 18px', fontSize: '0.85rem' }}
                >
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
