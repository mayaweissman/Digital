import { CampaignModel } from "./campaignModel";

export class ClientModel {
  public constructor(
    public clientId?: number,
    public clientImageSrc?: string,
    public clientName?: string,
    public company?: string,
    public lastUpdate?: string,
    public timePassed?: number
  ) {
  }
}
