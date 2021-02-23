import React, { Component } from "react";
import { ReportModel } from "../../models/reportModel";
import "./report.css";
import { getAllReports } from "../../data/report";
import { Campaigns } from "../campaigns/campaigns";
import { TopCampaignsNav } from "../top-campaigns-nav/top-campaigns-nav";
import { store } from "../../redux/store";
import { Unsubscribe } from "redux";
import { FilteringSideMenu } from "../filtering-side-menu/filtering-side-menu";
import { LinkPopUp } from "../link-pop-up/link-pop-up";
import { TopReportNav } from "../top-report-nav/top-report-nav";
import { ActionType } from "../../redux/actionType";
import axios from "axios";
import { AuthForWatchingOnly } from "../auth-for-watching-only/auth-for-watching-only";

interface ReportState {
    report: ReportModel,
    isScroll: boolean,
    display: boolean,
    isAfterAuth: boolean,
    isPreAuth: boolean
}

export class Report extends Component<any, ReportState>{

    private unsubscribeStore: Unsubscribe;

    public constructor(props: any) {
        super(props);
        this.state = {
            report: new ReportModel(),
            isScroll: false,
            display: store.getState().isLinksPopUpShow,
            isAfterAuth: store.getState().isAuthSucceededForReport,
            isPreAuth: store.getState().isAuthSucceeded
        }


        this.unsubscribeStore = store.subscribe(() => {
            const display = store.getState().isLinksPopUpShow;
            this.setState({ display });
            const isAfterAuth = store.getState().isAuthSucceededForReport;
            this.setState({ isAfterAuth });
            const isPreAuth = store.getState().isAuthSucceeded;
            this.setState({ isPreAuth });
        })
    }

    public async componentDidMount() {
        try {
            const uuid = this.props.match.params.uuid;
            const response = await axios.get("http://factory-dev.landing-page-media.co.il/all-reports/?uuid=" + uuid);
            const report: ReportModel = response.data;
            if (!report) {
                this.props.history.push("/page-not-found");
                return;
            }
            this.setState({ report });

            window.addEventListener('scroll', (e) => {
                const YPosition = window.pageYOffset;
                if (YPosition === 0) {
                    this.setState({ isScroll: false });
                }
                else {
                    this.setState({ isScroll: true });
                }
            });
    

            store.dispatch({ type: ActionType.updateSelectedClients, payLoad: report.clients });
            store.dispatch({type: ActionType.getDatesRanges, payLoad: report.datesOnReport});
            if (report.products && report.products.length > 0) {
                store.dispatch({ type: ActionType.getSelectedProducts, payLoad: report.products });
            }
            if (report.campaigns && report.campaigns.length > 0) {
                store.dispatch({ type: ActionType.getSelectedCampaigns, payLoad: report.campaigns });
            }
        }
        catch (err) {
            console.log(err.message);
        }
    }

    public componentWillUnmount(): void {
        this.unsubscribeStore();
    }

    public render() {
        return (
            <div className="report">
                {!this.state.isAfterAuth && <AuthForWatchingOnly />}
                {this.state.isAfterAuth  &&
                    <div>
                        <main>
                            <div className="header">
                                <TopReportNav isScroll={this.state.isScroll} />
                            </div>
                            <Campaigns />
                        </main>

                        <aside>
                            <FilteringSideMenu isOnReport={true} />
                        </aside>
                        {this.state.display && <LinkPopUp />}
                    </div>
                }
            </div>
        )
    }
}