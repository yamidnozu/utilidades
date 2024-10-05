const express = require("express");
const cors = require("cors");
const app = express();
const port = 9002;

// const corsOptions = {
//     origin: '*', // Permite cualquier origen
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization', 'fflags-app', 'fflags-key', 'origin', 'x-requested-with'],
//     credentials: true,
//     optionsSuccessStatus: 200
// };

const corsOptions = {
  origin: "*", // Permite cualquier origen
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "fflags-app",
    "fflags-key",
    "Origin",
    "X-Requested-With",
    "Accept",
    "Access-Control-Allow-Origin",
    "Access-Control-Allow-Credentials",
    "Access-Control-Allow-Methods",
    "Access-Control-Allow-Headers",
    "sec-ch-ua",
    "message-id",
    "device-id",
    "channel",
    "device-info",
    "sec-ch-ua-platform",
    "session-tracker",
    "request-timestamp",
    "sec-ch-ua-mobile",
    "User-Agent",
    "Referer",
    "platform-type",
    "ip",
    "app-version",
  ],
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());

// Responder a solicitudes preflight (OPTIONS)
app.options("*", cors(corsOptions));

// ORIGINAL = app.post('/feature/flags/api/client/features/validate', (req, res) => {
// app.post('/feature/flags/api/client/features/validate', (req, res) => {
app.post("/feature/flags/api/client/features/validate", (req, res) => {
  console.log("FEATURE FLAGS :: Entra");
  res.json({
    data: [
      { name: "mfFinancialLeasing", enabled: true },
      { name: "mfOrderAgreement", enabled: true },
      // { "name": "mfBalances", "enabled": true },
      // { "name": "MNF", "enabled": true },
      // { "name": "mfPaymentHistory", "enabled": true },
      // { "name": "mfCdt", "enabled": true },
      // { "name": "mfFic", "enabled": true },
      // { "name": "mfTdc", "enabled": true },
      // { "name": "mfConsolidatedBalances", "enabled": true },
      // { "name": "mfCredits", "enabled": true },
      // { "name": "mfTransfers", "enabled": true },
      // { "name": "mfOwnCreditPayment", "enabled": true },
      // { "name": "mfAuditReview", "enabled": true },
      // { "name": "mfStatements", "enabled": true },
      // { "name": "mfMailboxDownload", "enabled": true },
      // { "name": "mfCreditCardPayment", "enabled": true },
      // { "name": "mfPayrollProvidersPayment", "enabled": true },
      // { "name": "mfProductManagement", "enabled": true },
      // { "name": "mfRegistedInvoices", "enabled": true },
      // { "name": "mfSupportLanding", "enabled": true },
      // { "name": "mfAgilePayment", "enabled": true },
      // { "name": "mfBlockCheck", "enabled": true },
      // { "name": "digitalRescue", "enabled": true },
      // { "name": "mfFilePayment", "enabled": false },
      // { "name": "mfBatchHistory", "enabled": true },
      // { "name": "mfStatementsDocuments", "enabled": true },
      // { "name": "mfStatementsCertifications", "enabled": true },
      // { "name": "mfManualPayment", "enabled": true },
      // { "name": "mfThirdPartyProducts", "enabled": true },
      // { "name": "mfProfileSettingsLimitsSettings", "enabled": true },
      // { "name": "mfProfileSettingsTokenStatus", "enabled": true },
      // { "name": "virtualInvestmentOpening", "enabled": true },
      // {
      //     "name": "mfBalances",
      //     "enabled": true
      // },
      // {
      //     "name": "mfConsolidatedBalances",
      //     "enabled": true
      // },
      // {
      //     "name": "mfCdt",
      //     "enabled": true
      // },
      // {
      //     "name": "mfCredits",
      //     "enabled": true
      // },
      // {
      //     "name": "mfTdc",
      //     "enabled": true
      // },
      // {
      //     "name": "mfPaymentHistory",
      //     "enabled": true
      // },
      // {
      //     "name": "mfFic",
      //     "enabled": true
      // },
      // {
      //     "name": "mfOwnCreditPayment",
      //     "enabled": true
      // },
      // {
      //     "name": "mfAuditReview",
      //     "enabled": true
      // },
      // {
      //     "name": "mfStatements",
      //     "enabled": true
      // },
      // {
      //     "name": "mfMailboxDownload",
      //     "enabled": true
      // },
      // {
      //     "name": "mfCreditCardPayment",
      //     "enabled": true
      // },
      // {
      //     "name": "mfTransfers",
      //     "enabled": true
      // },
      // {
      //     "name": "mfPayrollProvidersPayment",
      //     "enabled": true
      // },
      // {
      //     "name": "mfProductManagement",
      //     "enabled": true
      // },
      // {
      //     "name": "mfRegistedInvoices",
      //     "enabled": true
      // },
      // {
      //     "name": "mfSupportLanding",
      //     "enabled": true
      // },
      // {
      //     "name": "mfBlockCheck",
      //     "enabled": true
      // },
      // {
      //     "name": "mfTransactionScheduling",
      //     "enabled": true
      // },   {
      //     "name": "digitalRescue",
      //     "enabled": true
      // },
      // {
      //     "name": "mfFilePayment",
      //     "enabled": false
      // },
      // {
      //     "name": "mfBatchHistory",
      //     "enabled": true
      // },
      // {
      //     "name": "mfStatementsDocuments",
      //     "enabled": true
      // },
      // {
      //     "name": "mfStatementsCertifications",
      //     "enabled": true
      // },
      // {
      //     "name": "mfManualPayment",
      //     "enabled": true
      // },
      // {
      //     "name": "mfThirdPartyProducts",
      //     "enabled": true
      // },
      // {
      //     "name": "mfProfileSettingsLimitsSettings",
      //     "enabled": true
      // },
      // {
      //     "name": "mfProfileSettingsTokenStatus",
      //     "enabled": true
      // },
      // {
      //     "name": "virtualInvestmentOpening",
      //     "enabled": true
      // },
      // {
      //     "name": "mfAgilePayment",
      //     "enabled": true
      // },
    ],
  });
});

// localhost:9002/neg/api/v1/security-filters/ch_ms_authentication/authentication/auth
// ORIGINAL = app.post('/neg/api/v1/security-filters/ch_ms_authentication/authentication/auth', (req, res) => {
// app.post('/neg/api/v1/security-filters/ch_ms_authentication/authentication/auth', (req, res) => {
//     console.log('Entra AUTH');
//     res.json({
//         "data": [
//             {
//                 "id": "some-unique-id",
//                 "type": "some-type",
//                 "attributes": {
//                     "companyId": "company-id-123",
//                     "userId": "user-id-123",
//                     "timestamp": "20230601T123456789",
//                     "ip": "192.168.1.1",
//                     "appId": "SVN",
//                     "appModule": "001",
//                     "param": {
//                         "sessionDataRS": {
//                             "lastAuthenticationTime": "2023-06-01T12:34:56.789Z",
//                             "accessToken": "mock-access-token",
//                             "refreshToken": "mock-refresh-token",
//                             "expiresIn": "3600",
//                             "sessionId": "mock-session-id",
//                             "lastAuthenticationIp": "192.168.1.1",
//                             "scope": "authenticityFilialesExteriorScope",
//                             "tokenType": "bearer"
//                         },
//                         "userDataRS": {
//                             "companyName": "Mock Company",
//                             "documentType": "CC",
//                             "companyId": "company-id-123",
//                             "userId": "user-id-123",
//                             "userDocumentType": "CC",
//                             "userDocumentId": "123456789",
//                             "userName": "Mock User",
//                             "userSurname": "Mock Surname",
//                             "userRole": "admin",
//                             "userDocumentTypeId": "1",
//                             "documentTypeId": "1"
//                         }
//                     }
//                 }
//             }
//         ]
//     }
//     );
// });

app.post(
  "/neg/api/v1/security-filters/ch_ms_authentication/authentication/auth",
  (req, res) => {
    console.log("Entra AUTHEEEE");
    res.json({
      data: [
        {
          id: "217900e1-83de-d1b5-0de5-9a199f398917", // sessionId as id
          type: "some-type",
          attributes: {
            companyId: "12240954",
            userId: "leasing3",
            timestamp: "20230601T123456789",
            ip: "186.84.208.17",
            appId: "SVN",
            appModule: "001",
            param: {
              sessionDataRS: {
                lastAuthenticationTime: "viernes 17 de mayo de 2024 1:36 p. m.",
                accessToken:
                  "eyJhbGciOiJIUzI1NiJ9.eyJjb21wYW55LW5hbWUiOiJMRUFTSU5HIDMiLCJkb2N1bWVudFR5cGUiOiJOSVQiLCJkb2N1bWVudE51bWJlciI6IjEyMjQwOTU0Iiwia2lkIjoiQVlBQmVGZ1JNWnc3L2tKUjBTNmF1RTZNQmprQUFBQUJBQWRoZDNNdGEyMXpBRXRoY200NllYZHpPbXR0Y3pwMWN5MWxZWE4wTFRFNk1UZzNOalkyT1RVNU56RTBPbXRsZVM4d01UZGhNakEzT1Mxa05HWTFMVFF6TWpVdFlXSXhNaTAwWXpnek5EWXhaVEkwTURRQXVBRUNBUUI0QUlLN0V1VVJBcjhZOUFLNkc1b1JZQUZiQTdNYS9rOFpjSExkRnZwZkpuOEJCeHliQ3VwMm1XeG9icnJBei9WbWFBQUFBSDR3ZkFZSktvWklodmNOQVFjR29HOHdiUUlCQURCb0Jna3Foa2lHOXcwQkJ3RXdIZ1lKWUlaSUFXVURCQUV1TUJFRURNblY1VXRDUnQraHlOSzZSZ0lCRUlBNzdncHpoUXhLZi9YNVpOOCthVmNrSWdqNktzSmtEUlpTYjA2bW4yWGE5Y21hK3U1UnRmc1JoTHRNa0FvSWYrVFd0bmtiQU5mbnh5VnNMcjhDQUFBQUFBd0FBQkFBQUFBQUFBQUFBQUFBQUFBQTVaZWhJZCtCUVI2bUM3RlNBMHYrZS8vLy8vOEFBQUFCQUFBQUFBQUFBQUFBQUFBQkFBQUFMSnpEamtXcjNpWXgzazRTdk9GREVWbE04YVc1cEZDOFZJaEErNFlsVlVYaVk5cmpaUUprSWwwQ2pDYmQ1aEpuL09xZXYvcWM0NDFhMHZ4WlRBPT0iLCJjaGFubmVsIjoiTkVHIiwidXNlci1kb2N1bWVudC10eXBlIjoiMTIyNDA5NTQiLCJkb2N1bWVudC10eXBlIjoiTklUIiwidXNlci1kb2N1bWVudC10eXBlIjoiQVlBQmVBbzR5UUZvemsrZlhMN0lTbGVPa2JjQUFBQUJBQWRoZDNNdGEyMXpBRXRoY200NllYZHpPbXR0Y3pwMWN5MWxZWE4wTFRFNk1UZzNOalkyT1RVNU56RTBPbXRsZVM4d01UZGhNakEzT1Mxa05HWTFMVFF6TWpVdFlXSXhNaTAwWXpnek5EWXhaVEkwTURRQXVBRUNBUUI0QUlLN0V1VVJBcjhZOUFLNkc1b1JZQUZiQTdNYS9rOFpjSExkRnZwZkpuOEJCeHliQ3VwMm1XeG9icnJBei9WbWFBQUFBSDR3ZkFZSktvWklodmNOQVFjR29HOHdiUUlCQURCb0Jna3Foa2lHOXcwQkJ3RXdIZ1lKWUlaSUFXVURCQUV1TUJFRURNblY1VXRDUnQraHlOSzZSZ0lCRUlBNzdncHpoUXhLZi9YNVpOOCthVmNrSWdqNktzSmtEUlpTYjA2bW4yWGE5Y21hK3U1UnRmc1JoTHRNa0FvSWYrVFd0bmtiQU5mbnh5VnNMcjhDQUFBQUFBd0FBQkFBQUFBQUFBQUFBQUFBQUFBQXlZV1dlSGVoSk9YSEhYTExVOEJIMFAvLy8vOEFBQUFCQUFBQUFBQUFBQUFBQUFBQkFBQUFBZ2V4dnNBRW1FTDNvbkd0VElodzlXcHlqUT09Iiwic2NvcGUiOiJORUciLCJuYW1lIjoiSmVzdXMgQW5kcmVzIEFjZW5kcmEgTWFydGluZXoiLCJleHAiOjE3MTY4MjE0NzgsImFwcGxpY2F0aW9uLWlkIjoiU1ZOIiwidXNlcm5hbWUiOiJsZWFzaW5nMyJ9.R9bpgNq9f_oKov6Dqi-9I7kbh38w3F3OLYIbWXg0qOU",
                refreshToken: "H2IW8UW2QCWEN_3BD3smR_OH5cro3E9O",
                expiresIn: "3600",
                sessionId: "217900e1-83de-d1b5-0de5-9a199f398917",
                lastAuthenticationIp: "10.2.1.11",
                scope: "NEG",
                tokenType: "bearer",
              },
              userDataRS: {
                companyName: "LEASING 3",
                documentType: "NIT",
                companyId: "12240954",
                userId: "leasing3",
                userDocumentType: "Cédula de ciudadanía",
                userDocumentId: "12240954",
                userName: "Jesus Andres",
                userSurname: "Acendra Martinez",
                userRole: "A",
                userDocumentTypeId: "CC",
                documentTypeId: "3",
              },
            },
          },
        },
      ],
    });
  }
);

