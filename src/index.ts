import express from "express";
import mongoose from "mongoose";
import { loadFeeCollectorEvents, parseFeeCollectorEvents } from "./ethereum";
import { config } from "./config/config";
import feeRoutes from "./routes/feeRoutes";

const app = express();
const PORT = config.apiPort;

// Connect to MongoDB
mongoose.connect(config.mongoDbUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Load and parse events periodically
const loadEventsPeriodically = async () => {
  const latestBlock = await loadLatestBlock();
  const fromBlock = Math.max(latestBlock - 10, config.oldestBlock); // adjust the block range as needed

  const events = await loadFeeCollectorEvents(fromBlock, latestBlock);
  const parsedEvents = parseFeeCollectorEvents(events);

  // Store events in MongoDB
  await storeEvents(parsedEvents);

  setTimeout(loadEventsPeriodically, 60000); // Adjust the interval as needed
};

const loadLatestBlock = async () => {
  // Implement logic to load the latest block from the Ethereum RPC provider
  // ...

  return 100000; // Replace with the actual latest block number
};


// async function getLatestBlockNumber(provider: ethers.providers.JsonRpcProvider): Promise<number> {
//   try {
//     const blockNumber = await provider.getBlockNumber();
//     return blockNumber;
//   } catch (error) {
//     console.error('Error getting latest block number:', error);
//     throw new Error('Failed to retrieve the latest block number');
//   }
// }

// async function getLatestBlock(): Promise<number> {
//   try {
//     const response = await axios.get(`${config.polygonRpcUrl}/blocks/latest`);
//     return response.data.number;
//   } catch (error) {
//     console.error('Error fetching latest block:', error.message);
//     throw new Error('Failed to fetch latest block');
//   }
// }
const storeEvents = async (events: any[]) => {
  // Store events in MongoDB
  await FeeEventModel.insertMany(events);
};

// Register routes
app.use("/api", feeRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
  loadEventsPeriodically(); // Start loading events periodically
});
