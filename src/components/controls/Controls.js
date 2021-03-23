import React, { useContext, useState } from "react";
import { ProgramContext } from "../../contexts/ProgramContext";
import { IntentContext } from "../../contexts/IntentContext";
import { TimerContext } from "../../contexts/TimerContext";
import { Dropdown, ButtonGroup, DropdownButton, Modal, Button, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import VoiceInfo from "../VoiceInfo";

import ControlButton from "./ControlButton"

const Controls = () => {
    const program = useContext(ProgramContext);
    const intents = useContext(IntentContext);
    const timer = useContext(TimerContext);
    const [showInfo, setShowInfo] = useState(false);

    const handleClose = () => setShowInfo(false);
    const handleShow = () => setShowInfo(true);

    const toggleTimer = () => {
        if (timer.active) {
            timer.setSeconds(0);
            timer.setCounting(false);
            timer.setActive(false);
        } else {
            timer.setActive(true);
        }
        
    }

    return (
        <React.Fragment>
            <div className="btn-toolbar" role="toolbar">
                <div className="btn-group" role="group" aria-label="Basic example">
                    <ControlButton
                        variant={timer.active ? "primary" : "secondary"}
                        onClick={toggleTimer}
                        tooltip="Enable/disable rest timer"
                        icon="hourglass-half"
                    />
                    <ControlButton
                        variant={program.showStats ? "primary" : "secondary"}
                        onClick={() => program.setShowStats(!program.showStats)}
                        tooltip="Show/hide stats"
                        icon="chart-bar"
                    />
                    <DropdownButton
                        as={ButtonGroup}
                        variant="secondary"
                        drop="up"
                        title={<FontAwesomeIcon icon="user" />}
                    >
                        {program.users.map(user => {
                            return (
                                <Dropdown.Item
                                    key={user}
                                    as="button"
                                    active={user === program.user}
                                    onClick={() => program.setUser(user)}
                                >
                                    User {user}
                                </Dropdown.Item>
                            )
                        })}
                    </DropdownButton>
                    <ControlButton
                        variant="secondary"
                        onClick={handleShow}
                        tooltip="Voice control info"
                        icon="info"
                    />
                    <ControlButton
                        variant="secondary"
                        onClick={intents.updateWeights}
                        tooltip="Update maxes"
                        icon="sync-alt"
                    />
                    <ControlButton
                        variant="secondary"
                        onClick={intents.undoUpdate}
                        tooltip="Undo last maxes update"
                        icon="undo-alt"
                    />
                    <ControlButton
                        variant="secondary"
                        onClick={intents.nextSet}
                        tooltip="Advance to the next set"
                        icon="forward"
                    />
                </div>
                <div className="input-group d-flex align-items-center ml-3">
                    <Form.Label className="m-0">User {program.user}</Form.Label>
                </div>
            </div>
            <Modal show={showInfo} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Voice Control</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <VoiceInfo />
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="primary" onClick={handleClose}>Got it</Button>
                </Modal.Footer>
            </Modal>
        </React.Fragment>
    )
};

export default Controls;