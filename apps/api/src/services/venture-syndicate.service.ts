import {
  VentureSafeAgreement,
  GenerateSafeNoteDto
} from '@studentlife/shared';

export class VentureSyndicateService {
  async generateSafeNote(dto: GenerateSafeNoteDto): Promise<VentureSafeAgreement> {
    const investment = dto.investmentAmountUsd || 50000;
    const valuationCap = dto.postMoneyValuationCapUsd || 2500000;
    const discount = dto.discountRatePercent || 20;
    const impliedEquity = Math.round((investment / valuationCap) * 10000) / 100;

    const safeMarkdown = `# SAFE (Simple Agreement for Future Equity)
**Post-Money Valuation Cap with Discount**

**THIS CERTIFIES THAT** in exchange for the payment by **${dto.investorName || 'Campus Micro-Angel Syndicate'}** (the "Investor") of **$${investment.toLocaleString()}** (the "Purchase Amount"), **${dto.startupName || 'NovaNeural AI Inc.'}** (the "Company") hereby issues to the Investor the right to certain shares of the Company's Capital Stock.

---
### Key Investment Terms
- **Post-Money Valuation Cap**: $${valuationCap.toLocaleString()} USD
- **Discount Rate**: ${discount}%
- **Implied Post-Money Ownership**: ${impliedEquity}%
- **Governing Law**: State of Delaware

---
### 1. Events & Conversion
(a) **Equity Financing**: Upon the next qualified equity financing round, this SAFE will automatically convert into shares of Preferred Stock at the lower of (i) the Discount Price, or (ii) the Post-Money Valuation Cap Price.
(b) **Liquidity Event**: In the event of a change of control or IPO, the Investor will receive cash or shares equal to the Purchase Amount or post-money proceeds.

*Executed by Founder:* **${dto.founderName || 'Alex Mercer (CEO)'}**
`;

    return {
      id: `safe-${Date.now()}`,
      startupName: dto.startupName || 'NovaNeural AI Inc.',
      founderName: dto.founderName || 'Alex Mercer (CEO)',
      investorName: dto.investorName || 'Campus Micro-Angel Syndicate',
      investmentAmountUsd: investment,
      postMoneyValuationCapUsd: valuationCap,
      discountRatePercent: discount,
      impliedEquityPercent: impliedEquity,
      governingLawState: 'Delaware (US)',
      safeAgreementMarkdown: safeMarkdown,
      sha256ContractHash: `0x7a8f9c2d5e1b40a3e819cd0f${Date.now().toString(16)}`,
      capTableSimulation: [
        {
          holderName: 'Founders & Core Team',
          stakeType: 'FOUNDERS',
          sharesCount: 8000000,
          ownershipPercentPre: 80.0,
          ownershipPercentPost: Math.round((80.0 - impliedEquity * 0.8) * 10) / 10
        },
        {
          holderName: 'Unallocated Option Pool',
          stakeType: 'OPTION_POOL',
          sharesCount: 2000000,
          ownershipPercentPre: 20.0,
          ownershipPercentPost: Math.round((20.0 - impliedEquity * 0.2) * 10) / 10
        },
        {
          holderName: `${dto.investorName || 'Angel Syndicate'} (New SAFE)`,
          stakeType: 'ANGEL_SYNDICATE',
          sharesCount: Math.round(10000000 * (impliedEquity / 100)),
          ownershipPercentPre: 0.0,
          ownershipPercentPost: impliedEquity
        }
      ]
    };
  }
}
