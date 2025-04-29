const mongoose = require('mongoose');

// MongoDB connection
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  const MONGODB_URI = process.env.MONGODB_DATABASE_URL?.replace('<db_password>', process.env.MONGODB_DATABASE_PASSWORD);

  if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
  }

  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mong) => {
      return mong;
    });
  }
  try {
    cached.conn = await cached.promise;
    console.log('☘️  MongoDB connection successful');
  } catch (e) {
    cached.promise = null;
    console.error('MongoDB connection error:', e);
    throw e;
  }

  return cached.conn;
}

module.exports = dbConnect;
