export const categories = ['Uber Cash — Swish', 'Uber Cash — Zettle', 'Direct Customer Payments', 'Uber Earnings — Non-Cash', 'Bolt Payout'];
export type Week = { id: string; date: string; endDate?: string; amounts: number[]; percentage: number; notes: string };
export type Settings = { percentage: number; currency: string; ownerEmail?: string; userName?: string };
export const defaults: Settings = { percentage: 50, currency: 'SEK', ownerEmail: '', userName: '' };
export function iso(d: Date) { return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; }
export function shift(date: string, days: number) { const d = new Date(date+'T12:00:00'); d.setDate(d.getDate()+days); return iso(d); }
export function monday(date = iso(new Date())) { const d = new Date(date+'T12:00:00'); return shift(date, -((d.getDay()+6)%7)); }
export function validDate(value: string) { return /^\d{4}-\d{2}-\d{2}$/.test(value) && !isNaN(new Date(value+'T12:00:00').getTime()) && iso(new Date(value+'T12:00:00')) === value; }
export function parseAmount(value: string) { const v = value.trim().replace(',', '.'); if (!/^\d{1,9}(\.\d{1,2})?$/.test(v || '0')) throw new Error('Enter a positive amount with up to two decimals.'); return Math.round(Number(v || 0)*100); }
export function totals(records: Week[]) { const amounts = [0,0,0,0,0]; let driver = 0; for (const r of records) { r.amounts.forEach((a,i)=>amounts[i]+=a); driver += Math.round(r.amounts.reduce((a,b)=>a+b,0)*r.percentage/100); } const total = amounts.reduce((a,b)=>a+b,0); return { amounts, total, driver, owner: total-driver, cash: amounts[0]+amounts[1] }; }
export function money(cents: number, currency = 'SEK') { return `${(cents/100).toLocaleString('sv-SE', { minimumFractionDigits: cents%100 ? 2 : 0, maximumFractionDigits: 2 })} ${currency}`; }
export function range(date: string, endDate?: string) { const fmt = (v: string) => new Date(v+'T12:00:00').toLocaleDateString('en-GB',{day:'numeric',month:'short'}); return `${fmt(date)} – ${fmt(endDate || shift(date,6))}`; }
