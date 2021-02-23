import React, { Component, useRef } from "react";
import { NavLink } from "react-router-dom";
import { Unsubscribe } from "redux";
import { CampaignModel } from "../../models/campaignModel";
import { ClientModel } from "../../models/clientModel";
import { ProductModel } from "../../models/productModel";
import { ProductsType } from "../../models/productsTypeModel";
import { ActionType } from "../../redux/actionType";
import { store } from "../../redux/store";
import { AddClientPopUp } from "../add-client-pop-up/add-client-pop-up";
import { AllClients } from "../all-clients/all-clients";
import "./top-campaigns-nav.css";

interface TopCampaignsNavProps {
    isScroll: boolean
}

interface TopCampaignsNavState {
    selectedClients: ClientModel[],
    clientsToDisplay: ClientModel[],
    isButtonsScrolled: boolean,
    display: boolean,
    filteringBefore: {
        beforeCampaignsToDisplay: CampaignModel[],
        beforeProductsToDisplay: ProductModel[]

    },
    showLogout: boolean
}

export class TopCampaignsNav extends Component<TopCampaignsNavProps, TopCampaignsNavState>{

    private unsubscribeStore: Unsubscribe;
    public buttonsRef = React.createRef<HTMLDivElement>();
    public topNavRef = React.createRef<HTMLDivElement>();


    public constructor(props: TopCampaignsNavProps) {
        super(props);

        this.state = {
            selectedClients: store.getState().selectedClients,
            clientsToDisplay: store.getState().clientsToDisplay,
            isButtonsScrolled: false,
            display: store.getState().isPopUpShow,
            filteringBefore: {
                beforeCampaignsToDisplay: [],
                beforeProductsToDisplay: []
            },
            showLogout: false
        }
        this.unsubscribeStore = store.subscribe(() => {
            const selectedClients = store.getState().selectedClients;
            const display = store.getState().isPopUpShow;
            const clientsToDisplay = store.getState().clientsToDisplay;
            this.setState({ selectedClients });
            this.setState({ display });
            this.setState({ clientsToDisplay });


            const topNavWidth: number = this.topNavRef.current?.clientWidth as number;
            const maxWidth = topNavWidth / 100 * 70;
            const buttonsWidth = this.buttonsRef.current?.scrollWidth as number;
            if (buttonsWidth > maxWidth) {
                this.setState({ isButtonsScrolled: true });
            }
            else {
                this.setState({ isButtonsScrolled: false });
            }
        })

    }

    componentDidMount() {
        const topNavWidth: number = this.topNavRef.current?.clientWidth as number;
        const maxWidth = topNavWidth / 100 * 70;
        const buttonsWidth = this.buttonsRef.current?.scrollWidth as number;

        if (buttonsWidth > maxWidth) {
            this.setState({ isButtonsScrolled: true });
        }
        else {
            this.setState({ isButtonsScrolled: false });
        }


        window.addEventListener("click", () => {
            const topNavWidth: number = this.topNavRef.current?.clientWidth as number;
            const maxWidth = topNavWidth / 100 * 70;
            const buttonsWidth = this.buttonsRef.current?.scrollWidth as number;
            if (buttonsWidth > maxWidth) {
                this.setState({ isButtonsScrolled: true });
            }
            else {
                this.setState({ isButtonsScrolled: false });
            }
        })
    }


    public filterByClientId = (clientId: number) => (event: any) => {

        const campaignsToDisplay: CampaignModel[] = [];

        const filteringBefore = { ...this.state.filteringBefore };
        filteringBefore.beforeCampaignsToDisplay = store.getState().campaignsToDisplay;
        filteringBefore.beforeProductsToDisplay = store.getState().productsToDisplay;
        this.setState({ filteringBefore });

        const allSelectedCampaigns = store.getState().selectedCampaigns;
        for (const c of allSelectedCampaigns) {
            if (c.clientId === clientId) {
                campaignsToDisplay.push(c);
            }
        }
        store.dispatch({ type: ActionType.updateCampaignsToDisplay, payLoad: campaignsToDisplay });


        const clientsToDisplay: ClientModel[] = [];
        const allSelectedClients = store.getState().selectedClients;
        for (const c of allSelectedClients) {
            if (c.clientId === clientId) {
                clientsToDisplay.push(c);
            }
        }

        store.dispatch({ type: ActionType.updateClientsToDisplay, payLoad: clientsToDisplay });
    }


