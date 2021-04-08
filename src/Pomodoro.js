import { Component } from 'react';
import './Pomodoro.css';

const defaultState = {
    breakLength: 5,
    sessionLength: 25,
    stateDisplay: "Session",
    timeLeft: 1500,
};

export class Pomodoro extends Component {
    constructor(props) {
        super(props);
        this.state = Object.assign({}, defaultState);
        this.handleLengthClick = this.handleLengthClick.bind(this);
        this.handleLengthChange = this.handleLengthChange.bind(this);
        this.handleReset = this.handleReset.bind(this);
        this.changeSettings = this.changeSettings.bind(this);
    }

    handleLengthClick(field, operator) {
        if (operator === "increment") {
            this.changeSettings(field, this.state[field] + 1);
        } else {
            this.changeSettings(field, this.state[field] - 1);
        }
    }

    changeSettings(field, value) {
        if (this.timer) {
            // ha fut az óra, nem módosítható semmi
            return;
        }
        this.setState((state) => {
            const newState = Object.assign({}, state);
            if (value > 60 || value <= 0) {
                return state;
            }
            newState[field] = value;
            if (state.stateDisplay === "Session") {
                newState["timeLeft"] = newState["sessionLength"] * 60;
            } else {
                newState["timeLeft"] = newState["breakLength"] * 60;
            }
            return newState;
        });
    }

    handleLengthChange(event, field) {
        const value = Number(event.target.value) ;
        if (!isNaN(value)) {
            this.changeSettings(field, value);
        }
    }

    handleReset() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }

        document.getElementById("beep").pause();
        document.getElementById("beep").currentTime = 0;
        this.setState(defaultState);
    }

    handleStartStop() {
        if (this.timer) {
            // ha épp fut, törlés
            clearInterval(this.timer);
            this.timer = null;
            return;
        } 
        this.timer = setInterval(() => {
            this.setState((state) => {
                if (state.timeLeft !== 0) {
                    // normál tick
                    return { timeLeft: state.timeLeft - 1 };
                } else {
                    // 0-n áll a számláló, mód váltása
                    document.getElementById("beep").play();
                    return {
                        stateDisplay: state.stateDisplay === "Session" ? "Break" : "Session",
                        timeLeft: state.stateDisplay === "Session" ? state.breakLength * 60 : state.sessionLength * 60
                    };
                }
            });
        }, 1000);
    }

    render() {
        const timeRemaining = Math.floor(this.state.timeLeft / 60).toLocaleString("en", {minimumIntegerDigits:2,minimumFractionDigits:0,useGrouping:false}) + ":" + Math.floor(this.state.timeLeft % 60).toLocaleString('en', {minimumIntegerDigits:2,minimumFractionDigits:0,useGrouping:false});

        return (
            <div id="pomodoro" className="container">
                <h1 className="text-center">Pomodoro Timer</h1>
                <div className="row my-4">
                    <div className="col-sm text-center">
                        <h4 id="break-label">Break Length</h4>
                        <div className="input-group">
                            <div className="input-group-prepend">
                                <button className="btn btn-primary" id="break-decrement" onClick={() => this.handleLengthClick("breakLength", "decrement")}>-</button>
                            </div>
                            <input id="break-length" className="form-control text-center" maxLength="3" value={this.state.breakLength} onChange={(event) => this.handleLengthChange(event, "breakLength")}></input>
                            <div className="input-group-append">
                                <button className="btn btn-primary" id="break-increment" onClick={() => this.handleLengthClick("breakLength", "increment")}>+</button>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm text-center">
                        <h4 id="session-label">Session Length</h4>
                        <div className="input-group">
                            <div className="input-group-prepend">
                                <button className="btn btn-primary" id="session-decrement" onClick={() => this.handleLengthClick("sessionLength", "decrement")}>-</button>
                            </div>
                            <input id="session-length" className="form-control text-center" maxLength="3" value={this.state.sessionLength} onChange={(event) => this.handleLengthChange(event, "sessionLength")}></input>
                            <div className="input-group-append">
                                <button className="btn btn-primary" id="session-increment" onClick={() => this.handleLengthClick("sessionLength", "increment")}>+</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row my-4">
                    <div className="col">
                        <div className="card">
                            <div className="card-body">
                                <h2 id="timer-label" className="card-title text-center">{this.state.stateDisplay}</h2>
                                <div id="time-left" className="card-text text-center">{timeRemaining}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col"><button className="btn btn-danger btn-block" id="reset" onClick={() => this.handleReset()}>Reset</button></div>
                    <div className="col"><button className="btn btn-primary btn-block" id="start_stop" onClick={() => this.handleStartStop()}>Start / Stop</button></div>
                    <audio id="beep" src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"></audio>
                </div>
            </div>
        );
    }
}