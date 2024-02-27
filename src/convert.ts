import dayjs from 'dayjs';

import type { WiseBalanceStatement } from './wise/types';
import Stripe from 'stripe';

export const convertWiseBalanceStatementForBillyCSV = (data : WiseBalanceStatement) => {
    const transactions = data.transactions
    // Date;Amount;Description
    // ${t.referenceNumber}
    const csvLines = transactions.map(t => {
        return `${dayjs(t.date).format('DD-MM-YYYY') };"${t.amount.value.toString().replace('.',',')}";${t.referenceNumber}: ${t.details.description}`
    });

    return csvLines.join('\n');
}

export const convertStripeBalanceStatementForBillyCSV = (transactions : Stripe.BalanceTransaction[]) => {
    // Date;Amount;Description
    // ${t.referenceNumber}
    const csvLines = transactions.data.map(t => {
        return `${dayjs.unix(t.created).format('DD-MM-YYYY') };"${(t.net/100).toString().replace('.',',')}";${t.type} ${t.id} ${t.description?t.description:''}`
    });

    return csvLines.join('\n');
}
