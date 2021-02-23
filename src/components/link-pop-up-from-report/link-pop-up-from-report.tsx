import React, { ChangeEvent, Component } from "react";
import { ActionType } from "../../redux/actionType";
import { store } from "../../redux/store";
import "./link-pop-up-from-report.css";
import CloseIcon from '@material-ui/icons/Close';
import { Config } from "../../config";
import { config } from "process";
import { ReportModel } from "../../models/reportModel";
import axios from "axios";
import { Unsubscribe } from "redux";
import { ClientModel } from "../../models/clientModel";
import { UserModel } from "../../models/userModel";

interface LinkPopUpFromReportState {
    url: string,
    user: UserModel,
    report: ReportModel
}


export class LinkPopUpFromReport extends Component<any, LinkPopUpFromReportState>{

    public urlInput = React.createRef<HTMLDivElement>();
    private unsubscribeStore: Unsubscribe;
    public linkRef = React.createRef<HTMLInputElement>();


    public constructor(props: any) {
        super(props);
        this.state = {
            url: "",
            user: store.getState().user,
            report: store.getState().reportToCopy
        }

        this.unsubscribeStore = store.subscribe(() => {
            const user = store.getState().user;
            this.setState({ user });
            const report = store.getState().reportToCopy;
            this.setState({ report });
        })
    }

    public componentDidMount() {
        let url = Config.serverUrl + "/" + this.state.report.uuid;
        this.setState({ url });
    }

    public componentWillUnmount(): void {
        this.unsubscribeStore();
    }


    public closePopUp = () => {
        store.dispatch({ type: ActionType.changeDisplayForReportsLinkPopUp });
    }

    public stopPropagation = (e: any) => {
        e.stopPropagation();
    }

    public copyToClipboard = () => {

        this.linkRef.current?.select();
        document.execCommand("copy");
    };


    public render() {
        return (
            <div className="full-screen-link-conatiner" onClick={this.closePopUp} >

                <div className="small-link-conatiner" onClick={this.stopPropagation}>
                    <button className="close-link-pop-up-btn" onClick={this.closePopUp} ><CloseIcon /></button>


                    <div className="inner-content in">

                        <h2 className="link-title">והנה הלינק לשיתוף לדו"ח {this.state.report.reportName} </h2>
                        <input ref={this.linkRef} className="url-box" value={this.state.url} />

                        <button onClick={this.copyToClipboard} className="copy-link-btn">העתקת קישור</button>
                        <button className="send-on-email-btn">
                            <a href={`mailto:?subject=${this.state.report.reportName}-${this.state.report.datesOnReport}
                            &body=${this.state.url}`}>
                                שליחה במייל
                            </a>
                        </button>
                    </div>

                </div>
            </div>
        )
    }
}