//https://canalnegocios-ext-qa.apps.ambientesbc.com/neg/api/v1/security-filters/fraud-monitoring/generateCSID-obj
//localhost:9002/neg/api/v1/security-filters/fraud-monitoring/generateCSID-obj
//https://canalnegocios-ext-qa.apps.ambientesbc.com
// ORIGINAL = app.post('/neg/api/v1/security-filters/fraud-monitoring/generateCSID-obj', (req, res) => {
app.post(
  "/neg/api/v1/security-filters/fraud-monitoring/generateCSID-obj",
  (req, res) => {
    delete req.headers["origin"];
    console.log("Entra CSID");
    res.json({
      meta: {
        _messageId: "a8559c26-cd61-44a5-bf28-0fc3c9082dee",
        _requestDateTime: "2024-06-07T17:30:43.545Z",
        _applicationId: "3ca64e4063553adeafc7b28e7ed8ad8a",
      },
      data: {
        CSID: "350f3366-cce9-4436-8727-107292c8cf7f",
        date: "2024-06-07",
        time: "17:30:44.105317",
        transactionInformation: {
          date: "2024-06-10",
          time: "20,00,28",
          trace: "20002820240610",
          CID: "d0693195-375d-409a-850c-bf978dedc873",
          channel: "SVN",
        },
      },
    });
  }
);

//https://canalnegocios-ext-qa.apps.ambientesbc.com/neg/api/v1/security-filters/ch_ms_balances/balances/summydep
//https://canalnegocios-ext-qa.apps.ambientesbc.com/neg/api/v1/security-filters/ch_ms_balances/balances/summydep
//https://canalnegocios-ext-qa.apps.ambientesbc.com
// ORIGINAL = app.post('/neg/api/v1/security-filters/ch_ms_balances/balances/summydep', (req, res) => {
app.post(
  "/neg/api/v1/security-filters/ch_ms_balances/balances/summydep",
  (req, res) => {
    console.log("Entra AUTH");
    res.json({
      data: [
        {
          type: "SUMYRSDEP",
          id: "0d028d42-1fee-63cf-8e82-a54dc535e6a0",
          attributes: {
            companyId: "12240954",
            userId: "leasing3",
            timestamp: "20240607173042000",
            ip: "186.84.208.17",
            appId: "SVN",
            appModule: "TRX",
            origin: "WEB",
            currency: "COP",
            language: "es",
            param: {
              accounts: [
                {
                  acctId: "406-709540-25",
                  typeAccount: "DEPOSITO",
                  category: "ACTIVOS",
                  acctTypeCode: "7",
                  acctTypeDesc: "Ahorros",
                  bankId: "5600078",
                  exchangeBalance: 0.0,
                  availableBalance: 0.0,
                  totalBalance: 0.0,
                  currency: "COP",
                  accountHolder: "12240954",
                  view: "Y",
                  debit: "Y",
                  credit: "Y",
                },
                {
                  acctId: "406-709540-40",
                  typeAccount: "DEPOSITO",
                  category: "ACTIVOS",
                  acctTypeCode: "7",
                  acctTypeDesc: "Ahorros",
                  bankId: "5600078",
                  exchangeBalance: 0.0,
                  availableBalance: 0.0,
                  totalBalance: 0.0,
                  currency: "COP",
                  accountHolder: "12240954",
                  view: "Y",
                  debit: "Y",
                  credit: "Y",
                },
                {
                  acctId: "406-740954-26",
                  typeAccount: "DEPOSITO",
                  category: "ACTIVOS",
                  acctTypeCode: "7",
                  acctTypeDesc: "Ahorros",
                  bankId: "5600078",
                  exchangeBalance: 0.0,
                  availableBalance: 0.0,
                  totalBalance: 0.0,
                  currency: "COP",
                  accountHolder: "12240954",
                  view: "Y",
                  debit: "Y",
                  credit: "Y",
                },
                {
                  acctId: "406-740954-50",
                  typeAccount: "DEPOSITO",
                  category: "ACTIVOS",
                  acctTypeCode: "7",
                  acctTypeDesc: "Ahorros",
                  bankId: "5600078",
                  exchangeBalance: 0.0,
                  availableBalance: 0.0,
                  totalBalance: 0.0,
                  currency: "COP",
                  accountHolder: "12240954",
                  view: "Y",
                  debit: "Y",
                  credit: "Y",
                },
                {
                  acctId: "406-740954-51",
                  typeAccount: "DEPOSITO",
                  category: "ACTIVOS",
                  acctTypeCode: "7",
                  acctTypeDesc: "Ahorros",
                  bankId: "5600078",
                  exchangeBalance: 0.0,
                  availableBalance: 0.0,
                  totalBalance: 0.0,
                  currency: "COP",
                  accountHolder: "12240954",
                  view: "Y",
                  debit: "Y",
                  credit: "Y",
                },
              ],
            },
          },
        },
      ],
    });
  }
);

//https://wup-natashatest.us.v2.customers.biocatch.com/client/v3/web/wup?cid=natashatest
//https://wup-natashatest.us.v2.customers.biocatch.com/client/v3/web/wup?cid=natashatest
// ORIGINAL = app.post('/client/v3/web/wup?cid=natashatest', (req, res) => {
app.post("/client/v3/web/wup", (req, res) => {
  console.log("Entra AUTH");
  res.json({
    wupsSendRate: 5000,
    crossDomainsTimeout: 5000,
    isCrossdomain: true,
    crossDomainsList:
      '["https://1.a79ab95c1589a13f8a4cab612bc71f9f7.com/scripts/prod/crossdomain.html","https://1.b406929acabac9b095f124c81bdfcf57f.com/scripts/prod/crossdomain.html","https://1.c81358859121583b7adf2ace89cb39f44.com/scripts/prod/crossdomain.html"]',
    std: "gAAAAABmY4wxnoqqYqoYoic8IDm0vjzpXOEYh8stcqocUbso1yJ7jImmbL9hgyKO94F1oAQunAgoVhB5sy7R_VyACxtsPxW8ebbvOgTaU3_GuOF_M5zHEUSplv0-2EkyET5vTY5uN5oZNanHo-YnW8vHOvo1bEvM4fppEVv5zo7wm9SYfxbLxluEyyA4D9-bAkNcch-aTqY968vNM4zxGaxSvofz6W0WKg==",
    sts: "gAAAAABmY4wxaa39G88QgACpO7SAVnd-QhUwMzEQgr13UfI8plRZjypMauot_lfpsiWq7lXeyheOz0_EdQh2BL8ydJ2UtUBVJjsSKRGcmAqTbvjn3pSFZFhZCqGOChbQlqVdE-6N0vDHUjlBcY3jZaURuBA0hSTMzJ_KosbBDlNpu3jRoOFNG9FVxhbgeF-C5wrCuA14Di4bMdqIVkBeH4JEa72vgzqy2K3QWfcGzdbYrr67xoMNStHcwI4g5WUOa17_67ZCtU9ABj6sUxxaqlDtZiJRJgE9sRkEFxeuQQpX5IdET7i49-asks3NqOLf-XfXExS3xm_72PdB4Uy38-BOx0MqhGumzT_2jEpMy6mFaxaVu5eZcHSbWhufdygXlrl1iuP19LYLfS8bFfQxUyKsJVPhPI2T6A==",
    nextWupInterval: 5000,
  });
});

