import crypto from "crypto";

const MerchantAccountIdUSD = "cwBTtest";
const MerchantAccountIdEUR = "cwBTLPMtest";
const VaultPaymentMethodCriteria = "ON_SUCCESSFUL_TRANSACTION";
const TRUE = "true"

const gqlQueryAndMutationVariables = {
    getChargeCreditCardVariables(requestBody) {
        console.log(requestBody)

        const nonceFromTheClient = requestBody.payment_method_nonce;
        const invoiceId = crypto.randomUUID();
        if (requestBody.vaultpaymentmethod == TRUE && requestBody.vaultexistingcustomer == TRUE) {
            console.log("vault payment method:" + requestBody.vaultpaymentmethod);
            console.log("vault existing customer :" + requestBody.vaultexistingcustomer);
            const variables = {
                input: {
                    paymentMethodId: nonceFromTheClient,
                    options: {
                        billingAddress: {
                            firstName: requestBody.billingAddress.firstName,
                            lastName: requestBody.billingAddress.lastName,
                            addressLine1: requestBody.billingAddress.line1,
                            addressLine2: requestBody.billingAddress.line2,
                            adminArea1: requestBody.billingAddress.state,
                            adminArea2: requestBody.billingAddress.city,
                            postalCode: requestBody.billingAddress.postalCode,
                            countryCode: requestBody.billingAddress.countryCode
                        }
                    },
                    transaction: {
                        amount: requestBody.amount,
                        merchantAccountId: MerchantAccountIdUSD,
                        orderId: invoiceId,
                        shipping: {
                            shippingAddress: {
                                firstName: requestBody.shippingAddress.firstName,
                                lastName: requestBody.shippingAddress.lastName,
                                addressLine1: requestBody.shippingAddress.line1,
                                addressLine2: requestBody.shippingAddress.line2,
                                adminArea1: requestBody.shippingAddress.state,
                                adminArea2: requestBody.shippingAddress.city,
                                postalCode: requestBody.shippingAddress.postalCode,
                                countryCode: requestBody.shippingAddress.countryCode
                            }
                        },
                        vaultPaymentMethodAfterTransacting: {
                            when: VaultPaymentMethodCriteria
                        },
                        customerId: requestBody.existingcustomerid
                    }
                }
            };
            console.log(variables);
            return variables;
        } else if (requestBody.vaultpaymentmethod == TRUE && requestBody.vaultnewcustomer == TRUE) {
            console.log("vault payment method:" + requestBody.vaultpaymentmethod);
            console.log("vault existing customer :" + requestBody.vaultnewcustomer);
            const variables = {
                input: {
                    paymentMethodId: nonceFromTheClient,
                    options: {
                        billingAddress: {
                            firstName: requestBody.billingAddress.firstName,
                            lastName: requestBody.billingAddress.lastName,
                            addressLine1: requestBody.billingAddress.line1,
                            addressLine2: requestBody.billingAddress.line2,
                            adminArea1: requestBody.billingAddress.state,
                            adminArea2: requestBody.billingAddress.city,
                            postalCode: requestBody.billingAddress.postalCode,
                            countryCode: requestBody.billingAddress.countryCode
                        }
                    },
                    transaction: {
                        amount: requestBody.amount,
                        merchantAccountId: MerchantAccountIdUSD,
                        orderId: invoiceId,
                        shipping: {
                            shippingAddress: {
                                firstName: requestBody.shippingAddress.firstName,
                                lastName: requestBody.shippingAddress.lastName,
                                addressLine1: requestBody.shippingAddress.line1,
                                addressLine2: requestBody.shippingAddress.line2,
                                adminArea1: requestBody.shippingAddress.state,
                                adminArea2: requestBody.shippingAddress.city,
                                postalCode: requestBody.shippingAddress.postalCode,
                                countryCode: requestBody.shippingAddress.countryCode
                            }
                        },
                        vaultPaymentMethodAfterTransacting: {
                            when: VaultPaymentMethodCriteria
                        },
                        customerDetails: {
                            email: requestBody.email,
                            phoneNumber: requestBody.billingAddress.phone
                        }
                    }
                }
            };
            console.log(variables);
            return variables;
        } else {
            const variables = {
                input: {
                    paymentMethodId: nonceFromTheClient,
                    options: {
                        billingAddress: {
                            firstName: requestBody.billingAddress.firstName,
                            lastName: requestBody.billingAddress.lastName,
                            addressLine1: requestBody.billingAddress.line1,
                            addressLine2: requestBody.billingAddress.line2,
                            adminArea1: requestBody.billingAddress.state,
                            adminArea2: requestBody.billingAddress.city,
                            postalCode: requestBody.billingAddress.postalCode,
                            countryCode: requestBody.billingAddress.countryCode
                        }
                    },
                    transaction: {
                        amount: requestBody.amount,
                        merchantAccountId: MerchantAccountIdUSD,
                        orderId: invoiceId,
                        shipping: {
                            shippingAddress: {
                                firstName: requestBody.shippingAddress.firstName,
                                lastName: requestBody.shippingAddress.lastName,
                                addressLine1: requestBody.shippingAddress.line1,
                                addressLine2: requestBody.shippingAddress.line2,
                                adminArea1: requestBody.shippingAddress.state,
                                adminArea2: requestBody.shippingAddress.city,
                                postalCode: requestBody.shippingAddress.postalCode,
                                countryCode: requestBody.shippingAddress.countryCode
                            }
                        },
                        customerDetails: {
                            email: requestBody.email,
                            phoneNumber: requestBody.billingAddress.phone
                        }
                    }
                }
            };
            console.log(variables);
            return variables;
        }
    },

    splitPayPalShippingAddressObjectRecipientName(recipientName) {
        return recipientName.split(' ');
    },

    getChargePayPalAccountVariables(requestBody) {
        console.log(requestBody)

        const nonceFromTheClient = requestBody.payment_method_nonce;
        const invoiceId = crypto.randomUUID();
        if (requestBody.vaultpaymentmethod == TRUE && requestBody.vaultexistingcustomer == TRUE) {
            console.log("vault payment method:" + requestBody.vaultpaymentmethod);
            console.log("vault existing customer :" + requestBody.vaultexistingcustomer);
            const variables = {
                input: {
                    paymentMethodId: nonceFromTheClient,
                    transaction: {
                        amount: requestBody.amount,
                        merchantAccountId: MerchantAccountIdUSD,
                        orderId: invoiceId,
                        shipping: {
                            shippingAddress: {
                                firstName: this.splitPayPalShippingAddressObjectRecipientName(requestBody.paypalShippingAddress.recipientName)[0],
                                lastName: this.splitPayPalShippingAddressObjectRecipientName(requestBody.paypalShippingAddress.recipientName)[1],
                                addressLine1: requestBody.paypalShippingAddress.line1,
                                addressLine2: requestBody.paypalShippingAddress.line2,
                                adminArea1: requestBody.paypalShippingAddress.state,
                                adminArea2: requestBody.paypalShippingAddress.city,
                                postalCode: requestBody.paypalShippingAddress.postalCode,
                                countryCode: requestBody.paypalShippingAddress.countryCode
                            }
                        },
                        vaultPaymentMethodAfterTransacting: {
                            when: VaultPaymentMethodCriteria
                        },
                        customerId: requestBody.existingcustomerid
                    }
                }
            };
            console.log(variables);
            return variables;
        } else if (requestBody.vaultpaymentmethod == TRUE && requestBody.vaultnewcustomer == TRUE) {
            console.log("vault payment method:" + requestBody.vaultpaymentmethod);
            console.log("vault existing customer :" + requestBody.vaultnewcustomer);
            const variables = {
                input: {
                    paymentMethodId: nonceFromTheClient,
                    transaction: {
                        amount: requestBody.amount,
                        merchantAccountId: MerchantAccountIdUSD,
                        orderId: invoiceId,
                        shipping: {
                            shippingAddress: {
                                firstName: this.splitPayPalShippingAddressObjectRecipientName(requestBody.paypalShippingAddress.recipientName)[0],
                                lastName: this.splitPayPalShippingAddressObjectRecipientName(requestBody.paypalShippingAddress.recipientName)[1],
                                addressLine1: requestBody.paypalShippingAddress.line1,
                                addressLine2: requestBody.paypalShippingAddress.line2,
                                adminArea1: requestBody.paypalShippingAddress.state,
                                adminArea2: requestBody.paypalShippingAddress.city,
                                postalCode: requestBody.paypalShippingAddress.postalCode,
                                countryCode: requestBody.paypalShippingAddress.countryCode
                            }
                        },
                        vaultPaymentMethodAfterTransacting: {
                            when: VaultPaymentMethodCriteria
                        },
                        customerDetails: {
                            email: requestBody.paypalAccountDetails.email,
                            phoneNumber: requestBody.paypalAccountDetails.phone
                        }
                    }
                }
            };
            console.log(variables);
            return variables;
        } else {
            const variables = {
                input: {
                    paymentMethodId: nonceFromTheClient,
                    transaction: {
                        amount: requestBody.amount,
                        merchantAccountId: MerchantAccountIdUSD,
                        orderId: invoiceId,
                        shipping: {
                            shippingAddress: {
                                firstName: this.splitPayPalShippingAddressObjectRecipientName(requestBody.paypalShippingAddress.recipientName)[0],
                                lastName: this.splitPayPalShippingAddressObjectRecipientName(requestBody.paypalShippingAddress.recipientName)[1],
                                addressLine1: requestBody.paypalShippingAddress.line1,
                                addressLine2: requestBody.paypalShippingAddress.line2,
                                adminArea1: requestBody.paypalShippingAddress.state,
                                adminArea2: requestBody.paypalShippingAddress.city,
                                postalCode: requestBody.paypalShippingAddress.postalCode,
                                countryCode: requestBody.paypalShippingAddress.countryCode
                            }
                        },
                        customerDetails: {
                            email: requestBody.paypalAccountDetails.email,
                            phoneNumber: requestBody.paypalAccountDetails.phone
                        }
                    }
                }
            };
            console.log(variables);
            return variables;
        }

    },

    getCreateClientTokenVariables(requestBody) {
        if (requestBody.customerId) {
            const variable = {
                input: {
                    clientToken: {
                        customerId: requestBody.customerId
                    }
                }
            };
            return variable;
        } else {
            const variable = {};
            return variable;
        }
    }

}

export default gqlQueryAndMutationVariables;