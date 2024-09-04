const CLIENT_TOKEN_URL = 'btusclienttoken';

fetch(CLIENT_TOKEN_URL, requestOptions)
  .then((res) => {
    clientToken = res.text();
    console.log(clientToken);
    return clientToken;
  })
  .then((clientToken) => {
    console.log(clientToken);

    //Above just get client token, Till now create BT iframe
    const form = document.getElementById('payment-form');

    braintree.dropin.create({

      authorization: clientToken,
      container: '#dropin-container',
      paypal: dropinPPEcConfiguration,
      paypalCredit: dropinPPEcConfiguration,
      venmo: {} ,
      paymentOptionPriority:['card', 'paypal', 'venmo', 'paypalCredit',  'applePay', 'googlePay']

    }, (error, dropinInstance) => {
      if (error) console.error(error);

      form.addEventListener('submit', event => {
        event.preventDefault();

        dropinInstance.requestPaymentMethod((error, payload) => {
          if (error) console.error(error);

          // Step four: when the user is ready to complete their
          //   transaction, use the dropinInstance to get a payment
          //   method nonce for the user's selected payment method, then add
          //   it a the hidden field before submitting the complete form to
          //   a server-side integration
          console.log(payload);
          document.getElementById('nonce').value = payload.nonce;
          addAddressToFormInput(form, billingAddress, BillingAddress);
          addAddressToFormInput(form, shippingAddress, ShippingAddress);
          addLineItemsToFormInput(form, lineItems);
          if (PayPalAccountNonceType == payload.type) {
            addNonceTypeToFormInput(form, PayPalAccountNonceType);
            addPayPalAccountDetailsToFormInput(form, payload.details);
            //addAddressToFormInput(form, paypalShippingAddress, PayPalShippingAddress);
          } else if (CreditCardNonceType == payload.type) {
            addNonceTypeToFormInput(form, CreditCardNonceType);
            addLineItemsToFormInput(form, lineItems);
            addCreditCardDetailsToFormInput(form, payload.details);
            addCreditCardDescriptionToFormInput(form, payload.description);
            addCreditCardBinDataToFormInput(form, payload.binData);
          }
          form.submit();

        });
      });
    });

  });

