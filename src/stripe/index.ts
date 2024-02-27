

import got from 'got';
import Stripe from 'stripe';

const stripeApiEndpoint = 'https://api.stripe.com/v1'
const stripeApiKey = process.env.STRIPE_API_KEY!

const stripe = new Stripe(stripeApiKey, {
    apiVersion: '2023-08-16',
  });


// Stripe balance
//  GET /v1/balance_transactions


export const getStripeBalanceStatement = async ({currency='EUR'} = {}) => {

    return stripe.balanceTransactions.list({
        limit: 100,
        currency: currency,
        
        }
    )
    /*const response = await got(`${stripeApiEndpoint}/balance_transactions?currency=${currency}&limit=100`, {
        username: stripeApiKey,
    }).json()
    return response;*/
}
