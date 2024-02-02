"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const ethereum_1 = require("./ethereum");
const config_1 = require("./config/config");
const feeRoutes_1 = __importDefault(require("./routes/feeRoutes"));
const app = (0, express_1.default)();
const PORT = config_1.config.apiPort;
// Connect to MongoDB
mongoose_1.default.connect(config_1.config.mongoDbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
// Load and parse events periodically
const loadEventsPeriodically = () => __awaiter(void 0, void 0, void 0, function* () {
    const latestBlock = yield loadLatestBlock();
    const fromBlock = Math.max(latestBlock - 10, config_1.config.oldestBlock); // adjust the block range as needed
    const events = yield (0, ethereum_1.loadFeeCollectorEvents)(fromBlock, latestBlock);
    const parsedEvents = (0, ethereum_1.parseFeeCollectorEvents)(events);
    // Store events in MongoDB
    yield storeEvents(parsedEvents);
    setTimeout(loadEventsPeriodically, 60000); // Adjust the interval as needed
});
const loadLatestBlock = () => __awaiter(void 0, void 0, void 0, function* () {
    // Implement logic to load the latest block from the Ethereum RPC provider
    // ...
    return 100000; // Replace with the actual latest block number
});
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
const storeEvents = (events) => __awaiter(void 0, void 0, void 0, function* () {
    // Store events in MongoDB
    yield FeeEventModel.insertMany(events);
});
// Register routes
app.use("/api", feeRoutes_1.default);
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
    loadEventsPeriodically(); // Start loading events periodically
});
