export interface PromoCode {
  code: string;
  discountPercent: number;
  description: string;
  applicableTo: 'vendor' | 'couple' | 'all';
  active: boolean;
}

const PROMO_CODES: PromoCode[] = [
  {
    code: 'KSSTAR20',
    discountPercent: 20,
    description: '20% off on your subscription',
    applicableTo: 'vendor',
    active: true,
  },
];

export function validatePromoCode(code: string, userType: 'vendor' | 'couple' = 'vendor'): PromoCode | null {
  const normalized = code.trim().toUpperCase();
  const promo = PROMO_CODES.find(
    p => p.code === normalized && p.active && (p.applicableTo === userType || p.applicableTo === 'all')
  );
  return promo || null;
}

export function applyPromoDiscount(price: number, promo: PromoCode): number {
  return Math.round(price * (1 - promo.discountPercent / 100));
}
