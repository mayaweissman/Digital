import React, { Component } from "react";
import { Unsubscribe } from "redux";
import { UserModel } from "../../models/userModel";
import { ActionType } from "../../redux/actionType";
import { store } from "../../redux/store";
import { AllClients } from "../all-clients/all-clients";
import { RestoreStatePopUp } from "../restore-state-pop-up/restore-state-pop-up";
import { TopClientsNav } from "../top-clients-nav/top-clients-nav";
import './home.css';


interface HomeState {
    isScroll: boolean,
    user: UserModel,
    isAfterAuth: boolean,
    isRestoreStatePopUp: boolean
}

export class Home extends Component<any, HomeState> {

    private unsubscribeStore: Unsubscribe;

    public constructor(props: any) {
        super(props);
        this.state = {
            isScroll: false,
            isAfterAuth: store.getState().isAuthSucceeded,
            isRestoreStatePopUp: store.getState().isRestoreStatePopUpShow,
            user: store.getState().user
        }


        this.unsubscribeStore = store.subscribe(() => {
            const isAfterAuth = store.getState().isAuthSucceeded;
            this.setState({ isAfterAuth });
            const user = store.getState().user;
            this.setState({ user });
            const isRestoreStatePopUp = store.getState().isRestoreStatePopUpShow;
            this.setState({ isRestoreStatePopUp });
        })
    }

    componentDidMount() {

        if (!this.state.isAfterAuth) {
            this.props.history.push("/auth");
            return;
        }

        const stateFromLocal = localStorage.getItem(`${this.state.user.userId}`);
        if(stateFromLocal){
            store.dispatch({type: ActionType.changeDisplayForRestoreStatePopUp});
        } 

        window.addEventListener('scroll', (e) => {
            const YPosition = window.pageYOffset;
            if (YPosition === 0) {
                this.setState({ isScroll: false });
            }
            else {
                this.setState({ isScroll: true });
            }
        });
    }


    public componentWillUnmount(): void {
        this.unsubscribeStore();
    }


    public render() {
        return (
            <div className="home">
                {!this.state.isAfterAuth &&
                    this.props.history.push("/auth")

                }
                {this.state.isAfterAuth &&
                    <>
                        <TopClientsNav isScroll={this.state.isScroll} />
                        <AllClients />
                    </>}
                    {this.state.isRestoreStatePopUp && <RestoreStatePopUp/>}
            </div>
        )
    }
}