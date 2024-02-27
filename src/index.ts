import dotenv from 'dotenv';
dotenv.config();

import dayjs from 'dayjs';
import { writeFile } from 'fs/promises';

import { getWiseBalanceStatement } from './wise/index.js';
import { convertWiseBalanceStatementForBillyCSV } from './convert.js';
import { getStripeBalanceStatement } from './stripe/index.js';
import { convertStripeBalanceStatementForBillyCSV } from './convert.js';

getStripeBalanceStatement({currency: 'EUR'}).then(async (data) => {
    convertStripeBalanceStatementForBillyCSV(data)
    await writeFile(`data/eur-StripeToBilly.csv`, convertStripeBalanceStatementForBillyCSV(data))       
})
getStripeBalanceStatement({currency: 'DKK'}).then(async (data) => {
    await writeFile(`data/dkk-StripeToBilly.csv`, convertStripeBalanceStatementForBillyCSV(data))       
})

getWiseBalanceStatement({ intervalStart: dayjs('2023-02-01T22:00:00Z').toDate() } ).then(convertWiseBalanceStatementForBillyCSV).then(async (data) => {
    await writeFile('data/eurWiseToBilly.csv', data)
});


//getBillyBankStatement().then(console.log);
//getProfiles().then(console.log);