import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Sparkles,
  Star,
  Plus,
  Lock,
  Unlock,
  X
} from 'lucide-react';
import {
  TopperNoteResource,
  UploadResourceDto
} from '@studentlife/shared';

interface NotesMarketplaceViewProps {
  onAddXp?: (xp: number, reason: string) => void;
}

export const NotesMarketplaceView: React.FC<NotesMarketplaceViewProps> = ({ onAddXp }) => {
  const [resources, setResources] = useState<TopperNoteResource[]>([]);
  const [selectedExam, setSelectedExam] = useState<string>('ALL');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activePreviewResource, setActivePreviewResource] = useState<TopperNoteResource | null>(null);
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    exam: 'JEE Advanced',
    subject: '',
    topperRankBadge: '',
    content: '',
    unlockCostCoins: 25
  });

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/notes-marketplace/resources');
      const data = await res.json();
      if (data.success && data.data) {
        setResources(data.data);
      }
    } catch (err) {
      console.error('Failed to load marketplace resources', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnlockResource = async (resourceId: string) => {
    try {
      const res = await fetch('/api/notes-marketplace/unlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resourceId })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setResources(prev =>
          prev.map(r => (r.id === resourceId ? data.data : r))
        );
        setActivePreviewResource(data.data);
        onAddXp?.(30, 'Unlocked Topper Notes Resource');
      }
    } catch (err) {
      console.error('Failed to unlock resource', err);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dto: UploadResourceDto = {
        title: uploadForm.title,
        exam: uploadForm.exam,
        subject: uploadForm.subject,
        topperRankBadge: uploadForm.topperRankBadge || 'Verified Contributor ⭐',
        content: uploadForm.content,
        unlockCostCoins: uploadForm.unlockCostCoins
      };

      const res = await fetch('/api/notes-marketplace/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dto)
      });
      const data = await res.json();
      if (data.success && data.data) {
        setResources(prev => [data.data, ...prev]);
        setShowUploadModal(false);
        setUploadForm({ title: '', exam: 'JEE Advanced', subject: '', topperRankBadge: '', content: '', unlockCostCoins: 25 });
        onAddXp?.(50, 'Contributed Notes to Student Marketplace');
      }
    } catch (err) {
      console.error('Failed to upload notes', err);
    }
  };

  const filteredResources = selectedExam === 'ALL'
    ? resources
    : resources.filter(r => r.exam.toLowerCase().includes(selectedExam.toLowerCase()));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 text-sm font-medium">Opening Topper Notes & Resource Marketplace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-600 via-orange-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white tracking-tight">Topper Notes & Resource Marketplace</h1>
              <span className="px-2.5 py-0.5 text-xs font-semibold bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-500/30 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> P2P Knowledge Vault
              </span>
            </div>
            <p className="text-sm text-slate-400">
              Access handwritten formula cheatbooks, verified AIR toppers' summaries, and earn coins by sharing study notes.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-orange-500/25"
          >
            <Plus className="w-4 h-4" />
            Upload & Earn Coins
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {['ALL', 'JEE', 'UPSC', 'GATE', 'NEET'].map(exam => (
          <button
            key={exam}
            onClick={() => setSelectedExam(exam)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
              selectedExam === exam
                ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-md'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {exam === 'ALL' ? 'All Exam Notes' : `${exam} Verified`}
          </button>
        ))}
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map(res => (
          <div
            key={res.id}
            className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 hover:border-slate-700 transition-all flex flex-col justify-between shadow-xl"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-amber-300 font-bold text-[10px]">
                  {res.exam}
                </span>
                <span className="flex items-center gap-1 text-xs text-amber-400 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" /> {res.rating}
                </span>
              </div>

              <h3 className="font-bold text-white text-base leading-snug line-clamp-2">
                {res.title}
              </h3>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Author: {res.author}</span>
                  <span className="text-indigo-300 font-bold text-[11px]">{res.topperRankBadge}</span>
                </div>
                <div className="text-[11px] text-slate-500 flex items-center gap-3 pt-1">
                  <span>{res.pageCount} Pages</span>
                  <span>•</span>
                  <span>{res.downloadCount} Downloads</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {res.tags.map((tag, i) => (
                  <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-950 text-slate-400 border border-slate-800">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <button
                onClick={() => setActivePreviewResource(res)}
                className="text-xs text-cyan-400 hover:underline font-medium"
              >
                Preview Notes
              </button>

              {res.isUnlocked ? (
                <button
                  onClick={() => setActivePreviewResource(res)}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <Unlock className="w-3.5 h-3.5" /> Read Unlocked
                </button>
              ) : (
                <button
                  onClick={() => handleUnlockResource(res.id)}
                  className="px-4 py-1.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md"
                >
                  <Lock className="w-3.5 h-3.5" /> Unlock ({res.unlockCostCoins} 🪙)
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      {activePreviewResource && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs text-amber-400 font-bold">{activePreviewResource.topperRankBadge}</span>
                <h3 className="text-lg font-bold text-white">{activePreviewResource.title}</h3>
              </div>
              <button onClick={() => setActivePreviewResource(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1 text-xs text-slate-200 leading-relaxed font-sans">
              {activePreviewResource.previewParagraphs.map((p, idx) => (
                <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  {p}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <span className="text-xs text-slate-400 font-mono">{activePreviewResource.pageCount} Pages • {activePreviewResource.subject}</span>
              <button
                onClick={() => setActivePreviewResource(null)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold"
              >
                Close Reader
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-amber-400" />
              Upload Handwritten / Digital Notes
            </h3>
            <form onSubmit={handleUploadSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-semibold block mb-1">Notes Title</label>
                <input
                  type="text"
                  required
                  value={uploadForm.title}
                  onChange={e => setUploadForm({ ...uploadForm, title: e.target.value })}
                  placeholder="e.g. Modern Physics Formula Matrix & Shortcuts"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Exam</label>
                  <select
                    value={uploadForm.exam}
                    onChange={e => setUploadForm({ ...uploadForm, exam: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value="JEE Advanced">JEE Advanced</option>
                    <option value="UPSC Civil Services">UPSC Civil Services</option>
                    <option value="GATE CS">GATE CS</option>
                    <option value="NEET UG">NEET UG</option>
                    <option value="CBSE 12th">CBSE 12th</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    value={uploadForm.subject}
                    onChange={e => setUploadForm({ ...uploadForm, subject: e.target.value })}
                    placeholder="e.g. Physics / Polity"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
              <div>
                <label className="text-slate-400 font-semibold block mb-1">Notes Content (Markdown/Text)</label>
                <textarea
                  rows={4}
                  required
                  value={uploadForm.content}
                  onChange={e => setUploadForm({ ...uploadForm, content: e.target.value })}
                  placeholder="Paste your high-yield summary points or formula explanations..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl text-xs font-bold shadow-md"
                >
                  Publish & Earn +50 XP
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default NotesMarketplaceView;
