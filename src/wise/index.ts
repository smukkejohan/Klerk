import crypto from 'crypto';
import dayjs from 'dayjs';
import got from 'got';

import dotenv from 'dotenv';
dotenv.config();

import { WiseBalanceStatement, WiseBalanceStatementOptions } from './types';

const apiToken = process.env.WISE_API_TOKEN
const wiseApiEndpoint = 'https://api.transferwise.com'; // https://api.transferwise.tech // https://api.sandbox.transferwise.tech/v1'
const profileId = process.env.WISE_PROFILE_ID!; 
const balanceId =  process.env.WISE_BALANCE_ID!;
const scaPrivateKey = process.env.WISE_SCA_PRIVATE_KEY!;

export const signToken = ({key, token} : {key: string, token: string}) => {
    const sign = crypto.createSign('SHA256');
    sign.write(token);
    sign.end();
    return sign.sign(key, 'base64');
  }

export const getProfiles = async () => {
    const response = await got(`${wiseApiEndpoint}/v1/profiles`, {
        headers: {
            Authorization: `Bearer ${apiToken}`,
        },
    });
    return response.body;
}

export const getBalances = async () => {
    const response = await got(`${wiseApiEndpoint}/v4/profiles/${profileId}/balances?types=STANDARD`, {
        headers: {
            Authorization: `Bearer ${apiToken}`,
        },
    });
    return response.body;
}

// getWiseBalanceStatement https://docs.wise.com/api-docs/api-reference/balance-statement
// max 469 days between intervalStart and intervalEnd - endpoint says 455 days ???
export const getWiseBalanceStatement = async ({
    intervalStart=dayjs().subtract(1, 'month').toDate(), 
    intervalEnd=dayjs().toDate(), 
    currency='EUR',
    scaHeaders} : WiseBalanceStatementOptions) : Promise<WiseBalanceStatement> => {

    try {
        const response = await got(`${wiseApiEndpoint}/v1/profiles/${profileId}/balance-statements/${balanceId}/statement.json?currency=${currency}&intervalStart=${intervalStart.toISOString()}&intervalEnd=${intervalEnd.toISOString()}&type=FLAT`, {
            headers: {
                'Authorization': `Bearer ${apiToken}`,
                ...scaHeaders
            },
        }).json() as WiseBalanceStatement;
        return response;

    } catch (error: any) {

        if(error.response?.statusCode === 403 && !scaHeaders) {
            console.log('403 error, retry to get balance statement with sca');

            const oneTimeToken = error.response.headers['x-2fa-approval'];
            const signature = signToken({
                key: scaPrivateKey,
                token: oneTimeToken,
            });

            return getWiseBalanceStatement({intervalStart: intervalStart, intervalEnd: intervalEnd, scaHeaders: { 
                'x-2fa-approval': oneTimeToken,
                'X-Signature': signature,
            }});
        } else if(error.response?.statusCode === 400) {
            console.error('error getting balance statement');
            console.error(error.response.body);

            throw error;
        } else {
            console.error('error getting balance statement with sca');
            throw error;
        }

        // TODO: specifically handle 403 error after sca
    }
}