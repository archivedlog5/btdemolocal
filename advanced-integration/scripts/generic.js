const NonceType = "nonceType";
const PayPalAccountNonceType = "PayPalAccount";
const CreditCardNonceType = "CreditCard";
const AchNonceType = "us_bank_account";
const LpmNonceType = "PayPalAccount";
const ShippingAddress = "shippingAddress";
const BillingAddress = "billingAddress";
const PayPalShippingAddress = "paypalShippingAddress";
const PayPalAccountDetails = "paypalAccountDetails";
const CreditCardDetails = "creditCardDetails";
const CreditCardDescription = "creditCardDescription";
const AchDescription = "achDescription";
const CreditCardBinData = "creditCardBinData";
const LpmNLShippingAddress = "lpmNLShippingAddress";
const LpmNLCustomerInfo = "lpmNLCustomerInfo";
const LineItems = "lineItems";
const IdealType = "ideal";
const SofortType = "sofort";
const LpmPaymentId = "LpmPaymentId";
const LpmEurCurrency = "EUR";
const LpmMerchantAccountId = "cwBTLPMtest";
const LpmMark = "lpmMark";
const DropinVaultedCustomerId1 = "DlLhgTXYAweF0r6B1PmdVBao4QHHLW";

const requestOptions = {
    method: 'POST',
    redirect: 'follow'
};

const requestOptionsForDropinVault = {
    method: 'POST',
    redirect: 'follow',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ customerId: DropinVaultedCustomerId1 }),
};

const billingAddress = {
    line1: 'Billing Addr Cross bt test 123 ABC Street',
    line2: 'Billing Addr Cross bt test Apt 2',
    city: 'San Jose',
    state: 'CA',
    postalCode: '95121',
    countryCode: 'US',
    phone: '2407808080',
    firstName: 'Crossbtba',
    lastName: 'Wenbtba'
};

const shippingAddress = {
    line1: 'Shipping Addr Cross bt test 123 ABC Street',
    line2: 'Shipping Addr Cross bt test Apt 2',
    city: 'San Jose',
    state: 'CA',
    postalCode: '95121',
    countryCode: 'US',
    phone: '2407808080',
    firstName: 'Crossbtsa',
    lastName: 'Wenbtsa'
};

const paypalShippingAddress = {
    line1: 'PayPal Shipping Addr Cross bt test 123 ABC Street',
    line2: 'PayPal Shipping Addr Cross bt test Apt 2',
    city: 'San Jose',
    state: 'CA',
    postalCode: '95121',
    countryCode: 'US',
    phone: '2407808080',
    recipientName: 'Crossbtpsa Wenbtpsa'
};

function addAddressToFormInput(form, address, addressType) {
    Object.keys(address).forEach(function (key) {
        console.log('Key : ' + key + ', Value : ' + address[key]);
        var input = document.createElement("input");
        input.type = "hidden";
        input.name = addressType + '[' + key + ']';
        input.value = address[key];
        form.appendChild(input);
    })
}

const lineItem0 = {
    quantity: '1',
    unitAmount: '15',
    name: 'Monkey Toy',
    kind: 'debit',
    unitTaxAmount: '5',
    description: 'Big Size Monkey Toy',
    productCode: 'SKU01',
    url: 'https://examples.com/monkeytoy'
};

const lineItem1 = {
    quantity: '1',
    unitAmount: '20',
    name: 'Lion Toy',
    kind: 'debit',
    unitTaxAmount: '10',
    description: 'Big Size Lion Toy',
    productCode: 'SKU02',
    url: 'https://examples.com/liontoy'
};

const lineItem2 = {
    quantity: '1',
    unitAmount: '10',
    name: 'Coupon Discount',
    kind: 'credit',
    description: 'Coupon Discount Desc'
};

const lineItem3 = {
    quantity: '1',
    unitAmount: '5',
    name: 'Shipping Fee',
    kind: 'debit',
    description: 'Shipping Fee Description',
    productCode: '',
    url: ''
};

const lineItem4 = {
    quantity: '1',
    unitAmount: '5',
    name: 'Shipping Fee Discount',
    kind: 'credit',
    description: 'Shipping Fee Discount Desc',
    productCode: '',
    url: ''
};

const lineItem5 = {
    quantity: '1',
    unitAmount: '5',
    name: 'Membership Discount',
    kind: 'credit',
    description: 'Membership Discount Desc',
    productCode: '',
    url: ''
};

