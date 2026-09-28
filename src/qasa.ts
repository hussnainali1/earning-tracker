export const qasaFields = [
 ['bolt','Bolt'],['uber','Uber'],['uberRefund','Uber Refund'],['totalUberCash','Total Uber Cash'],
 ['uberCashInHand','Uber Cash in hand'],['totalZettle','Total Zettle'],['taxiTime','Taxi Time'],['expense','Expense']
] as const;
export type QasaKey = typeof qasaFields[number][0];
export type QasaInputs = Record<QasaKey,number>;
export type QasaRecord = QasaInputs & {month:string;percentage:number;notes:string;currency:string};
export function calculateQasa(r:QasaInputs & {percentage:number}){
 const uberCashInZettle=r.totalUberCash-r.uberCashInHand-r.expense;
 const okeriSwishCard=r.totalZettle-uberCashInZettle;
 const totalQasa=r.bolt+r.uber+r.uberRefund+r.totalZettle+r.taxiTime-uberCashInZettle;
 return {uberCashInZettle,okeriSwishCard,totalQasa,share:Math.round(totalQasa*r.percentage/100)};
}
export function validMonth(m:string){return /^\d{4}-(0[1-9]|1[0-2])$/.test(m)&&Number(m.slice(0,4))>=1900&&Number(m.slice(0,4))<=9999}