    public componentWillUnmount(): void {
        this.unsubscribeStore();
    }

    public scrollToRight = () => {
        this.buttonsRef.current?.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth"
        });
    }

    public scrollToLeft = () => {
        const buttonsWidth = this.buttonsRef.current?.scrollWidth as number;
        this.buttonsRef.current?.scrollTo({
            top: 0,
            left: -buttonsWidth,
            behavior: "smooth"
        });
    }


    public removeClient = (clientId: number) => (event: any) => {

        //Remove from clients in redux
        const selectedClients = [...this.state.selectedClients];
        const index = selectedClients.findIndex(c => c.clientId === clientId);
        selectedClients.splice(index, 1);
        this.setState({ selectedClients });

        store.dispatch({ type: ActionType.removeClient, payLoad: clientId });

    }

    public openPopUp = () => {
        store.dispatch({ type: ActionType.changeDisplayForPopUp, payLoad: false });
    }

    public resetClientsToDisplay = () => {
        store.dispatch({ type: ActionType.updateClientsToDisplay, payLoad: [] });
        store.dispatch({ type: ActionType.updateCampaignsToDisplay, payLoad: this.state.filteringBefore.beforeCampaignsToDisplay });
        store.dispatch({ type: ActionType.updateProductsToDisplay, payLoad: this.state.filteringBefore.beforeProductsToDisplay });
    }


    public render() {
        return (
            <div ref={this.topNavRef} className="top-campaigns-nav">
                <div ref={this.buttonsRef} className="campaigns-buttons">
                    <div style={{ display: this.state.isButtonsScrolled ? "block" : "none" }}
                        className="campaigns-start-of-buttons-section" onMouseEnter={this.scrollToRight}></div>



                    {this.state.clientsToDisplay.length === 0 && this.state?.selectedClients.map(client =>
                        <button className="campaigns-client-btn" onClick={this.filterByClientId(client.clientId as number)}>
                            <button className="campaigns-remove-btn" onClick={this.removeClient(client.clientId as number)}>
                                <span>&#10006;</span>
                            </button>
                            <span className="campaigns-inside-client-btn">{client.clientName}</span>
                        </button>
                    )}

                    {this.state.clientsToDisplay.length > 0 && this.state?.clientsToDisplay.map(client =>
                        <button className="campaigns-client-btn" onClick={this.filterByClientId(client.clientId as number)}>
                            <button className="campaigns-remove-btn" onClick={this.removeClient(client.clientId as number)}>
                                <span>&#10006;</span>
                            </button>
                            <span className="campaigns-inside-client-btn">{client.clientName}</span>
                        </button>
                    )}




                    <div style={{ display: this.state.isButtonsScrolled ? "block" : "none" }}
                        className="campaigns-end-of-buttons-section" onMouseEnter={this.scrollToLeft}>
                        <span className="campaigns-more-buttons-icon">|</span>
                    </div>
                </div>

                {this.state.clientsToDisplay.length === 0 &&
                    <span className="add-client-span" onClick={this.openPopUp}>הוספת לקוח</span>}

                <span className="logout-span" onClick={()=>this.setState({showLogout: true})}>logout</span>

                {this.state.clientsToDisplay.length > 0 &&
                    <span className="add-client-span" onClick={this.resetClientsToDisplay}>כל הלקוחות</span>}

                <div className="campaigns-top-scroll" style={{ top: this.props.isScroll ? this.topNavRef.current?.clientHeight : 0 }}></div>

                <NavLink to="/home">
                    <img className="campaigns-logo" src="./assets/images/logo_factory.svg" />
                </NavLink>

                {this.state.display &&
                    <AddClientPopUp />
                }


                {this.state.showLogout &&
                    <div className="logout-dialog" >
                        <span className="logout-subtitle">התנתקות מהמערכת תמחק את כל הבחירות הנוכחיות</span>
                        <br />
                        <span className="logout-title">מה ברצונך לעשות?</span>
                        <br />
                        <button className="logout-cancel-btn" onClick={() => this.setState({ showLogout: false })}>אני רוצה להישאר</button>
                        <button className="logout-confirm-btn" onClick={() => store.dispatch({ type: ActionType.logoutEditingMode })}>אני רוצה להתנתק</button>
                    </div>
                }

            </div>

        )
    }
}
