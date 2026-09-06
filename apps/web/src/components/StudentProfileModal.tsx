import React, { useState, useEffect } from 'react';
import {
  StudentProfile,
  UpdateStudentProfileDto,
  PREDEFINED_TARGET_EXAMS,
  PREDEFINED_SKILLS,
  PREDEFINED_CAREERS,
} from '@studentlife/shared';
import {
  X,
  Building2,
  GraduationCap,
  Target,
  Sparkles,
  BookMarked,
  Clock,
  Check,
  Plus,
} from 'lucide-react';

interface StudentProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile | null;
  onSave: (dto: UpdateStudentProfileDto) => Promise<void>;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSave,
}) => {
  const [collegeOrSchool, setCollegeOrSchool] = useState('');
  const [degreeOrGrade, setDegreeOrGrade] = useState('');
  const [academicYear, setAcademicYear] = useState<number>(1);
  const [selectedExams, setSelectedExams] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedCareers, setSelectedCareers] = useState<string[]>([]);
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState<number>(120);
  const [customSkillInput, setCustomSkillInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setCollegeOrSchool(profile.collegeOrSchool || '');
      setDegreeOrGrade(profile.degreeOrGrade || '');
      setAcademicYear(profile.academicYear || 1);
      setSelectedExams(profile.targetExams || []);
      setSelectedSkills(profile.skillTags || []);
      setSelectedCareers(profile.careerAspirations || []);
      setDailyGoalMinutes(profile.dailyStudyGoalMinutes || 120);
    }
  }, [profile, isOpen]);

  if (!isOpen) return null;

  const toggleItem = (list: string[], item: string, setter: (val: string[]) => void) => {
    if (list.includes(item)) {
      setter(list.filter((x) => x !== item));
    } else {
      setter([...list, item]);
    }
  };

  const handleAddCustomSkill = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && customSkillInput.trim()) {
      e.preventDefault();
      if (!selectedSkills.includes(customSkillInput.trim())) {
        setSelectedSkills([...selectedSkills, customSkillInput.trim()]);
      }
      setCustomSkillInput('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave({
        collegeOrSchool,
        degreeOrGrade,
        academicYear,
        targetExams: selectedExams,
        skillTags: selectedSkills,
        careerAspirations: selectedCareers,
        dailyStudyGoalMinutes: dailyGoalMinutes,
      });
      onClose();
    } catch {
      // Handled in caller
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 8, 15, 0.85)',
        backdropFilter: 'blur(12px)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
      onClick={onClose}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '620px',
          maxHeight: '90vh',
          backgroundColor: 'rgba(15, 23, 42, 0.95)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7), 0 0 40px rgba(99, 102, 241, 0.25)',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--border-glass)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.98)',
            zIndex: 10,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'var(--gradient-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <GraduationCap size={20} color="#ffffff" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Student Academic Profile</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Personalize targets, exams, skills & daily study commitments
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '8px',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Academic Institution & Program */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                <Building2 size={14} /> College / School
              </label>
              <input
                type="text"
                placeholder="e.g. IIT Delhi, Delhi University"
                value={collegeOrSchool}
                onChange={(e) => setCollegeOrSchool(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  backgroundColor: 'rgba(0, 0, 0, 0.25)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: '8px',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem',
                  outline: 'none',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                <GraduationCap size={14} /> Degree / Branch
              </label>
              <input
                type="text"
                placeholder="e.g. B.Tech Computer Science"
                value={degreeOrGrade}
                onChange={(e) => setDegreeOrGrade(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  backgroundColor: 'rgba(0, 0, 0, 0.25)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: '8px',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          {/* Academic Year Selection */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Academic Year
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
              {[1, 2, 3, 4].map((yr) => (
                <button
                  key={yr}
                  type="button"
                  onClick={() => setAcademicYear(yr)}
                  style={{
                    padding: '8px',
                    borderRadius: '8px',
                    border: academicYear === yr ? '1px solid var(--accent-primary)' : '1px solid var(--border-glass)',
                    backgroundColor: academicYear === yr ? 'rgba(99, 102, 241, 0.2)' : 'rgba(0, 0, 0, 0.2)',
                    color: academicYear === yr ? '#818cf8' : 'var(--text-secondary)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Year {yr} {yr === 4 ? '(Final)' : ''}
                </button>
              ))}
            </div>
          </div>

          {/* Target Exams Multi-select */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
              <Target size={14} color="var(--accent-rose)" /> Target Exams & Milestones
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {PREDEFINED_TARGET_EXAMS.map((exam) => {
                const isSelected = selectedExams.includes(exam);
                return (
                  <button
                    key={exam}
                    type="button"
                    onClick={() => toggleItem(selectedExams, exam, setSelectedExams)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 'var(--radius-full)',
                      border: isSelected ? '1px solid #f43f5e' : '1px solid var(--border-glass)',
                      backgroundColor: isSelected ? 'rgba(244, 63, 94, 0.2)' : 'rgba(0, 0, 0, 0.2)',
                      color: isSelected ? '#fda4af' : 'var(--text-secondary)',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    {isSelected && <Check size={12} />}
                    {exam}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Skill Tags */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
              <BookMarked size={14} color="var(--accent-primary)" /> Key Academic & Tech Skills
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
              {PREDEFINED_SKILLS.map((skill) => {
                const isSelected = selectedSkills.includes(skill);
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleItem(selectedSkills, skill, setSelectedSkills)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 'var(--radius-full)',
                      border: isSelected ? '1px solid var(--accent-primary)' : '1px solid var(--border-glass)',
                      backgroundColor: isSelected ? 'rgba(99, 102, 241, 0.2)' : 'rgba(0, 0, 0, 0.2)',
                      color: isSelected ? '#a5b4fc' : 'var(--text-secondary)',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    {isSelected && <Check size={12} />}
                    {skill}
                  </button>
                );
              })}
            </div>
            {/* Custom Skill Input */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                placeholder="Type custom skill and press Enter..."
                value={customSkillInput}
                onChange={(e) => setCustomSkillInput(e.target.value)}
                onKeyDown={handleAddCustomSkill}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  backgroundColor: 'rgba(0, 0, 0, 0.25)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: '6px',
                  color: 'var(--text-primary)',
                  fontSize: '0.8rem',
                  outline: 'none',
                }}
              />
              <button
                type="button"
                onClick={() => {
                  if (customSkillInput.trim() && !selectedSkills.includes(customSkillInput.trim())) {
                    setSelectedSkills([...selectedSkills, customSkillInput.trim()]);
                    setCustomSkillInput('');
                  }
                }}
                className="btn btn-secondary"
                style={{ padding: '8px 12px', fontSize: '0.75rem' }}
              >
                <Plus size={14} /> Add
              </button>
            </div>
          </div>

          {/* Dream Careers */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
              <Sparkles size={14} color="var(--accent-purple)" /> Career Aspirations
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {PREDEFINED_CAREERS.map((career) => {
                const isSelected = selectedCareers.includes(career);
                return (
                  <button
                    key={career}
                    type="button"
                    onClick={() => toggleItem(selectedCareers, career, setSelectedCareers)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 'var(--radius-full)',
                      border: isSelected ? '1px solid var(--accent-purple)' : '1px solid var(--border-glass)',
                      backgroundColor: isSelected ? 'rgba(168, 85, 247, 0.2)' : 'rgba(0, 0, 0, 0.2)',
                      color: isSelected ? '#d8b4fe' : 'var(--text-secondary)',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    {isSelected && <Check size={12} />}
                    {career}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Daily Study Goal Slider */}
          <div style={{ padding: '16px', borderRadius: '10px', backgroundColor: 'rgba(0, 0, 0, 0.25)', border: '1px solid var(--border-glass)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                <Clock size={16} color="var(--accent-secondary)" /> Daily Study Target
              </label>
              <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--accent-secondary)' }}>
                {Math.floor(dailyGoalMinutes / 60)} Hours {dailyGoalMinutes % 60 > 0 ? `${dailyGoalMinutes % 60} Mins` : ''} / Day
              </span>
            </div>
            <input
              type="range"
              min={30}
              max={480}
              step={30}
              value={dailyGoalMinutes}
              onChange={(e) => setDailyGoalMinutes(Number(e.target.value))}
              style={{
                width: '100%',
                accentColor: 'var(--accent-secondary)',
                cursor: 'pointer',
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              <span>30m (Light)</span>
              <span>2-3h (Recommended)</span>
              <span>8h (Intense)</span>
            </div>
          </div>

          {/* Submit Button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              style={{ padding: '10px 18px' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="btn btn-primary"
              style={{ padding: '10px 24px' }}
            >
              {isSaving ? 'Saving Changes...' : 'Save Student Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
