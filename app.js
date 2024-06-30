const express = require('express');
const connectDB = require('./config/db.connection');
const roleRoutes = require('./src/routes/role.routes');
const userRoutes = require('./src/routes/user.routes');
const app = express();
const PORT = process.env.PORT || 5000;

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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});