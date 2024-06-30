const express = require('express');
const connectDB = require('./config/db.connection');
const roleRoutes = require('./src/routes/role.routes');
const userRoutes = require('./src/routes/user.routes');

const app = express();
// swagger-ui-express configurations
const swagger = require("swagger-ui-express");
const swaggerDoc = require("./swagger/swagger.index");
swaggerDoc.host = process.env.SWAGGER_BASE_URL;
app.use("/swagger-doc", swagger.serve);
app.use("/swagger-doc", swagger.setup(swaggerDoc));

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// // Routes
app.use('/api/role', roleRoutes);
app.use('/api/user', userRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Internal Server Error!');
});

module.exports = app;