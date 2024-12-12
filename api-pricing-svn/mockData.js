// mockData.js

const mockResponses = {
  National: {
    "number": "40670954025",
    "accountClass": "SVGS",
    "currencyCode": "COP"
  },
  Filex: {
    "number": "80700000302",
    "accountClass": "CAA",
    "currencyCode": "USD"
  }
};

const mockError = {
  "errors": [
    {
      "reason": "Estamos trabajando para mejorar el mensaje por defecto",
      "domain": "POST:/api/v1/security-filters/payments-leasing/retrieve-conditions-advance-stage",
      "code": "400",
      "message": "{\"title\":\"El sistema no se encuentra disponible\",\"description\":\"Nuestro equipo está trabajando para darte una pronta solución.\"}",
      "type": "ERROR"
    }
  ]
};

module.exports = { mockResponses, mockError };
