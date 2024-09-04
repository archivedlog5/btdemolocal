import crypto from "crypto";
import braintree from "braintree";

const { BT_MERCHANT_ID, BT_PUBLIC_KEY, BT_PRIVATE_KEY, BT_US_MERCHANT_ID, BT_US_PUBLIC_KEY, BT_US_PRIVATE_KEY } = process.env;
const BT_ENVIRONMENT = braintree.Environment.Sandbox;

export const gateway = new braintree.BraintreeGateway({
    environment: BT_ENVIRONMENT,
    merchantId: BT_MERCHANT_ID,
    publicKey: BT_PUBLIC_KEY,
    privateKey: BT_PRIVATE_KEY
});

export const usGateway = new braintree.BraintreeGateway({
    environment: BT_ENVIRONMENT,
    merchantId: BT_US_MERCHANT_ID,
    publicKey: BT_US_PUBLIC_KEY,
    privateKey: BT_US_PRIVATE_KEY
});

const MerchantAccountIdUSD = "cwBTtest";
const MerchantAccountIdEUR = "cwBTLPMtest";
const UsMerchantAccountIdUSD = "cwen5us";

const PayPalAccountNonceType = "PayPalAccount";
const CreditCardNonceType = "CreditCard";
const AchNonceType = "us_bank_account";
const paymentInstrumentType_CreditCard = "credit_card";
const paymentInstrumentType_PaypalAccount = "paypal_account";
const paymentInstrumentType_LocalPayment = "local_payment";

export async function createTransactionSale(requestBody, res) {
    const nonceTypeFromTheClient = requestBody.nonceType;
    switch (nonceTypeFromTheClient) {
        case PayPalAccountNonceType:
            if (PayPalAccountNonceType == nonceTypeFromTheClient && !requestBody.lpmMark) {
                createPayPalTransactionSale(requestBody, res, PayPalAccountNonceType);
            } else if (PayPalAccountNonceType == nonceTypeFromTheClient && requestBody.lpmMark) {
                createLpmTransactionSale(requestBody, res, PayPalAccountNonceType);
            }

            break;
        case CreditCardNonceType:
            createCreditCardTransactionSale(requestBody, res, CreditCardNonceType);
            break;
        case AchNonceType:
            createAchTransactionSale(requestBody, res, AchNonceType);
            break;
        default:
            res.send('No Payment Nonce Provide');
    }

}

async function createPayPalTransactionSale(requestBody, res, nonceType) {
    const paypalSaleObject = await generateTransactionSaleObject(requestBody, nonceType);
    console.log(paypalSaleObject);

    gateway.transaction.sale(paypalSaleObject, (err, result) => {
        if (err) res.status(500).send(err.message);
        console.log(result.transaction.id);
        //res.json(result);
        formatResponse(res, result)
    });
}

async function createLpmTransactionSale(requestBody, res, nonceType) {
    const lpmSaleObject = await generateTransactionSaleObject(requestBody, nonceType);
    console.log(lpmSaleObject);

    gateway.transaction.sale(lpmSaleObject, (err, result) => {
        if (err) res.status(500).send(err.message);
        //console.log(result.transaction.id);
        //res.json(result);
        formatResponse(res, result)
    });
}

async function createCreditCardTransactionSale(requestBody, res, nonceType) {

    const creditCardSaleObject = await generateTransactionSaleObject(requestBody, nonceType);
    console.log(creditCardSaleObject);

    gateway.transaction.sale(creditCardSaleObject, (err, result) => {
        if (err) res.status(500).send(err.message);
        console.log(result.transaction.id);
        //res.json(result);
        formatResponse(res, result)
    });

}

