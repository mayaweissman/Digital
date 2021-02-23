import React, { ChangeEvent, Component } from "react";
import { ActionType } from "../../redux/actionType";
import { store } from "../../redux/store";
import "./link-pop-up.css";
import CloseIcon from '@material-ui/icons/Close';
import { Config } from "../../config";
import { config } from "process";
import { ReportModel } from "../../models/reportModel";
import axios from "axios";
import { Unsubscribe } from "redux";
import { ClientModel } from "../../models/clientModel";
import { UserModel } from "../../models/userModel";

interface LinkPopUpState {
    url: string,
    isReportCreated: boolean,
    uuid: string,
    user: UserModel,
    report: ReportModel,
    datesRanges: string
}

export class LinkPopUp extends Component<any, LinkPopUpState>{

    public urlInput = React.createRef<HTMLDivElement>();
    private unsubscribeStore: Unsubscribe;
    public linkRef = React.createRef<HTMLInputElement>();


    public constructor(props: any) {
        super(props);
        this.state = {
            url: "",
            isReportCreated: false,
            uuid: "",
            user: store.getState().user,
            report: new ReportModel(),
            datesRanges: store.getState().datesRange
        }

        this.unsubscribeStore = store.subscribe(() => {
            const user = store.getState().user;
            this.setState({ user });
            const datesRanges = store.getState().datesRange;
            this.setState({datesRanges});
        })
    }

    public componentDidMount() {
        let url = Config.serverUrl;
        this.setState({ url });
    }

    public componentWillUnmount(): void {
        this.unsubscribeStore();
    }


    public closePopUp = () => {
        store.dispatch({ type: ActionType.changeDisplayForLinkPopUp });
    }

    public stopPropagation = (e: any) => {
        e.stopPropagation();
    }

    public copyToClipboard = () => {
        console.log(this.state.report);

        this.linkRef.current?.select();
        document.execCommand("copy");
    };

    public setReportName = (args: ChangeEvent<HTMLInputElement>) => {
        const reportName = args.target.value;
        const report = { ...this.state.report };
        report.reportName = reportName;;
        this.setState({ report });
    }


    public createReport = async () => {
        try {
            store.dispatch({ type: ActionType.saveReport });
            //Made new report
            const report = { ...this.state.report };
            const uuid = this.uuid();
            const url = this.state.url + "/" + uuid;
            this.setState({ url });
            this.setState({ uuid });
            report.uuid = uuid;
            report.creatorId = this.state.user.userId;
            report.creationDate = new Date().toLocaleDateString();
            report.datesOnReport= store.getState().datesRange;

            const allClients: ClientModel[] = store.getState().selectedClients;
            //Push new report all selections
            report.clients = allClients;
            report.campaigns = store.getState().campaignsToDisplay;
            report.products = store.getState().productsToDisplay;

            if (report.campaigns && report.campaigns?.length > 0) {
                report.clients = [];
                const filteredClients: ClientModel[] = [];
                report.campaigns?.map(campaign => {
                    allClients.filter(client => client.clientId === campaign.clientId)
                        .forEach(c => filteredClients.push(c));
                });
                report.clients = filteredClients;
            }

            const id: string = (this.state.user.userId?.toString() as string);

            let formData = new FormData();
            formData.append("state", JSON.stringify(report));
            formData.append("userId", id);
            formData.append("uuid", uuid);
            await axios.post("http://factory-dev.landing-page-media.co.il/create-report/", formData);

            this.setState({ isReportCreated: true });
            this.setState({report});
        }
        catch (err) {
            console.log(err.message);
        }

    }

    public uuid = () => {
        const hashTable = [
            'a', 'b', 'c', 'd', 'e', 'f',
            '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
        ]
        let uuid = []
        for (let i = 0; i < 35; i++) {
            if (i === 7 || i === 12 || i === 17 || i === 22) {
                uuid[i] = '-'
            } else {
                uuid[i] = hashTable[Math.floor(Math.random() * hashTable.length - 1)]
            }
        }
        return uuid.join('');
    }

    public render() {
        return (
            <div className="full-screen-link-conatiner" onClick={this.closePopUp} >

                <div className="small-link-conatiner" onClick={this.stopPropagation}>
                    <button className="close-link-pop-up-btn" onClick={this.closePopUp} ><CloseIcon /></button>

                    <div className={this.state.isReportCreated ? "inner-content-first out" : "inner-content-first"}>
                        <h2 className="link-title">בחירת שם לדו"ח</h2>
                        <input onChange={this.setReportName} className="report-name-box" />

                        <button disabled={!this.state.report.reportName} onClick={this.createReport}
                            className="copy-link-btn">יצירת דו"ח תוצרים</button>
                    </div>


                    <div className={this.state.isReportCreated ? "inner-content-second in" : "inner-content-second"}>

                        <h2 className="link-title">{this.state.report.reportName} :והנה הלינק לשיתוף</h2>
                        <input ref={this.linkRef} className="url-box" value={this.state.url} />

                        <button onClick={this.copyToClipboard} className="copy-link-btn">העתקת קישור</button>
                        <button className="send-on-email-btn">
                            <a href={`mailto:?subject=תוצרי פקטורי - ${this.state.report.reportName} ${this.state.report.datesOnReport}
                            &body=מומלץ לצרוך את התוכן הבא בישיבה.%0D%0Aאם הנכם חשים תופעות מסוג: חיוך בלתי נשלט, פששש, וואו, איזה מדהים, כמה כישרון, הלם, איזה פקטורי זה, סימן שהחודש הצלחנו!%0D%0A%0D%0Aצפייה מהנה%0D%0A${this.state.url}`}>
                                שליחה במייל
                            </a>
                        </button>
                    </div>

                </div>
            </div>
        )
    }
}