import React, { Component } from "react";
import { ActionType } from "../../redux/actionType";
import { store } from "../../redux/store";
import "./reports-history-pop-up.css";
import CloseIcon from '@material-ui/icons/Close';
import { ReportModel } from "../../models/reportModel";
import axios from "axios";
import IconButton from '@material-ui/core/IconButton';
import VisibilityIcon from '@material-ui/icons/Visibility';
import LinkIcon from '@material-ui/icons/Link';
import { Config } from "../../config";
import { CampaignModel } from "../../models/campaignModel";
import { ProductModel } from "../../models/productModel";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import { DateModel } from "../../models/dateModel";

interface ReportsHistoryPopUpState {
    reports: ReportModel[],
    reportsToDisplay: ReportModel[],
    allStartDates: DateModel[],
    sorting: {
        alphabetically: string,
        dates: string
    }
}



export class ReportsHistoryPopUp extends Component<any, ReportsHistoryPopUpState>{

    public constructor(props: any) {
        super(props);
        this.state = {
            reports: [],
            reportsToDisplay: [],
            allStartDates: [],
            sorting: {
                alphabetically: "down",
                dates: "down"
            }
        }
    }

    public async componentDidMount() {
        try {
            const user = store.getState().user;
            const response = await axios.get("http://factory-dev.landing-page-media.co.il/reports-by-user/?userId=" + user.userId);
            const reportsStr = response.data;
            if (typeof (reportsStr) === 'object') {
                const reports: ReportModel[] = [];
                reports.push(reportsStr);
                this.setState({ reports });
            }
            else {
                const fixedJson = "[" + reportsStr.replace(/}{/g, "},{") + "]";
                const reports: ReportModel[] = JSON.parse(fixedJson);
                this.setState({ reports });
                this.setState({ reportsToDisplay: reports });
            }
            setTimeout(() => {
                const allReports = [...this.state.reports];
                const allStartDates: DateModel[] = [];
                for (const r of allReports) {
                    const obj = new DateModel();
                    obj.uuid = r.uuid;
                    obj.date = r.datesOnReport?.split(" - ")[1] as string;
                    allStartDates.push(obj);
                }
                this.setState({ allStartDates });

            }, 1000);
        }
        catch (err) {
            console.log(err.message);
        }
    }

    public openLinkPopUp = (report: ReportModel) => (event: any) => {
        store.dispatch({ type: ActionType.changeDisplayForReportsPopUp });
        store.dispatch({ type: ActionType.changeDisplayForReportsLinkPopUp });
        store.dispatch({ type: ActionType.getReportToCopy, payLoad: report });
    }

    public watchReport = (report: ReportModel) => async (event: any) => {
        store.dispatch({ type: ActionType.updateSelectedClients, payLoad: report.clients });
        store.dispatch({ type: ActionType.getSelectedCampaigns, payLoad: report.campaigns });
        store.dispatch({ type: ActionType.getSelectedProducts, payLoad: report.products });
        store.dispatch({ type: ActionType.getDatesRanges, payLoad: report.datesOnReport });

        const response = await axios.get("http://factory-dev.landing-page-media.co.il/all-campaigns/");
        const allCampaigns: CampaignModel[] = response.data.campaigns;

        if (report.campaigns?.length === 0) {
            const selectedCampaigns: CampaignModel[] = [];
            report.clients?.map(client => {
                allCampaigns.map(campaign => {
                    if (campaign.clientId === client.clientId) {
                        selectedCampaigns.push(campaign);
                    }
                })
            })
            store.dispatch({ type: ActionType.getSelectedCampaigns, payLoad: selectedCampaigns });
        }


        if (report.products?.length === 0) {
            const responseForProducts = await axios.get("http://factory-dev.landing-page-media.co.il/all-products");
            const allProductsFromDb: ProductModel[] = responseForProducts.data.products;
            const selectedCampaigns: CampaignModel[] = store.getState().selectedCampaigns;

            const selectedProducts: ProductModel[] = [];
            selectedCampaigns.map(campaign => {
                allProductsFromDb.map(product => {
                    if (product.campaignId === campaign.campaignId) {
                        selectedProducts.push(product);

                    }
                })
            });

            store.dispatch({ type: ActionType.getSelectedProducts, payLoad: selectedProducts });
        }
        store.dispatch({ type: ActionType.changeDisplayForReportsPopUp });
    }

