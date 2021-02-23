import { CampaignModel } from "./campaignModel";
import { ClientModel } from "./clientModel";
import { ProductModel } from "./productModel";

export class ReportModel {
    public constructor(
        public reportId?: number,
        public creatorId?: number,
        public reportName?: string,
        public creatorName?: string,
        public creationDate?: string,
        public datesOnReport?: string,
        public isSaved?: boolean,
        public uuid?: string,
        public clients?: ClientModel[],
        public campaigns?: CampaignModel[],
        public products?: ProductModel[],
        public timePassed?: number
        
    ) {
    }
}
