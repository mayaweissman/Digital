import React, { Component } from "react";
import { Campaigns } from "../campaigns/campaigns";
import { FilteringSideMenu } from "../filtering-side-menu/filtering-side-menu";
import { TopCampaignsNav } from "../top-campaigns-nav/top-campaigns-nav";
import "./report-maker.css";
import { store } from "../../redux/store";
import { Unsubscribe } from "redux";
import { LinkPopUp } from "../link-pop-up/link-pop-up";
import { UserModel } from "../../models/userModel";
import { ActionType } from "../../redux/actionType";
import { ReportsHistoryPopUp } from "../reports-history-pop-up/reports-history-pop-up";
import { LinkPopUpFromReport } from "../link-pop-up-from-report/link-pop-up-from-report";

interface ReportMakerState {
    isScroll: boolean,
    display: boolean,
    windowWidth: number,
    isAfterAuth: boolean,
    displayForReportsPopUp: boolean,
    displayForReportsLinkPopUp: boolean

}

export class ReportMaker extends Component<any, ReportMakerState>{

    private unsubscribeStore: Unsubscribe;

    public constructor(props: any) {
        super(props);
        this.state = {
            isScroll: false,
            display: store.getState().isLinksPopUpShow,
            displayForReportsPopUp: store.getState().isReportsPopUpShow,
            displayForReportsLinkPopUp: store.getState().displayForReportsLinkPopUp,
            windowWidth: 0,
            isAfterAuth: store.getState().isAuthSucceeded,
        }

        this.unsubscribeStore = store.subscribe(() => {
            const display = store.getState().isLinksPopUpShow;
            this.setState({ display });
            const isAfterAuth = store.getState().isAuthSucceeded;
            this.setState({ isAfterAuth });
            const displayForReportsPopUp = store.getState().isReportsPopUpShow;
            this.setState({ displayForReportsPopUp });
            const displayForReportsLinkPopUp = store.getState().displayForReportsLinkPopUp;
            this.setState({ displayForReportsLinkPopUp });

        })

    }


    public componentDidMount() {

        if (!this.state.isAfterAuth) {
            this.props.history.push("/auth");
            return;
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

        const windowWidth = window.screen.width;
        this.setState({ windowWidth });
    }

    public componentWillUnmount(): void {
        this.unsubscribeStore();
    }

    public render() {
        return (
            <div className="report-maker">
                {!this.state.isAfterAuth &&
                    this.props.history.push("/auth")

                }
                {this.state.isAfterAuth &&
                    <>
                        <main>
                            <div className="header">
                                <TopCampaignsNav isScroll={this.state.isScroll} />
                            </div>

                            <Campaigns />
                        </main>

                        <aside>
                            {this.state.windowWidth > 600 &&
                                <FilteringSideMenu isOnReport={false} />
                            }


                            {this.state.windowWidth <= 600 && store.getState().isMobileMenuShow &&
                                <FilteringSideMenu isOnReport={false} />
                            }
                        </aside>
                        {this.state.display && <LinkPopUp />}
                        {this.state.displayForReportsPopUp && <ReportsHistoryPopUp />}
                        {this.state.displayForReportsLinkPopUp && <LinkPopUpFromReport/>}
                    </>
                }

            </div>

        )
    }
}