//https://canales-tradicionales-ext-qa.apps.ambientesbc.com/digital-predictive-ctc/external-connection-mtx/genesys/data-table/data-rows-flow/5519eb85-3557-4b3b-9947-c74c756aeccc?showbrief=false
//https://canales-tradicionales-ext-qa.apps.ambientesbc.com/digital-predictive-ctc/external-connection-mtx/genesys/data-table/data-rows-flow/5519eb85-3557-4b3b-9947-c74c756aeccc?showbrief=false
// ORIGINAL = app.post('/digital-predictive-ctc/external-connection-mtx/genesys/data-table/data-rows-flow/5519eb85-3557-4b3b-9947-c74c756aeccc?showbrief=false', (req, res) => {
// app.post('/digital-predictive-ctc/external-connection-mtx/genesys/data-table/data-rows-flow/5519eb85-3557-4b3b-9947-c74c756aeccc?showbrief=false', (req, res) => {
app.post(
  "/digital-predictive-ctc/external-connection-mtx/genesys/data-table/data-rows-flow/:id",
  (req, res) => {
    console.log("Entra AUTH");
    res.json({
      entities: [
        {
          scheduled_group: "3056f757-7fcc-4e82-9208-00c4cb7e3be0",
          feebak_organization_id: "38",
          Description: "Libre inversión - Ventas Digitales",
          is_active: true,
          consumer_properties:
            "U2FsdGVkX1+6SbM0xPXyqHtdjK8Yw6zmpkdJy6GcwSK2bhbgZ0ncw80Gv1bSPwTPexyptR/DfIXDjdyQpOssA41jaHULlE+UnMUJu+9VPCdyvJEd8L1fQGtqwE7EM1dfx2iSRFUuJOy4uUJRhv846hd31A8rpEUGF29IPrCm1GYBA+Fg3br8oWZNCpnz6mO7MNz3vZxus/6w1GmK3av4NX5NM67+stNpxg2xytL+r33YzoOdG90ZFyS4Opy+B5YIZ4gLFAoY2PrwSXHFRevlDXfwOxfDUMazVJtjDISK/W428CdjDfFKFd+3Oh9tH+cT+M/mjqn8bgOr4kaNLfDQfmM29rOsKyr3Z7th7lxtq0I=",
          is_active_callback: true,
          callback_script_id: "9878f909-6d81-424a-a821-ea1686ca9a89",
          feebak_organization_key:
            "h+dXfUUdeasempso3PVGAk7nXWEXrcSWkZ0CT2mE+weenT/RvyMUSIYoJJza1tZpB62eMQkkmaRXIfEDQVei9Q==",
          is_active_chat: true,
          is_active_c2c: true,
          feebak_survey_id: "1289",
          out_hours_message:
            "Nuestro horario de atención es de <br>**Lunes a Viernes de 8:00 am a 8:00 pm.** <br> **Sábado de 9:00 am a 3:00 pm.**",
          key: "C001",
          queue: "fc9f9ebc-c653-4897-a49d-ce9466a83894",
        },
        {
          scheduled_group: "3c238080-e9e5-4393-b8df-8521a369b0a4",
          feebak_organization_id: "38",
          Description: "SVN",
          is_active: true,
          consumer_properties:
            "U2FsdGVkX19gmrd/R6vOUbx/2meGvKVCAobCBqmyYBCLEXRabjmOWcvvDQH2PZNHLCzTRyWG4VJgwkwax7V9Eathfev+gG8Evp6AZ7+zIbRwPt1i4sSlKhFbqrc0PhHhQ1jPCWhw9US3WTnQI1k1QkIHo0/O7kC0eeWrQyye7SSJVAyKDaoyu0S49Edl+AsnSZp2KReRcVPYKf8dc+3HIEOdQ2tK+OeRVaDjK2mMEh/7/6QZc3DgcSJ9TisbqWaLxrWT5cR9JaRBdTN4+l/8HEkgm65vHW7c0+3KWp5M3g8a6N0YK2KfbtKQcrQrqfrQjD2wnIWrKFLSCKhOiJp2Caju1GEiFYCoIk3wer6FQM1aAdYNqQ01woRKmYg2h2zaIEyOcTgp+roN8UktWfKkXg==",
          is_active_callback: true,
          callback_script_id: "dc10cff9-c7a0-4fd7-bc2a-da3fb63de731",
          feebak_organization_key:
            "h+dXfUUdeasempso3PVGAk7nXWEXrcSWkZ0CT2mE+weenT/RvyMUSIYoJJza1tZpB62eMQkkmaRXIfEDQVei9Q==",
          is_active_chat: true,
          is_active_c2c: false,
          feebak_survey_id: "1289",
          out_hours_message:
            "Nuestro horario de atención es de <br>**Lunes a Viernes de 8:00 am a 8:00 pm.**",
          key: "C002",
          queue: "f1607894-c77b-4009-bfeb-f72fc92e932e",
        },
        {
          scheduled_group: "4db38b3b-ffb1-4c17-82a8-1175d96f17e0",
          feebak_organization_id: "38",
          Description: "Respuesta al frente - Ventas Digitales",
          is_active: true,
          consumer_properties:
            "U2FsdGVkX19Xq5DGSRQsKqL8RnTWMfwlOXLkXaCAHsv8e8/YDnFtpLw4wLP46o5umlDFxJTOQGDOHS9kNEvzbGYoRVrckr0g93PlMA/HWRzGlXdIIlp2LgJ84+BmYunmEQoCh4ODGnrRqar7NJuxefr5n90rLg/2VYZ1W9VwdjNklHbsdGX2552Xa3gLLzQ57j4GM/SlVvBljuC/hBXJ2U8Nr0nCSJRra/+E84CeVKAoZKAg53uqptVBa1FqQzLh",
          is_active_callback: true,
          callback_script_id: "c964f5cd-df27-4079-bdfe-73ffbcb1bd06",
          feebak_organization_key:
            "h+dXfUUdeasempso3PVGAk7nXWEXrcSWkZ0CT2mE+weenT/RvyMUSIYoJJza1tZpB62eMQkkmaRXIfEDQVei9Q==",
          is_active_chat: true,
          is_active_c2c: false,
          feebak_survey_id: "1289",
          out_hours_message:
            "Nuestro horario de atención es de <br>**Lunes a Viernes de 8:00 am a 8:00 pm.**",
          key: "C003",
          queue: "a9287ee0-8c37-436b-8111-d3b5e2159f20",
        },
        {
          scheduled_group: "474b0f2d-9e02-4f66-8069-83ae072fa4d9",
          feebak_organization_id: "38",
          Description: "Libranza - Ventas Digitales",
          is_active: true,
          consumer_properties:
            "U2FsdGVkX1+/WW2sOe/cMhjtJvxyQjKEk0M86LscQl7aHJn2+Gg6BKO8tNFT4RQTO/CJ7OgiH2r9UBeaB7ppWZFBGt/J1HTNTKxaOLHlpWzMbpTqw0igOgkWU5UxsHuGfvv0pZFVpSBVHuuGNEh77CHRkZO66AT9HGEO1WG/W1grANs8JK9PurbtWHfkqoReUsA8MnBdviMH96CAzM0JoQ==",
          is_active_callback: true,
          callback_script_id: "c964f5cd-df27-4079-bdfe-73ffbcb1bd06",
          feebak_organization_key:
            "h+dXfUUdeasempso3PVGAk7nXWEXrcSWkZ0CT2mE+weenT/RvyMUSIYoJJza1tZpB62eMQkkmaRXIfEDQVei9Q==",
          is_active_chat: true,
          is_active_c2c: false,
          feebak_survey_id: "1289",
          out_hours_message:
            "Nuestro horario de atención es de <br>**Lunes a Viernes de 8:00 am a 8:00 pm.**",
          key: "C004",
          queue: "1918a0f6-0d0c-4015-adca-a37ba4977e32",
        },
        {
          scheduled_group: "b0ad04a9-76a7-4c2b-9ce7-8ccc5a065d5c",
          feebak_organization_id: "38",
          Description: "Preaprobados TDC - Ventas Digitales",
          is_active: true,
          consumer_properties: "",
          is_active_callback: true,
          callback_script_id: "c964f5cd-df27-4079-bdfe-73ffbcb1bd06",
          feebak_organization_key:
            "h+dXfUUdeasempso3PVGAk7nXWEXrcSWkZ0CT2mE+weenT/RvyMUSIYoJJza1tZpB62eMQkkmaRXIfEDQVei9Q==",
          is_active_chat: true,
          is_active_c2c: false,
          feebak_survey_id: "1289",
          out_hours_message:
            "Nuestro horario de atención es de <br>**Lunes a Viernes de 8:00 am a 8:00 pm.**",
          key: "C005",
          queue: "8827f8dc-abe0-4368-94a3-2578bbc730cb",
        },
        {
          scheduled_group: "c7b8f023-09d1-40f4-9279-c8f40d679ab2",
          feebak_organization_id: "38",
          Description: "Respuesta al frente TDC - Ventas Digitales",
          is_active: true,
          consumer_properties:
            "U2FsdGVkX1+YVU+/cQB3lJDos3Fr36emz5JTuA6t64qksKpqPl2idpOvLaMe2GoXaUWPxNlGSpIRQzwmU4ZJLchp8tTDDr0vhbRpz/aNeuNXv0IuGRODjX5H7aCSUTtbOed8Xi39MRIlvDRq2rWi9lRNJTSwOqsXFjyfkNRb1bOmwP1JGHQU/aAgsKTDVs4aSg9ambmujHnoMtZSPHPn5bPW9iwgy49M89fThsvkZPYNeYC9ChtKSW29kqUlul3H",
          is_active_callback: true,
          callback_script_id: "c964f5cd-df27-4079-bdfe-73ffbcb1bd06",
          feebak_organization_key:
            "h+dXfUUdeasempso3PVGAk7nXWEXrcSWkZ0CT2mE+weenT/RvyMUSIYoJJza1tZpB62eMQkkmaRXIfEDQVei9Q==",
          is_active_chat: true,
          is_active_c2c: false,
          feebak_survey_id: "1289",
          out_hours_message:
            "Nuestro horario de atención es de <br>**Lunes a Viernes de 8:00 am a 8:00 pm.**",
          key: "C006",
          queue: "02a623bb-9369-445a-9e71-b0539e6383ea",
        },
        {
          scheduled_group: "2911682f-9359-4e3e-bf88-12ec9b063d89",
          feebak_organization_id: "38",
          Description: "CrediAgil - Ventas Digitales",
          is_active: true,
          consumer_properties:
            "U2FsdGVkX1+lJcORo2EzJDZ8PO2Tpne7JWwSu8CmY3f9hUd7XDQOolq+uWvwJoZ02uB526WEJrRgML4hTb3S8778VSelQ8yC85Z8UOhScMSiBH3T+8XafHFbCx35H/U2/BnKeVUDqzjxAu8hOrxxsDrjsXCYLHIywkJyJYUsO8D6rPA3ENo5Rzl732hnTHLr63XlFlwtFcyycMMi8UIyF7OWb0aEHA8Zuwjz+O9N8Vfkhs8gMOZkRdQBuk5JsAUA",
          is_active_callback: true,
          callback_script_id: "c964f5cd-df27-4079-bdfe-73ffbcb1bd06",
          feebak_organization_key:
            "h+dXfUUdeasempso3PVGAk7nXWEXrcSWkZ0CT2mE+weenT/RvyMUSIYoJJza1tZpB62eMQkkmaRXIfEDQVei9Q==",
          is_active_chat: true,
          is_active_c2c: false,
          feebak_survey_id: "1289",
          out_hours_message:
            "Nuestro horario de atención es de <br>**Lunes a Viernes de 8:00 am a 8:00 pm.** <br> **Sábado de 9:00 am a 3:00 pm.**",
          key: "C007",
          queue: "ed23f6b4-f562-4048-9adf-568f4e16183a",
        },
        {
          scheduled_group: "065b9006-ee44-44a5-bd32-50e72820788e",
          feebak_organization_id: "38",
          Description: "BALM - Ventas Digitales",
          is_active: true,
          consumer_properties:
            "U2FsdGVkX1+f9+/paFEC5bo226EZzhwzHtg4FcqHv6uBVwOr8q07WGjfYoK99QSlS/sOzG7/IqAPy6Hf32onBoHEB1qCbe9ay7qcse5eWQTzjJ2U+WFtqtDdlLsfHwnrVj0QekgTQScHW6ZuIyh9pNBKgS2kd83KTT/qH432Yv7f+xWcFZT9RbXZ7yOLi+dgpqGtRsxzlKepkig2v6FwRfGfEBoTvQHgZUV/N4+eWTbCVTPFTVx198ooJOYZqvU6B5QbwqB6tnlxZUs8fGRJBBZI2Dgl9G2yp870Tw014r7n2yI83fKwxn4sANr0Y9IBVv+HGEAWjqJpgbbm0HXhz3akNCcBCeIdL6Tb0UaMYxqqkmsTSUb305PEyqvfjKgx",
          is_active_callback: true,
          callback_script_id: "c964f5cd-df27-4079-bdfe-73ffbcb1bd06",
          feebak_organization_key:
            "h+dXfUUdeasempso3PVGAk7nXWEXrcSWkZ0CT2mE+weenT/RvyMUSIYoJJza1tZpB62eMQkkmaRXIfEDQVei9Q==",
          is_active_chat: true,
          is_active_c2c: false,
          feebak_survey_id: "1289",
          out_hours_message:
            "Nuestro horario de atención es de <br>**Lunes a Viernes de 8:00 am a 8:00 pm.** <br> **Sábado de 9:00 am a 3:00 pm.**",
          key: "C008",
          queue: "cb920c2c-05bc-4852-921a-a07baeb81ff3",
        },
        {
          scheduled_group: "242fa02a-cf97-4295-a59e-479b7a207ad4",
          feebak_organization_id: "38",
          Description: "Vinculación cuenta de ahorro - Ventas Digitales",
          is_active: true,
          consumer_properties:
            "U2FsdGVkX1/H2vk0UnVgSy1/annNiBx/8upC1tmPD7wxi5NcDS+3rt12GoUVBKcEfJfNvXXPXw4g+sA4blhK6F3ucyYeEZMWLhaM12fBy+etS41vEiVE1LD0OhuKa/J+rKup26fHTnCa221G8XGsvroRSzX6YXAjtKniHU2Hc3hzWHA0z9s7g9kCXRUB8c5tPGGk7Nk9UwTgf/6RySUGLysIdyvB2dXDiOIYpaIxd5aWp/X7thIMqZ989ox9WgjO/H/xAkGERAVvhC/YzvoNZVAck0esbRx8FOVlYomItQA=",
          is_active_callback: true,
          callback_script_id: "c964f5cd-df27-4079-bdfe-73ffbcb1bd06",
          feebak_organization_key:
            "h+dXfUUdeasempso3PVGAk7nXWEXrcSWkZ0CT2mE+weenT/RvyMUSIYoJJza1tZpB62eMQkkmaRXIfEDQVei9Q==",
          is_active_chat: true,
          is_active_c2c: false,
          feebak_survey_id: "1289",
          out_hours_message:
            "Nuestro horario de atención es de <br>**Lunes a Viernes de 8:00 am a 8:00 pm.** <br> **Sábado de 9:00 am a 3:00 pm.**",
          key: "C009",
          queue: "19b6e12e-c089-48a5-844c-fa2ad4bb2ce0",
        },
        {
          scheduled_group: "0895b25e-09c2-420a-989d-0440bef7754c",
          feebak_organization_id: "38",
          Description: "Cobranzas",
          is_active: true,
          consumer_properties:
            "U2FsdGVkX1+nTklBm29/MjPy4PydC/v27KDZPlXB0mTjCXfLoP1j8/wl6/62XNp4SeV0skdyDWtk7YPZr6h6sNIRfR8eOBmWItV8z2mZ6qXPHP2SZ/v6DNL4rwuFgoGE9dvFvmSEUikl1hZonpXGGawSKbstQmuW4EwgC8w1Cny7ifnu3dTMSyjnoqWC0+ayWeYAMR7OjBQjOZqxzGCsySVZMVnIOi3uCPWOqZIzKUOQWVqz05iKsF/ARMxpAjho8SEjQZvacOVCX/vycBp71ztLMi746XoQAWtyhb3H9oKlWLOjEBzZzhYbOaiWRtxzyP3AqxeCmLApWhHAfXEsUUYO48Ewlk2PF6h6UZ2E5ewmHvZC4jUyd5vfRusRROsG",
          is_active_callback: true,
          callback_script_id: "c964f5cd-df27-4079-bdfe-73ffbcb1bd06",
          feebak_organization_key:
            "h+dXfUUdeasempso3PVGAk7nXWEXrcSWkZ0CT2mE+weenT/RvyMUSIYoJJza1tZpB62eMQkkmaRXIfEDQVei9Q==",
          is_active_chat: true,
          is_active_c2c: true,
          feebak_survey_id: "1289",
          out_hours_message:
            "Nuestro horario de atención es de <br>**Lunes a Viernes de 8:00 am a 8:00 pm.** <br> **Sábado de 9:00 am a 3:00 pm.**",
          key: "C010",
          queue: "0df0cd00-743e-483c-9edb-6ad1e7cc95c3",
        },
        {
          scheduled_group: "0895b25e-09c2-420a-989d-0440bef7754c",
          feebak_organization_id: "38",
          Description: "Ahorro Apertura de Cuenta",
          is_active: true,
          consumer_properties:
            "U2FsdGVkX1+rF2ogWqhl14TNJPa6lEGjiAhMp4SAI1ZImFWYLSYWnPseeSZXe4m38C2m9bYUrGPn061cMhFUwVnH/t+kyPu3rSKCuA018CslRqp8iFmFryNTYXOu4QcPRuTZCxYU5XsXJGE7WDVHFulrNU09XGOvwt9M624IQVWGoQoxutSMcYFM9u5fd7OD//L50JOoLt8pJuXiOrPaJX4SS7fM97LXb5/EBaeRuKnxd3ahLpfmabT4a75ju0d2",
          is_active_callback: true,
          callback_script_id: "c964f5cd-df27-4079-bdfe-73ffbcb1bd06",
          feebak_organization_key:
            "h+dXfUUdeasempso3PVGAk7nXWEXrcSWkZ0CT2mE+weenT/RvyMUSIYoJJza1tZpB62eMQkkmaRXIfEDQVei9Q==",
          is_active_chat: true,
          is_active_c2c: false,
          feebak_survey_id: "1289",
          out_hours_message:
            "Nuestro horario de atención es de <br>**Lunes a Viernes de 8:00 am a 8:00 pm.** <br> **Sábado de 9:00 am a 3:00 pm.**",
          key: "C011",
          queue: "3930487e-8cb2-41bc-91f3-18872b1b9937",
        },
        {
          scheduled_group: "656b1f00-300b-409a-859a-13b287d1e3a1",
          feebak_organization_id: "38",
          Description: "Sucursales Fisicas",
          is_active: true,
          consumer_properties:
            "U2FsdGVkX1+0q6bOWlzHYZwOwPfthoiA+GBZZaSjd42Yvz3QZpdtGExuEer8p48ZebWTacbM7HQMUMVHTPsMzEq5dQtnhgqQr3FWOdT4NkWse49nO2Ktx2HxLvXIsCQzrdqiaYGH8NYd2IvMUVQGHZmQ1UMYbPVoejuGm4x6cmtt+YnppY2tabcuxjqGxyisgPyGBw6ReYcYXO1WhfjXZAbe3azdSisZV8ARmwv5Pc6WfhQbYTsmNO2PhzItewiRdMN+bfx1+gPm274W7Q90Nw==",
          is_active_callback: true,
          callback_script_id: "e1a2f3a1-2d8e-4eed-bc6c-3b4fa52934b1",
          feebak_organization_key:
            "h+dXfUUdeasempso3PVGAk7nXWEXrcSWkZ0CT2mE+weenT/RvyMUSIYoJJza1tZpB62eMQkkmaRXIfEDQVei9Q==",
          is_active_chat: false,
          is_active_c2c: false,
          feebak_survey_id: "1289",
          out_hours_message:
            "Nuestro horario de atención es de <br>**Lunes a Viernes de 8:00 am a 8:00 pm.** <br> **Sábado de 9:00 am a 3:00 pm.**",
          key: "C012",
          queue: "997b1fc9-89ed-43b3-855e-b5e9c25fc28f",
        },
        {
          scheduled_group: "b0ad04a9-76a7-4c2b-9ce7-8ccc5a065d5c",
          feebak_organization_id: "38",
          Description: "Sucursales Virtuales Personas",
          is_active: true,
          consumer_properties:
            "U2FsdGVkX1+vsZrKVBz9ymgnz1qrbndccQHWz2AGm191C/KP8+CZ74858hf5RSx2lF0yQ4Gviw6U7EF2lRE+hhGdRQFD/w2ZbtL6zBOgL/C87X1UMZDo3afjDl+dKBTif2ibSo4btqiE2RiS3/AQuxIX0Jcj+cafuhFqlxI8guLiCeLPgvyN5jV9Px3F1jYwnr76pzRezan/RffiAX0CsL7kXl3jV9edsiWFNrtAQ1e91EhIyumg3QvKKNTuu/vo4h64ar+Rq1OiZOiwSICuNqZ5hb9wZSdRwFWSsYDApHw/ersqRant31SMCq+qJmSbP6GS+wZapeYVr8Xq8mAREuTI3K8KbSomLLpoOyAfvI+IpOFyD2KUafkie1xwO/HR84kr9GjSrr0qVfZxRaM8GJDG+1JEtikbm5RyRhcaqG91scFxetehYM+ybLTcBMN4GWCcucBKEiAzSQwBOKnDK/nk/NiAugvyv7zEfycjPFxXGgiEbjdqzl2FYhwcH4RpfGd2bXg9tVLScK6AWa2QqA==",
          is_active_callback: true,
          callback_script_id: "9878f909-6d81-424a-a821-ea1686ca9a89",
          feebak_organization_key:
            "h+dXfUUdeasempso3PVGAk7nXWEXrcSWkZ0CT2mE+weenT/RvyMUSIYoJJza1tZpB62eMQkkmaRXIfEDQVei9Q==",
          is_active_chat: true,
          is_active_c2c: false,
          feebak_survey_id: "1289",
          out_hours_message:
            "Nuestro horario de atención es de <br>**Lunes a Viernes de 8:00 am a 8:00 pm.** <br> **Sábado de 9:00 am a 3:00 pm.**",
          key: "C013",
          queue: "fc9f9ebc-c653-4897-a49d-ce9466a83894",
        },
        {
          scheduled_group: "aafca7e2-16ec-4b05-857c-0ed86de8e977",
          feebak_organization_id: "38",
          Description: "Aumento de cupo credito",
          is_active: true,
          consumer_properties:
            "U2FsdGVkX19hYtcXwdvjc9EV/pFS0qXFa/iu7W0fGP+BiI8t1H3+lqmfiFlbEye4sBS7FGsv33Q6gC7cKW/SDYZRfqwfrLklQwq/8kEYoI2joVAvM5zJvRMwqbWhyLp25mLKj4nxsCo9lYS++8C5Wb3M+LZ5sahUZrFMixDJ+IBpgLueb/FSoHBnz0Raj1JMlxCW+7SNk+H6wRANp20El3ZW+29lVHI7tud5ZbeoSGi3Vij1WuCcHuEdmz6NLdan",
          is_active_callback: true,
          callback_script_id: "c964f5cd-df27-4079-bdfe-73ffbcb1bd06",
          feebak_organization_key:
            "h+dXfUUdeasempso3PVGAk7nXWEXrcSWkZ0CT2mE+weenT/RvyMUSIYoJJza1tZpB62eMQkkmaRXIfEDQVei9Q==",
          is_active_chat: true,
          is_active_c2c: false,
          feebak_survey_id: "1289",
          out_hours_message:
            "Nuestro horario de atención es de <br>**Lunes a Viernes de 8:00 am a 8:00 pm.** <br> **Sábado de 9:00 am a 3:00 pm.**",
          key: "C014",
          queue: "0c600776-75aa-47b3-b84d-902bfddd9273",
        },
        {
          scheduled_group: "3056f757-7fcc-4e82-9208-00c4cb7e3be0",
          feebak_organization_id: "38",
          Description: "Home Bancolombia - Leasing",
          is_active: true,
          consumer_properties: "",
          is_active_callback: true,
          callback_script_id: "a31853f2-1128-40cd-9c4b-1fe1940194fd",
          feebak_organization_key:
            "h+dXfUUdeasempso3PVGAk7nXWEXrcSWkZ0CT2mE+weenT/RvyMUSIYoJJza1tZpB62eMQkkmaRXIfEDQVei9Q==",
          is_active_chat: true,
          is_active_c2c: true,
          feebak_survey_id: "136",
          out_hours_message:
            "Nuestro horario de atención es de <br>**Lunes a Viernes de 8:00 am a 8:00 pm.** <br> **Sábado de 9:00 am a 3:00 pm.**",
          key: "C015",
          queue: "7b6b494c-125c-4d76-af8c-26f498415733",
        },
      ],
      pageSize: 25,
      pageNumber: 1,
      total: 15,
      pageCount: 1,
    });
  }
);

