import React, { useState, useEffect } from 'react';
import {
  Leaf,
  TrendingDown,
  Sparkles,
  Zap,
  DollarSign,
  Building,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { EsgFootprintReport, CarbonCreditListing } from '@studentlife/shared';

interface Props {
  onAddXp?: (amount: number) => void;
}

export const CarbonCreditMarketView: React.FC<Props> = ({ onAddXp }) => {
  const [electricityKwh, setElectricityKwh] = useState(14500);
  const [transportKm, setTransportKm] = useState(5200);
  const [isLoading, setIsLoading] = useState(false);
  const [purchasedTx, setPurchasedTx] = useState<string | null>(null);

  const [report, setReport] = useState<EsgFootprintReport>({
    id: 'esg-rep-01',
    scope1EmissionsTonnes: 14.2,
    scope2EmissionsTonnes: 48.6,
    scope3EmissionsTonnes: 22.4,
    netCarbonBalanceTonnes: -12.8,
    greenCampusRating: 'PLATINUM',
    activeListings: [
      {
        id: 'carb-list-01',
        campusProjectName: '500kW Rooftop Solar Array (North Academic Block)',
        creditType: 'SOLAR_ROOFTOP',
        tonnesCo2Offset: 45.0,
        pricePerTonneCredits: 25,
        verifierOrganization: 'Gold Standard & Campus Sustainability Board',
        sellerStudentOrg: 'Renewable Energy Student Chapter',
        sha256CertificateHash: '0x8f2a1b9e4d7c0a3e819cd0f1'
      },
      {
        id: 'carb-list-02',
        campusProjectName: 'Campus EV Shuttle Fleet Electrification',
        creditType: 'EV_SHUTTLE_OFFSET',
        tonnesCo2Offset: 28.5,
        pricePerTonneCredits: 22,
        verifierOrganization: 'Verified Carbon Standard (VCS)',
        sellerStudentOrg: 'Autonomous Transit Working Group',
        sha256CertificateHash: '0x3e7b1a9c4f0d2e817bc0a9f5'
      },
      {
        id: 'carb-list-03',
        campusProjectName: 'Hostel Dining Hall Biogas Digester',
        creditType: 'FOOD_WASTE_BIOGAS',
        tonnesCo2Offset: 16.0,
        pricePerTonneCredits: 18,
        verifierOrganization: 'Campus Green Council',
        sellerStudentOrg: 'Eco-Warriors Society',
        sha256CertificateHash: '0x5c9f1a2d8e0b4a719dc0e3f1'
      }
    ]
  });

  const fetchReport = async () => {
    try {
      const res = await fetch('/api/carbon-market/report');
      if (res.ok) {
        const data: EsgFootprintReport = await res.json();
        setReport(data);
      }
    } catch {
      // Fallback
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const handleCalculate = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/carbon-market/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campusBuildingId: 'sci-tech-complex',
          electricityKwh,
          transportKm
        })
      });
      if (res.ok) {
        const data: EsgFootprintReport = await res.json();
        setReport(data);
        if (onAddXp) onAddXp(60);
      }
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  const handleBuyCredit = async (listing: CarbonCreditListing) => {
    try {
      const res = await fetch('/api/carbon-market/trade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingId: listing.id,
          tonnesToBuy: 2,
          buyerAddress: '0x71C...StudentLife'
        })
      });
      if (res.ok) {
        const result = await res.json();
        setPurchasedTx(`Purchased 2.0 Tonnes from "${listing.campusProjectName}"! TxHash: ${result.txHash}`);
        if (onAddXp) onAddXp(85);
      }
    } catch {
      // Fallback
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-teal-950/70 border border-emerald-500/30 p-6 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
              <Leaf className="w-3.5 h-3.5" />
              Phase 95 • Collegiate Carbon Credit Smart Market & ESG Offset Ledger
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              Collegiate Carbon Credit Exchange
              <span className="text-xs px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                ESG Ledger v1.0
              </span>
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl">
              Track university Scope 1, 2, and 3 emissions, calculate department carbon offsets, and trade tokenized verified green credits directly between student societies and campus labs.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleCalculate}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-medium shadow-lg shadow-emerald-500/25 transition-all text-sm disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              {isLoading ? 'Recalculating...' : 'Update ESG Footprint'}
            </button>
          </div>
        </div>
      </div>

      {purchasedTx && (
        <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/50 text-emerald-300 text-xs flex items-center justify-between">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            {purchasedTx}
          </span>
          <button onClick={() => setPurchasedTx(null)} className="text-slate-400 hover:text-white text-xs">
            Dismiss
          </button>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Department Scope Calculator */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Building className="w-4 h-4 text-emerald-400" />
              Campus Emissions Calculator
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Monthly Grid Power (kWh)</span>
                  <span className="text-emerald-300 font-mono font-bold">{electricityKwh.toLocaleString()} kWh</span>
                </div>
                <input
                  type="range"
                  min={5000}
                  max={50000}
                  step={500}
                  value={electricityKwh}
                  onChange={(e) => setElectricityKwh(parseInt(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Student Transit Distance (km)</span>
                  <span className="text-teal-300 font-mono font-bold">{transportKm.toLocaleString()} km</span>
                </div>
                <input
                  type="range"
                  min={1000}
                  max={20000}
                  step={200}
                  value={transportKm}
                  onChange={(e) => setTransportKm(parseInt(e.target.value))}
                  className="w-full accent-teal-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Scope Summary */}
          <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-teal-400" />
                Emissions Breakdown
              </h3>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                {report.greenCampusRating} RATING
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400">Scope 1 (Direct Fuel):</span>
                <span className="text-white font-mono font-bold">{report.scope1EmissionsTonnes} tCO2e</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400">Scope 2 (Electricity):</span>
                <span className="text-white font-mono font-bold">{report.scope2EmissionsTonnes} tCO2e</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400">Scope 3 (Commuter Transit):</span>
                <span className="text-white font-mono font-bold">{report.scope3EmissionsTonnes} tCO2e</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-500/40">
                <span className="text-emerald-300 font-bold">Net Carbon Balance:</span>
                <span className="text-emerald-400 font-mono font-bold text-sm">{report.netCarbonBalanceTonnes} tCO2e</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Peer-to-Peer Carbon Credit Listings */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-400" />
                Verified Student Carbon Offset Market ({report.activeListings.length} Active Projects)
              </h3>
              <span className="text-xs text-slate-400">Gold Standard Verified</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {report.activeListings.map((listing) => (
                <div
                  key={listing.id}
                  className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-3 flex flex-col justify-between hover:border-emerald-500/40 transition-all"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-white line-clamp-1">{listing.campusProjectName}</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex-shrink-0">
                        {listing.creditType.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-400 space-y-1">
                      <div><span className="text-slate-500">Initiator:</span> {listing.sellerStudentOrg}</div>
                      <div><span className="text-slate-500">Audit:</span> {listing.verifierOrganization}</div>
                    </div>

                    <div className="p-2 rounded bg-slate-900/90 border border-slate-800 text-[10px] font-mono text-slate-400 flex items-center gap-1 overflow-hidden text-ellipsis">
                      <Lock className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                      Cert: {listing.sha256CertificateHash}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                    <div>
                      <div className="text-[10px] text-slate-500">Available / Price</div>
                      <div className="text-xs font-bold text-white">
                        {listing.tonnesCo2Offset} tCO2 • <span className="text-emerald-400">{listing.pricePerTonneCredits} PTS/t</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleBuyCredit(listing)}
                      className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-bold shadow transition-all flex items-center gap-1"
                    >
                      <DollarSign className="w-3.5 h-3.5" />
                      Retire 2t
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarbonCreditMarketView;
