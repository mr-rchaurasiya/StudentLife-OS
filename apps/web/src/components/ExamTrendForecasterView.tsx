import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  BookOpen,
  HelpCircle,
  Search,
  ChevronRight
} from 'lucide-react';
import {
  ExamTrendForecast,
  TopicProbabilityData,
  PredictExamTrendsDto
} from '@studentlife/shared';

interface ExamTrendForecasterViewProps {
  onAddXp?: (xp: number, reason: string) => void;
}

export const ExamTrendForecasterView: React.FC<ExamTrendForecasterViewProps> = ({ onAddXp }) => {
  const [forecast, setForecast] = useState<ExamTrendForecast | null>(null);
  const [selectedExam, setSelectedExam] = useState<string>('GATE (CSE)');
  const [selectedSubject, setSelectedSubject] = useState<string>('Algorithms & Data Structures');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isPredicting, setIsPredicting] = useState<boolean>(false);
  const [activeTopic, setActiveTopic] = useState<TopicProbabilityData | null>(null);

  useEffect(() => {
    fetchForecast(selectedExam);
  }, [selectedExam]);

  const fetchForecast = async (exam: string) => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/exam-trend/forecast?examName=${encodeURIComponent(exam)}`);
      const data = await res.json();
      if (data.success && data.data) {
        setForecast(data.data);
        if (data.data.topPredictedTopics?.length > 0) {
          setActiveTopic(data.data.topPredictedTopics[0]);
        }
      }
    } catch (err) {
      console.error('Failed to fetch exam forecast', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsPredicting(true);
      const dto: PredictExamTrendsDto = {
        examName: selectedExam,
        targetSubject: selectedSubject
      };
      const res = await fetch('/api/exam-trend/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dto)
      });
      const data = await res.json();
      if (data.success && data.data) {
        setForecast(data.data);
        if (data.data.topPredictedTopics?.length > 0) {
          setActiveTopic(data.data.topPredictedTopics[0]);
        }
        onAddXp?.(25, 'Analyzed AI Exam Trends');
      }
    } catch (err) {
      console.error('Failed to predict custom trends', err);
    } finally {
      setIsPredicting(false);
    }
  };

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case 'VERY_HIGH': return '#ef4444';
      case 'HIGH': return '#f59e0b';
      case 'MEDIUM': return '#38bdf8';
      default: return '#10b981';
    }
  };

  if (isLoading || !forecast) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
        <TrendingUp size={36} className="animate-pulse" style={{ margin: '0 auto 16px', color: 'var(--accent-primary)' }} />
        <p>Analyzing 10+ Years of Exam Big-Data & Question Frequency Patterns...</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{
        padding: '24px 32px',
        background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.7) 0%, rgba(15, 23, 42, 0.9) 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="badge badge-active" style={{ backgroundColor: 'rgba(236, 72, 153, 0.2)', color: '#f472b6' }}>
                <Sparkles size={12} /> PHASE 46 &bull; BIG-DATA ML FORECASTING
              </span>
              <span className="badge badge-completed">
                <CheckCircle2 size={12} /> {forecast.forecastAccuracyScore}% Historical Accuracy
              </span>
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>
              AI Exam Paper Trend <span className="gradient-text">Forecaster 🔮</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
              Predict high-probability question patterns, weightage shifts, and high-risk topics based on {forecast.analyzedYearSpan}.
            </p>
          </div>

          <form onSubmit={handlePredict} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
            <select
              value={selectedExam}
              onChange={(e) => setSelectedExam(e.target.value)}
              className="glass-input"
              style={{ padding: '8px 14px', borderRadius: 'var(--radius-md)', fontSize: '0.85rem' }}
            >
              <option value="GATE (CSE)">GATE Computer Science</option>
              <option value="JEE Advanced">JEE Advanced (Physics/Math)</option>
              <option value="UPSC Civil Services">UPSC GS & Optional</option>
              <option value="Semester Finals">Univ Semester Finals</option>
            </select>

            <input
              type="text"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              placeholder="Filter by subject..."
              className="glass-input"
              style={{ padding: '8px 14px', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', width: '200px' }}
            />

            <button
              type="submit"
              disabled={isPredicting}
              className="btn btn-primary"
              style={{ padding: '8px 18px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Search size={14} />
              {isPredicting ? 'Computing...' : 'Forecast'}
            </button>
          </form>
        </div>
      </div>

      {/* KPI Metric Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div className="glass-panel" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818cf8' }}>
            <BookOpen size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Indexed PYQs</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{forecast.totalPYQQuestionsIndexed} Questions</div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(236, 72, 153, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f472b6' }}>
            <TrendingUp size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Forecast Accuracy</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f472b6' }}>{forecast.forecastAccuracyScore}%</div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fbbf24' }}>
            <AlertTriangle size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Predicted Difficulty</div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fbbf24' }}>{forecast.predictedPaperDifficulty}</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Probability Table & Detail Insight */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '20px' }}>
        {/* Topic Probability Heatmap Table */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={18} color="var(--accent-primary)" />
            Top Predicted Topics for Upcoming Exam
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {forecast.topPredictedTopics.map((topic, idx) => {
              const isSelected = activeTopic?.topicName === topic.topicName;
              return (
                <div
                  key={idx}
                  onClick={() => setActiveTopic(topic)}
                  className="glow-hover"
                  style={{
                    padding: '14px 18px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: isSelected ? 'rgba(99, 102, 241, 0.15)' : 'rgba(15, 23, 42, 0.6)',
                    border: isSelected ? '1px solid var(--accent-primary)' : '1px solid var(--border-glass)',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxWidth: '70%' }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: isSelected ? '#ffffff' : 'var(--text-primary)' }}>
                      {topic.topicName}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Expected Weightage: <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{topic.expectedMarksWeightage} Marks</span> &bull; {topic.historicalFrequencyCount} Previous Questions
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
                        {topic.probabilityPercent}%
                      </div>
                      <span
                        style={{
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          padding: '2px 6px',
                          borderRadius: '4px',
                          backgroundColor: `${getRiskBadgeColor(topic.riskLevel)}22`,
                          color: getRiskBadgeColor(topic.riskLevel)
                        }}
                      >
                        {topic.riskLevel.replace('_', ' ')} RISK
                      </span>
                    </div>
                    <ChevronRight size={16} color="var(--text-muted)" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Topic Intelligence & High-Probability Patterns */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {activeTopic && (
            <div className="glass-panel" style={{ padding: '24px', borderLeft: `4px solid ${getRiskBadgeColor(activeTopic.riskLevel)}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                  DEEP REVISION INTELLIGENCE
                </span>
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: `${getRiskBadgeColor(activeTopic.riskLevel)}22`,
                    color: getRiskBadgeColor(activeTopic.riskLevel)
                  }}
                >
                  {activeTopic.probabilityPercent}% PROBABILITY
                </span>
              </div>

              <h4 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '8px' }}>
                {activeTopic.topicName}
              </h4>

              <div style={{
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(9, 13, 22, 0.7)',
                border: '1px solid var(--border-glass)',
                marginBottom: '16px'
              }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-secondary)', marginBottom: '4px' }}>
                  🎯 AI RECOMMENDED ACTION:
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {activeTopic.recommendedAction}
                </div>
              </div>
            </div>
          )}

          {/* High Probability Question Patterns */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <HelpCircle size={16} color="#fbbf24" />
              High-Yield Question Blueprints
            </h4>

            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {forecast.highProbabilityQuestionPatterns.map((pattern, idx) => (
                <li
                  key={idx}
                  style={{
                    fontSize: '0.8rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.4,
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'rgba(15, 23, 42, 0.5)'
                  }}
                >
                  <span style={{ color: 'var(--accent-primary)', fontWeight: 800 }}>#{idx + 1}</span>
                  {pattern}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
