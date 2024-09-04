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
    var form = document.querySelector('#my-sample-form');
    //var submit = document.querySelector('input[type="submit"]');
    var submit = document.getElementById('button-pay');
    document.getElementById('button-pay').style.backgroundColor = "grey";

    braintree.client.create({
      authorization: clientToken
    }, function (clientErr, clientInstance) {
      if (clientErr) {
        // Handle error in client creation
        console.error(clientErr);
        return;
      }

      var options = {
        client: clientInstance,
        styles: {
          'input': {
            'color': '#282c37',
            'font-size': '16px',
            'transition': 'color 0.1s',
            'line-height': '3'
          },
          // Style the text of an invalid input
          'input.invalid': {
            'color': '#E53A40'
          },
          // placeholder styles need to be individually adjusted
          '::-webkit-input-placeholder': {
            'color': 'rgba(0,0,0,0.6)'
          },
          ':-moz-placeholder': {
            'color': 'rgba(0,0,0,0.6)'
          },
          '::-moz-placeholder': {
            'color': 'rgba(0,0,0,0.6)'
          },
          ':-ms-input-placeholder': {
            'color': 'rgba(0,0,0,0.6)'
          },
          // prevent IE 11 and Edge from
          // displaying the clear button
          // over the card brand icon
          'input::-ms-clear': {
            opacity: '0'
          }
        },
        // Add information for individual fields
        fields: {
          number: {
            selector: '#card-number',
            placeholder: '4111 1111 1111 1111'
          },
          cvv: {
            selector: '#cvv',
            placeholder: '123'
          },
          expirationDate: {
            selector: '#expiration-date',
            placeholder: '10 / 24'
          }
        }
      };

      braintree.hostedFields.create(options, function (hostedFieldsErr, hostedFieldsInstance) {
        if (hostedFieldsErr) {
          // Handle error in Hosted Fields creation
          console.error(hostedFieldsErr);
          return;
        }

        hostedFieldsInstance.on('validityChange', function (event) {
          // Check if all fields are valid, then show submit button
          var formValid = Object.keys(event.fields).every(function (key) {
            return event.fields[key].isValid;
          });

          if (formValid) {
            //$('#button-pay').addClass('show-button');
            submit.removeAttribute('disabled');
            document.getElementById('button-pay').style.backgroundColor = "#282c37";
          } else {
            //$('#button-pay').removeClass('show-button');
            document.getElementById('button-pay').setAttribute("disabled", "true");
            document.getElementById('button-pay').style.backgroundColor = "grey";
          }
        });

        hostedFieldsInstance.on('empty', function (event) {
          $('header').removeClass('header-slide');
          $('#card-image').removeClass();
          $(form).removeClass();
        });

        hostedFieldsInstance.on('cardTypeChange', function (event) {
          // Change card bg depending on card type
          if (event.cards.length === 1) {
            $(form).removeClass().addClass(event.cards[0].type);
            $('#card-image').removeClass().addClass(event.cards[0].type);
            $('header').addClass('header-slide');

            // Change the CVV length for AmericanExpress cards
            if (event.cards[0].code.size === 4) {
              hostedFieldsInstance.setAttribute({
                field: 'cvv',
                attribute: 'placeholder',
                value: '1234'
              });
            }
          } else {
            hostedFieldsInstance.setAttribute({
              field: 'cvv',
              attribute: 'placeholder',
              value: '123'
            });
          }
        });

        //submit.removeAttribute('disabled');

        // Use the Hosted Fields instance here to tokenize a card

        form.addEventListener('submit', event => {
          event.preventDefault();

          console.log('Pay Button Clicked')
          hostedFieldsInstance.tokenize((tokenizeErr, payload) => {
            if (tokenizeErr) {
              console.error(tokenizeErr);
              return;
            }

            // If this was a real integration, this is where you would
            // send the nonce to your server.
            console.log(payload);
            console.log('Got a nonce: ' + payload.nonce);
            document.getElementById('nonce').value = payload.nonce;
            document.getElementById('button-pay').setAttribute("disabled", "true");
            document.getElementById('button-pay').style.backgroundColor = "grey";
            document.getElementById('button-pay').innerHTML = "Processing Order";
            addNonceTypeToFormInput(form, CreditCardNonceType);
            addAddressToFormInput(form, billingAddress, BillingAddress);
            addAddressToFormInput(form, shippingAddress, ShippingAddress);
            addLineItemsToFormInput(form, lineItems);
            addCreditCardDetailsToFormInput(form, payload.details);
            addCreditCardDescriptionToFormInput(form, payload.description);
            addCreditCardBinDataToFormInput(form, payload.binData);
            form.submit();
          });
          
        }, false);
      });
    });

  });