const lineItems = [];
lineItems.push(lineItem0, lineItem1, lineItem2, lineItem3, lineItem4, lineItem5);
//console.log(lineItems);

const dropinPPEcConfiguration = {
    flow: 'checkout',
    intent: 'capture',
    offerCredit: true,
    amount: document.getElementById('amount').value,
    currency: 'USD',
    displayName: 'Cross Wen BT Store',
    //shippingOptions: chosenShippingOption,
    enableShippingAddress: true,
    shippingAddressEditable: false,
    landingPageType: 'login',
    shippingAddressOverride: paypalShippingAddress,
    lineItems: lineItems
};

const dropinPPEcCheckoutWithVaultConfiguration = {
    flow: 'checkout',
    intent: 'capture',
    offerCredit: true,
    amount: document.getElementById('amount').value,
    currency: 'USD',
    requestBillingAgreement: true, // Required
    billingAgreementDetails: {
        description: 'Details Description of the billng agreement to display to the customer'
    },
    billingAgreementDescription: "Description of the billng agreement to display to the customer",
    displayName: 'Cross Wen BT Store',
    //shippingOptions: chosenShippingOption,
    enableShippingAddress: true,
    shippingAddressEditable: false,
    landingPageType: 'login',
    shippingAddressOverride: paypalShippingAddress,
    lineItems: lineItems
};

const paypalCheckoutEcmConfiguration = {
    flow: 'checkout',
    intent: 'capture',
    //offerCredit: true,
    amount: document.getElementById('amount').value,
    currency: 'USD',
    displayName: 'Cross Wen BT Store',
    //shippingOptions: chosenShippingOption,
    enableShippingAddress: true,
    shippingAddressEditable: false,
    landingPageType: 'login',
    shippingAddressOverride: paypalShippingAddress,
    lineItems: lineItems
};

const paypalJSSDKCheckoutEcsConfiguration = {
    //'client-id': '',
    intent: 'capture',
    //locale: 'en_US',
    currency: 'USD',
    vault: false,
    components: 'buttons,messages',
    //dataAttributes: {}
    //following are the parameters not in official documents, just for myself testing.
    commit: false,
    'buyer-country': 'US',
    'enable-funding': 'paylater',
    'disable-funding': 'card'
};

const paypalJSSDKCheckoutEcmConfiguration = {
    //'client-id': '',
    intent: 'capture',
    //locale: 'en_US',
    currency: 'USD',
    vault: false,
    components: 'buttons,messages',
    //dataAttributes: {}
    //following are the parameters not in official documents, just for myself testing.
    commit: true,
    'buyer-country': 'US',
    'enable-funding': 'paylater',
    'disable-funding': 'card'
};

const paypalCheckoutEcsConfiguration = {
    flow: 'checkout',
    intent: 'capture',
    //offerCredit: true,
    amount: document.getElementById('amount').value,
    currency: 'USD',
    displayName: 'Cross Wen BT Store',
    //shippingOptions: chosenShippingOption,
    enableShippingAddress: true,
    shippingAddressEditable: true,
    landingPageType: 'login',
    //shippingAddressOverride: paypalShippingAddress,
    lineItems: lineItems
};

var idealButton = document.getElementById('ideal-button');
var sofortButton = document.getElementById('sofort-button');

function merchantAccountId() {
    return LpmMerchantAccountId;
}

const lpmNLShippingAddress = {
    streetAddress: 'LPM Addr Oosterdoksstraat 110',
    extendedAddress: 'Apt. B',
    locality: 'DK Amsterdam',
    postalCode: '1011',
    region: 'NH',
    countryCode: 'NL'
}

const lpmNLCustomerInfo = {
    email: 'crosswen5@gmail.com',
    phone: '5101231234',
    givenName: 'Crosslpm',
    surname: 'Wenlpm',
}

