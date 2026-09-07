import React, { useState, useEffect } from 'react';
import {
  Bus,
  MapPin,
  Clock,
  CheckCircle2,
  Leaf,
  Share2,
  Navigation
} from 'lucide-react';
import { CampusTransitState, CarpoolRidePost, ShuttleVehicle } from '@studentlife/shared';

interface CampusTransitViewProps {
  onAddXp?: (xp: number, reason: string) => void;
}

export const CampusTransitView: React.FC<CampusTransitViewProps> = ({ onAddXp }) => {
  const [transitState, setTransitState] = useState<CampusTransitState | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [bookingRideId, setBookingRideId] = useState<string | null>(null);

  useEffect(() => {
    fetchTransit();
  }, []);

  const fetchTransit = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/campus-transit/state');
      const json = await res.json();
      if (json.success && json.data) {
        setTransitState(json.data);
      }
    } catch (err) {
      console.error('Failed to load campus transit state', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookCarpool = async (post: CarpoolRidePost) => {
    setBookingRideId(post.id);
    try {
      const res = await fetch('/api/campus-transit/carpool/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ carpoolPostId: post.id }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setTransitState(json.data);
        onAddXp?.(25, `Reserved Seat with ${post.riderName} & Saved 0.8kg CO2`);
      }
    } catch (err) {
      console.error('Failed to book carpool', err);
    } finally {
      setBookingRideId(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
      {/* Header Banner */}
      <div className="glass-panel glow-hover" style={{
        padding: '24px 32px',
        background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(16, 185, 129, 0.1) 100%)',
        borderLeft: '4px solid #06b6d4',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="badge badge-completed">
                <Bus size={13} /> PHASE 68: SMART CAMPUS TRANSIT RADAR
              </span>
              <span className="badge badge-active">LIVE EV SHUTTLES + CARPOOL MESH</span>
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>
              Campus Smart Transit & <span className="gradient-text">Shuttle Radar</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
              Real-time EV shuttle GPS telemetry, inter-hostel bike & e-rickshaw carpooling, and green carbon offset rewards.
            </p>
          </div>

          {transitState && (
            <div className="glass-panel" style={{ padding: '12px 20px', backgroundColor: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
              <div style={{ fontSize: '0.75rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                <Leaf size={14} /> Eco Carbon Saved
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', marginTop: '2px' }}>
                {transitState.userEcoCarbonSavedKg} kg CO₂
              </div>
            </div>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          Connecting to campus transit telemetry node...
        </div>
      ) : transitState ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '20px' }}>
          {/* Left Column: Live Active Shuttles & Route Stops */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Active Shuttles Grid */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Navigation size={18} color="#22d3ee" /> Live EV Shuttles on Campus ({transitState.activeShuttles.length})
                </h3>
                <span className="badge badge-active">Live GPS Frequency 5s</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {transitState.activeShuttles.map((shuttle: ShuttleVehicle) => (
                  <div
                    key={shuttle.id}
                    style={{
                      padding: '18px',
                      borderRadius: '12px',
                      backgroundColor: 'rgba(15, 23, 42, 0.7)',
                      border: '1px solid var(--border-glass)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '12px',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#22d3ee' }}>
                          {shuttle.vehicleNumber}
                        </span>
                        <span className="badge" style={{ fontSize: '0.7rem', backgroundColor: 'rgba(6, 182, 212, 0.2)', color: '#22d3ee' }}>
                          {shuttle.vehicleType.replace('_', ' ')}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          • {shuttle.speedKmph} km/h
                        </span>
                      </div>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#fff', marginBottom: '6px' }}>
                        {shuttle.routeName}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <MapPin size={12} color="#f59e0b" />
                        <span>Current: <strong>{shuttle.currentStop}</strong></span>
                        <span>➔</span>
                        <span>Next: <strong>{shuttle.nextStop}</strong></span>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Estimated Arrival</div>
                      <div style={{ fontSize: '1.4rem', fontWeight: 800, color: shuttle.etaMinutes <= 3 ? '#34d399' : '#fbbf24' }}>
                        {shuttle.etaMinutes} min
                      </div>
                      <div style={{ fontSize: '0.65rem', color: '#34d399', fontWeight: 600 }}>● Tracking Active</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Route Stops Occupancy */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={18} color="#fbbf24" /> Major Campus Transit Hubs & Next Arrivals
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
                {transitState.routeStops.map((stop) => (
                  <div
                    key={stop.id}
                    style={{
                      padding: '14px',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(15, 23, 42, 0.6)',
                      border: '1px solid var(--border-glass)',
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#fff', marginBottom: '4px' }}>
                      {stop.stopName}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                      {stop.stopLocationTag}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="badge" style={{
                        fontSize: '0.65rem',
                        backgroundColor: stop.occupancyStatus === 'SEATS_AVAILABLE' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                        color: stop.occupancyStatus === 'SEATS_AVAILABLE' ? '#34d399' : '#f87171',
                      }}>
                        {stop.occupancyStatus.replace('_', ' ')}
                      </span>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fbbf24' }}>
                        Next: {stop.nextArrivalMinutes}m
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Peer Carpool & Bike Share Board */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="glass-panel" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Share2 size={16} color="#34d399" /> Peer Carpool & Bike Pool
                </h3>
                <span className="badge badge-completed">Eco Coins</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                Hitch a ride with fellow hostelers heading to labs, workshops, or libraries to reduce campus congestion.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {transitState.activeCarpoolPosts.map((post) => {
                  const isFilled = post.status === 'FILLED';
                  return (
                    <div
                      key={post.id}
                      style={{
                        padding: '14px',
                        borderRadius: '10px',
                        backgroundColor: 'rgba(15, 23, 42, 0.6)',
                        border: '1px solid var(--border-glass)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#fff' }}>
                          {post.riderName}
                        </span>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fbbf24' }}>
                          {post.departureTime}
                        </span>
                      </div>

                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                        <div>📍 From: <strong>{post.fromLocation}</strong></div>
                        <div>🎯 To: <strong>{post.toLocation}</strong></div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                        <span style={{ fontSize: '0.7rem', color: isFilled ? '#f87171' : '#34d399', fontWeight: 600 }}>
                          {isFilled ? '● Full (No Seats)' : `● ${post.availableSeats} Seat Available (+${post.coinRewardContribution} Coins)`}
                        </span>
                        {!isFilled && (
                          <button
                            className="btn btn-primary"
                            onClick={() => handleBookCarpool(post)}
                            disabled={bookingRideId === post.id}
                            style={{ fontSize: '0.7rem', padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '4px' }}
                          >
                            <CheckCircle2 size={11} /> Join (+25 XP)
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
