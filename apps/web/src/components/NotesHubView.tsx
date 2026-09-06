import React, { useState, useEffect } from 'react';
import { NoteItem, ResourceDocumentItem } from '@studentlife/shared';
import { useAuth } from '../context/AuthContext';

const API_BASE = 'http://localhost:5000/api';

const DEFAULT_FALLBACK_NOTES: NoteItem[] = [
  {
    id: 'note-1',
    userId: 'demo-student-uuid-01',
    title: 'Dynamic Programming: 0/1 Knapsack & Subset Sum Blueprint',
    subjectName: 'Data Structures & Algorithms',
    subjectColor: '#6366f1',
    content: `# Dynamic Programming: 0/1 Knapsack Pattern

## 1. Problem Identification
Whenever we are given a set of items with weights and profits, and we need to find a subset that satisfies a weight constraint $W$ while maximizing total profit.

\`\`\`python
def knapsack(weights, values, W, n):
    dp = [[0 for _ in range(W + 1)] for _ in range(n + 1)]
    for i in range(1, n + 1):
        for w in range(1, W + 1):
            if weights[i-1] <= w:
                dp[i][w] = max(values[i-1] + dp[i-1][w - weights[i-1]], dp[i-1][w])
            else:
                dp[i][w] = dp[i-1][w]
    return dp[n][W]
\`\`\`

## 2. Key Variations
- **Subset Sum Problem**: Target sum match using boolean matrix.
- **Equal Sum Partition**: If total sum is odd -> False, else Target = Sum // 2.
- **Count of Subsets with Given Sum**: Replace max with addition (+).`,
    tags: ['#DSA', '#DP', '#Algorithms'],
    isBookmarked: true,
    isAiGenerated: false,
    wordCount: 120,
    readTimeMinutes: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'note-2',
    userId: 'demo-student-uuid-01',
    title: 'System Design: Cache-Aside vs Write-Through Patterns',
    subjectName: 'System Design',
    subjectColor: '#06b6d4',
    content: `# Distributed Caching Strategies

## Cache-Aside (Lazy Loading)
1. Application queries Cache first.
2. If **Cache Hit** -> return data immediately.
3. If **Cache Miss** -> read from Database, update Cache, return data.

> **Pros**: Resilient against cache failure.
> **Cons**: Cache misses result in 3 round trips.

---

## Write-Through Cache
Application writes data to Cache, and Cache synchronously writes to DB.

- **Pros**: Data consistency between DB and Cache is high.
- **Cons**: Write latency is higher because two storage layers are written synchronously.`,
    tags: ['#SystemDesign', '#Caching', '#Redis'],
    isBookmarked: false,
    isAiGenerated: false,
    wordCount: 95,
    readTimeMinutes: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const DEFAULT_FALLBACK_RESOURCES: ResourceDocumentItem[] = [
  {
    id: 'res-1',
    title: 'GATE CSE Master Formula & Concept Handbook',
    type: 'FORMULA_SHEET',
    subjectName: 'GATE Exam Prep',
    fileSize: '4.2 MB',
    pagesOrItems: 48,
    description: 'Comprehensive formula summaries for Discrete Math, Algorithms, COA, DBMS, and Networks.',
    tags: ['#GATE', '#Formulas', '#Revision'],
    isPinned: true,
  },
  {
    id: 'res-2',
    title: 'Distributed Systems & Microservices Architecture Blueprint',
    type: 'CHEATSHEET',
    subjectName: 'System Design',
    fileSize: '2.8 MB',
    pagesOrItems: 24,
    description: 'Visual diagrams for Sharding, CAP Theorem, Kafka pipelines, and Redis Cache invalidation.',
    tags: ['#SystemDesign', '#Architecture', '#InterviewPrep'],
    isPinned: true,
  },
  {
    id: 'res-3',
    title: 'Top 75 Essential LeetCode Patterns & Templates',
    type: 'CODE_SNIPPET',
    subjectName: 'Data Structures & Algorithms',
    fileSize: '1.5 MB',
    pagesOrItems: 75,
    description: 'Boilerplate templates for Two Pointers, Monotonic Stacks, DP State Machines, and Trie trees.',
    tags: ['#DSA', '#LeetCode', '#CodingInterview'],
    isPinned: false,
  },
];

interface NotesHubViewProps {
  onTriggerAiStudy?: (noteContent: string) => void;
}

export const NotesHubView: React.FC<NotesHubViewProps> = ({ onTriggerAiStudy }) => {
  const { tokens } = useAuth();
  const [activeTab, setActiveTab] = useState<'MY_NOTES' | 'RESOURCE_HUB'>('MY_NOTES');
  const [notes, setNotes] = useState<NoteItem[]>(DEFAULT_FALLBACK_NOTES);
  const [resources, setResources] = useState<ResourceDocumentItem[]>(DEFAULT_FALLBACK_RESOURCES);
  const [selectedNoteId, setSelectedNoteId] = useState<string>(DEFAULT_FALLBACK_NOTES[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('ALL');
  const [isEditing, setIsEditing] = useState(false);
  const [editorTitle, setEditorTitle] = useState('');
  const [editorContent, setEditorContent] = useState('');
  const [editorSubject, setEditorSubject] = useState('');
  const [editorTags, setEditorTags] = useState('');
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  const fetchNotes = async () => {
    try {
      const res = await fetch(`${API_BASE}/notes`, {
        headers: {
          Authorization: `Bearer ${tokens?.accessToken || ''}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) {
          setNotes(data.data);
          if (data.data.length > 0 && !selectedNoteId) {
            setSelectedNoteId(data.data[0].id);
          }
        }
      }
    } catch {
      // Offline fallback
    }
  };

  const fetchResources = async () => {
    try {
      const res = await fetch(`${API_BASE}/notes/resources`, {
        headers: {
          Authorization: `Bearer ${tokens?.accessToken || ''}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) {
          setResources(data.data);
        }
      }
    } catch {
      // Offline fallback
    }
  };

  useEffect(() => {
    fetchNotes();
    fetchResources();
  }, [tokens]);

  const selectedNote = notes.find((n) => n.id === selectedNoteId) || notes[0];

  useEffect(() => {
    if (selectedNote && !isCreatingNew) {
      setEditorTitle(selectedNote.title);
      setEditorContent(selectedNote.content);
      setEditorSubject(selectedNote.subjectName);
      setEditorTags(selectedNote.tags.join(', '));
    }
  }, [selectedNoteId, notes, isCreatingNew]);

  // Extract all unique tags
  const allTags = Array.from(new Set(notes.flatMap((n) => n.tags)));

  const filteredNotes = notes.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.subjectName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag === 'ALL' || n.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const handleCreateNew = () => {
    setIsCreatingNew(true);
    setIsEditing(true);
    setEditorTitle('');
    setEditorContent('');
    setEditorSubject('Data Structures & Algorithms');
    setEditorTags('#DSA, #StudyNote');
  };

  const handleSaveNote = async () => {
    if (!editorTitle.trim() || !editorContent.trim()) {
      alert('Please fill out both the title and content.');
      return;
    }

    const tagsArray = editorTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
      .map((t) => (t.startsWith('#') ? t : `#${t}`));

    if (isCreatingNew) {
      const newNoteDto = {
        title: editorTitle,
        content: editorContent,
        subjectName: editorSubject || 'General',
        subjectColor: '#6366f1',
        tags: tagsArray.length > 0 ? tagsArray : ['#StudyNote'],
        isBookmarked: false,
      };

      try {
        const res = await fetch(`${API_BASE}/notes`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${tokens?.accessToken || ''}`,
          },
          body: JSON.stringify(newNoteDto),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.data) {
            setNotes([data.data, ...notes]);
            setSelectedNoteId(data.data.id);
          }
        } else {
          // Local fallback
          const localNote: NoteItem = {
            id: `note-${Date.now()}`,
            userId: 'demo-student-uuid-01',
            ...newNoteDto,
            isAiGenerated: false,
            wordCount: editorContent.split(/\s+/).length,
            readTimeMinutes: Math.ceil(editorContent.split(/\s+/).length / 150),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          setNotes([localNote, ...notes]);
          setSelectedNoteId(localNote.id);
        }
      } catch {
        const localNote: NoteItem = {
          id: `note-${Date.now()}`,
          userId: 'demo-student-uuid-01',
          ...newNoteDto,
          isAiGenerated: false,
          wordCount: editorContent.split(/\s+/).length,
          readTimeMinutes: Math.ceil(editorContent.split(/\s+/).length / 150),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setNotes([localNote, ...notes]);
        setSelectedNoteId(localNote.id);
      }
    } else if (selectedNote) {
      const updateDto = {
        title: editorTitle,
        content: editorContent,
        subjectName: editorSubject,
        tags: tagsArray,
      };

      try {
        const res = await fetch(`${API_BASE}/notes/${selectedNote.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${tokens?.accessToken || ''}`,
          },
          body: JSON.stringify(updateDto),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.data) {
            setNotes(notes.map((n) => (n.id === selectedNote.id ? data.data : n)));
          }
        } else {
          setNotes(
            notes.map((n) =>
              n.id === selectedNote.id
                ? {
                    ...n,
                    ...updateDto,
                    wordCount: editorContent.split(/\s+/).length,
                    readTimeMinutes: Math.ceil(editorContent.split(/\s+/).length / 150),
                    updatedAt: new Date().toISOString(),
                  }
                : n
            )
          );
        }
      } catch {
        setNotes(
          notes.map((n) =>
            n.id === selectedNote.id
              ? {
                  ...n,
                  ...updateDto,
                  wordCount: editorContent.split(/\s+/).length,
                  readTimeMinutes: Math.ceil(editorContent.split(/\s+/).length / 150),
                  updatedAt: new Date().toISOString(),
                }
              : n
          )
        );
      }
    }

    setIsEditing(false);
    setIsCreatingNew(false);
  };

  const handleToggleBookmark = async (noteId: string) => {
    try {
      const res = await fetch(`${API_BASE}/notes/${noteId}/bookmark`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${tokens?.accessToken || ''}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.data) {
          setNotes(notes.map((n) => (n.id === noteId ? data.data : n)));
          return;
        }
      }
    } catch {
      // local fallback
    }

    setNotes(
      notes.map((n) => (n.id === noteId ? { ...n, isBookmarked: !n.isBookmarked } : n))
    );
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!window.confirm('Are you sure you want to delete this study note?')) return;

    try {
      await fetch(`${API_BASE}/notes/${noteId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${tokens?.accessToken || ''}`,
        },
      });
    } catch {
      // local fallback
    }

    const updated = notes.filter((n) => n.id !== noteId);
    setNotes(updated);
    if (selectedNoteId === noteId && updated.length > 0) {
      setSelectedNoteId(updated[0].id);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
      {/* Header bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '1.8rem',
              fontWeight: 800,
              background: 'linear-gradient(135deg, #a78bfa, #818cf8, #38bdf8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              margin: 0,
            }}
          >
            📚 Notes & Resources Knowledge Hub
          </h1>
          <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0', fontSize: '0.9rem' }}>
            Markdown knowledge base, quick formula cheatsheets, and AI summary integration
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <div
            style={{
              display: 'flex',
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '12px',
              padding: '4px',
              border: '1px solid var(--border-color)',
            }}
          >
            <button
              onClick={() => setActiveTab('MY_NOTES')}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                background:
                  activeTab === 'MY_NOTES'
                    ? 'linear-gradient(135deg, #6366f1, #4f46e5)'
                    : 'transparent',
                color: activeTab === 'MY_NOTES' ? '#fff' : 'var(--text-secondary)',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              📝 My Study Notes ({notes.length})
            </button>
            <button
              onClick={() => setActiveTab('RESOURCE_HUB')}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                background:
                  activeTab === 'RESOURCE_HUB'
                    ? 'linear-gradient(135deg, #06b6d4, #0284c7)'
                    : 'transparent',
                color: activeTab === 'RESOURCE_HUB' ? '#fff' : 'var(--text-secondary)',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              📂 Resource Library ({resources.length})
            </button>
          </div>

          {activeTab === 'MY_NOTES' && (
            <button
              onClick={handleCreateNew}
              style={{
                padding: '8px 18px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: '#fff',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.88rem',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span>+</span> New Note
            </button>
          )}
        </div>
      </div>

      {/* Main Container */}
      {activeTab === 'MY_NOTES' ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '320px 1fr',
            gap: '20px',
            minHeight: '620px',
          }}
        >
          {/* Left Sidebar: Notes list & filter */}
          <div
            style={{
              background: 'var(--card-bg)',
              border: '1px solid var(--border-color)',
              borderRadius: '16px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}
          >
            {/* Search */}
            <input
              type="text"
              placeholder="🔍 Search notes or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '10px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid var(--border-color)',
                color: '#fff',
                fontSize: '0.88rem',
                outline: 'none',
              }}
            />

            {/* Tag Filter Pills */}
            <div
              style={{
                display: 'flex',
                gap: '6px',
                overflowX: 'auto',
                paddingBottom: '4px',
              }}
            >
              <button
                onClick={() => setSelectedTag('ALL')}
                style={{
                  padding: '4px 10px',
                  borderRadius: '12px',
                  border: 'none',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  background:
                    selectedTag === 'ALL'
                      ? 'linear-gradient(135deg, #6366f1, #4f46e5)'
                      : 'rgba(255,255,255,0.06)',
                  color: selectedTag === 'ALL' ? '#fff' : 'var(--text-secondary)',
                }}
              >
                All
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '12px',
                    border: 'none',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    background:
                      selectedTag === tag
                        ? 'linear-gradient(135deg, #6366f1, #4f46e5)'
                        : 'rgba(255,255,255,0.06)',
                    color: selectedTag === tag ? '#fff' : 'var(--text-secondary)',
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Notes List */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                overflowY: 'auto',
                maxHeight: '520px',
                paddingRight: '4px',
              }}
            >
              {filteredNotes.length === 0 ? (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '30px 10px',
                    color: 'var(--text-secondary)',
                    fontSize: '0.85rem',
                  }}
                >
                  No notes found matching query.
                </div>
              ) : (
                filteredNotes.map((note) => {
                  const isSelected = selectedNote?.id === note.id && !isCreatingNew;
                  return (
                    <div
                      key={note.id}
                      onClick={() => {
                        setSelectedNoteId(note.id);
                        setIsCreatingNew(false);
                        setIsEditing(false);
                      }}
                      style={{
                        padding: '12px 14px',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        background: isSelected
                          ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(129, 140, 248, 0.08))'
                          : 'rgba(255,255,255,0.02)',
                        border: isSelected
                          ? '1px solid rgba(99, 102, 241, 0.4)'
                          : '1px solid rgba(255,255,255,0.05)',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                        }}
                      >
                        <span
                          style={{
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            color: note.subjectColor || '#818cf8',
                            letterSpacing: '0.5px',
                          }}
                        >
                          {note.subjectName}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleBookmark(note.id);
                          }}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            color: note.isBookmarked ? '#fbbf24' : 'rgba(255,255,255,0.2)',
                            fontSize: '0.9rem',
                            padding: 0,
                          }}
                        >
                          {note.isBookmarked ? '★' : '☆'}
                        </button>
                      </div>

                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: '0.9rem',
                          color: isSelected ? '#fff' : 'var(--text-primary)',
                          lineHeight: '1.3',
                        }}
                      >
                        {note.title}
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          fontSize: '0.75rem',
                          color: 'var(--text-secondary)',
                        }}
                      >
                        <span>⏱️ {note.readTimeMinutes} min read</span>
                        <span>•</span>
                        <span>{note.wordCount} words</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Editor / Reader Pane */}
          <div
            style={{
              background: 'var(--card-bg)',
              border: '1px solid var(--border-color)',
              borderRadius: '16px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            {isEditing || isCreatingNew ? (
              /* Edit / Create Mode */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', height: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, fontSize: '1.1rem', color: '#818cf8' }}>
                    {isCreatingNew ? '✨ Create New Study Note' : '✏️ Editing Note'}
                  </span>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setIsCreatingNew(false);
                      }}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '8px',
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid var(--border-color)',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                        fontWeight: 600,
                        fontSize: '0.85rem',
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveNote}
                      style={{
                        padding: '6px 16px',
                        borderRadius: '8px',
                        background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                        border: 'none',
                        color: '#fff',
                        cursor: 'pointer',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                      }}
                    >
                      💾 Save Note
                    </button>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                      Note Title
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Dynamic Programming Memoization Blueprint"
                      value={editorTitle}
                      onChange={(e) => setEditorTitle(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid var(--border-color)',
                        color: '#fff',
                        fontSize: '0.92rem',
                        fontWeight: 600,
                        outline: 'none',
                        marginTop: '4px',
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                      Subject
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Data Structures & Algorithms"
                      value={editorSubject}
                      onChange={(e) => setEditorSubject(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid var(--border-color)',
                        color: '#fff',
                        fontSize: '0.92rem',
                        outline: 'none',
                        marginTop: '4px',
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="#DSA, #DP, #Revision"
                    value={editorTags}
                    onChange={(e) => setEditorTags(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 14px',
                      borderRadius: '8px',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid var(--border-color)',
                      color: '#fff',
                      fontSize: '0.85rem',
                      outline: 'none',
                      marginTop: '4px',
                    }}
                  />
                </div>

                {/* Content Area */}
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                    Markdown Content
                  </label>
                  <textarea
                    placeholder="Write in Markdown (# Heading, - List, ```code```, > Quotes)..."
                    value={editorContent}
                    onChange={(e) => setEditorContent(e.target.value)}
                    rows={16}
                    style={{
                      width: '100%',
                      flex: 1,
                      padding: '14px',
                      borderRadius: '8px',
                      background: 'rgba(0,0,0,0.25)',
                      border: '1px solid var(--border-color)',
                      color: '#f8fafc',
                      fontSize: '0.9rem',
                      fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                      lineHeight: '1.6',
                      outline: 'none',
                      resize: 'vertical',
                      marginTop: '4px',
                    }}
                  />
                </div>
              </div>
            ) : selectedNote ? (
              /* Reader Mode */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Note Header & Action Buttons */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    borderBottom: '1px solid var(--border-color)',
                    paddingBottom: '14px',
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span
                        style={{
                          padding: '3px 10px',
                          borderRadius: '8px',
                          background: 'rgba(99, 102, 241, 0.15)',
                          color: '#818cf8',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                        }}
                      >
                        {selectedNote.subjectName}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        Updated {new Date(selectedNote.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '4px 0 0 0', color: '#fff' }}>
                      {selectedNote.title}
                    </h2>
                    <div style={{ display: 'flex', gap: '6px', marginTop: '2px' }}>
                      {selectedNote.tags.map((tag) => (
                        <span
                          key={tag}
                          style={{
                            fontSize: '0.75rem',
                            color: '#06b6d4',
                            background: 'rgba(6, 182, 212, 0.1)',
                            padding: '2px 8px',
                            borderRadius: '6px',
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => onTriggerAiStudy && onTriggerAiStudy(selectedNote.content)}
                      style={{
                        padding: '8px 14px',
                        borderRadius: '8px',
                        background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                        border: 'none',
                        color: '#fff',
                        cursor: 'pointer',
                        fontWeight: 700,
                        fontSize: '0.82rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      ✨ AI Explain & Flashcards
                    </button>
                    <button
                      onClick={() => setIsEditing(true)}
                      style={{
                        padding: '8px 14px',
                        borderRadius: '8px',
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid var(--border-color)',
                        color: '#fff',
                        cursor: 'pointer',
                        fontWeight: 600,
                        fontSize: '0.82rem',
                      }}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDeleteNote(selectedNote.id)}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '8px',
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        color: '#f87171',
                        cursor: 'pointer',
                        fontSize: '0.82rem',
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                {/* Rendered Content */}
                <div
                  style={{
                    background: 'rgba(0,0,0,0.2)',
                    borderRadius: '12px',
                    padding: '20px',
                    lineHeight: '1.7',
                    fontSize: '0.94rem',
                    color: '#e2e8f0',
                    whiteSpace: 'pre-wrap',
                    fontFamily: 'Inter, system-ui, sans-serif',
                  }}
                >
                  {selectedNote.content}
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-secondary)' }}>
                Select a note from the left to view its details or create a new one.
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Resource Library Tab */
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '20px',
          }}
        >
          {resources.map((res) => (
            <div
              key={res.id}
              style={{
                background: 'var(--card-bg)',
                border: '1px solid var(--border-color)',
                borderRadius: '16px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                position: 'relative',
                transition: 'all 0.25s ease',
              }}
            >
              {res.isPinned && (
                <span
                  style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    background: 'rgba(245, 158, 11, 0.15)',
                    color: '#fbbf24',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                  }}
                >
                  📌 ESSENTIAL
                </span>
              )}

              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#06b6d4',
                  textTransform: 'uppercase',
                }}
              >
                {res.type.replace('_', ' ')} • {res.subjectName}
              </span>

              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: '#fff', lineHeight: 1.4 }}>
                {res.title}
              </h3>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                {res.description}
              </p>

              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {res.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontSize: '0.72rem',
                      background: 'rgba(255,255,255,0.05)',
                      padding: '2px 8px',
                      borderRadius: '6px',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: 'auto',
                  paddingTop: '12px',
                  borderTop: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  📦 {res.fileSize} ({res.pagesOrItems} pages)
                </span>
                <button
                  onClick={() => alert(`Opening resource: ${res.title}`)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #06b6d4, #0284c7)',
                    border: 'none',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                  }}
                >
                  📖 View Document
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
