import { ProductModel } from "./productModel";

export class CampaignModel {
  public constructor(
    public campaignId?: number,
    public clientId?: number,
    public campaignName?: string,
    public lastUpdate?: string,
    public timePassed?: number

  ) {
  }
}
