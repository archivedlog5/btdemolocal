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

      // Create a PayPal Checkout component.
      braintree.paypalCheckout.create({
        client: clientInstance
      }, (paypalCheckoutErr, paypalCheckoutInstance) => {

        // Stop if there was a problem creating PayPal Checkout.
        // This could happen if there was a network error or if it's incorrectly
        // configured.
        if (paypalCheckoutErr) {
          console.error('Error creating PayPal Checkout:', paypalCheckoutErr);
          return;
        }

        // Load the PayPal JS SDK (see Load the PayPal JS SDK section)
        // This demo is merchant loaded instead of BT client load
        // So we do not call paypalCheckoutInstance.loadPayPalSDK(function (loadSDKErr) {});

        paypal.Buttons({
          //fundingSource: paypal.FUNDING.PAYPAL,

          createOrder: function () {
            return paypalCheckoutInstance.createPayment(paypalCheckoutEcmConfiguration);
          },

          /*
          onShippingChange: function (data, actions) {
            // Perform some validation or calculation logic on `data`
  
            if (  need to update shipping options or lineItems ) {
              return paypalCheckoutInstance.updatePayment({
                amount: 10.00,              // Required
                currency: 'USD',
                lineItems: [...],           // Required
                paymentId: data.paymentId,  // Required
                shippingOptions: [...],     // Optional       
              });
            } else if ( address not supported ) {
              return actions.reject();
            }
            
            return actions.resolve();
          },
          */

          onApprove: function (data, actions) {
            return paypalCheckoutInstance.tokenizePayment(data, function (err, payload) {
              // Submit `payload.nonce` to your server
              console.log(payload);
              console.log('Got a nonce: ' + payload.nonce);
              const form = document.getElementById('payment-form');
              // Step four: when the user is ready to complete their
              //   transaction, use the dropinInstance to get a payment
              //   method nonce for the user's selected payment method, then add
              //   it a the hidden field before submitting the complete form to
              //   a server-side integration
              addAddressToFormInput(form, billingAddress, BillingAddress);
              addAddressToFormInput(form, shippingAddress, ShippingAddress);
              addLineItemsToFormInput(form, lineItems);
              addNonceTypeToFormInput(form, PayPalAccountNonceType);
              addPayPalAccountDetailsToFormInput(form, payload.details);
              document.getElementById('nonce').value = payload.nonce;
              form.submit();

            });
          },

          onCancel: function (data) {
            console.log('PayPal payment cancelled', JSON.stringify(data, 0, 2));
          },

          onError: function (err) {
            console.error('PayPal error', err);
          }
        }).render('#paypal-button').then(function () {
          // The PayPal button will be rendered in an html element with the ID
          // `paypal-button`. This function will be called when the PayPal button
          // is set up and ready to be used
          console.log('This is the function after the render...And button ready for using.');
        });



      });

    });


  });

