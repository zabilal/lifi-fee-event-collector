import {ethers, BigNumber, EventLog} from "ethers";
import { FeeCollector__factory } from "@lifi/types";
import { BlockTag } from "@ethersproject/abstract-provider";
import { config } from "../config/config";

export const loadFeeCollectorEvents = async (
  fromBlock: BlockTag,
  toBlock: BlockTag
): Promise<EventLog[]> => {
  const feeCollector = new ethers.Contract(
    config.contractAddress,
    FeeCollector__factory.createInterface(),
    // new ethers.providers.JsonRpcProvider(config.ethereumRpcUrl)
    new ethers.JsonRpcProvider(config.polygonRpcUrl)
  );

  const filter = feeCollector.filters.FeesCollected();
   return feeCollector.queryFilter(filter, fromBlock, toBlock);
};

export const parseFeeCollectorEvents = (events: ethers.EventLog[]): any[] => {
  const feeCollectorContract = new ethers.Contract(
    config.contractAddress,
    FeeCollector__factory.createInterface(),
    new ethers.JsonRpcProvider(config.polygonRpcUrl)
  );

  return events.map((event) => {
    const parsedEvent = feeCollectorContract.interface.parseLog(event);

    return {
      token: parsedEvent?.args[0],
      integrator: parsedEvent?.args[1],
      integratorFee: BigNumber.from(parsedEvent?.args[2]).toString(),
      lifiFee: BigNumber.from(parsedEvent?.args[3]).toString(),
    };
  });
};