//https://canales-tradicionales-ext-qa.apps.ambientesbc.com/digital-predictive-ctc/external-connection-mtx/genesys/data-table/data-rows-flow/5519eb85-3557-4b3b-9947-c74c756aeccc?showbrief=false
//https://canales-tradicionales-ext-qa.apps.ambientesbc.com/digital-predictive-ctc/external-connection-mtx/genesys/data-table/data-rows-flow/5519eb85-3557-4b3b-9947-c74c756aeccc?showbrief=false
// ORIGINAL = app.post('/neg/api/v1/security-filters/ch_ms_balances/balances/summydep', (req, res) => {
app.post(
  "/neg/api/v1/security-filters/ch_ms_balances/balances/summydep",
  (req, res) => {
    console.log("Entra AUTH");
    res.json({
      entities: [
        {
          scheduled_group: "3056f757-7fcc-4e82-9208-00c4cb7e3be0",
          feebak_organization_id: "38",
          Description: "Libre inversión - Ventas Digitales",
          is_active: true,
          consumer_properties:
            "U2FsdGVkX1+6SbM0xPXyqHtdjK8Yw6zmpkdJy6GcwSK2bhbgZ0ncw80Gv1bSPwTPexyptR/DfIXDjdyQpOssA41jaHULlE+UnMUJu+9VPCdyvJEd8L1fQGtqwE7EM1dfx2iSRFUuJOy4uUJRhv846hd31A8rpEUGF29IPrCm1GYBA+Fg3br8oWZNCpnz6mO7MNz3vZxus/6w1GmK3av4NX5NM67+stNpxg2xytL+r33YzoOdG90ZFyS4Opy+B5YIZ4gLFAoY2PrwSXHFRevlDXfwOxfDUMazVJtjDISK/W428CdjDfFKFd+3Oh9tH+cT+M/mjqn8bgOr4kaNLfDQfmM29rOsKyr3Z7th7lxtq0I=",
          is_active_callback: true,
          callback_script_id: "9878f909-6d81-424a-a821-ea1686ca9a89",
          feebak_organization_key:
            "h+dXfUUdeasempso3PVGAk7nXWEXrcSWkZ0CT2mE+weenT/RvyMUSIYoJJza1tZpB62eMQkkmaRXIfEDQVei9Q==",
          is_active_chat: true,
          is_active_c2c: true,
          feebak_survey_id: "1289",
          out_hours_message:
            "Nuestro horario de atención es de <br>**Lunes a Viernes de 8:00 am a 8:00 pm.** <br> **Sábado de 9:00 am a 3:00 pm.**",
          key: "C001",
          queue: "fc9f9ebc-c653-4897-a49d-ce9466a83894",
        },
        {
          scheduled_group: "3c238080-e9e5-4393-b8df-8521a369b0a4",
          feebak_organization_id: "38",
          Description: "SVN",
          is_active: true,
          consumer_properties:
            "U2FsdGVkX19gmrd/R6vOUbx/2meGvKVCAobCBqmyYBCLEXRabjmOWcvvDQH2PZNHLCzTRyWG4VJgwkwax7V9Eathfev+gG8Evp6AZ7+zIbRwPt1i4sSlKhFbqrc0PhHhQ1jPCWhw9US3WTnQI1k1QkIHo0/O7kC0eeWrQyye7SSJVAyKDaoyu0S49Edl+AsnSZp2KReRcVPYKf8dc+3HIEOdQ2tK+OeRVaDjK2mMEh/7/6QZc3DgcSJ9TisbqWaLxrWT5cR9JaRBdTN4+l/8HEkgm65vHW7c0+3KWp5M3g8a6N0YK2KfbtKQcrQrqfrQjD2wnIWrKFLSCKhOiJp2Caju1GEiFYCoIk3wer6FQM1aAdYNqQ01woRKmYg2h2zaIEyOcTgp+roN8UktWfKkXg==",
          is_active_callback: true,
          callback_script_id: "dc10cff9-c7a0-4fd7-bc2a-da3fb63de731",
          feebak_organization_key:
            "h+dXfUUdeasempso3PVGAk7nXWEXrcSWkZ0CT2mE+weenT/RvyMUSIYoJJza1tZpB62eMQkkmaRXIfEDQVei9Q==",
          is_active_chat: true,
          is_active_c2c: false,
          feebak_survey_id: "1289",
          out_hours_message:
            "Nuestro horario de atención es de <br>**Lunes a Viernes de 8:00 am a 8:00 pm.**",
          key: "C002",
          queue: "f1607894-c77b-4009-bfeb-f72fc92e932e",
        },
        {
          scheduled_group: "4db38b3b-ffb1-4c17-82a8-1175d96f17e0",
          feebak_organization_id: "38",
          Description: "Respuesta al frente - Ventas Digitales",
          is_active: true,
          consumer_properties:
            "U2FsdGVkX19Xq5DGSRQsKqL8RnTWMfwlOXLkXaCAHsv8e8/YDnFtpLw4wLP46o5umlDFxJTOQGDOHS9kNEvzbGYoRVrckr0g93PlMA/HWRzGlXdIIlp2LgJ84+BmYunmEQoCh4ODGnrRqar7NJuxefr5n90rLg/2VYZ1W9VwdjNklHbsdGX2552Xa3gLLzQ57j4GM/SlVvBljuC/hBXJ2U8Nr0nCSJRra/+E84CeVKAoZKAg53uqptVBa1FqQzLh",
          is_active_callback: true,
          callback_script_id: "c964f5cd-df27-4079-bdfe-73ffbcb1bd06",
          feebak_organization_key:
            "h+dXfUUdeasempso3PVGAk7nXWEXrcSWkZ0CT2mE+weenT/RvyMUSIYoJJza1tZpB62eMQkkmaRXIfEDQVei9Q==",
          is_active_chat: true,
          is_active_c2c: false,
          feebak_survey_id: "1289",
          out_hours_message:
            "Nuestro horario de atención es de <br>**Lunes a Viernes de 8:00 am a 8:00 pm.**",
          key: "C003",
          queue: "a9287ee0-8c37-436b-8111-d3b5e2159f20",
        },
        {
          scheduled_group: "474b0f2d-9e02-4f66-8069-83ae072fa4d9",
          feebak_organization_id: "38",
          Description: "Libranza - Ventas Digitales",
          is_active: true,
          consumer_properties:
            "U2FsdGVkX1+/WW2sOe/cMhjtJvxyQjKEk0M86LscQl7aHJn2+Gg6BKO8tNFT4RQTO/CJ7OgiH2r9UBeaB7ppWZFBGt/J1HTNTKxaOLHlpWzMbpTqw0igOgkWU5UxsHuGfvv0pZFVpSBVHuuGNEh77CHRkZO66AT9HGEO1WG/W1grANs8JK9PurbtWHfkqoReUsA8MnBdviMH96CAzM0JoQ==",
          is_active_callback: true,
          callback_script_id: "c964f5cd-df27-4079-bdfe-73ffbcb1bd06",
          feebak_organization_key:
            "h+dXfUUdeasempso3PVGAk7nXWEXrcSWkZ0CT2mE+weenT/RvyMUSIYoJJza1tZpB62eMQkkmaRXIfEDQVei9Q==",
          is_active_chat: true,
          is_active_c2c: false,
          feebak_survey_id: "1289",
          out_hours_message:
            "Nuestro horario de atención es de <br>**Lunes a Viernes de 8:00 am a 8:00 pm.**",
          key: "C004",
          queue: "1918a0f6-0d0c-4015-adca-a37ba4977e32",
        },
        {
          scheduled_group: "b0ad04a9-76a7-4c2b-9ce7-8ccc5a065d5c",
          feebak_organization_id: "38",
          Description: "Preaprobados TDC - Ventas Digitales",
          is_active: true,
          consumer_properties: "",
          is_active_callback: true,
          callback_script_id: "c964f5cd-df27-4079-bdfe-73ffbcb1bd06",
          feebak_organization_key:
            "h+dXfUUdeasempso3PVGAk7nXWEXrcSWkZ0CT2mE+weenT/RvyMUSIYoJJza1tZpB62eMQkkmaRXIfEDQVei9Q==",
          is_active_chat: true,
          is_active_c2c: false,
          feebak_survey_id: "1289",
          out_hours_message:
            "Nuestro horario de atención es de <br>**Lunes a Viernes de 8:00 am a 8:00 pm.**",
          key: "C005",
          queue: "8827f8dc-abe0-4368-94a3-2578bbc730cb",
        },
        {
          scheduled_group: "c7b8f023-09d1-40f4-9279-c8f40d679ab2",
          feebak_organization_id: "38",
          Description: "Respuesta al frente TDC - Ventas Digitales",
          is_active: true,
          consumer_properties:
            "U2FsdGVkX1+YVU+/cQB3lJDos3Fr36emz5JTuA6t64qksKpqPl2idpOvLaMe2GoXaUWPxNlGSpIRQzwmU4ZJLchp8tTDDr0vhbRpz/aNeuNXv0IuGRODjX5H7aCSUTtbOed8Xi39MRIlvDRq2rWi9lRNJTSwOqsXFjyfkNRb1bOmwP1JGHQU/aAgsKTDVs4aSg9ambmujHnoMtZSPHPn5bPW9iwgy49M89fThsvkZPYNeYC9ChtKSW29kqUlul3H",
          is_active_callback: true,
          callback_script_id: "c964f5cd-df27-4079-bdfe-73ffbcb1bd06",
          feebak_organization_key:
            "h+dXfUUdeasempso3PVGAk7nXWEXrcSWkZ0CT2mE+weenT/RvyMUSIYoJJza1tZpB62eMQkkmaRXIfEDQVei9Q==",
          is_active_chat: true,
          is_active_c2c: false,
          feebak_survey_id: "1289",
          out_hours_message:
            "Nuestro horario de atención es de <br>**Lunes a Viernes de 8:00 am a 8:00 pm.**",
          key: "C006",
          queue: "02a623bb-9369-445a-9e71-b0539e6383ea",
        },
        {
          scheduled_group: "2911682f-9359-4e3e-bf88-12ec9b063d89",
          feebak_organization_id: "38",
          Description: "CrediAgil - Ventas Digitales",
          is_active: true,
          consumer_properties:
            "U2FsdGVkX1+lJcORo2EzJDZ8PO2Tpne7JWwSu8CmY3f9hUd7XDQOolq+uWvwJoZ02uB526WEJrRgML4hTb3S8778VSelQ8yC85Z8UOhScMSiBH3T+8XafHFbCx35H/U2/BnKeVUDqzjxAu8hOrxxsDrjsXCYLHIywkJyJYUsO8D6rPA3ENo5Rzl732hnTHLr63XlFlwtFcyycMMi8UIyF7OWb0aEHA8Zuwjz+O9N8Vfkhs8gMOZkRdQBuk5JsAUA",
          is_active_callback: true,
          callback_script_id: "c964f5cd-df27-4079-bdfe-73ffbcb1bd06",
          feebak_organization_key:
            "h+dXfUUdeasempso3PVGAk7nXWEXrcSWkZ0CT2mE+weenT/RvyMUSIYoJJza1tZpB62eMQkkmaRXIfEDQVei9Q==",
          is_active_chat: true,
          is_active_c2c: false,
          feebak_survey_id: "1289",
          out_hours_message:
            "Nuestro horario de atención es de <br>**Lunes a Viernes de 8:00 am a 8:00 pm.** <br> **Sábado de 9:00 am a 3:00 pm.**",
          key: "C007",
          queue: "ed23f6b4-f562-4048-9adf-568f4e16183a",
        },
        {
          scheduled_group: "065b9006-ee44-44a5-bd32-50e72820788e",
          feebak_organization_id: "38",
          Description: "BALM - Ventas Digitales",
          is_active: true,
          consumer_properties:
            "U2FsdGVkX1+f9+/paFEC5bo226EZzhwzHtg4FcqHv6uBVwOr8q07WGjfYoK99QSlS/sOzG7/IqAPy6Hf32onBoHEB1qCbe9ay7qcse5eWQTzjJ2U+WFtqtDdlLsfHwnrVj0QekgTQScHW6ZuIyh9pNBKgS2kd83KTT/qH432Yv7f+xWcFZT9RbXZ7yOLi+dgpqGtRsxzlKepkig2v6FwRfGfEBoTvQHgZUV/N4+eWTbCVTPFTVx198ooJOYZqvU6B5QbwqB6tnlxZUs8fGRJBBZI2Dgl9G2yp870Tw014r7n2yI83fKwxn4sANr0Y9IBVv+HGEAWjqJpgbbm0HXhz3akNCcBCeIdL6Tb0UaMYxqqkmsTSUb305PEyqvfjKgx",
          is_active_callback: true,
          callback_script_id: "c964f5cd-df27-4079-bdfe-73ffbcb1bd06",
          feebak_organization_key:
            "h+dXfUUdeasempso3PVGAk7nXWEXrcSWkZ0CT2mE+weenT/RvyMUSIYoJJza1tZpB62eMQkkmaRXIfEDQVei9Q==",
          is_active_chat: true,
          is_active_c2c: false,
          feebak_survey_id: "1289",
          out_hours_message:
            "Nuestro horario de atención es de <br>**Lunes a Viernes de 8:00 am a 8:00 pm.** <br> **Sábado de 9:00 am a 3:00 pm.**",
          key: "C008",
          queue: "cb920c2c-05bc-4852-921a-a07baeb81ff3",
        },
        {
          scheduled_group: "242fa02a-cf97-4295-a59e-479b7a207ad4",
          feebak_organization_id: "38",
          Description: "Vinculación cuenta de ahorro - Ventas Digitales",
          is_active: true,
          consumer_properties:
            "U2FsdGVkX1/H2vk0UnVgSy1/annNiBx/8upC1tmPD7wxi5NcDS+3rt12GoUVBKcEfJfNvXXPXw4g+sA4blhK6F3ucyYeEZMWLhaM12fBy+etS41vEiVE1LD0OhuKa/J+rKup26fHTnCa221G8XGsvroRSzX6YXAjtKniHU2Hc3hzWHA0z9s7g9kCXRUB8c5tPGGk7Nk9UwTgf/6RySUGLysIdyvB2dXDiOIYpaIxd5aWp/X7thIMqZ989ox9WgjO/H/xAkGERAVvhC/YzvoNZVAck0esbRx8FOVlYomItQA=",
          is_active_callback: true,
          callback_script_id: "c964f5cd-df27-4079-bdfe-73ffbcb1bd06",
          feebak_organization_key:
            "h+dXfUUdeasempso3PVGAk7nXWEXrcSWkZ0CT2mE+weenT/RvyMUSIYoJJza1tZpB62eMQkkmaRXIfEDQVei9Q==",
          is_active_chat: true,
          is_active_c2c: false,
          feebak_survey_id: "1289",
          out_hours_message:
            "Nuestro horario de atención es de <br>**Lunes a Viernes de 8:00 am a 8:00 pm.** <br> **Sábado de 9:00 am a 3:00 pm.**",
          key: "C009",
          queue: "19b6e12e-c089-48a5-844c-fa2ad4bb2ce0",
        },
        {
          scheduled_group: "0895b25e-09c2-420a-989d-0440bef7754c",
          feebak_organization_id: "38",
          Description: "Cobranzas",
          is_active: true,
          consumer_properties:
            "U2FsdGVkX1+nTklBm29/MjPy4PydC/v27KDZPlXB0mTjCXfLoP1j8/wl6/62XNp4SeV0skdyDWtk7YPZr6h6sNIRfR8eOBmWItV8z2mZ6qXPHP2SZ/v6DNL4rwuFgoGE9dvFvmSEUikl1hZonpXGGawSKbstQmuW4EwgC8w1Cny7ifnu3dTMSyjnoqWC0+ayWeYAMR7OjBQjOZqxzGCsySVZMVnIOi3uCPWOqZIzKUOQWVqz05iKsF/ARMxpAjho8SEjQZvacOVCX/vycBp71ztLMi746XoQAWtyhb3H9oKlWLOjEBzZzhYbOaiWRtxzyP3AqxeCmLApWhHAfXEsUUYO48Ewlk2PF6h6UZ2E5ewmHvZC4jUyd5vfRusRROsG",
          is_active_callback: true,
          callback_script_id: "c964f5cd-df27-4079-bdfe-73ffbcb1bd06",
          feebak_organization_key:
            "h+dXfUUdeasempso3PVGAk7nXWEXrcSWkZ0CT2mE+weenT/RvyMUSIYoJJza1tZpB62eMQkkmaRXIfEDQVei9Q==",
          is_active_chat: true,
          is_active_c2c: true,
          feebak_survey_id: "1289",
          out_hours_message:
            "Nuestro horario de atención es de <br>**Lunes a Viernes de 8:00 am a 8:00 pm.** <br> **Sábado de 9:00 am a 3:00 pm.**",
          key: "C010",
          queue: "0df0cd00-743e-483c-9edb-6ad1e7cc95c3",
        },
        {
          scheduled_group: "0895b25e-09c2-420a-989d-0440bef7754c",
          feebak_organization_id: "38",
          Description: "Ahorro Apertura de Cuenta",
          is_active: true,
          consumer_properties:
            "U2FsdGVkX1+rF2ogWqhl14TNJPa6lEGjiAhMp4SAI1ZImFWYLSYWnPseeSZXe4m38C2m9bYUrGPn061cMhFUwVnH/t+kyPu3rSKCuA018CslRqp8iFmFryNTYXOu4QcPRuTZCxYU5XsXJGE7WDVHFulrNU09XGOvwt9M624IQVWGoQoxutSMcYFM9u5fd7OD//L50JOoLt8pJuXiOrPaJX4SS7fM97LXb5/EBaeRuKnxd3ahLpfmabT4a75ju0d2",
          is_active_callback: true,
          callback_script_id: "c964f5cd-df27-4079-bdfe-73ffbcb1bd06",
          feebak_organization_key:
            "h+dXfUUdeasempso3PVGAk7nXWEXrcSWkZ0CT2mE+weenT/RvyMUSIYoJJza1tZpB62eMQkkmaRXIfEDQVei9Q==",
          is_active_chat: true,
          is_active_c2c: false,
          feebak_survey_id: "1289",
          out_hours_message:
            "Nuestro horario de atención es de <br>**Lunes a Viernes de 8:00 am a 8:00 pm.** <br> **Sábado de 9:00 am a 3:00 pm.**",
          key: "C011",
          queue: "3930487e-8cb2-41bc-91f3-18872b1b9937",
        },
        {
          scheduled_group: "656b1f00-300b-409a-859a-13b287d1e3a1",
          feebak_organization_id: "38",
          Description: "Sucursales Fisicas",
          is_active: true,
          consumer_properties:
            "U2FsdGVkX1+0q6bOWlzHYZwOwPfthoiA+GBZZaSjd42Yvz3QZpdtGExuEer8p48ZebWTacbM7HQMUMVHTPsMzEq5dQtnhgqQr3FWOdT4NkWse49nO2Ktx2HxLvXIsCQzrdqiaYGH8NYd2IvMUVQGHZmQ1UMYbPVoejuGm4x6cmtt+YnppY2tabcuxjqGxyisgPyGBw6ReYcYXO1WhfjXZAbe3azdSisZV8ARmwv5Pc6WfhQbYTsmNO2PhzItewiRdMN+bfx1+gPm274W7Q90Nw==",
          is_active_callback: true,
          callback_script_id: "e1a2f3a1-2d8e-4eed-bc6c-3b4fa52934b1",
          feebak_organization_key:
            "h+dXfUUdeasempso3PVGAk7nXWEXrcSWkZ0CT2mE+weenT/RvyMUSIYoJJza1tZpB62eMQkkmaRXIfEDQVei9Q==",
          is_active_chat: false,
          is_active_c2c: false,
          feebak_survey_id: "1289",
          out_hours_message:
            "Nuestro horario de atención es de <br>**Lunes a Viernes de 8:00 am a 8:00 pm.** <br> **Sábado de 9:00 am a 3:00 pm.**",
          key: "C012",
          queue: "997b1fc9-89ed-43b3-855e-b5e9c25fc28f",
        },
        {
          scheduled_group: "b0ad04a9-76a7-4c2b-9ce7-8ccc5a065d5c",
          feebak_organization_id: "38",
          Description: "Sucursales Virtuales Personas",
          is_active: true,
          consumer_properties:
            "U2FsdGVkX1+vsZrKVBz9ymgnz1qrbndccQHWz2AGm191C/KP8+CZ74858hf5RSx2lF0yQ4Gviw6U7EF2lRE+hhGdRQFD/w2ZbtL6zBOgL/C87X1UMZDo3afjDl+dKBTif2ibSo4btqiE2RiS3/AQuxIX0Jcj+cafuhFqlxI8guLiCeLPgvyN5jV9Px3F1jYwnr76pzRezan/RffiAX0CsL7kXl3jV9edsiWFNrtAQ1e91EhIyumg3QvKKNTuu/vo4h64ar+Rq1OiZOiwSICuNqZ5hb9wZSdRwFWSsYDApHw/ersqRant31SMCq+qJmSbP6GS+wZapeYVr8Xq8mAREuTI3K8KbSomLLpoOyAfvI+IpOFyD2KUafkie1xwO/HR84kr9GjSrr0qVfZxRaM8GJDG+1JEtikbm5RyRhcaqG91scFxetehYM+ybLTcBMN4GWCcucBKEiAzSQwBOKnDK/nk/NiAugvyv7zEfycjPFxXGgiEbjdqzl2FYhwcH4RpfGd2bXg9tVLScK6AWa2QqA==",
          is_active_callback: true,
          callback_script_id: "9878f909-6d81-424a-a821-ea1686ca9a89",
          feebak_organization_key:
            "h+dXfUUdeasempso3PVGAk7nXWEXrcSWkZ0CT2mE+weenT/RvyMUSIYoJJza1tZpB62eMQkkmaRXIfEDQVei9Q==",
          is_active_chat: true,
          is_active_c2c: false,
          feebak_survey_id: "1289",
          out_hours_message:
            "Nuestro horario de atención es de <br>**Lunes a Viernes de 8:00 am a 8:00 pm.** <br> **Sábado de 9:00 am a 3:00 pm.**",
          key: "C013",
          queue: "fc9f9ebc-c653-4897-a49d-ce9466a83894",
        },
        {
          scheduled_group: "aafca7e2-16ec-4b05-857c-0ed86de8e977",
          feebak_organization_id: "38",
          Description: "Aumento de cupo credito",
          is_active: true,
          consumer_properties:
            "U2FsdGVkX19hYtcXwdvjc9EV/pFS0qXFa/iu7W0fGP+BiI8t1H3+lqmfiFlbEye4sBS7FGsv33Q6gC7cKW/SDYZRfqwfrLklQwq/8kEYoI2joVAvM5zJvRMwqbWhyLp25mLKj4nxsCo9lYS++8C5Wb3M+LZ5sahUZrFMixDJ+IBpgLueb/FSoHBnz0Raj1JMlxCW+7SNk+H6wRANp20El3ZW+29lVHI7tud5ZbeoSGi3Vij1WuCcHuEdmz6NLdan",
          is_active_callback: true,
          callback_script_id: "c964f5cd-df27-4079-bdfe-73ffbcb1bd06",
          feebak_organization_key:
            "h+dXfUUdeasempso3PVGAk7nXWEXrcSWkZ0CT2mE+weenT/RvyMUSIYoJJza1tZpB62eMQkkmaRXIfEDQVei9Q==",
          is_active_chat: true,
          is_active_c2c: false,
          feebak_survey_id: "1289",
          out_hours_message:
            "Nuestro horario de atención es de <br>**Lunes a Viernes de 8:00 am a 8:00 pm.** <br> **Sábado de 9:00 am a 3:00 pm.**",
          key: "C014",
          queue: "0c600776-75aa-47b3-b84d-902bfddd9273",
        },
        {
          scheduled_group: "3056f757-7fcc-4e82-9208-00c4cb7e3be0",
          feebak_organization_id: "38",
          Description: "Home Bancolombia - Leasing",
          is_active: true,
          consumer_properties: "",
          is_active_callback: true,
          callback_script_id: "a31853f2-1128-40cd-9c4b-1fe1940194fd",
          feebak_organization_key:
            "h+dXfUUdeasempso3PVGAk7nXWEXrcSWkZ0CT2mE+weenT/RvyMUSIYoJJza1tZpB62eMQkkmaRXIfEDQVei9Q==",
          is_active_chat: true,
          is_active_c2c: true,
          feebak_survey_id: "136",
          out_hours_message:
            "Nuestro horario de atención es de <br>**Lunes a Viernes de 8:00 am a 8:00 pm.** <br> **Sábado de 9:00 am a 3:00 pm.**",
          key: "C015",
          queue: "7b6b494c-125c-4d76-af8c-26f498415733",
        },
      ],
      pageSize: 25,
      pageNumber: 1,
      total: 15,
      pageCount: 1,
    });
  }
);

