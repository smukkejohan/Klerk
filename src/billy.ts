



const billyApiEndpoint = 'https://api.billysbilling.com/v2'
const billyApiToken = process.env.BILLY_API_TOKEN
import got from 'got';


export const billyApiGetAccounts = async () => { // works
    const response = await got(`${billyApiEndpoint}/accounts`, {
        headers: {
            'X-Access-Token': billyApiToken,
            'Content-Type': 'application/json',
        },
    });
    return response.body;
}

export const getBillyBankStatement = async (accountId: string ) => { 
    const response = await got(`${billyApiEndpoint}/accounts/${accountId}/statement`, {
        headers: {
            'X-Access-Token': billyApiToken,
        },}).json()
    return response;
} 
