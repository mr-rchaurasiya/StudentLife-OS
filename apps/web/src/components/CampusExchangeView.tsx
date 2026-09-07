import React, { useState, useEffect } from 'react';
import {
  Package,
  Sparkles,
  MapPin,
  CheckCircle2,
  Plus,
  Search,
  MessageSquare
} from 'lucide-react';
import {
  CampusItem,
  CampusItemType,
  CampusItemCategory,
  CreateCampusItemDto
} from '@studentlife/shared';

interface CampusExchangeViewProps {
  onAddXp?: (xp: number, reason: string) => void;
}

export const CampusExchangeView: React.FC<CampusExchangeViewProps> = ({ onAddXp }) => {
  const [items, setItems] = useState<CampusItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedType, setSelectedType] = useState<CampusItemType | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showReportModal, setShowReportModal] = useState<boolean>(false);

  // Form State
  const [reportType, setReportType] = useState<CampusItemType>('LOST');
  const [reportCategory, setReportCategory] = useState<CampusItemCategory>('CALCULATOR');
  const [reportTitle, setReportTitle] = useState<string>('');
  const [reportLocation, setReportLocation] = useState<string>('');
  const [reportDescription, setReportDescription] = useState<string>('');
  const [reportContact, setReportContact] = useState<string>('@student');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/campus-exchange/items');
      const data = await res.json();
      if (data.success && data.data) {
        setItems(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch campus items', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReportItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dto: CreateCampusItemDto = {
        type: reportType,
        category: reportCategory,
        title: reportTitle,
        locationDetails: reportLocation,
        description: reportDescription,
        contactHandle: reportContact
      };
      const res = await fetch('/api/campus-exchange/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dto)
      });
      const data = await res.json();
      if (data.success && data.data) {
        setItems(prev => [data.data, ...prev]);
        setShowReportModal(false);
        setReportTitle('');
        setReportLocation('');
        setReportDescription('');
        onAddXp?.(25, 'Posted to Campus Exchange Hub');
      }
    } catch (err) {
      console.error('Failed to report item', err);
    }
  };

  const handleClaim = async (id: string) => {
    try {
      const res = await fetch(`/api/campus-exchange/claim/${id}`, { method: 'POST' });
      const data = await res.json();
      if (data.success && data.data) {
        setItems(prev => prev.map(i => i.id === id ? data.data : i));
        onAddXp?.(15, 'Resolved Campus Item Exchange');
      }
    } catch (err) {
      console.error('Failed to claim item', err);
    }
  };

  const filteredItems = items.filter(item => {
    const matchesType = selectedType === 'ALL' || item.type === selectedType;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.locationDetails.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const getTypeBadge = (type: CampusItemType) => {
    switch (type) {
      case 'LOST':
        return { label: 'LOST ITEM 🔍', bg: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5' };
      case 'FOUND':
        return { label: 'FOUND ITEM 🎁', bg: 'rgba(16, 185, 129, 0.2)', color: '#86efac' };
      default:
        return { label: 'BORROW / RENT 🤝', bg: 'rgba(56, 189, 248, 0.2)', color: '#7dd3fc' };
    }
  };

  if (isLoading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
        <Package size={36} className="animate-pulse" style={{ margin: '0 auto 16px', color: 'var(--accent-primary)' }} />
        <p>Loading Campus Lost & Found & Equipment Exchange...</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Banner */}
      <div className="glass-panel" style={{
        padding: '24px 32px',
        background: 'linear-gradient(135deg, rgba(20, 83, 45, 0.6) 0%, rgba(15, 23, 42, 0.9) 100%)',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '16px'
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="badge badge-active" style={{ backgroundColor: 'rgba(34, 197, 94, 0.2)', color: '#4ade80' }}>
              <Sparkles size={12} /> PHASE 53 &bull; CAMPUS RESOURCE BAZAAR
            </span>
            <span className="badge badge-completed">Verified Student Registry</span>
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>
            Smart Campus Lost & Found <span className="gradient-text">& Equipment Exchange 🎒</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            Report lost items, claim found IDs & scientific calculators, and borrow lab drafters & robotics kits from verified peers.
          </p>
        </div>

        <button
          onClick={() => setShowReportModal(true)}
          className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}
        >
          <Plus size={14} /> Report / Share Item
        </button>
      </div>

      {/* Filter Strip */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {(['ALL', 'LOST', 'FOUND', 'FOR_BORROW_RENT'] as const).map(type => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.75rem',
                fontWeight: 700,
                border: selectedType === type ? '1px solid var(--accent-primary)' : '1px solid var(--border-glass)',
                backgroundColor: selectedType === type ? 'var(--accent-primary)' : 'rgba(15, 23, 42, 0.6)',
                color: selectedType === type ? '#ffffff' : 'var(--text-secondary)',
                cursor: 'pointer'
              }}
            >
              {type.replace(/_/g, ' ')}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', width: '260px' }}>
          <Search size={14} style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-muted)' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search items or location..."
            className="glass-input"
            style={{ width: '100%', padding: '8px 12px 8px 32px', fontSize: '0.85rem' }}
          />
        </div>
      </div>

      {/* Items Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
        {filteredItems.map(item => {
          const badge = getTypeBadge(item.type);
          const isResolved = item.status === 'RESOLVED' || item.status === 'CLAIMED';
          return (
            <div
              key={item.id}
              className="glass-panel glow-hover"
              style={{
                padding: '20px',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '14px',
                opacity: isResolved ? 0.65 : 1
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    padding: '3px 8px',
                    borderRadius: '4px',
                    backgroundColor: badge.bg,
                    color: badge.color
                  }}>
                    {badge.label}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    {item.dateReported}
                  </span>
                </div>

                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '6px' }}>
                  {item.title}
                </h4>

                <div style={{ fontSize: '0.75rem', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
                  <MapPin size={12} /> {item.locationDetails}
                </div>

                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4, margin: 0 }}>
                  {item.description}
                </p>
              </div>

              <div style={{ paddingTop: '12px', borderTop: '1px solid var(--border-glass)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MessageSquare size={12} /> {item.contactHandle}
                </div>

                {!isResolved ? (
                  <button
                    onClick={() => handleClaim(item.id)}
                    className="btn btn-secondary"
                    style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                  >
                    Mark {item.type === 'FOR_BORROW_RENT' ? 'Borrowed' : 'Resolved'}
                  </button>
                ) : (
                  <span style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle2 size={12} /> {item.status}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Report Item Modal */}
      {showReportModal && (
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
          <div className="glass-panel" style={{ width: '100%', maxWidth: '480px', padding: '28px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '16px' }}>
              Report Lost / Found / Share Equipment 🎒
            </h3>

            <form onSubmit={handleReportItem} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                    Type
                  </label>
                  <select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value as any)}
                    className="glass-input"
                    style={{ width: '100%', padding: '8px 10px', fontSize: '0.85rem' }}
                  >
                    <option value="LOST">Lost Item</option>
                    <option value="FOUND">Found Item</option>
                    <option value="FOR_BORROW_RENT">Available for Borrowing</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                    Category
                  </label>
                  <select
                    value={reportCategory}
                    onChange={(e) => setReportCategory(e.target.value as any)}
                    className="glass-input"
                    style={{ width: '100%', padding: '8px 10px', fontSize: '0.85rem' }}
                  >
                    <option value="CALCULATOR">Scientific Calculator</option>
                    <option value="ID_DOCUMENT">ID Card / Document</option>
                    <option value="LAB_EQUIPMENT">Lab Drafter / Tools</option>
                    <option value="BOOK_STATIONERY">Notes / Book</option>
                    <option value="ELECTRONICS">Electronics / Cables</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Item Title
                </label>
                <input
                  type="text"
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  placeholder="e.g. Casio fx-991CW Calculator"
                  className="glass-input"
                  style={{ width: '100%', padding: '8px 12px' }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Location Details
                </label>
                <input
                  type="text"
                  value={reportLocation}
                  onChange={(e) => setReportLocation(e.target.value)}
                  placeholder="e.g. Physics Lab 3 or Library 2nd Floor"
                  className="glass-input"
                  style={{ width: '100%', padding: '8px 12px' }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Description & Identifiers
                </label>
                <textarea
                  value={reportDescription}
                  onChange={(e) => setReportDescription(e.target.value)}
                  placeholder="Color, marks, stickers, room info..."
                  className="glass-input"
                  style={{ width: '100%', padding: '8px 12px', minHeight: '60px' }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Contact (Telegram / WhatsApp / Email)
                </label>
                <input
                  type="text"
                  value={reportContact}
                  onChange={(e) => setReportContact(e.target.value)}
                  className="glass-input"
                  style={{ width: '100%', padding: '8px 12px' }}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
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
                  Publish Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
