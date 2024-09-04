import { GraphQLClient, rawRequest, gql } from 'graphql-request'

const Mutation = "mutation";
const ChargePaymentMethod = "chargePaymentMethod";
const ChargePaymentMethodInput = "ChargePaymentMethodInput";
const ChargeCreditCard = "chargeCreditCard";
const ChargeCreditCardInput = "ChargeCreditCardInput";
const ChargePayPalAccount = "chargePayPalAccount";
const ChargePayPalAccountInput = "ChargePayPalAccountInput";
const TransactionLabel = "transaction";
const AmountLabel = "amount";
const AmountValue = "value";
const AmountCurrencyCode = "currencyCode";
const ShippingLabel = "shipping";
const ShippingAddressLabel = "shippingAddress";
const BillingAddressLabel = "billingAddress";
const NewId = "id";
const LagacyId = "legacyId";
const Status = "status";
const CreateAt = "createdAt";
const OrderId = "orderId";
const FirstName = "firstName";
const LastName = "lastName";
const FullName = "fullName";
const CustomerLabel = "customer";
const Email = "email";
const AddressLine1 = "addressLine1";
const AddressLine2 = "addressLine2";
const AdminArea1 = "adminArea1";
const AdminArea2 = "adminArea2";
const PostalCode = "postalCode";
const CountryCode = "countryCode";
const PhoneNumber = "phoneNumber";
const PaymentMethodSnapshotLabel = "paymentMethodSnapshot";
const __TypeName = "__typename";
const CreditCardDetailsLabel = "CreditCardDetails";
const PayPalTransactionDetailsLabel = "PayPalTransactionDetails";
const Last4 = "last4";
const BrandCode = "brandCode";
const AuthorizationId = "authorizationId";
const CaptureId = "captureId";
const PayerStatus = "payerStatus";
const PaymentId = "paymentId";
const SellerProtectionStatus = "sellerProtectionStatus";
const PayPalPayerLabel = "payer";
const PayPalPayeeLabel = "payee";
const Phone = "phone";
const PayerId = "payerId";
const TransactionFeeLabel = "transactionFee";
const CreateClientTokenInput = "CreateClientTokenInput";
const CreateClientToken = "createClientToken";
const ClientToken = "clientToken";
const CustomerId = "id";
const CustomerLegacyId = "legacyId";

const Amount = `
${AmountLabel} {
    ${AmountValue}
    ${AmountCurrencyCode}
}`

const TransactionFee = `
${TransactionFeeLabel} {
    ${AmountValue}
    ${AmountCurrencyCode}
}`

const Shipping = `
${ShippingLabel} {
    ${ShippingAddressLabel} {
        ${FirstName}
        ${LastName}
        ${AddressLine1}
        ${AddressLine2}
        ${AdminArea1}
        ${AdminArea2}
        ${PostalCode}
        ${CountryCode}
        ${PhoneNumber}
    }
}`

const BillingAddress = `
${BillingAddressLabel} {
    ${FirstName}
    ${LastName}
    ${AddressLine1}
    ${AddressLine2}
    ${AdminArea1}
    ${AdminArea2}
    ${PostalCode}
    ${CountryCode}
    ${PhoneNumber}
}`

const Customer = `
${CustomerLabel} {
    ${CustomerId}
    ${CustomerLegacyId}
    ${Email}
    ${PhoneNumber}
}`

const CreditCardDetails = `
... on ${CreditCardDetailsLabel} {
    ${Last4}
    ${BrandCode}
}`

const PayPalPayer = `
${PayPalPayerLabel} {
    ${Email}
    ${Phone}
    ${PayerId}
}`

const PayPalPayee = `
${PayPalPayeeLabel} {
    ${Email}
    ${Phone}
    ${PayerId}
}`

const PayPalTransactionDetails = `
... on ${PayPalTransactionDetailsLabel} {
    ${AuthorizationId}
    ${CaptureId}
    ${PayPalPayer}
    ${PayPalPayee}
    ${PayerStatus}
    ${PaymentId}
    ${SellerProtectionStatus}
    ${TransactionFee}
}
`

const PaymentMethodSnapshot = `
${PaymentMethodSnapshotLabel} {
    ${__TypeName}
    ${CreditCardDetails}
    ${PayPalTransactionDetails}
}`

const CreditCardTransactions = `
${TransactionLabel} {
    ${NewId}
    ${LagacyId}
    ${Status}
    ${CreateAt}
    ${OrderId}
    ${Amount}
    ${Shipping}
    ${BillingAddress}
    ${Customer}
    ${PaymentMethodSnapshot}
}`

const PayPalTransactions = `
${TransactionLabel} {
    ${NewId}
    ${LagacyId}
    ${Status}
    ${CreateAt}
    ${OrderId}
    ${Amount}
    ${Shipping}
    ${BillingAddress}
    ${Customer}
    ${PaymentMethodSnapshot}
}`

const ChargeCreditCardMutation = gql`${Mutation} ChargeCreditCard($input: ${ChargeCreditCardInput}!) {
    ${ChargeCreditCard}(input: $input) {
        ${CreditCardTransactions}
    }
}`

const ChargePayPalAccountMutation = gql`${Mutation} ChargePayPalAccount($input: ${ChargePayPalAccountInput}!) {
    ${ChargePayPalAccount}(input: $input) {
        ${PayPalTransactions}
    }
}`

const CreateClientTokenMutation = gql`${Mutation} CreateClientToken($input: ${CreateClientTokenInput}){ 
    ${CreateClientToken}(input: $input) {
        ${ClientToken}
    }
  }`

const CreateClientTokenWithoutCustomerIdMutation = gql`${Mutation} CreateClientToken($input: ${CreateClientTokenInput}) {
    ${CreateClientToken}(input: $input) {
        ${ClientToken}
    }
}`

const gqlQueryAndMutation = {
    getChargeCreditCardMutation() {
        return ChargeCreditCardMutation;
    },

    getChargePayPalAccountMutation() {
        return ChargePayPalAccountMutation;
    },

    getCreateClientTokenMutation() {
        return CreateClientTokenMutation;
    }
}

export default gqlQueryAndMutation;