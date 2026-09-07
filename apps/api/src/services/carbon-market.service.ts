import {
  EsgFootprintReport,
  TradeCarbonCreditDto,
  CalculateEsgFootprintDto
} from '@studentlife/shared';

export class CarbonMarketService {
  private defaultReport: EsgFootprintReport = {
    id: 'esg-rep-01',
    scope1EmissionsTonnes: 14.2, // Direct diesel/generator
    scope2EmissionsTonnes: 48.6, // Purchased grid electricity
    scope3EmissionsTonnes: 22.4, // Commuter student transit & waste
    netCarbonBalanceTonnes: -12.8, // Net negative (surplus offsets)
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
  };

  async getReport(): Promise<EsgFootprintReport> {
    return this.defaultReport;
  }

  async calculateFootprint(dto: CalculateEsgFootprintDto): Promise<EsgFootprintReport> {
    const kwh = dto.electricityKwh || 12000;
    const km = dto.transportKm || 4500;

    const scope2 = Math.round((kwh * 0.00085) * 10) / 10;
    const scope3 = Math.round((km * 0.00018) * 10) / 10;

    return {
      ...this.defaultReport,
      scope2EmissionsTonnes: scope2,
      scope3EmissionsTonnes: scope3,
      netCarbonBalanceTonnes: Math.round((scope2 + scope3 + this.defaultReport.scope1EmissionsTonnes - 89.5) * 10) / 10
    };
  }

  async tradeCredit(dto: TradeCarbonCreditDto): Promise<{ success: boolean; txHash: string; remainingTonnes: number }> {
    return {
      success: true,
      txHash: `0x9a8f7b${Date.now().toString(16)}`,
      remainingTonnes: 32.0 - (dto.tonnesToBuy || 1)
    };
  }
}
