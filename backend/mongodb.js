const { MongoClient, ServerApiVersion } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function connectMongoDB() {
  try {
      console.log("Attempting to connect to MongoDB...");
      await client.connect();
      await client.db("admin").command({ ping: 1 });
      console.log("Successfully connected to MongoDB Atlas!");
      return client;
  } catch (err) {
      console.error("Error connecting to MongoDB:", err);
      throw err; // Ensure the error is thrown to stop the server
  }
}


function closeMongoDBConnection() {
  client.close();
  console.log("MongoDB connection closed.");
}

module.exports = {
  connectMongoDB,
  closeMongoDBConnection,
};
