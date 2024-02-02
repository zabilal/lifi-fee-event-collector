import {prop, getModelForClass, Prop} from "@typegoose/typegoose";

export class FeeEvent {
  @prop( {required: true} )
  token!: string;

  @prop({ required: true })
  integrator!: string;

  @prop({ required: true })
  integratorFee!: string;

  @prop({ required: true })
  lifiFee!: string;
}

export const FeeEventModel = getModelForClass(FeeEvent);
