import {
  OrderBookSnapshot,
  ExecuteHftTradeDto
} from '@studentlife/shared';

export class HftOrderBookService {
  private basePrice = 2840.50;

  getSnapshot(): OrderBookSnapshot {
    return {
      id: 'hft-snap-01',
      symbol: 'STUDENT_COIN / USD',
      lastTradePriceUsd: this.basePrice,
      spreadBps: 1.8,
      bidLadder: [
        { priceUsd: 2840.40, aggregateQuantity: 145, orderCount: 12 },
        { priceUsd: 2840.20, aggregateQuantity: 320, orderCount: 28 },
        { priceUsd: 2840.00, aggregateQuantity: 890, orderCount: 65 },
        { priceUsd: 2839.50, aggregateQuantity: 1450, orderCount: 110 }
      ],
      askLadder: [
        { priceUsd: 2840.60, aggregateQuantity: 180, orderCount: 14 },
        { priceUsd: 2840.80, aggregateQuantity: 290, orderCount: 22 },
        { priceUsd: 2841.00, aggregateQuantity: 740, orderCount: 58 },
        { priceUsd: 2841.50, aggregateQuantity: 1620, orderCount: 125 }
      ],
      recentFills: [
        { price: 2840.55, quantity: 25, side: 'BUY', timestamp: '11:45:01.892' },
        { price: 2840.50, quantity: 50, side: 'SELL', timestamp: '11:45:01.810' },
        { price: 2840.45, quantity: 15, side: 'SELL', timestamp: '11:45:01.650' }
      ],
      matchingEngineLatencyMicros: 4.2
    };
  }

  async executeTrade(dto: ExecuteHftTradeDto): Promise<{ success: boolean; fillPrice: number; orderId: string; latencyMicros: number }> {
    const slippage = (Math.random() - 0.5) * 0.20;
    const fill = dto.orderType === 'MARKET' ? this.basePrice + (dto.side === 'BUY' ? 0.10 : -0.10) + slippage : dto.priceUsd;

    return {
      success: true,
      fillPrice: Math.round(fill * 100) / 100,
      orderId: `ord-${Date.now().toString(16)}`,
      latencyMicros: 3.8
    };
  }
}
