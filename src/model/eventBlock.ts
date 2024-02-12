import {prop, getModelForClass} from "@typegoose/typegoose";

export class EventBlock {
    @prop( {required: true} )
    lastBlock?: number;
    evmChainId?: string;
    date?: Date;
}

export const LastBlockEventModel = getModelForClass(EventBlock);
