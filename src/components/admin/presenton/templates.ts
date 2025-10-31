export type TemplateId =
  | 'modern' | 'general' | 'swift' | 'minimal' | 'corporate'
  | 'ocean' | 'sunrise' | 'sunset' | 'forest' | 'desert'
  | 'midnight' | 'ruby' | 'sapphire' | 'citrus' | 'mint'
  | 'lavender' | 'coral' | 'slate' | 'gold' | 'rose'
  | 'royal' | 'monochrome' | 'neon' | 'pastel' | 'cyber'
  | 'custom';

export const TEMPLATE_OPTIONS: Array<{ id: TemplateId; label: string }> = [
  { id: 'modern', label: 'Modern' },
  { id: 'general', label: 'General' },
  { id: 'swift', label: 'Swift' },
  { id: 'minimal', label: 'Minimal' },
  { id: 'corporate', label: 'Corporate' },
  { id: 'ocean', label: 'Ocean' },
  { id: 'sunrise', label: 'Sunrise' },
  { id: 'sunset', label: 'Sunset' },
  { id: 'forest', label: 'Forest' },
  { id: 'desert', label: 'Desert' },
  { id: 'midnight', label: 'Midnight' },
  { id: 'ruby', label: 'Ruby' },
  { id: 'sapphire', label: 'Sapphire' },
  { id: 'citrus', label: 'Citrus' },
  { id: 'mint', label: 'Mint' },
  { id: 'lavender', label: 'Lavender' },
  { id: 'coral', label: 'Coral' },
  { id: 'slate', label: 'Slate' },
  { id: 'gold', label: 'Gold' },
  { id: 'rose', label: 'Rose' },
  { id: 'royal', label: 'Royal' },
  { id: 'monochrome', label: 'Monochrome' },
  { id: 'neon', label: 'Neon' },
  { id: 'pastel', label: 'Pastel' },
  { id: 'cyber', label: 'Cyber' },
  { id: 'custom', label: 'Custom (Brand Kit)' },
];

// Colors for preview cards in LayoutPreview
export const TEMPLATE_COLORS: Record<string, { primary: string; bg: string; title: string; text: string; border: string }> = {
  modern:   { primary: '#10B981', bg: '#FFFFFF', title: '#1F2937', text: '#374151', border: '#D1D5DB' },
  general:  { primary: '#3B82F6', bg: '#FFFFFF', title: '#1E40AF', text: '#1F2937', border: '#D1D5DB' },
  swift:    { primary: '#8B5CF6', bg: '#FFFFFF', title: '#5B21B6', text: '#4C1D95', border: '#D1D5DB' },
  minimal:  { primary: '#000000', bg: '#FFFFFF', title: '#000000', text: '#374151', border: '#D1D5DB' },
  corporate:{ primary: '#1F2937', bg: '#F9FAFB', title: '#111827', text: '#374151', border: '#D1D5DB' },
  ocean:    { primary: '#0EA5E9', bg: '#F0F9FF', title: '#0C4A6E', text: '#075985', border: '#BAE6FD' },
  sunrise:  { primary: '#F97316', bg: '#FFF7ED', title: '#7C2D12', text: '#7C2D12', border: '#FED7AA' },
  sunset:   { primary: '#EF4444', bg: '#FEF2F2', title: '#7F1D1D', text: '#7F1D1D', border: '#FECACA' },
  forest:   { primary: '#22C55E', bg: '#F0FDF4', title: '#064E3B', text: '#065F46', border: '#BBF7D0' },
  desert:   { primary: '#D97706', bg: '#FFFBEB', title: '#78350F', text: '#92400E', border: '#FDE68A' },
  midnight: { primary: '#111827', bg: '#0B1220', title: '#E5E7EB', text: '#CBD5E1', border: '#1F2937' },
  ruby:     { primary: '#E11D48', bg: '#FFF1F2', title: '#881337', text: '#9F1239', border: '#FECDD3' },
  sapphire: { primary: '#2563EB', bg: '#EFF6FF', title: '#1E3A8A', text: '#1E40AF', border: '#BFDBFE' },
  citrus:   { primary: '#F59E0B', bg: '#FFFBEB', title: '#7C2D12', text: '#92400E', border: '#FDE68A' },
  mint:     { primary: '#14B8A6', bg: '#ECFEFF', title: '#115E59', text: '#134E4A', border: '#99F6E4' },
  lavender: { primary: '#A78BFA', bg: '#F5F3FF', title: '#4C1D95', text: '#5B21B6', border: '#DDD6FE' },
  coral:    { primary: '#FB7185', bg: '#FFF1F2', title: '#881337', text: '#9F1239', border: '#FECDD3' },
  slate:    { primary: '#64748B', bg: '#F8FAFC', title: '#0F172A', text: '#1F2937', border: '#CBD5E1' },
  gold:     { primary: '#F59E0B', bg: '#FFF7ED', title: '#1F2937', text: '#374151', border: '#FED7AA' },
  rose:     { primary: '#F43F5E', bg: '#FFF1F2', title: '#881337', text: '#9F1239', border: '#FECDD3' },
  royal:    { primary: '#7C3AED', bg: '#F5F3FF', title: '#312E81', text: '#3730A3', border: '#DDD6FE' },
  monochrome:{ primary: '#111827', bg: '#FFFFFF', title: '#111827', text: '#374151', border: '#D1D5DB' },
  neon:     { primary: '#06B6D4', bg: '#F0FDFA', title: '#0E7490', text: '#155E75', border: '#99F6E4' },
  pastel:   { primary: '#93C5FD', bg: '#EFF6FF', title: '#1D4ED8', text: '#1E40AF', border: '#BFDBFE' },
  cyber:    { primary: '#22D3EE', bg: '#0B1220', title: '#E2E8F0', text: '#94A3B8', border: '#1E293B' },
  custom:   { primary: '#10B981', bg: '#FFFFFF', title: '#1F2937', text: '#374151', border: '#D1D5DB' },
};

