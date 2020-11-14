import React, { Component } from 'react';


class Scorecard extends Component {
    state = {
        label:"Registrations",
        value:10403
    }
    render() { 
        return (
            <React.Fragment>
                <div className="Scorecard">
                    <span> {this.props.label}</span>
                    <button>{this.props.value}</button>
                </div>
            </React.Fragment>
        )
    }
}
 
export default Scorecard;