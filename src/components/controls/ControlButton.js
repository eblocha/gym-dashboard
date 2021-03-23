import React from "react";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


const ControlButton = props => {
    return (
        <OverlayTrigger
            placement="top"
            overlay={
                <Tooltip>
                    {props.tooltip}
            </Tooltip>
            }
        >
            <Button
                variant={props.variant}
                onClick={props.onClick}
            >
                <FontAwesomeIcon icon={props.icon} />
            </Button>
        </OverlayTrigger>
    );
};

export default ControlButton;