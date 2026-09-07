import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  FileCode2,
  Play,
  Download,
  Sigma,
  Copy,
  Check,
  BookOpen
} from 'lucide-react';
import { LatexPaperProject, CompileLatexDto, FormatMathEquationDto, LatexDocumentTemplate } from '@studentlife/shared';

interface LatexThesisStudioViewProps {
  onAddXp?: (xp: number, reason: string) => void;
}

export const LatexThesisStudioView: React.FC<LatexThesisStudioViewProps> = ({ onAddXp }) => {
  const [project, setProject] = useState<LatexPaperProject | null>(null);
  const [sourceCode, setSourceCode] = useState<string>('');
  const [template, setTemplate] = useState<LatexDocumentTemplate>('IEEE_TRANSACTIONS');
  const [equationPrompt, setEquationPrompt] = useState<string>('');
  const [formattedEquation, setFormattedEquation] = useState<{ latexEquation: string; explanation: string } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isCompiling, setIsCompiling] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  useEffect(() => {
    fetchProject();
  }, []);

  const fetchProject = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/latex-studio/project');
      const data = await res.json();
      if (data.success && data.data) {
        setProject(data.data);
        setSourceCode(data.data.latexSourceCode);
        setTemplate(data.data.template);
      }
    } catch (err) {
      console.error('Failed to fetch LaTeX project', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompile = async () => {
    try {
      setIsCompiling(true);
      const dto: CompileLatexDto = {
        latexSourceCode: sourceCode,
        template
      };
      const res = await fetch('/api/latex-studio/compile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dto)
      });
      const data = await res.json();
      if (data.success && data.data) {
        setProject(data.data);
        onAddXp?.(25, 'Compiled LaTeX Academic Paper');
      }
    } catch (err) {
      console.error('Failed to compile LaTeX', err);
    } finally {
      setIsCompiling(false);
    }
  };

  const handleFormatEquation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!equationPrompt.trim()) return;
    try {
      const dto: FormatMathEquationDto = { naturalLanguageMathDescription: equationPrompt };
      const res = await fetch('/api/latex-studio/format-equation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dto)
      });
      const data = await res.json();
      if (data.success && data.data) {
        setFormattedEquation(data.data);
        onAddXp?.(10, 'Generated LaTeX Mathematical Formula');
      }
    } catch (err) {
      console.error('Failed to format equation', err);
    }
  };

  const handleInsertEquation = (latex: string) => {
    setSourceCode(prev => prev + `\n\\begin{equation}\n${latex}\n\\end{equation}\n`);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownloadSource = () => {
    if (!project) return;
    const blob = new Blob([sourceCode], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.title.replace(/\s+/g, '_')}.tex`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isLoading || !project) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
        <FileCode2 size={36} className="animate-pulse" style={{ margin: '0 auto 16px', color: 'var(--accent-primary)' }} />
        <p>Loading Overleaf-Style Interactive LaTeX Thesis Studio...</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Banner */}
      <div className="glass-panel" style={{
        padding: '24px 32px',
        background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.6) 0%, rgba(15, 23, 42, 0.9) 100%)',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '16px'
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="badge badge-active" style={{ backgroundColor: 'rgba(6, 182, 212, 0.2)', color: '#22d3ee' }}>
              <Sparkles size={12} /> PHASE 59 &bull; OVERLEAF-STYLE LATEX THESIS STUDIO
            </span>
            <span className="badge badge-completed">Dual-Pane Compiler</span>
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>
            LaTeX Academic Thesis Studio <span className="gradient-text">& Equation Formatter 📐</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            Dual-pane live editor for IEEE / ACM / Springer templates, natural language math formatter, and 1-click TeX export.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <select
            value={template}
            onChange={(e) => setTemplate(e.target.value as LatexDocumentTemplate)}
            className="glass-input"
            style={{ padding: '8px 12px', fontSize: '0.8rem' }}
          >
            <option value="IEEE_TRANSACTIONS">IEEE Transactions</option>
            <option value="ACM_SIGCONF">ACM Conference</option>
            <option value="SPRINGER_LNCS">Springer LNCS</option>
            <option value="NEURIPS_PAPER">NeurIPS Paper</option>
          </select>

          <button
            onClick={handleCompile}
            disabled={isCompiling}
            className="btn btn-primary"
            style={{ padding: '8px 16px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Play size={14} fill="currentColor" />
            {isCompiling ? 'Compiling PDF...' : 'Compile LaTeX'}
          </button>

          <button
            onClick={handleDownloadSource}
            className="btn btn-secondary"
            style={{ padding: '8px 14px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Download size={14} /> Export .TEX
          </button>
        </div>
      </div>

      {/* Math Natural Language Formatter Bar */}
      <div className="glass-panel" style={{ padding: '16px 20px' }}>
        <form onSubmit={handleFormatEquation} style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 700, color: '#22d3ee' }}>
            <Sigma size={16} /> AI Natural Language Math Formatter:
          </div>
          <input
            type="text"
            value={equationPrompt}
            onChange={(e) => setEquationPrompt(e.target.value)}
            placeholder="E.g., Navier-Stokes PDE, Schrödinger wave equation, Adam optimizer..."
            className="glass-input"
            style={{ flex: 1, minWidth: '240px', padding: '8px 12px', fontSize: '0.85rem' }}
          />
          <button type="submit" className="btn btn-primary" style={{ padding: '8px 14px', fontSize: '0.8rem' }}>
            Generate LaTeX Equation
          </button>
        </form>

        {formattedEquation && (
          <div style={{
            marginTop: '12px',
            padding: '12px 14px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'rgba(9, 13, 22, 0.8)',
            border: '1px solid var(--border-glass)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: '#fbbf24' }}>
                {formattedEquation.latexEquation}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                {formattedEquation.explanation}
              </div>
            </div>
            <button
              onClick={() => handleInsertEquation(formattedEquation.latexEquation)}
              className="btn btn-secondary"
              style={{ padding: '4px 10px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              {isCopied ? <Check size={12} color="#34d399" /> : <Copy size={12} />}
              {isCopied ? 'Inserted!' : 'Insert to Code'}
            </button>
          </div>
        )}
      </div>

      {/* Dual Pane Editor: Left TeX Source, Right Live Formatted Output */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Left: LaTeX Code Editor */}
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileCode2 size={16} color="var(--accent-primary)" />
              main.tex (Source Code)
            </h4>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              Word Count: {project.wordCount}
            </span>
          </div>

          <textarea
            value={sourceCode}
            onChange={(e) => setSourceCode(e.target.value)}
            className="glass-input"
            style={{
              width: '100%',
              height: '460px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              lineHeight: 1.5,
              padding: '12px',
              resize: 'vertical'
            }}
          />
        </div>

        {/* Right: Compiled Document Preview */}
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BookOpen size={16} color="#22d3ee" />
              Compiled PDF / Article Preview
            </h4>
            <span className="badge badge-completed" style={{ fontSize: '0.65rem' }}>
              Template: {template}
            </span>
          </div>

          <div
            style={{
              height: '460px',
              overflowY: 'auto',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-glass)'
            }}
            dangerouslySetInnerHTML={{ __html: project.compiledHtmlPreview }}
          />
        </div>
      </div>
    </div>
  );
};