async function createAchTransactionSale(requestBody, res, nonceType) {

    /*
    const creditCardSaleObject = await generateTransactionSaleObject(requestBody, nonceType);
    console.log(creditCardSaleObject);

    gateway.transaction.sale(creditCardSaleObject, (err, result) => {
        if (err) res.status(500).send(err.message);
        console.log(result.transaction.id);
        //res.json(result);
        formatResponse(res, result)
    });
    */
    const nonceFromTheClient = requestBody.payment_method_nonce;
    const amountFromTheClient = requestBody.amount;
    console.log(requestBody);
    usGateway.paymentMethod.create({
        customerId: '122331',
        paymentMethodNonce: nonceFromTheClient,
        options: {
            usBankAccountVerificationMethod: braintree.UsBankAccountVerification.VerificationMethod.IndependentCheck  // or MicroTransfers or IndependentCheck
        } 
    }, (err, result) => {
        if (err) res.status(500).send(err.message);
        if (result.success) {
            const usBankAccount = result.paymentMethod;
            const verified = usBankAccount.verified;
            const responseCode = usBankAccount.verifications[0].processorResponseCode;
            console.log(usBankAccount);
            console.log(verified);
            console.log(responseCode);
            formatResponse(res, result)
            // ...
        } else {

        }
    });

}

async function generateTransactionSaleObject(requestBody, nonceType) {
    const invoiceId = crypto.randomUUID();
    //const nonceTypeFromTheClient = requestBody.nonceType;
    const nonceFromTheClient = requestBody.payment_method_nonce;
    const amountFromTheClient = requestBody.amount;
    const customerInfoObject = await generateCustomerObject(requestBody);
    const billingAddressObject = await generateBillingAddressObject(requestBody);
    const shippingAddressObject = await generateShippingAddressObject(requestBody);

    if (PayPalAccountNonceType == nonceType && !requestBody.lpmMark) {
        console.log('generating paypal sale object');
        const paypalCustomerInfoObject = await generatePayPalCustomerObject(requestBody);
        const paypalShippingAddressObject = await generatePayPalShippingAddressObject(requestBody);
        if (requestBody.vaultpaymentmethod && requestBody.vaultexistingcustomer) {
            const saleObject = {
                amount: amountFromTheClient,
                orderId: invoiceId,
                merchantAccountId: MerchantAccountIdUSD,
                customerId: requestBody.existingcustomerid,
                paymentMethodNonce: nonceFromTheClient,
                //deviceData: deviceDataFromTheClient,
                //customer: paypalCustomerInfoObject,
                billing: billingAddressObject,
                shipping: paypalShippingAddressObject,
                options: {
                    submitForSettlement: true,
                    storeInVaultOnSuccess: true
                }
            };
            return saleObject;
        } else if (requestBody.vaultpaymentmethod && requestBody.vaultnewcustomer) {
            const customerId = crypto.randomUUID();
            const saleObject = {
                amount: amountFromTheClient,
                orderId: invoiceId,
                merchantAccountId: MerchantAccountIdUSD,
                paymentMethodNonce: nonceFromTheClient,
                customer: {
                    id: customerId
                },
                //deviceData: deviceDataFromTheClient,
                //customer: paypalCustomerInfoObject,
                billing: billingAddressObject,
                shipping: paypalShippingAddressObject,
                options: {
                    submitForSettlement: true,
                    storeInVaultOnSuccess: true
                }
            };
            return saleObject;
        } else {
            const saleObject = {
                amount: amountFromTheClient,
                orderId: invoiceId,
                merchantAccountId: MerchantAccountIdUSD,
                paymentMethodNonce: nonceFromTheClient,
                //deviceData: deviceDataFromTheClient,
                customer: paypalCustomerInfoObject,
                billing: billingAddressObject,
                shipping: paypalShippingAddressObject,
                options: {
                    submitForSettlement: true
                }
            };
            return saleObject;
        }

    }
    if (PayPalAccountNonceType == nonceType && requestBody.lpmMark) {
        console.log('generating lpm sale object');
        const descriptor = {
            name: "wen*cw productions",
            phone: "3125551212",
            url: "cwen.ga"
        }
        const lpmNLCustomerInfoObject = await generateLpmCustomerObject(requestBody);
        const lpmNLShippingAddressObject = await generateLpmShippingAddressObject(requestBody);
        const saleObject = {
            amount: amountFromTheClient,
            orderId: invoiceId,
            merchantAccountId: MerchantAccountIdEUR,
            paymentMethodNonce: nonceFromTheClient,
            descriptor: descriptor, //will show in buyer bank statement
            //deviceData: deviceDataFromTheClient,
            customer: lpmNLCustomerInfoObject,
            //billing: billingAddressObject,
            shipping: lpmNLShippingAddressObject,
            options: {
                submitForSettlement: true
            }
        };
        return saleObject;
    }
    if (CreditCardNonceType == nonceType) {
        console.log('generating credit card sale object');
        if (requestBody.vaultpaymentmethod && requestBody.vaultexistingcustomer) {
            const saleObject = {
                amount: amountFromTheClient,
                orderId: invoiceId,
                merchantAccountId: MerchantAccountIdUSD,
                paymentMethodNonce: nonceFromTheClient,
                customerId: requestBody.existingcustomerid,
                //deviceData: deviceDataFromTheClient,
                //customer: customerInfoObject,
                billing: billingAddressObject,
                shipping: shippingAddressObject,
                options: {
                    submitForSettlement: true,
                    storeInVaultOnSuccess: true
                }
            };
            return saleObject;
        } else if (requestBody.vaultpaymentmethod && requestBody.vaultnewcustomer) {
            const saleObject = {
                amount: amountFromTheClient,
                orderId: invoiceId,
                merchantAccountId: MerchantAccountIdUSD,
                paymentMethodNonce: nonceFromTheClient,
                //deviceData: deviceDataFromTheClient,
                //customer: customerInfoObject,
                customer: {
                    id: customerId
                },
                billing: billingAddressObject,
                shipping: shippingAddressObject,
                options: {
                    submitForSettlement: true
                }
            };
            return saleObject;
        } else {
            const saleObject = {
                amount: amountFromTheClient,
                orderId: invoiceId,
                merchantAccountId: MerchantAccountIdUSD,
                paymentMethodNonce: nonceFromTheClient,
                //deviceData: deviceDataFromTheClient,
                customer: customerInfoObject,
                billing: billingAddressObject,
                shipping: shippingAddressObject,
                options: {
                    submitForSettlement: true
                }
            };
            return saleObject;
        }
    }
}

