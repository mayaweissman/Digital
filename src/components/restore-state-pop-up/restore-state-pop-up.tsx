import React, { Component } from "react";
import { ActionType } from "../../redux/actionType";
import { AppState } from "../../redux/appState";
import { store } from "../../redux/store";
import "./restore-state-pop-up.css";


export class RestoreStatePopUp extends Component {

    public refuse = () => {
        store.dispatch({ type: ActionType.changeDisplayForRestoreStatePopUp });
        const user = store.getState().user;
        localStorage.removeItem(`${user.userId}`);
    }

    public restoreState = () => {
        const user = store.getState().user;
        const json = localStorage.getItem(`${user.userId}`);
        const state:AppState = JSON.parse(json as string);
        store.dispatch({type: ActionType.updateSelectedClients, payLoad: state.selectedClients});
        store.dispatch({type: ActionType.getSelectedCampaigns, payLoad: state.selectedCampaigns});
        store.dispatch({type: ActionType.getSelectedProducts, payLoad: state.selectedProducts});
        store.dispatch({type: ActionType.updateCampaignsToDisplay, payLoad: state.campaignsToDisplay});
        store.dispatch({type: ActionType.updateProductsToDisplay, payLoad: state.productsToDisplay});
        store.dispatch({type: ActionType.updateClientsToDisplay, payLoad: state.clientsToDisplay});
        store.dispatch({type: ActionType.changeDisplayForRestoreStatePopUp});
        localStorage.removeItem(`${user.userId}`);
    }

    public render() {
        return (
            <div className="full-screen-link-conatiner">
                <div className="small-link-conatiner">
                    <h3>ראינו שלא סיימת לערוך את דו"ח התוצרים בפעם האחרונה שהיית כאן</h3>
                    <h2>?האם ברצונך להמשיך מאותה הנקודה</h2>
                    <div className="buttons-in-popup">
                        <button onClick={this.refuse} className="restore-btn">לא</button>
                        <button className="restore-btn" onClick={this.restoreState}>כן</button>
                    </div>
                </div>
            </div>
        )
    }
}