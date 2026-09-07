import { LatexPaperProject, CompileLatexDto, FormatMathEquationDto } from '@studentlife/shared';

export class LatexStudioService {
  private static project: LatexPaperProject = {
    id: 'latex-proj-01',
    title: 'Adaptive Quantization in Distributed Deep Learning Architectures',
    authorNames: ['Rohit Chaurasiya', 'Dr. S. Ramanujan', 'Dr. Alan Turing'],
    template: 'IEEE_TRANSACTIONS',
    abstractText: 'In this paper, we demonstrate that bounded sub-byte quantization coupled with rank-stabilized gradient scaling eliminates communication bottlenecks in federated multi-node training clusters.',
    latexSourceCode: `\\documentclass[conference]{IEEEtran}
\\usepackage{amsmath,amsfonts,amssymb}
\\usepackage{graphicx}

\\title{Adaptive Quantization in Distributed Deep Learning Architectures}
\\author{\\IEEEauthorblockN{Rohit Chaurasiya}
\\IEEEauthorblockA{Indian Institute of Technology\\\\Email: rohit@studentlife.os}}

\\begin{document}
\\maketitle

\\begin{abstract}
In this paper, we demonstrate that bounded sub-byte quantization coupled with rank-stabilized gradient scaling eliminates communication bottlenecks in federated multi-node training clusters.
\\end{abstract}

\\section{Introduction}
Modern distributed neural network architectures face severe inter-GPU bandwidth degradation during backward propagation. The gradient exchange tensor $\\nabla W_t$ scales with $\\mathcal{O}(d \\times k)$.

\\section{Mathematical Formulation}
Let $W \\in \\mathbb{R}^{m \\times n}$ be the frozen pre-trained weight matrix. The low-rank update is defined as:
\\begin{equation}
\\Delta W = \\frac{\\alpha}{r} \\cdot B \\cdot A, \\quad A \\in \\mathbb{R}^{r \\times k}, B \\in \\mathbb{R}^{d \\times r}
\\end{equation}
where $r \\ll \\min(d, k)$ is the bottleneck intrinsic rank. Under stochastic gradient descent, the gradient expectation satisfies:
\\begin{equation}
\\mathbb{E}[\\| \\nabla f(W_t) \\|^2] \\le \\frac{2(f(W_0) - f^*)}{\\eta T} + \\frac{\\eta L \\sigma^2}{2}
\\end{equation}

\\section{Empirical Evaluation}
Experimental results on an 8x NVIDIA H100 cluster show a 48.2\\% speedup in all-reduce synchronization with no loss in BLEU / HumanEval accuracy.

\\end{document}`,
    compiledHtmlPreview: `<div class="p-6 bg-white text-slate-900 font-serif leading-relaxed text-sm rounded shadow">
      <h1 class="text-xl font-bold text-center mb-1">Adaptive Quantization in Distributed Deep Learning Architectures</h1>
      <p class="text-xs text-center text-slate-600 mb-4">Rohit Chaurasiya (IIT) &bull; rohit@studentlife.os</p>
      <div class="border-t border-b border-slate-300 py-2 my-2 text-xs italic">
        <strong>Abstract</strong>—In this paper, we demonstrate that bounded sub-byte quantization coupled with rank-stabilized gradient scaling eliminates communication bottlenecks in federated multi-node training clusters.
      </div>
      <h2 class="text-sm font-bold mt-4 mb-1">I. INTRODUCTION</h2>
      <p class="text-xs text-justify">Modern distributed neural network architectures face severe inter-GPU bandwidth degradation during backward propagation. The gradient exchange tensor ∇W_t scales with O(d × k).</p>
      <h2 class="text-sm font-bold mt-4 mb-1">II. MATHEMATICAL FORMULATION</h2>
      <p class="text-xs">The low-rank matrix decomposition satisfies:</p>
      <div class="my-3 py-2 px-4 bg-slate-100 border text-center font-mono text-xs rounded">
        ΔW = (α / r) · B · A,  where A ∈ ℝ^(r×k), B ∈ ℝ^(d×r)
      </div>
    </div>`,
    wordCount: 184,
    lastCompiledAt: new Date().toISOString()
  };

  public static getProject(): LatexPaperProject {
    return this.project;
  }

  public static compileLatex(dto: CompileLatexDto): LatexPaperProject {
    if (dto.template) {
      this.project.template = dto.template;
    }
    this.project.latexSourceCode = dto.latexSourceCode;
    this.project.wordCount = dto.latexSourceCode.split(/\s+/).filter(Boolean).length;
    this.project.lastCompiledAt = new Date().toISOString();
    return this.project;
  }

  public static formatEquation(dto: FormatMathEquationDto): { latexEquation: string; explanation: string } {
    const desc = dto.naturalLanguageMathDescription.toLowerCase();
    if (desc.includes('schrodinger') || desc.includes('wave')) {
      return {
        latexEquation: `i\\hbar \\frac{\\partial}{\\partial t} \\Psi(\\mathbf{r}, t) = \\left[ -\\frac{\\hbar^2}{2m} \\nabla^2 + V(\\mathbf{r}, t) \\right] \\Psi(\\mathbf{r}, t)`,
        explanation: 'Time-dependent Schrödinger wave equation in 3D coordinate space with potential field V(r, t).'
      };
    } else if (desc.includes('navier') || desc.includes('fluid')) {
      return {
        latexEquation: `\\rho \\left( \\frac{\\partial \\mathbf{u}}{\\partial t} + \\mathbf{u} \\cdot \\nabla \\mathbf{u} \\right) = -\\nabla p + \\mu \\nabla^2 \\mathbf{u} + \\mathbf{f}`,
        explanation: 'Incompressible Navier-Stokes momentum conservation equation.'
      };
    } else if (desc.includes('gradient') || desc.includes('loss') || desc.includes('backprop')) {
      return {
        latexEquation: `\\theta_{t+1} = \\theta_t - \\eta \\cdot \\frac{1}{\\sqrt{\\hat{v}_t} + \\epsilon} \\hat{m}_t, \\quad \\hat{m}_t = \\frac{m_t}{1 - \\beta_1^t}`,
        explanation: 'Adam Optimizer parameter update formula with bias-corrected first and second moment estimates.'
      };
    } else {
      return {
        latexEquation: `f(x) = \\sum_{n=0}^{\\infty} \\frac{f^{(n)}(a)}{n!} (x - a)^n + R_n(x)`,
        explanation: 'Taylor series expansion of analytical function f(x) centered at x = a.'
      };
    }
  }
}
