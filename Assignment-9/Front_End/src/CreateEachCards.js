import React from "react";

export default class CreateJobCards extends React.Component {

    constructor(props) {
        super(props);

    }

    render() {
        return (
            <div className="card">
                <span > {this.props.id} </span>
                <span > {this.props.fname} </span>
                <span > {this.props.lname} </span>
                <span > {this.props.email} </span>
                <span > {this.props.gender} </span>
                <span > {this.props.ip} </span>
            </div>
        );
    }
}