    public sortAlphabetically = () => {
        if (this.state.sorting.alphabetically === "down") {
            const reportsByAlphabetically = this.state.reports.map(r => r.reportName).sort();
            let reportsToDisplay: ReportModel[] = [];
            for (let i = 0; i <= reportsByAlphabetically.length; i++) {
                for (const report of this.state.reports) {
                    if (report.reportName === reportsByAlphabetically[i]) {
                        reportsToDisplay.push(report);
                    }
                }
            }
            this.setState({ reportsToDisplay });
            const sorting = { ...this.state.sorting };
            sorting.alphabetically = "up";
            this.setState({ sorting });
            return;
        }
        const reportsByAlphabetically = this.state.reports.map(r => r.reportName).sort();
        let reportsToDisplay: ReportModel[] = [];
        for (let i = reportsByAlphabetically.length; i >= 0; i--) {
            for (const report of this.state.reports) {
                if (report.reportName === reportsByAlphabetically[i]) {
                    reportsToDisplay.push(report);
                }
            }
        }
        this.setState({ reportsToDisplay });
        const sorting = { ...this.state.sorting };
        sorting.alphabetically = "down";
        this.setState({ sorting });
        return;

    }

    public filterByDates = () => {
        const allDates = [...this.state.allStartDates];
        const allReports = [...this.state.reports];
        for (const date of allDates) {
            for (const r of allReports) {
                if (date.date && r.uuid === date.uuid) {
                    const dateArr = date.date.split("/");
                    const fixedDate = `${dateArr[1]}/${dateArr[0]}/${dateArr[2]}`
                    r.timePassed = Date.parse(fixedDate as string);
                }
            }
        }
        const sorting = { ...this.state.sorting };
        if (sorting.dates === "down") {
            allReports.sort((a, b) => ((a.timePassed as number) > (b.timePassed as number)) ? 1 : -1);
            this.setState({ reportsToDisplay: allReports });
            sorting.dates = "up";
            this.setState({ sorting });
        }
        else {
            allReports.sort((a, b) => ((a.timePassed as number) > (b.timePassed as number)) ? -1 : 1);
            this.setState({ reportsToDisplay: allReports });
            sorting.dates = "down";
            this.setState({ sorting });
        }


    }

    public render() {
        return (
            <div className="full-screen-link-conatiner">
                <div className="small-reports-conatiner">
                    <button className="close-reports-pop-up-btn"
                        onClick={() => store.dispatch({ type: ActionType.changeDisplayForReportsPopUp })} >
                        <CloseIcon />
                    </button>
                    <h2>היסטוריית הדוחות שלי</h2>
                    <table>
                        <thead>
                            <tr>
                                <th className="name-th" onClick={this.sortAlphabetically}>
                                    שם הדו"ח
                                    {this.state.sorting.alphabetically === "down" && <ExpandMoreIcon />}
                                    {this.state.sorting.alphabetically === "up" && <ExpandLessIcon />}
                                </th>
                                <th className="dates-th" onClick={this.filterByDates}>
                                    תאריכים
                                    {this.state.sorting.dates === "down" && <ExpandMoreIcon />}
                                    {this.state.sorting.dates === "up" && <ExpandLessIcon />}
                                </th>
                                <th className="watch-th">צפייה</th>
                                <th className="link-th"> קישור</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.reportsToDisplay.length !== 0 && this.state.reportsToDisplay.map(r =>
                                <tr className="white">
                                    <td>{r.reportName}</td>
                                    <td>{r.datesOnReport}</td>
                                    <td>
                                        <IconButton onClick={this.watchReport(r)}>
                                            <VisibilityIcon style={{ fontSize: 25 }} />
                                        </IconButton>
                                    </td>
                                    <td>
                                        <IconButton onClick={this.openLinkPopUp(r as ReportModel)}>
                                            <LinkIcon style={{ fontSize: 25 }} />
                                        </IconButton>
                                    </td>

                                </tr>
                            )}
                        </tbody>
                    </table>


                </div>
            </div>
        )
    }
}