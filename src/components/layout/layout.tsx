import React, { Component } from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { Auth } from "../auth/auth";
import { Home } from "../home/home";
import { PageNotFound } from "../page-not-found/page-not-found";
import { ReportMaker } from "../report-maker/report-maker";
import { Report } from "../report/report";
import axios from "axios";
import "./layout.css";

interface LayoutState {
    isLegal: boolean
}


export class Layout extends Component<any, LayoutState>{

    public constructor(props: any) {
        super(props);
        this.state = {
            isLegal: false
        }
    }

    public async componentDidMount() {
        try {
            const json = await axios.get("https://api.ipify.org?format=json");
            const ip = json.data.ip;
            if (ip === '176.230.160.231' || ip === '31.168.98.222' || ip === '82.80.148.180' || ip === '82.81.38.254') {
                this.setState({ isLegal: true });
            }
        }
        catch (err) {
            console.log(err.message);
        }
    }

    public render() {
        return (
            <div className="layout">
                {this.state.isLegal &&
                    <BrowserRouter>

                        <Switch>
                            <Route path="/auth" component={Auth} exact />
                            <Route path="/report-maker" component={ReportMaker} exact />
                            <Route path="/home" component={Home} exact />
                            <Route path="/page-not-found" component={PageNotFound} exact />
                            <Route path="/:uuid" component={Report} />
                            <Redirect from="/" to="/home" />
                        </Switch>

                    </BrowserRouter>
                }
            </div>
        )
    }
}