//https://log-natashatest.us.v2.customers.biocatch.com/api/v1/sendLogs?cid=natashatest&cdsnum=1717799440356-sjc0000443-374c2b4d-127c-4218-aad5-fe5b475fa0de&csid=350f3366-cce9-4436-8727-107292c8cf7f&ds=js&sdkVer=2.37.0.1767.6eeb4dc
//https://log-natashatest.us.v2.customers.biocatch.com/api/v1/sendLogs?cid=natashatest&cdsnum=1717799440356-sjc0000443-374c2b4d-127c-4218-aad5-fe5b475fa0de&csid=350f3366-cce9-4436-8727-107292c8cf7f&ds=js&sdkVer=2.37.0.1767.6eeb4dc
// ORIGINAL = app.post('/neg/api/v1/security-filters/ch_ms_balances/balances/summydep', (req, res) => {
app.post(
  "/neg/api/v1/security-filters/ch_ms_balances/balances/summydep",
  (req, res) => {
    console.log("Entra AUTH");
    res
      .json({
        std: "gAAAAABmY4wyti9Z0WDFMZrUPWwp84zgcyiDUFSyTnYkmV-cXPmyWgPeSXnew6vt_nIfZ_nm5pl825JIOfH-HxcLmhbYP0vNA3blO3uKNntMjPqus-L499M2K_Lc2RsbrXdkvvf4l_XYQDBSp5_B5JDfjFYaEDdErOcTkQ6OJ5y0V7cJTa9moNiJDbve-uye9UgPkKGm2kwLNZaSvkhtdRYzgwqQnKwVTA==",
        sts: "gAAAAABmY4wyXNxR1x4BLBqfOnzHoZE3lM7weH4w9fyfItXbAiKSfsQPSfDFA1GIrlEuP382j-h_eZDWREJJYqPibzbCrFU2gkoz9A0UIwbfkwKrYguv4iI9wME9CAYlks0sbQncxia77iJwI8GkxlTek2S3tGlj8FiSnY8KpQs1mjApOhtHsHBeKg1e5CTYDm2EcYwwdyQnGetLCVCxxpaF7yw3br1kmdyjCdQufBsMq27oYzYtCZqYTqiZfmI_bf1P0FSmbl6GmZDUHAqGxi-iXMPbfwEKCqTPqruq4DbhQa9GtX2fVpkspxNVsZ5BgUO1RkxvxvOBN_8C9z6fXb1XFkPK5OJsGalLJ8QhcqYNxHTwruaz27FsP0p6sLQSyz4YolHc0ayXRdu5Whc8UJ2Uq3Fre597WQ==",
        nextWupInterval: 5000,
      })
      .status(204)
      .format({
        "text/plain": function () {
          res.send("hey");
        },
      });
  }
);

