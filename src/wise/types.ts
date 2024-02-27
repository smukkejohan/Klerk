export type TscaHeaders = {'x-2fa-approval': string, 'X-Signature': string }

export enum WiseAccountHolderType {
    PERSONAL = 'PERSONAL',
    BUSINESS = 'BUSINESS',
}

export type WiseBalanceStatementOptions = {
    intervalStart?: Date,
    intervalEnd?: Date,
    scaHeaders?: TscaHeaders,
    currency?: string,
}

export type WiseAmount = {
    value: number,
    currency: string,
}

export type WiseAccountHolder = {
        type: WiseAccountHolderType,
        address: {
            addressFirstLine: string,
            city: string,
            postCode: string,
            stateCode: string,
            countryName: string,
        },
        firstName: string,
        lastName: string,
    }

export type WiseIssuer = {
    name: string,
    firstLine: string,
    city: string,
    postCode: string,
    stateCode: string,
    country: string,
}

export type WiseTransaction = {
    type: 'DEBIT' | 'CREDIT',
        date: string,
        amount: WiseAmount,
        totalFees: WiseAmount,
        details: {
            type: 'CARD' | 'CONVERSION' | 'DEPOSIT' | 'TRANSFER' | 'MONEY_ADDED',
            description: string,
            amount: WiseAmount,
            category: string,
            merchant: {
                name: string,
                firstLine: string,
                postCode: string,
                city: string,
                state: string,
                country: string,
                category: string,
            },
            senderName: string,
            senderAccount: string,
            paymentReference: string,
            sourceAmount: WiseAmount,
            targetAmount: WiseAmount,
            fee: WiseAmount,
            rate: number,
        },
        exchangeDetails: {
            forAmount: {
                value: number,
                currency: string,
            },
            rate: number,
        },
        runningBalance: WiseAmount,
        referenceNumber: string,
    }

// Type for json API response from Wise 
// https://docs.wise.com/api-docs/api-reference/balance-statement#object
export type WiseBalanceStatement = {
    accountHolder: WiseAccountHolder,
    issuer: WiseIssuer,
    bankDetails: null,
    transactions: WiseTransaction[],
    endOfStatementBalance: WiseAmount,
    query: {
        intervalStart: string,
        intervalEnd: string,
        currency: string,
        accountId: number,
    },
}