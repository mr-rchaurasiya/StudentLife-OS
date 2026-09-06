import { useState, useEffect } from 'react';
import {
  ScholarshipScheme,
  ScholarshipCategory,
  DocumentVerificationItem,
  EligibilityMatchResult,
} from '@studentlife/shared';
import {
  Award,
  Search,
  CheckCircle2,
  Clock,
  ExternalLink,
  ShieldCheck,
  Calculator,
  FileText,
  Bookmark,
  Sparkles,
} from 'lucide-react';

export function ScholarshipFinderView() {
  const [activeTab, setActiveTab] = useState<'SCHEMES_RADAR' | 'ELIGIBILITY_MATCHMAKER' | 'DOCUMENT_CHECKLIST'>('SCHEMES_RADAR');
  const [scholarships, setScholarships] = useState<ScholarshipScheme[]>([]);
  const [documentChecklist, setDocumentChecklist] = useState<DocumentVerificationItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | ScholarshipCategory>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Matchmaker form state
  const [calcCgpa, setCalcCgpa] = useState<number>(8.5);
  const [calcIncomeLakhs, setCalcIncomeLakhs] = useState<number>(6.0);
  const [calcYear, setCalcYear] = useState<number>(3);
  const [calcGender, setCalcGender] = useState<'MALE' | 'FEMALE' | 'OTHER'>('MALE');
  const [calcDegree, setCalcDegree] = useState('B.Tech Computer Science');
  const [matchResult, setMatchResult] = useState<EligibilityMatchResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    fetchScholarships();
    fetchDocumentChecklist();
    runEligibilityCalculation();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchScholarships = async () => {
    try {
      const res = await fetch('/api/scholarships');
      const data = await res.json();
      if (data && data.success && data.data) {
        setScholarships(data.data);
      }
    } catch {
      // Keep state
    }
  };

  const fetchDocumentChecklist = async () => {
    try {
      const res = await fetch('/api/scholarships/checklist');
      const data = await res.json();
      if (data && data.success && data.data) {
        setDocumentChecklist(data.data);
      }
    } catch {
      // Keep state
    }
  };

  const handleToggleBookmark = async (id: string) => {
    try {
      const res = await fetch(`/api/scholarships/${id}/bookmark`, { method: 'PATCH' });
      const data = await res.json();
      if (data && data.success && data.data) {
        setScholarships(scholarships.map((s) => (s.id === id ? data.data : s)));
      }
    } catch {
      // Fallback
    }
  };

  const handleToggleDocument = async (id: string) => {
    try {
      const res = await fetch(`/api/scholarships/checklist/${id}/toggle`, { method: 'PATCH' });
      const data = await res.json();
      if (data && data.success && data.data) {
        setDocumentChecklist(documentChecklist.map((d) => (d.id === id ? data.data : d)));
        showToast('Document verification status updated!');
      }
    } catch {
      // Fallback
    }
  };

  const runEligibilityCalculation = async () => {
    setIsCalculating(true);
    try {
      const res = await fetch('/api/scholarships/check-eligibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cgpa: calcCgpa,
          familyIncomeLakhs: calcIncomeLakhs,
          gender: calcGender,
          academicYear: calcYear,
          degree: calcDegree,
        }),
      });
      const data = await res.json();
      if (data && data.success && data.data) {
        setMatchResult(data.data);
      }
    } catch {
      // Fallback
    } finally {
      setIsCalculating(false);
    }
  };

  // Filter scholarships
  const filteredScholarships = scholarships.filter((sch) => {
    const matchesCategory = selectedCategory === 'ALL' || sch.category === selectedCategory;
    const matchesSearch =
      sch.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sch.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sch.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const verifiedDocCount = documentChecklist.filter((d) => d.isVerified).length;
  const docReadinessPercent = Math.round((verifiedDocCount / (documentChecklist.length || 1)) * 100);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Banner */}
      <section className="glass-panel glow-hover" style={{
        padding: '24px 32px',
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)',
        position: 'relative',
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="badge badge-completed">
                <Award size={12} /> PHASE 17 ACTIVE
              </span>
              <span className="badge badge-active">85% TOTAL OS PROGRESS</span>
              <span className="badge" style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                ₹4,80,000 ($5,800) Potential Aid Matched
              </span>
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>
              Scholarships & Financial Aid <span className="gradient-text">Finder</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
              National Government schemes, corporate merit foundations, institutional grants, automated eligibility matchmaker, and document verification checklists.
            </p>
          </div>

          {/* Action Highlights */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={() => {
                setActiveTab('ELIGIBILITY_MATCHMAKER');
                runEligibilityCalculation();
              }}
              className="btn btn-primary"
              style={{ padding: '8px 16px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Calculator size={14} /> Calculate Financial Aid
            </button>
            <button
              onClick={() => setActiveTab('DOCUMENT_CHECKLIST')}
              className="btn btn-secondary"
              style={{ padding: '8px 16px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <FileText size={14} /> Doc Verification ({docReadinessPercent}%)
            </button>
          </div>
        </div>

        {toastMessage && (
          <div style={{
            position: 'absolute',
            bottom: '12px',
            right: '24px',
            backgroundColor: '#10b981',
            color: '#ffffff',
            padding: '6px 14px',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.75rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)',
          }}>
            <CheckCircle2 size={13} /> {toastMessage}
          </div>
        )}
      </section>

      {/* Main Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '12px' }}>
        <button
          onClick={() => setActiveTab('SCHEMES_RADAR')}
          style={{
            padding: '8px 18px',
            borderRadius: 'var(--radius-full)',
            border: 'none',
            fontSize: '0.85rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: activeTab === 'SCHEMES_RADAR' ? 'var(--accent-primary)' : 'rgba(255,255,255,0.04)',
            color: activeTab === 'SCHEMES_RADAR' ? '#ffffff' : 'var(--text-secondary)',
          }}
        >
          <Award size={15} /> Schemes Radar ({scholarships.length})
        </button>
        <button
          onClick={() => {
            setActiveTab('ELIGIBILITY_MATCHMAKER');
            runEligibilityCalculation();
          }}
          style={{
            padding: '8px 18px',
            borderRadius: 'var(--radius-full)',
            border: 'none',
            fontSize: '0.85rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: activeTab === 'ELIGIBILITY_MATCHMAKER' ? 'linear-gradient(135deg, #10b981, #059669)' : 'rgba(255,255,255,0.04)',
            color: activeTab === 'ELIGIBILITY_MATCHMAKER' ? '#ffffff' : 'var(--text-secondary)',
          }}
        >
          <Calculator size={15} color={activeTab === 'ELIGIBILITY_MATCHMAKER' ? '#fff' : '#34d399'} /> Eligibility Matchmaker
        </button>
        <button
          onClick={() => setActiveTab('DOCUMENT_CHECKLIST')}
          style={{
            padding: '8px 18px',
            borderRadius: 'var(--radius-full)',
            border: 'none',
            fontSize: '0.85rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: activeTab === 'DOCUMENT_CHECKLIST' ? 'linear-gradient(135deg, #a855f7, #6366f1)' : 'rgba(255,255,255,0.04)',
            color: activeTab === 'DOCUMENT_CHECKLIST' ? '#ffffff' : 'var(--text-secondary)',
          }}
        >
          <FileText size={15} color={activeTab === 'DOCUMENT_CHECKLIST' ? '#fff' : '#c084fc'} /> Document Verification Vault
        </button>
      </div>

      {/* Tab 1: Schemes Radar */}
      {activeTab === 'SCHEMES_RADAR' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Search and Category Filter Strip */}
          <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '260px' }}>
              <Search size={16} color="var(--text-muted)" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search schemes by name, provider (Reliance, NSP, Tata, Google, Birla)..."
                className="input-field"
                style={{ flex: 1, fontSize: '0.85rem', padding: '8px 12px' }}
              />
            </div>

            <div className="glass-pill" style={{ padding: '4px', display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
              {(['ALL', 'GOVT_NATIONAL', 'MEANS_CUM_MERIT', 'PRIVATE_MERIT', 'WOMEN_IN_TECH', 'RESEARCH_GRANT'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: '5px 12px',
                    borderRadius: 'var(--radius-full)',
                    border: 'none',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    backgroundColor: selectedCategory === cat ? 'var(--accent-primary)' : 'transparent',
                    color: selectedCategory === cat ? '#ffffff' : 'var(--text-secondary)',
                  }}
                >
                  {cat === 'ALL' ? 'All Schemes' : cat.replace(/_/g, ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Scheme Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '20px' }}>
            {filteredScholarships.map((sch) => (
              <div
                key={sch.id}
                className="glass-panel glow-hover"
                style={{
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderTop: `3px solid ${sch.category === 'GOVT_NATIONAL' ? '#06b6d4' : sch.category === 'MEANS_CUM_MERIT' ? '#10b981' : '#a855f7'}`,
                }}
              >
                <div>
                  {/* Top category badge and star */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span className="badge" style={{ backgroundColor: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', fontSize: '0.7rem' }}>
                        {sch.category.replace(/_/g, ' ')}
                      </span>
                      {sch.verifiedByGovtOrTrust && (
                        <span style={{ fontSize: '0.7rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <ShieldCheck size={13} /> Verified
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleToggleBookmark(sch.id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: sch.isBookmarked ? '#fbbf24' : 'var(--text-muted)', padding: '4px' }}
                    >
                      <Bookmark size={16} fill={sch.isBookmarked ? '#fbbf24' : 'none'} />
                    </button>
                  </div>

                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, lineHeight: 1.4, marginBottom: '6px', color: '#ffffff' }}>
                    {sch.title}
                  </h3>

                  <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: '12px' }}>
                    Provider: <strong style={{ color: 'var(--text-primary)' }}>{sch.provider}</strong>
                  </div>

                  {/* Award Amount Pill */}
                  <div style={{ padding: '8px 14px', borderRadius: '8px', backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.25)', color: '#34d399', fontSize: '0.95rem', fontWeight: 800, marginBottom: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>💰 {sch.awardAmount}</span>
                    <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600 }}>{sch.totalRecipientsPerYear.toLocaleString()} Scholars</span>
                  </div>

                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '14px' }}>
                    {sch.description}
                  </p>

                  {/* Eligibility Criteria Box */}
                  <div style={{ padding: '10px 14px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', marginBottom: '14px', fontSize: '0.75rem' }}>
                    <div style={{ fontWeight: 700, color: '#fbbf24', marginBottom: '4px' }}>Eligibility Highlights:</div>
                    <div style={{ color: 'var(--text-secondary)' }}>&bull; Minimum CGPA: <strong>{sch.eligibilityCriteria.minCgpa}</strong></div>
                    {sch.eligibilityCriteria.maxAnnualFamilyIncomeInLakhs && (
                      <div style={{ color: 'var(--text-secondary)' }}>&bull; Family Income Cap: <strong>Below ₹{sch.eligibilityCriteria.maxAnnualFamilyIncomeInLakhs} Lakhs/yr</strong></div>
                    )}
                    <div style={{ color: 'var(--text-secondary)' }}>&bull; Target Years: <strong>AY {sch.eligibilityCriteria.academicYears.join(', ')}</strong></div>
                  </div>
                </div>

                {/* Card footer */}
                <div style={{ paddingTop: '14px', borderTop: '1px solid var(--border-glass)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: sch.daysRemaining <= 30 ? '#f87171' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} /> {sch.daysRemaining} days left
                  </div>

                  <a
                    href={sch.applyUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-primary"
                    style={{ padding: '6px 14px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}
                  >
                    Apply on Official Portal <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Eligibility Matchmaker */}
      {activeTab === 'ELIGIBILITY_MATCHMAKER' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 1fr) 2fr', gap: '24px', alignItems: 'start' }}>
          
          {/* Matchmaker Form */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#34d399' }}>
              <Calculator size={16} /> Student Financial Profile
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Current CGPA ({calcCgpa} / 10.0)</label>
                <input
                  type="range"
                  min="5.0"
                  max="10.0"
                  step="0.1"
                  value={calcCgpa}
                  onChange={(e) => setCalcCgpa(parseFloat(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Annual Family Income (₹{calcIncomeLakhs} Lakhs)</label>
                <input
                  type="range"
                  min="1.0"
                  max="20.0"
                  step="0.5"
                  value={calcIncomeLakhs}
                  onChange={(e) => setCalcIncomeLakhs(parseFloat(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--accent-emerald)' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Academic Year</label>
                  <select
                    value={calcYear}
                    onChange={(e) => setCalcYear(parseInt(e.target.value))}
                    className="input-field"
                    style={{ width: '100%', fontSize: '0.8rem', padding: '8px' }}
                  >
                    <option value={1}>1st Year</option>
                    <option value={2}>2nd Year</option>
                    <option value={3}>3rd Year</option>
                    <option value={4}>4th Year</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Gender Category</label>
                  <select
                    value={calcGender}
                    onChange={(e) => setCalcGender(e.target.value as any)}
                    className="input-field"
                    style={{ width: '100%', fontSize: '0.8rem', padding: '8px' }}
                  >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female (Eligible for WIT)</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Degree Program</label>
                <input
                  type="text"
                  value={calcDegree}
                  onChange={(e) => setCalcDegree(e.target.value)}
                  className="input-field"
                  style={{ width: '100%', fontSize: '0.8rem', padding: '8px 12px' }}
                />
              </div>

              <button
                onClick={runEligibilityCalculation}
                disabled={isCalculating}
                className="btn btn-primary"
                style={{ marginTop: '6px', padding: '10px', fontSize: '0.85rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px' }}
              >
                <Sparkles size={14} />
                {isCalculating ? 'Recalculating Aid...' : 'Calculate Eligible Aid & Schemes'}
              </button>
            </div>
          </div>

          {/* Results View */}
          {matchResult && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Financial Aid summary banner */}
              <div className="glass-panel" style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(6, 182, 212, 0.15) 100%)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>TOTAL CLAIMABLE FINANCIAL AID</div>
                    <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#34d399', margin: '4px 0' }}>
                      {matchResult.totalPotentialAidEstimate}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                      You meet all eligibility criteria for <strong>{matchResult.matchedCount} high-value scholarship programs</strong>.
                    </div>
                  </div>

                  <span className="badge badge-completed" style={{ fontSize: '0.85rem', padding: '8px 16px' }}>
                    100% Verified Eligibility
                  </span>
                </div>
              </div>

              {/* Matched Schemes List */}
              <div className="glass-panel" style={{ padding: '24px' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '14px', color: '#818cf8' }}>
                  Qualified Scholarship Programs ({matchResult.eligibleSchemes.length}):
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {matchResult.eligibleSchemes.map((sch) => (
                    <div key={sch.id} style={{ padding: '14px 18px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                      <div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{sch.title}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{sch.provider} &bull; Deadline: {sch.applicationDeadline}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#34d399' }}>{sch.awardAmount}</span>
                        <a
                          href={sch.applyUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-secondary"
                          style={{ padding: '4px 10px', fontSize: '0.75rem', textDecoration: 'none' }}
                        >
                          Apply <ExternalLink size={10} />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Next Steps */}
              <div className="glass-panel" style={{ padding: '20px', backgroundColor: 'rgba(245, 158, 11, 0.04)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fbbf24', marginBottom: '8px' }}>
                  📋 Priority Next Steps for Maximum Grant Success:
                </div>
                <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {matchResult.recommendedNextSteps.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Document Verification Checklist */}
      {activeTab === 'DOCUMENT_CHECKLIST' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Readiness Meter */}
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Document Verification Vault</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Required certificates for National Scholarship Portal (NSP), Reliance, and Corporate Trusts direct disbursement.
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: docReadinessPercent >= 80 ? 'var(--accent-emerald)' : '#fbbf24' }}>
                {docReadinessPercent}% Ready
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {verifiedDocCount} of {documentChecklist.length} Documents Certified
              </div>
            </div>
          </div>

          {/* Checklist Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
            {documentChecklist.map((doc) => (
              <div
                key={doc.id}
                className="glass-panel glow-hover"
                style={{
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderLeft: doc.isVerified ? '3px solid var(--accent-emerald)' : '3px solid #f59e0b',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <span className="badge" style={{ backgroundColor: 'rgba(255,255,255,0.06)', fontSize: '0.65rem' }}>
                      {doc.category.replace(/_/g, ' ')}
                    </span>
                    <button
                      onClick={() => handleToggleDocument(doc.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: doc.isVerified ? '#34d399' : '#fbbf24',
                      }}
                    >
                      <CheckCircle2 size={16} fill={doc.isVerified ? '#34d399' : 'none'} color={doc.isVerified ? '#0f172a' : '#fbbf24'} />
                      {doc.isVerified ? 'Verified' : 'Pending'}
                    </button>
                  </div>

                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, lineHeight: 1.4, marginBottom: '6px' }}>
                    {doc.documentName}
                  </h4>

                  {doc.notes && (
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4, margin: '0 0 10px 0' }}>
                      {doc.notes}
                    </p>
                  )}
                </div>

                <div style={{ paddingTop: '10px', borderTop: '1px solid var(--border-glass)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  Format: <strong>{doc.fileFormat}</strong>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
}
