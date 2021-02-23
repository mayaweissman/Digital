import { Store } from "redux";
import { AppState } from "./appState";
import { Action } from "./action";

// תחביר מקוצר לפונקציה הנ"ל
export const saveToSessionStorage = (store: { getState: () => any; }) => (next: (arg0: any) => void) => (action: any) => {
    next(action);
    if(action.type === 20 || action.type === 22){
        sessionStorage.removeItem("AppState");
    }
    else{
        sessionStorage.setItem("AppState", JSON.stringify(store.getState()));
    }
};
