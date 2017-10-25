import React from "react";

import CreateEachCards from "./CreateEachCards";


export default class UserLists extends React.Component {

    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="AllCards">
                {this.props.lists.map((eachUser) => {
                    return (
                        <CreateEachCards
                            id={eachUser.id}
                            fname={eachUser.first_name}
                            lname={eachUser.last_name}
                            email={eachUser.email}
                            gender={eachUser.gender}
                            ip={eachUser.ip_address}
                        />
                    );
                })}
            </div>
        );
    }
}