async function generateCustomerObject(requestBody) {
    //Suppose should generate from the frontend requestbody of real customer, but this demo no such info
    const customer = {
        firstName: "Crossc",
        lastName: "Wenc",
        company: "",
        phone: "312-555-1234",
        email: requestBody.email
    };
    return customer;
}

async function generatePayPalCustomerObject(requestBody) {

    const paypalCustomer = {
        firstName: requestBody.paypalAccountDetails.firstName,
        lastName: requestBody.paypalAccountDetails.lastName,
        company: "",
        phone: requestBody.paypalAccountDetails.phone,
        email: requestBody.paypalAccountDetails.email,
    };
    return paypalCustomer;
}

async function generateLpmCustomerObject(requestBody) {

    const lpmCustomer = {
        firstName: requestBody.lpmNLCustomerInfo.givenName,
        lastName: requestBody.lpmNLCustomerInfo.surname,
        company: "",
        phone: requestBody.lpmNLCustomerInfo.phone,
        email: requestBody.lpmNLCustomerInfo.email,
    };
    return lpmCustomer;
}

async function generateBillingAddressObject(requestBody) {
    const billing = {
        firstName: requestBody.billingAddress.firstName,
        lastName: requestBody.billingAddress.lastName,
        company: "",
        streetAddress: requestBody.billingAddress.line1,
        extendedAddress: requestBody.billingAddress.line2,
        locality: requestBody.billingAddress.city,
        region: requestBody.billingAddress.state,
        postalCode: requestBody.billingAddress.postalCode,
        countryCodeAlpha2: requestBody.billingAddress.countryCode,
    };
    console.log(billing);
    return billing;
}

async function generateShippingAddressObject(requestBody) {

    const shipping = {
        firstName: requestBody.shippingAddress.firstName,
        lastName: requestBody.shippingAddress.lastName,
        company: "",
        streetAddress: requestBody.shippingAddress.line1,
        extendedAddress: requestBody.shippingAddress.line2,
        locality: requestBody.shippingAddress.city,
        region: requestBody.shippingAddress.state,
        postalCode: requestBody.shippingAddress.postalCode,
        countryCodeAlpha2: requestBody.shippingAddress.countryCode,
    };
    return shipping;
}

