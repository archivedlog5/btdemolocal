var localPaymentInstance;

const CLIENT_TOKEN_URL = 'btclienttoken';

fetch(CLIENT_TOKEN_URL, requestOptions)
  .then((res) => {
    clientToken = res.text();
    console.log(clientToken);
    return clientToken;
  })
  .then((clientToken) => {
    console.log(clientToken);

    //Above just get client token, Till now create BT iframe
    braintree.client.create({
      authorization: clientToken
    }, (clientErr, clientInstance) => {

      // Stop if there was a problem creating the client.
      // This could happen if there is a network error or if the authorization
      // is invalid.
      if (clientErr) {
        console.error('Error creating client:', clientErr);
        return;
      }

      // Create a local payment component.
      braintree.localPayment.create({
        client: clientInstance,
        merchantAccountId: merchantAccountId()
      }, (localPaymentErr, paymentInstance) => {

        // Stop if there was a problem creating local payment component.
        // This could happen if there was a network error or if it's incorrectly
        // configured.
        if (localPaymentErr) {
          console.error('Error creating local payment:', localPaymentErr);
          return;
        }

        localPaymentInstance = paymentInstance;
        console.log(localPaymentInstance);
      });
    });

  });

function createLocalPaymentClickListener(type) {
  return function (event) {
    event.preventDefault();

    localPaymentInstance.startPayment(returnLpmPaymentObject(type), (startPaymentError, payload) => {
      if (startPaymentError) {
        if (startPaymentError.code === 'LOCAL_PAYMENT_POPUP_CLOSED') {
          console.error('Customer closed Local Payment popup.');
        } else {
          console.error('Error!', startPaymentError);
        }
      } else {
        // Send the nonce to your server to create a transaction
        console.log(payload);
        //console.log(payload.nonce);
        const form = document.getElementById('payment-form');
        //following 2 address useless just donot want to modify code
        addAddressToFormInput(form, billingAddress, BillingAddress);
        addAddressToFormInput(form, shippingAddress, ShippingAddress);
        //above 2 address useless just donot want to modify code
        addAddressToFormInput(form, lpmNLShippingAddress, LpmNLShippingAddress);
        addLineItemsToFormInput(form, lineItems);
        addNonceTypeToFormInput(form, LpmNonceType);
        addLpmCustomInfoToFormInput(form, lpmNLCustomerInfo, LpmNLCustomerInfo);
        addLpmMarkToFormInput(form, LpmMark);
        document.getElementById('nonce').value = payload.nonce;
        form.submit();
      }
    });
  };
}

idealButton.addEventListener('click', createLocalPaymentClickListener('ideal'));
sofortButton.addEventListener('click', createLocalPaymentClickListener('sofort'));