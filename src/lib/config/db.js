import mongoose from "mongoose";

const connections = {};

export const connectDB = async (dbName = "KojiHQ") => {
  if (connections[dbName]) {
    return connections[dbName];
  }

  const MONGO_URI = process.env.MONGODB_URI;

  if (!MONGO_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
  }

  try {
    mongoose.set("strictQuery", true);
    const newConnection = await mongoose.createConnection(MONGO_URI, {
      serverSelectionTimeoutMS: 15000,  
      socketTimeoutMS: 30000,           
      maxPoolSize: 10,                  
      minPoolSize: 2,                   
      heartbeatFrequencyMS: 10000,      
      connectTimeoutMS: 30000,         
      family: 4,                       
      retryWrites: true,
      ssl: true,
      tls: true,
      tlsAllowInvalidCertificates: true,
      tlsAllowInvalidHostnames: true,
      authSource: 'admin'
    });

    newConnection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    newConnection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    await newConnection.asPromise();
    
    connections[dbName] = newConnection;
    return newConnection;
  } catch (error) {
    console.error(`Error connecting to database ${dbName}:`, error);
    process.exit(1);
  }
};
