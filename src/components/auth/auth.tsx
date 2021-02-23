import React, { ChangeEvent, Component } from "react";
import { Unsubscribe } from "redux";
import { UserModel } from "../../models/userModel";
import { ActionType } from "../../redux/actionType";
import { store } from "../../redux/store";
import "./auth.css";
import axios from "axios";
import { rejects } from "assert";
import TextField from '@material-ui/core/TextField';
import InputCode from "./InputCode";

interface AuthState {
  phoneNumber: string,
  code: string,
  message: string,
  isPhoneLegal: boolean,
  isCodeLegal: boolean,
  isDisplayForBtn: boolean,
  allUsers: UserModel[],
  isSmsSent: boolean,
  title: string,
  user: UserModel
}

export class Auth extends Component<any, AuthState> {

  private firstInput = React.createRef<HTMLInputElement>();
  private secondInput = React.createRef<HTMLInputElement>();
  private thirdInput = React.createRef<HTMLInputElement>();
  private fourthInput = React.createRef<HTMLInputElement>();


  public constructor(props: any) {
    super(props);
    this.state = {
      phoneNumber: "",
      code: "",
      message: "",
      title: "יש להזין מספר טלפון על מנת להתחבר",
      isPhoneLegal: false,
      isCodeLegal: false,
      isDisplayForBtn: false,
      allUsers: [],
      isSmsSent: false,
      user: new UserModel()
    }
  }

  public async componentDidMount() {
    try {
      const response = await axios.get("http://factory-dev.landing-page-media.co.il/all-users/");
      const allUsers: UserModel[] = response.data.users;
      this.setState({ allUsers });

    }
    catch (err) {
      console.log(err.message);
    }
  }

  public linsenToKeyPress = (e: any) => {
    e.keyCode === 13 &&
      this.authPhoneNumber();
  }


  public setPhoneNumber = (args: ChangeEvent<HTMLInputElement>) => {
    const phoneNumber = args.target.value;
    const fixedPhone = phoneNumber.replace(/[a-zA-Z$&@#*^%()!]/g, "");
    this.setState({ phoneNumber: fixedPhone });
    this.setState({ message: "" })

  }


  //Demo functions
  public authPhoneNumber = () => {
    const phoneNumber = this.state.phoneNumber;
    const allUsers = [...this.state.allUsers];
    const user = allUsers.find(u => u.phoneNumber?.toString() === phoneNumber);

    let message = "";
    let isPhoneLegal = false;

    if (user) {
      this.setState({ user });
      if (user.permission === "יצירת דוחות") {
        message = "";
        isPhoneLegal = true;
        this.setState({ title: "יש להזין את הקוד שקיבלת" })
        new Promise((resolve, reject) => {
          resolve(() => console.log(""))
        }

        )
          .then(() =>
            fetch(
              `https://landing-page-media.co.il/projects/phone-auth/?phone=${phoneNumber}`
            )
          )
          .then((data) => {
            this.setState({ isSmsSent: true });
          }
          )
          .catch((e) => {
            console.log(e)
          });
      }
      else {
        message = "מספר הטלפון שהוזן אינו מספר מורשה";
      }
    }
    else {
      message = "מספר הטלפון שהוזן אינו מספר מורשה";
    }
    this.setState({ message })
    this.setState({ isPhoneLegal })
  }

  public authCode = () => {
    const code = this.state.code;
    const phoneNumber = this.state.phoneNumber;
    let message = "";
    let isCodeLegal = false;

    if (this.state.isSmsSent) {
      new Promise((resolve, reject) => {
        resolve(console.log(""));
      })
        .then(() =>
          fetch(
            `https://landing-page-media.co.il/projects/phone-auth/code_validation.php?code=${code}&phone=${phoneNumber}`
          )
        )
        .then((response) => response.json())
        .then((data) => {

          if (data.auth) {
            message = "ברוכים הבאים";
            isCodeLegal = true;
            store.dispatch({ type: ActionType.loginEditingMode, payLoad: this.state.user });
            this.props.history.push('/home');
          } else {
            message = "קוד אינו חוקי";
          }
          this.setState({ message })
          this.setState({ isCodeLegal })
        })
    }
  }




  public render() {
    return (
      <div className="auth">

        <div className="auth-box">

          <img className="auth-logo" src="/assets/images/logo_factory.svg" />

          <div className="auth-titles">
            <h1>מערכת תוצר</h1>
          </div>

          {!this.state.isPhoneLegal &&
            <button onClick={this.authPhoneNumber} className="send-btn"><img src="./assets/images/pink_btn_after.svg" /></button>
          }
          <div className="phone-field">
            <TextField id="standard-basic"
              label="יש להזין מספר טלפון על מנת להתחבר"
              color="primary"
              onChange={this.setPhoneNumber}
              onKeyDown={this.linsenToKeyPress}
              className={this.state.isPhoneLegal ? "out" : ""}
              value={this.state.phoneNumber}
              style={{ borderBottom: this.state.message === "" ? "2px solid black" : "2px solid red" }} />
            <span className="err-message">{this.state.message}</span>
            <br />
          </div>


          {this.state.isPhoneLegal &&
            <div className="code-area">
              <InputCode
                length={4}
                label="יש להזין את הקוד שקיבלת"
                loading={() => { }}
                onComplete={(code: any) => {
                  this.setState({ code });
                  setTimeout(() => {
                    this.authCode();
                  }, 1000);
                }} />
            </div>
          }





        </div>


      </div>

    )
  }
}