function returnLpmPaymentObject(lpmType) {
    return {
        paymentType: lpmType,
        amount: document.getElementById('amount').value,
        fallback: { // see Fallback section for details on these params
            url: 'https://localhost/btlpmcompleted',
            buttonText: 'Complete Payment'
        },
        currencyCode: LpmEurCurrency,
        shippingAddressRequired: true,
        email: lpmNLCustomerInfo.email,
        phone: lpmNLCustomerInfo.phone,
        givenName: lpmNLCustomerInfo.givenName,
        surname: lpmNLCustomerInfo.surname,
        address: lpmNLShippingAddress,
        onPaymentStart: (data, start) => {
            // NOTE: It is critical here to store data.paymentId on your server
            //       so it can be mapped to a webhook sent by Braintree once the
            //       buyer completes their payment. See Start the payment
            //       section for details.
            const form = document.getElementById('payment-form');
            console.log(data.paymentId);
            addLpmPaymentIdToFormInput(form, data.paymentId);
            // Call start to initiate the popup
            start();
        }
    }
}

function addLineItemsToFormInput(form, lineItems) {
    lineItems.forEach((lineItem, index) => {
        //console.log(index);
        //console.log(lineItem);

        Object.keys(lineItem).forEach(function (key) {
            //console.log('Key : ' + key + ', Value : ' + lineItem[key]);
            var input = document.createElement("input");
            input.type = "hidden";
            input.name = LineItems + '[' + index + ']' + '[' + key + ']';
            input.value = lineItem[key];
            form.appendChild(input);
        })

    });

}

function addLpmPaymentIdToFormInput(form, lpmPaymentId) {
    var input = document.createElement("input");
    input.type = "hidden";
    input.name = LpmPaymentId;
    input.value = lpmPaymentId;
    form.appendChild(input);
}

function addAchDescriptionToFormInput(form, achDescription) {
    var input = document.createElement("input");
    input.type = "hidden";
    input.name = AchDescription;
    input.value = achDescription;
    form.appendChild(input);
}

function addLpmMarkToFormInput(form, lpmMark) {
    var input = document.createElement("input");
    input.type = "hidden";
    input.name = LpmMark;
    input.value = true;
    form.appendChild(input);
}

function addNonceTypeToFormInput(form, nonceType) {
    var input = document.createElement("input");
    input.type = "hidden";
    input.name = NonceType;
    input.value = nonceType;
    form.appendChild(input);
}

function addLpmCustomInfoToFormInput(form, lpmNLCustomerInfo, keyName) {
    Object.keys(lpmNLCustomerInfo).forEach(function (key) {
        //console.log('Key : ' + key + ', Value : ' + creditCardDetails[key]);
        var input = document.createElement("input");
        input.type = "hidden";
        input.name = keyName + '[' + key + ']';
        input.value = lpmNLCustomerInfo[key];
        form.appendChild(input);

    })
}

function addPayPalAccountDetailsToFormInput(form, paypalAccountDetails) {
    Object.keys(paypalAccountDetails).forEach(function (key) {
        //console.log('Key : ' + key + ', Value : ' + paypalAccountDetails[key]);
        if (ShippingAddress == key) {
            addAddressToFormInput(form, paypalAccountDetails[key], PayPalShippingAddress)
        } else {
            var input = document.createElement("input");
            input.type = "hidden";
            input.name = PayPalAccountDetails + '[' + key + ']';
            input.value = paypalAccountDetails[key];
            form.appendChild(input);
        }
    })
}

function addCreditCardDetailsToFormInput(form, creditCardDetails) {
    Object.keys(creditCardDetails).forEach(function (key) {
        //console.log('Key : ' + key + ', Value : ' + creditCardDetails[key]);
        var input = document.createElement("input");
        input.type = "hidden";
        input.name = CreditCardDetails + '[' + key + ']';
        input.value = creditCardDetails[key];
        form.appendChild(input);

    })
}

function addCreditCardDescriptionToFormInput(form, creditCardDescription) {
    var input = document.createElement("input");
    input.type = "hidden";
    input.name = CreditCardDescription;
    input.value = creditCardDescription;
    form.appendChild(input);
}

function addCreditCardBinDataToFormInput(form, creditCardBinData) {
    Object.keys(creditCardBinData).forEach(function (key) {
        //console.log('Key : ' + key + ', Value : ' + creditCardBinData[key]);
        var input = document.createElement("input");
        input.type = "hidden";
        input.name = CreditCardBinData + '[' + key + ']';
        input.value = creditCardBinData[key];
        form.appendChild(input);

    })
}

/*
shippingOption0 = {
  id: 'Standard Shipping',
  label: 'Standard UPS Shipping',
  selected: true,
  type: 'SHIPPING',
  amount: {
    currency: 'USD',
    value: '10'
  }
}
const chosenShippingOption = [];
chosenShippingOption.push(shippingOption0);
*/

