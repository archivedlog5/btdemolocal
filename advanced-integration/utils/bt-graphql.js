import { GraphQLClient, rawRequest, gql } from 'graphql-request'
import crypto from "crypto";
import gqlQueryAndMutation from './bt-gql-query-mutation.js';
import gqlQueryAndMutationVariables from './bt-gql-query-mutation-variables.js';

const { BT_MERCHANT_ID, BT_PUBLIC_KEY, BT_PRIVATE_KEY } = process.env;
const BT_GRAPHQL_ENDPOINT = "https://payments.sandbox.braintree-api.com/graphql";
const API_KEYS_BASE64 = Buffer.from(BT_PUBLIC_KEY + ':' + BT_PRIVATE_KEY, 'utf8').toString('base64')
const CONTENT_TYPE = 'application/json';
const BRAINTREE_VERSION = await format(new Date());
const MerchantAccountIdUSD = "cwBTtest";
const MerchantAccountIdEUR = "cwBTLPMtest";
const PayPalAccountNonceType = "PayPalAccount";
const CreditCardNonceType = "CreditCard";
const paymentMethodSnapshotType_CreditCard = "CreditCardDetails";
const paymentMethodSnapshotType_PayPalAccount = "PayPalTransactionDetails";
const paymentInstrumentType_LocalPayment = "local_payment";

const basicRequestHeaders = {
  authorization: 'Bearer ' + API_KEYS_BASE64,
  'Content-Type': CONTENT_TYPE,
  'Braintree-Version': BRAINTREE_VERSION
};

export async function ping() {

  const query = gql`
    query pingTest{
        ping
      }
    `;

  const variables = {

  };

  const response = await handleRequest(query, variables, basicRequestHeaders);
  return response;
}

export async function clientToken(requestBody) {

  console.log(requestBody);
  const mutation = gqlQueryAndMutation.getCreateClientTokenMutation();
  const variables = gqlQueryAndMutationVariables.getCreateClientTokenVariables(requestBody);

  const response = await handleRequest(mutation, variables, basicRequestHeaders);
  return response;
}

/** For test only */
export async function createSale(requestBody, res) {

  //console.log(gqlQueryAndMutation.ChargeCreditCardMutation);

  const mutation = gqlQueryAndMutation.getChargePayPalAccountMutation();


  console.log(mutation);

  const variables = gqlQueryAndMutationVariables.getChargePayPalAccountVariables(requestBody);

  const response = await handleRequest(mutation, variables, basicRequestHeaders);
  return response;


}

export async function createTransactionSale(requestBody, res) {
  const nonceTypeFromTheClient = requestBody.nonceType;
  switch (nonceTypeFromTheClient) {
    case PayPalAccountNonceType:
      if (PayPalAccountNonceType == nonceTypeFromTheClient && !requestBody.lpmMark) {
        console.log("ready to create paypal sale");
        createPayPalTransactionSale(requestBody, res, PayPalAccountNonceType);
      } else if (PayPalAccountNonceType == nonceTypeFromTheClient && requestBody.lpmMark) {
        console.log("ready to create lpm sale");
        createLpmTransactionSale(requestBody, res, PayPalAccountNonceType);
      }

      break;
    case CreditCardNonceType:
      console.log("ready to create creditcard sale");
      createCreditCardTransactionSale(requestBody, res, CreditCardNonceType);
      break;
    default:
      res.send('No Payment Nonce Provide');
  }
}

async function createCreditCardTransactionSale(requestBody, res, nonceType) {

  const mutation = gqlQueryAndMutation.getChargeCreditCardMutation();
  const variables = gqlQueryAndMutationVariables.getChargeCreditCardVariables(requestBody);
  const result = await handleRequest(mutation, variables, basicRequestHeaders);
  formatResponse(res, result)

}

async function createPayPalTransactionSale(requestBody, res, nonceType) {

  const mutation = gqlQueryAndMutation.getChargePayPalAccountMutation();
  const variables = gqlQueryAndMutationVariables.getChargePayPalAccountVariables(requestBody);
  const result = await handleRequest(mutation, variables, basicRequestHeaders);
  formatResponse(res, result)

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

  if (result.data.chargeCreditCard) {
    return res.send(
      "<h4>Transaction results</h4>" +
      "Transaction Id: " + result.data.chargeCreditCard.transaction.id + "</br>" +
      "Transaction Lagacy Id: " + result.data.chargeCreditCard.transaction.legacyId + "</br>" +
      "Transaction Status: " + result.data.chargeCreditCard.transaction.status + "</br>" +
      "Transaction Amount: " + result.data.chargeCreditCard.transaction.amount.value + result.data.chargeCreditCard.transaction.amount.currencyCode + "</br>" +
      "Transaction Payment Instrument Type: " + result.data.chargeCreditCard.transaction.paymentMethodSnapshot.__typename.substring(0, 10) + "</br>" +
      "Transaction Payment Card Type: " + result.data.chargeCreditCard.transaction.paymentMethodSnapshot.brandCode + "</br>" +
      "Transaction Payment Last 4 Digits: " + result.data.chargeCreditCard.transaction.paymentMethodSnapshot.last4 + "</br>"
    );
  }

  if (result.data.chargePayPalAccount) {
    return res.send(
      "<h4>Transaction results</h4>" +
      "Transaction Id: " + result.data.chargePayPalAccount.transaction.id + "</br>" +
      "Transaction Lagacy Id: " + result.data.chargePayPalAccount.transaction.legacyId + "</br>" +
      "Transaction Status: " + result.data.chargePayPalAccount.transaction.status + "</br>" +
      "Transaction Amount: " + result.data.chargePayPalAccount.transaction.amount.value + result.data.chargePayPalAccount.transaction.amount.currencyCode + "</br>" +
      "Transaction Payment Instrument Type: " + result.data.chargePayPalAccount.transaction.paymentMethodSnapshot.__typename.substring(0, 6) + "</br>" +
      "Payer PayPal Email: " + result.data.chargePayPalAccount.transaction.paymentMethodSnapshot.payer.email + "</br>" +
      "PayPal Trasaction Id: " + result.data.chargePayPalAccount.transaction.paymentMethodSnapshot.captureId + "</br>"
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

async function handleRequest(queryOrMutation, variables, requestHeaders) {
  const { data, errors, extensions, headers, status } = await rawRequest(BT_GRAPHQL_ENDPOINT, queryOrMutation, variables, requestHeaders);
  console.log(JSON.stringify({ data, errors, extensions, headers, status }, undefined, 2));
  return { data, errors, extensions, headers, status };
}

async function format(date) {
  if (!(date instanceof Date)) {
    throw new Error('Invalid "date" argument. You must pass a date instance')
  }

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}