//https://api-cdn.mypurecloud.com/webdeployments/v1/deployments/5b62301c-6e80-4231-b750-740b5735ccdb/domains.json
//https://api-cdn.mypurecloud.com/webdeployments/v1/deployments/5b62301c-6e80-4231-b750-740b5735ccdb/domains.json
// app.post('/webdeployments/v1/deployments/5b62301c-6e80-4231-b750-740b5735ccdb/domains.json', (req, res) => {
app.post(
  "/webdeployments/v1/deployments/:deploymentId/domains.json",
  (req, res) => {
    res.json({
      allowAllDomains: true,
      allowedDomains: [],
    });
  }
);

//https://api-cdn.mypurecloud.com/webdeployments/v1/deployments/5b62301c-6e80-4231-b750-740b5735ccdb/config.json
//https://api-cdn.mypurecloud.com/webdeployments/v1/deployments/5b62301c-6e80-4231-b750-740b5735ccdb/config.json
// response {}
app.post(
  "/webdeployments/v1/deployments/5b62301c-6e80-4231-b750-740b5735ccdb/config.json",
  (req, res) => {
    res.json({
      id: "a6b394b6-c5e6-402f-9a50-14edeafd9d35",
      version: "6",
      headlessMode: {
        enabled: true,
      },
      languages: ["es"],
      defaultLanguage: "es",
      apiEndpoint: "https://api.mypurecloud.com",
      messenger: {
        enabled: true,
        apps: {
          conversations: {
            messagingEndpoint: "wss://webmessaging.mypurecloud.com",
            showAgentTypingIndicator: true,
            showUserTypingIndicator: true,
            autoStart: {
              enabled: false,
            },
            markdown: {
              enabled: true,
            },
            conversationDisconnect: {
              enabled: true,
              type: "Send",
            },
            conversationClear: {
              enabled: false,
            },
            humanize: {
              enabled: true,
              bot: {
                name: "",
                avatarUrl: "",
              },
            },
          },
        },
        styles: {
          primaryColor: "#0D6EFD",
        },
        launcherButton: {
          visibility: "On",
        },
        fileUpload: {
          modes: [
            {
              fileTypes: [],
              maxFileSizeKB: 0,
            },
          ],
        },
        homeScreen: {
          enabled: false,
          logoUrl: "",
        },
      },
      position: {
        alignment: "Auto",
        sideSpace: 20,
        bottomSpace: 12,
      },
      customI18NLabels: [],
      journeyEvents: {
        enabled: true,
      },
      status: "Active",
      cobrowse: {
        enabled: true,
        allowAgentControl: false,
        maskSelectors: [],
        readonlySelectors: [],
      },
      auth: {
        enabled: false,
      },
    });
  }
);

