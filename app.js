const express = require('express');
const config = require('config');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

app.use(express.json({ extended: true }));

// register routes
const authRoutes = require('./routes/auth.routes');
app.use('/api/auth', authRoutes);
const linkRoutes = require('./routes/link.routes');
app.use('/api/link', linkRoutes);
const redirectRoutes = require('./routes/redirect.routes');
app.use('/t', redirectRoutes);

if (process.env.NODE_ENV === 'production') {
  app.use('/', express.static(path.join(__dirname, 'client', 'build')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = config.get('port') || 5000;

async function start() {
  try {
    // connect to MongoDB
    await mongoose.connect(config.get('mongoUri'), {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    // start server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

  } catch (err) {
    console.log('Server Error', err.message);
    process.exit(1);
  }
}

start();