async function generatePayPalShippingAddressObject(requestBody) {
    // !!!!!!! and please note for paypal. 
    //!!!!!!! Backend below parameters will overwrite frontend passed to paypal ones.

    const recipientName = await splitPayPalShippingAddressObjectRecipientName(requestBody.paypalShippingAddress.recipientName);

    const shipping = {
        firstName: recipientName[0],
        lastName: recipientName[1],
        company: "",
        streetAddress: requestBody.paypalShippingAddress.line1,
        extendedAddress: requestBody.paypalShippingAddress.line2,
        locality: requestBody.paypalShippingAddress.city,
        region: requestBody.paypalShippingAddress.state,
        postalCode: requestBody.paypalShippingAddress.postalCode,
        countryCodeAlpha2: requestBody.paypalShippingAddress.countryCode,
    };
    return shipping;
}

async function generateLpmShippingAddressObject(requestBody) {

    const lpmShipping = {
        firstName: requestBody.lpmNLCustomerInfo.givenName,
        lastName: requestBody.lpmNLCustomerInfo.surname,
        company: "",
        streetAddress: requestBody.lpmNLShippingAddress.streetAddress,
        extendedAddress: requestBody.lpmNLShippingAddress.extendedAddress,
        locality: requestBody.lpmNLShippingAddress.locality,
        region: requestBody.lpmNLShippingAddress.region,
        postalCode: requestBody.lpmNLShippingAddress.postalCode,
        countryCodeAlpha2: requestBody.lpmNLShippingAddress.countryCode,
    };
    return lpmShipping;
}

async function splitPayPalShippingAddressObjectRecipientName(recipientName) {
    return recipientName.split(' ');
}

async function formatResponse(res, result) {

    if (paymentInstrumentType_CreditCard == result.transaction.paymentInstrumentType) {
        return res.send(
            "<h4>Transaction results</h4>" +
            "Transaction Id: " + result.transaction.id + "</br>" +
            "Transaction Status: " + result.transaction.status + "</br>" +
            "Transaction Amount: " + result.transaction.amount + result.transaction.currencyIsoCode + "</br>" +
            "Transaction Payment Instrument Type: " + result.transaction.paymentInstrumentType + "</br>" +
            "Transaction Payment Card Type: " + result.transaction.creditCard.cardType + "</br>" +
            "Transaction Payment Last 4 Digits: " + result.transaction.creditCard.last4 + "</br>"
        );
    }

    if (paymentInstrumentType_PaypalAccount == result.transaction.paymentInstrumentType) {
        return res.send(
            "<h4>Transaction results</h4>" +
            "Transaction Id: " + result.transaction.id + "</br>" +
            "Transaction Status: " + result.transaction.status + "</br>" +
            "Transaction Amount: " + result.transaction.amount + result.transaction.currencyIsoCode + "</br>" +
            "Transaction Payment Instrument Type: " + result.transaction.paymentInstrumentType + "</br>" +
            "Transaction PayPal Email: " + result.transaction.paypal.payerEmail + "</br>" +
            "PayPal Trasaction Id: " + result.transaction.paypal.captureId + "</br>"
        );
    }

    if (paymentInstrumentType_LocalPayment == result.transaction.paymentInstrumentType) {
        return res.send(
            "<h4>Transaction results</h4>" +
            "Transaction Id: " + result.transaction.id + "</br>" +
            "Transaction Status: " + result.transaction.status + "</br>" +
            "Transaction Amount: " + result.transaction.amount + result.transaction.currencyIsoCode + "</br>" +
            "Transaction Payment Instrument Type: " + result.transaction.paymentInstrumentType + "</br>" +
            "Transaction LPM Type: " + result.transaction.localPayment.fundingSource + "</br>" +
            "Transaction Payment Id: " + result.transaction.localPayment.paymentId + "</br>" +
            "Transaction Capture Id: " + result.transaction.localPayment.captureId + "</br>"
        );
    }

}