//https://apps.mypurecloud.com/messenger/i18n/es.json
//https://apps.mypurecloud.com/messenger/i18n/es.json
// response {}

// app.post('/webdeployments/v1/deployments/5b62301c-6e80-4231-b750-740b5735ccdb/config.json', (req, res) => {
app.post(
  "/webdeployments/v1/deployments/:deploymentId/config.json",
  (req, res) => {
    res.json({
      language: "es",
      home: {
        headerTitle: "Le damos la bienvenida",
        headerSubTitle: "Estamos aquí para ayudarle",
        ariaHomeScreenOpenStatus: "Se abrió la pantalla de inicio",
      },
      conversations: {
        headerTitle: "Envíenos un mensaje",
        inputMessagePlaceholder: "Enviar un mensaje...",
        startConversationMessage:
          "Este es el principio de su conversación con nosotros. Envíe un mensaje para empezar.",
        autoStartConversationMessage:
          "Este es el comienzo de su conversación con nosotros.",
        agentDefaultName: "Agente",
        botDefaultName: "Bot",
        customerDefaultName: "Usted",
        cancelButton: "Cancelar",
        closeButton: "Cerrar",
        startConversationButtonTitle: "Envíenos un mensaje",
        continueConversationButtonTitle: "Continuar",
        openConversationButtonTitle: "Abrir",
        startNewConversation: "Empezar nueva",
        startConversationCardTitle: "Comenzar una conversación",
        continueConversationCardTitle: "Continuar la conversación",
        yourConversationCardTitle: "Su conversación",
        yesButton: "Sí",
        noButton: "No",
        okButton: "Aceptar",
        sureButton: "Sí, seguro",
        downloadButton: "Descargar",
        openInNewTabButton: "Abrir en una nueva pestaña",
        previewFile: "Haga clic para previsualizar el archivo",
        pdfPreviewTitle: "Vista previa del PDF de Messenger",
        textFilePreviewTitle: "Vista previa del archivo de texto de Messenger",
        disconnectMessage: "La conversación finalizó",
        disconnectMessageSend:
          "Retome la conversación enviando un nuevo mensaje",
        videoLabel: "Vídeo",
        audioLabel: "Audio",
        ariaContinueConversation: "Haga clic para continuar la conversación",
        ariaOpenConversation: "Haga clic para abrir su conversación",
        ariaStartNewConversation:
          "Haga clic para iniciar una nueva conversación",
        ariaSendButton: "Envíe su mensaje",
        ariaMinimizeButton: "Minimizar Messenger",
        ariaAttachButton: "Adjuntar archivo",
        ariaRemoveButton: "Quitar archivo",
        ariaDownloadButton: "Descargar adjunto",
        ariaOpenAttachmentButton: "Abrir adjunto",
        ariaCloseAttachmentButton: "Cerrar vista previa de adjunto",
        ariaBackButton: "Atrás",
        ariaExpandButton: "Expandir",
        ariaLoading: "Cargando",
        ariaPercentRemaining: "porcentaje restante",
        ariaRemainingSeconds: "segundos restantes",
        ariaFileUploading: "Cargando el archivo",
        ariaFileUploadComplete: "Archivo cargado",
        ariaActionsAttachFileTitle: "Abre un diálogo de carga de archivos",
        ariaActionsImagePreviewTitle: "Abre una vista previa de la imagen",
        ariaActionsClearButtonTitle: "Borre y abandone la conversación",
        ariaActionsClearButtonLabel: "Borrar conversación",
        ariaImagePreviewOpened: "La vista previa de la imagen está abierta",
        ariaImagePreviewClosed: "La vista previa de la imagen está cerrada",
        ariaFileRemoved: "Archivo eliminado",
        ariaYouSaid: "Usted dijo",
        ariaBusinessSaid: "Mensaje comercial",
        ariaAgentSaid: "<%Agent%> dijo",
        ariaBotSaid: "<%Bot%> dijo",
        ariaIsTyping: "Escritura en curso",
        ariaStopTyping: "Escritura detenida",
        ariaNewMessage: "Nuevo mensaje",
        ariaMessengerOpenStatus: "Messenger está abierto",
        ariaMessengerMinimizeStatus: "Messenger está minimizado",
        ariaImageLabel: "Imagen",
        ariaQuickReply: "Haga clic para responder con este mensaje",
        ariaCardActionLink: "Haga clic para abrir el enlace.",
        ariaCardActionPostback: "Haga clic para responder con este mensaje.",
        ariaCobrowseActionPostback: "Haga clic para responder con esta acción.",
        ariaMessageLengthLimit: "Se alcanzó el número máximo de caracteres",
        ariaNextButton:
          "Siguiente. Pulse Intro o Espacio para pasar a la siguiente diapositiva del carrusel.",
        ariaPreviousButton:
          "Anterior. Pulse Intro o Espacio para volver a la anterior diapositiva del carrusel.",
        ariaSlideActive: "Diapositiva <%activeSlide%> de <%totalSlides%>.",
        ariaTabKeyNavigation:
          "Use las teclas Mayús+Tab para navegar por la diapositiva.",
        ariaArrowKeyNavigation:
          "Use las teclas de dirección para navegar entre diapositivas.",
        ariaCarouselMessage: "Carrusel con <%totalSlides%> diapositivas.",
        "cobrowse.offerTitle": "Compartir solicitud",
        "cobrowse.offerDescription": "Le solicitamos que comparta la pantalla",
        "cobrowse.acceptButton": "Aceptar",
        "cobrowse.declineButton": "Rechazar",
        "cobrowse.accepted": "Aceptado",
        "cobrowse.rejected": "Rechazado",
        "cobrowse.expired": "Caducado",
        "cobrowse.failed": "Error",
        "cobrowse.offerStatusNotification": "La oferta es de <%state%>",
        "info.authenticating": "Autenticando...",
        "info.reAuthenticating": "Reautenticando...",
        "errors.startFailed":
          "No pudimos iniciar una conversación. Vuelva a intentarlo más tarde.",
        "errors.restoreFailed": "No pudimos restaurar su conversación.",
        "errors.disconnected": "Se perdió la conexión",
        "errors.reconnecting": "Reconectándose...",
        "errors.generic":
          "Se produjo un error inesperado. Vuelva a intentarlo más tarde.",
        "errors.fileNameInvalid":
          "El nombre del archivo contiene caracteres no válidos inesperados que no podemos identificar",
        "errors.fileNameTooLong":
          "El nombre del archivo es demasiado largo. Vuelva a intentarlo con un nombre más corto.",
        "errors.fileTypeInvalid":
          "Solo se admiten los tipos de archivo <%allowedFileTypes%>.",
        "errors.fileTypeInvalidMultipleFiles":
          "Este tipo de archivo no es compatible",
        "errors.fileSizeZero":
          "El archivo no incluye contenido. Vuelva a intentarlo con un tamaño de archivo superior a 0 bytes y de hasta <%maxFileSizeLimit%>.",
        "errors.fileTooLarge":
          "El tamaño del archivo es demasiado grande. Use un tamaño de archivo de hasta <%maxFileSizeLimit%> y vuelva a intentarlo.",
        "errors.fileContentInvalid":
          "El archivo podría estar dañado. Vuelva a intentarlo con un archivo válido.",
        "errors.fileNotFound":
          "No podemos recuperar el archivo. Lamentamos las molestias.",
        "errors.messageLengthExceeded":
          "La longitud del mensaje es superior a <%maxMessageLength%>.",
        "alert.confirmClearConversation":
          "¿Desea borrar y abandonar la conversación? Se perderá el historial de mensajes.",
      },
      launcher: {
        inviteMessage:
          "Hola 👋 ¿Tiene alguna pregunta? ¡Estamos aquí para ayudarle!",
        ariaOpenButton: "Abrir Messenger",
        ariaMinimizeButton: "Minimizar Messenger",
        ariaCloseInvite: "Cerrar",
      },
      knowledge: {
        searchInputTitle: "¿Qué está buscando?",
        searchInputPlaceholder: "Buscar un tema...",
        searchResultSummary: "Mostrando <%resultsCount%> resultado(s) para",
        searchResultsEmpty: "No se encontraron resultados",
        ariaKnowledgeScreenOpenStatus: "Se abrió la pantalla de búsqueda",
        ariaArticleScreenOpenStatus: "Se abrió la pantalla de artículo",
        ariaAutoCompleteResultsSummary:
          "Mostrando <%resultsCount%> resultado(s) de compleción automática para <%searchInputText%>",
        ariaSearchResultSummary:
          "Mostrando <%resultsCount%> resultado(s) de búsqueda para <%searchQuery%>",
        ariaLoading: "Cargando",
        searchCategoriesTitle: "Categorías",
        searchArticlesTitle: "Artículos",
        ariaOpenSearchCategory: "Abrir categoría",
        categoryResultsSummary: "Resultados para <%category%>",
      },
      toaster: {
        acceptButton: "Aceptar",
        rejectButton: "Rechazar",
        ariaAcceptButton: "Haga clic para aceptar la notificación",
        ariaRejectButton: "Haga clic para rechazar la notificación",
      },
      cobrowse: {
        headerTitle: "Navegue por esta página con nosotros",
        connect: "Navegue por esta página con nosotros",
        enterPin: "Únase a la conavegación",
        enterPinTitle: "Introduzca su ID de reunión",
        otpMessage:
          "El agente con el que hable le proporcionará un ID de reunión de 6 dígitos para conectar este navegador a una sesión de conavegación. Esta pantalla se compartirá con dicho agente. El ID de reunión caducará en 5 minutos si no está conectado.",
        startSharing: "Empezar a compartir",
        ariaConnect:
          "Pulse Intro o la barra espaciadora para ir a la pantalla de conexión",
        ariaConnecting: "Conectándose",
        sharing: "Está compartiendo su pantalla",
        sharingAgent: "Está compartiendo pantalla con nuestro agente",
        "errors.cobrowseActive":
          "No se pudo iniciar la conavegación porque ya hay una sesión activa.",
        "errors.joinFailure": "ID de reunión no válido, inténtelo de nuevo.",
      },
    });
  }
);

