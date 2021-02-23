import { AppState } from "./appState";
import { Action } from "./action";
import { ActionType } from "./actionType";
import { act } from "react-dom/test-utils";
import { UserModel } from "../models/userModel";

export function reducer(oldAppState: AppState, action: Action): AppState {
  const newAppState = { ...oldAppState }; //Duplicate the old state into a new state

  switch (action.type) {
    case ActionType.getAllClients:
      newAppState.allClients = action.payLoad;
      break;

    case ActionType.getAllCampaigns:
      newAppState.allCampaigns = action.payLoad;
      break;

    case ActionType.getAllProducts:
      newAppState.allProducts = action.payLoad;
      break;

    case ActionType.addClientToSelectedClients:
      newAppState.selectedClients.push(action.payLoad);
      break;

    case ActionType.unselectAllClients:
      newAppState.selectedClients = [];
      break;

    case ActionType.updateSelectedClients:
      newAppState.selectedClients = action.payLoad;
      break;

    case ActionType.getSelectedProducts:
      newAppState.selectedProducts = action.payLoad;
      break;

    case ActionType.updateCampaignsToDisplay:
      newAppState.campaignsToDisplay = action.payLoad;
      break;

    case ActionType.updateClientsToDisplay:
      newAppState.clientsToDisplay = action.payLoad;
      break;

    case ActionType.updateProductsToDisplay:
      newAppState.productsToDisplay = action.payLoad;
      break;

    case ActionType.resetFiltering:
      newAppState.campaignsToDisplay = [];
      newAppState.productsToDisplay = [];
      newAppState.clientsToDisplay = [];
      break;

    case ActionType.getSelectedCampaigns:
      newAppState.selectedCampaigns = action.payLoad;
      break;

    case ActionType.loginEditingMode:
      newAppState.user = action.payLoad;
      newAppState.isAuthSucceeded = true;
      break;

    case ActionType.logoutEditingMode:
      if (!newAppState.isReportSave) {
        localStorage.setItem(
          `${newAppState.user.userId}`,
          JSON.stringify(newAppState)
        );
      }
      newAppState.user = new UserModel();
      newAppState.isAuthSucceeded = false;
      newAppState.selectedClients = [];
      newAppState.selectedCampaigns = [];
      newAppState.selectedProducts = [];
      newAppState.clientsToDisplay = [];
      newAppState.campaignsToDisplay = [];
      newAppState.productsToDisplay = [];
      break;

    case ActionType.loginWatchingMode:
      newAppState.user = action.payLoad;
      newAppState.isAuthSucceededForReport = true;
      break;

    case ActionType.logoutWatchingMode:
      newAppState.user = new UserModel();
      newAppState.isAuthSucceededForReport = false;
      newAppState.isAuthSucceeded = false;
      newAppState.selectedClients = [];
      newAppState.selectedCampaigns = [];
      newAppState.selectedProducts = [];
      newAppState.clientsToDisplay = [];
      newAppState.campaignsToDisplay = [];
      newAppState.productsToDisplay = [];
      break;

    case ActionType.changeDisplayForPopUp:
      if (newAppState.isPopUpShow) {
        newAppState.isPopUpShow = false;
      } else {
        newAppState.isPopUpShow = true;
      }
      break;

    case ActionType.changeDisplayForProductsPopUp:
      if (newAppState.isProductsPopUpShow) {
        newAppState.isProductsPopUpShow = false;
      } else {
        newAppState.isProductsPopUpShow = true;
      }
      break;

    case ActionType.changeDisplayForRestoreStatePopUp:
      if (newAppState.isRestoreStatePopUpShow) {
        newAppState.isRestoreStatePopUpShow = false;
      } else {
        newAppState.isRestoreStatePopUpShow = true;
      }
      break;

    case ActionType.changeDisplayForReportsPopUp:
      if (newAppState.isReportsPopUpShow) {
        newAppState.isReportsPopUpShow = false;
      } else {
        newAppState.isReportsPopUpShow = true;
      }
      break;

    case ActionType.changeDisplayForLinkPopUp:
      if (newAppState.isLinksPopUpShow) {
        newAppState.isLinksPopUpShow = false;
      } else {
        newAppState.isLinksPopUpShow = true;
      }
      break;

    case ActionType.changeDisplayForMobileMenu:
      if (newAppState.isMobileMenuShow) {
        newAppState.isMobileMenuShow = false;
      } else {
        newAppState.isMobileMenuShow = true;
      }
      break;

    case ActionType.changeDisplayForReportsLinkPopUp:
      if (newAppState.displayForReportsLinkPopUp) {
        newAppState.displayForReportsLinkPopUp = false;
      } else {
        newAppState.displayForReportsLinkPopUp = true;
      }
      break;

    case ActionType.saveReport:
      localStorage.removeItem(`${newAppState.user.userId}`);
      newAppState.isReportSave = true;
      break;

    case ActionType.getDatesRanges:
      newAppState.datesRange = action.payLoad;
      break;

    case ActionType.getReportToCopy:
      newAppState.reportToCopy = action.payLoad;
      break;


    case ActionType.removeClient:
      const clientId = action.payLoad;
      const index = newAppState.selectedClients.findIndex(
        (c) => c.clientId === clientId
      );

      newAppState.selectedClients.splice(index, 1);
      newAppState.selectedCampaigns = newAppState.selectedCampaigns.filter(
        (c) => c.clientId !== action.payLoad
      );
      newAppState.campaignsToDisplay = newAppState.campaignsToDisplay.filter(
        (c) => c.clientId !== action.payLoad
      );
      newAppState.selectedProducts = newAppState.selectedProducts.filter(
        (c) => c.clientId !== action.payLoad
      );
      newAppState.productsToDisplay = newAppState.productsToDisplay.filter(
        (c) => c.clientId !== action.payLoad
      );
      newAppState.clientsToDisplay = newAppState.clientsToDisplay.filter(
        (c) => c.clientId !== action.payLoad
      );
      break;

    default:
      break;
  }

  return newAppState;
}
