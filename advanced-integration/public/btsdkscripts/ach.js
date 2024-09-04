const CLIENT_TOKEN_URL = 'btusclienttoken';

fetch(CLIENT_TOKEN_URL, requestOptions)
  .then((res) => {
    clientToken = res.text();
    console.log(clientToken);
    return clientToken;
  })
  .then((clientToken) => {
    console.log(clientToken);

    var form = document.querySelector('#my-sample-form');
    //var submit = document.querySelector('input[type="submit"]');
    var submit = document.getElementById('button-pay');

    braintree.client.create({
      authorization: clientToken
    }, function (clientErr, clientInstance) {
      if (clientErr) {
        // Handle error in client creation
        console.error(clientErr);
        return;
      }

      braintree.usBankAccount.create({
        client: clientInstance
      }, function (usBankAccountErr, usBankAccountInstance) {
        if (usBankAccountErr) {
          console.error('There was an error creating the USBankAccount instance.');
          throw usBankAccountErr;
        }

        // Use the usBankAccountInstance here.
        // ...

        form.addEventListener('submit', event => {
          event.preventDefault();
          
          console.log('Pay Button Clicked')
          var bankDetails = {
            accountNumber: $('#account-number').val(),
            routingNumber: $('#routing-number').val(),
            accountType: $('#account-type').val(),
            ownershipType: $('#ownership-type').val(),
            billingAddress: {
              streetAddress: $('#billing-street-address').val(),
              extendedAddress: $('#billing-extended-address').val(),
              locality: $('#billing-locality').val(),
              region: $('#billing-region').val(),
              postalCode: $('#billing-postal-code').val()
            }
          };

          if (bankDetails.ownershipType === 'personal') {
            bankDetails.firstName = $('#first-name').val();
            bankDetails.lastName = $('#last-name').val();
          } else {
            bankDetails.businessName = $('#business-name').val();
          }

          console.log(bankDetails);

          usBankAccountInstance.tokenize({

            bankDetails: bankDetails,
            mandateText: 'By clicking ["Checkout"], I authorize Braintree, a service of PayPal, on behalf of [your business name here] (i) to verify my bank account information using bank information and consumer reports and (ii) to debit my bank account.'
          },  (tokenizeErr, tokenizedPayload) => {
            if (tokenizeErr) {
              console.error('There was an error tokenizing the bank details.');
              throw tokenizeErr;
            }
            console.log(tokenizedPayload);
            console.log('Got a nonce: ' + tokenizedPayload.nonce);
            document.getElementById('nonce').value = tokenizedPayload.nonce;
            document.getElementById('button-pay').setAttribute("disabled", "true");
            document.getElementById('button-pay').style.backgroundColor = "grey";
            document.getElementById('button-pay').innerHTML = "Processing Order";
            addNonceTypeToFormInput(form, AchNonceType);
            addAddressToFormInput(form, billingAddress, BillingAddress);
            addAddressToFormInput(form, shippingAddress, ShippingAddress);
            addLineItemsToFormInput(form, lineItems);
            addAchDescriptionToFormInput(form, tokenizedPayload.description);
            form.submit();
            // Submit tokenizedPayload.nonce to your server as you would
            // other payment method nonces.
          });


        }, false);



      });
    });

  });


function toggleFields() {
  var ownershipType = document.getElementById("ownership-type").value;
  var personalFields = document.getElementById("personalFields");
  var businessFields = document.getElementById("businessFields");

  if (ownershipType === "personal") {
    personalFields.style.display = "block";
    businessFields.style.display = "none";
  } else if (ownershipType === "business") {
    personalFields.style.display = "none";
    businessFields.style.display = "block";
  } else {
    personalFields.style.display = "none";
    businessFields.style.display = "none";
  }
}