//https://api.mypurecloud.com/api/v2/journey/deployments/5b62301c-6e80-4231-b750-740b5735ccdb/customers/bd17f76b-8a66-44f7-bb2b-b252e9262aa9/ping?sessionId=3c7d6ea0-251c-11ef-a2a3-9f02c4f43f2c&t=1717799991970&dl=http%3A%2F%2Flocalhost%3A4200%2Fleasing-financiero%2Foperaciones&dt=SVN%20-%20Bancolombia
//https://api.mypurecloud.com/api/v2/journey/deployments/5b62301c-6e80-4231-b750-740b5735ccdb/customers/bd17f76b-8a66-44f7-bb2b-b252e9262aa9/ping?sessionId=3c7d6ea0-251c-11ef-a2a3-9f02c4f43f2c&t=1717799991970&dl=http%3A%2F%2Flocalhost%3A4200%2Fleasing-financiero%2Foperaciones&dt=SVN%20-%20Bancolombia
// response {}
// app.post('/api/v2/journey/deployments/5b62301c-6e80-4231-b750-740b5735ccdb/customers/bd17f76b-8a66-44f7-bb2b-b252e9262aa9/ping', (req, res) => {
app.post(
  "/api/v2/journey/deployments/:deploymentId/customers/:customerId/ping",
  (req, res) => {
    res.json({ actions: [] });
  }
);

//https://resources.digital-cloud-west.medallia.com/wdcsea/17767/forms/10255/formDataV2_1716894831820_es.json
//https://resources.digital-cloud-west.medallia.com/wdcsea/17767/forms/10255/formDataV2_1716894831820_es.json
// response {}
// app.post('/wdcsea/17767/forms/10255/formDataV2_1716894831820_es.json', (req, res) => {
app.post(
  "/wdcsea/:formId/forms/:subFormId/formDataV2_:timestamp_es.json",
  (req, res) => {
    res.json({});
  }
);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
