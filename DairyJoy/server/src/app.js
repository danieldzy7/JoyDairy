const path = require('path');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

app.use(cors());
app.use(express.json({ limit: '2mb' }));

app.use((req, _res, next) => {
  if (req.path.startsWith('/api')) {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  }
  next();
});

// ---------- MongoDB with serverless-friendly connection caching ----------
// Vercel functions are stateless across cold starts; we reuse the connection
// promise across warm invocations to avoid reconnecting on every request.
mongoose.set('strictQuery', true);
let cachedPromise = global.__mongoosePromise;
async function connectMongo() {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not set');
  }
  if (mongoose.connection.readyState === 1) return mongoose.connection;
  if (!cachedPromise) {
    cachedPromise = mongoose
      .connect(process.env.MONGODB_URI, {
        dbName: 'joydiary',
        serverSelectionTimeoutMS: 8000,
      })
      .then((m) => {
        console.log('✅ MongoDB connected');
        return m;
      })
      .catch((err) => {
        cachedPromise = null;
        global.__mongoosePromise = null;
        console.error('❌ MongoDB connection error:', err.message);
        throw err;
      });
    global.__mongoosePromise = cachedPromise;
  }
  return cachedPromise;
}

// Ensure every API request has a live DB connection before handling.
app.use('/api', async (_req, _res, next) => {
  try {
    await connectMongo();
    next();
  } catch (err) {
    next(err);
  }
});

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'joy-diary', time: new Date().toISOString() });
});

app.use('/api/profile', require('./routes/profile'));
app.use('/api/entries', require('./routes/entries'));
app.use('/api/horoscope', require('./routes/horoscope'));
app.use('/api/almanac', require('./routes/almanac'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/encouragement', require('./routes/encouragement'));
app.use('/api/rituals', require('./routes/rituals'));

// Local-only static serve (Vercel serves the built client as static assets).
if (process.env.NODE_ENV === 'production' && !process.env.VERCEL) {
  const clientBuild = path.join(__dirname, '..', '..', 'client', 'dist');
  app.use(express.static(clientBuild));
  app.get('*', (_req, res) => res.sendFile(path.join(clientBuild, 'index.html')));
}

app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

module.exports = { app, connectMongo };
