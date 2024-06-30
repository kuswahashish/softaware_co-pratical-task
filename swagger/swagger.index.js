// import all common express paths here
const roleRoutes = require("./swagger_helper/role.swagger");

const swaggerDoc = {
  openapi: "3.0.0",
  host: "",
  info: {
    title: "Software co. Practical-Task",
    version: "0.0.1",
    description: "Swagger API Documentation for practical task provided by software co.",
  },
  servers: [
    {
      url: process.env.SWAGGER_BASE_URL,
      description: "local server",
    },
  ],
  tags: [
    {
      name: "Role",
      description: "All Role API Route",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
      },
    },
  },
  paths: {
    ...roleRoutes,
  },
};
module.exports = swaggerDoc;
