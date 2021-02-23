import { CampaignModel } from "../models/campaignModel";
import { ClientModel } from "../models/clientModel";
import { ProductModel } from "../models/productModel";
import { ReportModel } from "../models/reportModel";
import { UserModel } from "../models/userModel";

export class AppState {
  public allClients: ClientModel[] = [];
  public allProducts: ProductModel[] = [];
  public allCampaigns: CampaignModel[] = [];
  public selectedClients: ClientModel[] = [];
  public selectedCampaigns: CampaignModel[] = [];
  public selectedProducts: ProductModel[] = [];
  public clientsToDisplay: ClientModel[] = [];
  public campaignsToDisplay: CampaignModel[] = [];
  public productsToDisplay: CampaignModel[] = [];
  public isPopUpShow: boolean = false;
  public isProductsPopUpShow: boolean = false;
  public isRestoreStatePopUpShow: boolean = false;
  public isMobileMenuShow: boolean = false;
  public isLinksPopUpShow: boolean = false;
  public isReportsPopUpShow: boolean = false;
  public isReportSave: boolean = false;
  public isAuthSucceeded: boolean = false;
  public isAuthSucceededForReport: boolean = false;
  public datesRange: string = "- - / - - / - -";
  public user: UserModel = new UserModel();
  public reportToCopy: ReportModel = new ReportModel();
  public displayForReportsLinkPopUp: boolean = false;

  public constructor() {
    const json = sessionStorage.getItem("AppState");
    if (json) {
      const appState: AppState = JSON.parse(json);
      this.allClients = appState.allClients;
      this.allProducts = appState.allProducts;
      this.allCampaigns = appState.allCampaigns;
      this.selectedClients = appState.selectedClients;
      this.selectedCampaigns = appState.selectedCampaigns;
      this.selectedProducts = appState.selectedProducts;
      this.campaignsToDisplay = appState.campaignsToDisplay;
      this.clientsToDisplay = appState.clientsToDisplay;
      this.productsToDisplay = appState.productsToDisplay;
      this.isPopUpShow = appState.isPopUpShow;
      this.isProductsPopUpShow = appState.isProductsPopUpShow;
      this.isLinksPopUpShow = appState.isLinksPopUpShow;
      this.isMobileMenuShow = appState.isMobileMenuShow;
      this.isAuthSucceeded = appState.isAuthSucceeded;
      this.isRestoreStatePopUpShow = appState.isRestoreStatePopUpShow;
      this.isAuthSucceededForReport = appState.isAuthSucceededForReport;
      this.user = appState.user;
      this.datesRange = appState.datesRange;
      this.isReportSave = appState.isReportSave;
      this.isReportsPopUpShow = appState.isReportsPopUpShow;
      this.reportToCopy = appState.reportToCopy;
      this.displayForReportsLinkPopUp = appState.displayForReportsLinkPopUp;
    }
  }
}
