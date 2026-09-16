export const colors = {
  blue: '#0357EE', navy: '#02102D', sky: '#55C0F9', yellow: '#FFD85C',
  background: '#F8FAFF', paleBlue: '#E9F0FF', slate: '#64748B', border: '#E2E8F0',
  green: '#10B981', red: '#C9333D', white: '#FFFFFF',
} as const;

export const radius = { card: 20, button: 16, pill: 999 } as const;
export const shadow = { shadowColor: colors.navy, shadowOpacity: 0.07, shadowRadius: 12, shadowOffset: { width: 0, height: 5 }, elevation: 3 } as const;
