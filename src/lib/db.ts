import mongoose from 'mongoose';

declare global {
  var mongoose: {
    conn: mongoose.Connection | null;
    promise: Promise<mongoose.Connection> | null;
  };
}

if (!global.mongoose) {
  global.mongoose = {
    conn: null,
    promise: null,
  };
}

export async function connectDB() {
  if (global.mongoose.conn) {
    // If we have a connection, return it
    console.log('Using existing MongoDB connection');
    return global.mongoose.conn;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
  }

  if (!global.mongoose.promise) {
    // If no promise exists, create a new connection
    console.log('Creating new MongoDB connection');
    
    const opts = {
      bufferCommands: true,
    };

    global.mongoose.promise = mongoose.connect(process.env.MONGODB_URI, opts).then(m => m.connection);
  }

  try {
    global.mongoose.conn = await global.mongoose.promise;
  } catch (error) {
    global.mongoose.promise = null;
    throw error;
  }

  return global.mongoose.conn;
}
