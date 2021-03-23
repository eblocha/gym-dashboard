import React from "react";

const Day = (props) => {
    return (
        <div className={`card ${props.today?"border-primary":""}`} style={{ height: "100%" }}>
            <div className={`card-header ${props.today?"border-primary":""}`}>
                <h4 className="text-center">{props.name}</h4>
            </div>
            <div className="card-body" style={{overflowY:"auto"}}>
                {props.children}
            </div>
        </div>
    )
}

export default Day