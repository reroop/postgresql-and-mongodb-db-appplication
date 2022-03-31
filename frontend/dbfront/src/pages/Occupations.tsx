import React from "react";
import OccupationStore, {Occupation} from "../stores/OccupationStore";
import {inject, observer} from "mobx-react";
import {Button, Card, Col, Dropdown, Form, FormControl, InputGroup, Modal, Row, Table} from "react-bootstrap";
import {OccupationsAndEmployeesReport} from "../components";

interface OccupationsProps {
    occupationStore?: OccupationStore;
}

interface State {
    newOccupationCode?: number
    newOccupationName: string,
    newOccupationDescription?: string,
    showStatsModal: boolean
}

@inject('occupationStore')
@observer
class Occupations extends React.Component<OccupationsProps, State> {

    constructor(props) {
        super(props);
        this.state = {
            //newOccupationCode: null,
            newOccupationName: '',
            //newOccupationDescription: null,
            showStatsModal: false

        };
    }

    public componentDidMount() {
        this.props.occupationStore?.getOccupations();
    }

    private handleShowStatsModalButtonClick() {
        this.setState({showStatsModal: true});
    }

    private handleCloseStatsModalButtonClick() {
        this.setState({showStatsModal: false})
    };

    public render() {
        const occupationStore = this.props.occupationStore!!;
        const occupations: Occupation[] = occupationStore.occupations;

        const handleEditOccupationButtonClick = (occupation: Occupation) => {
            if (occupation.description === '') {
                occupation.description = undefined;
            }
            occupationStore.updateOccupation(occupation).then(occupationStore.getOccupations);
        };

        const handleDeleteOccupationButtonClick = (occupationCode: number) => {
            occupationStore.deleteOccupation(occupationCode).then(occupationStore.getOccupations);
        };

        const handleAddOccupationClick = () => {
            if (this.state.newOccupationCode === null) {
                return;
            }
            const newOccupation: Occupation = {
                occupation_code: this.state.newOccupationCode!!,
                name: this.state.newOccupationName
            };
            if (this.state.newOccupationDescription !== null) {
                newOccupation.description = this.state.newOccupationDescription;
            }
            occupationStore.addOccupation(newOccupation).then(r => this.setState({
                newOccupationCode: undefined,
                newOccupationName: '',
                newOccupationDescription: undefined
            }));

        }

        return (
            <div>
                <h1 className="font-weight-heavy">Occupations page</h1>

                <Row>
                    <Col>
                        <Card className={'m-3'} style={{width: '36rem'}}>
                            <Card.Title>Add new occupation:</Card.Title>
                            <Card.Body>
                                <Form>
                                    <Form.Group className="mb-3" controlId="addOccupationCode">
                                        <Form.Label>Occupation code:</Form.Label>
                                        <Form.Control
                                            placeholder="Enter occupation code (number)"
                                            type="number"
                                            value={this.state.newOccupationCode == undefined ? '' : this.state.newOccupationCode}
                                            onChange={(e) => this.setState({newOccupationCode: Number(e.target.value)})}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="addOccupationName">
                                        <Form.Label>Occupation name:</Form.Label>
                                        <Form.Control
                                            placeholder="Enter occupation name"
                                            value={this.state.newOccupationName}
                                            onChange={(e) => this.setState({newOccupationName: e.target.value})}/>
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="addOccupationDescription">
                                        <Form.Label>Occupation description:</Form.Label>
                                        <Form.Control
                                            as="textarea" rows={3}
                                            value={this.state.newOccupationDescription}
                                            placeholder="Enter occupation description (optional)"
                                            onChange={(e) => this.setState({newOccupationDescription: e.target.value})}/>
                                    </Form.Group>
                                    <Button variant="success" onClick={() => handleAddOccupationClick()}>Add new
                                        occupation</Button>
                                </Form>

                            </Card.Body>
                        </Card>
                    </Col>

                    <Col><Button variant="info" onClick={() => this.handleShowStatsModalButtonClick()}>Show
                        statistics</Button></Col>
                    <Modal show={this.state.showStatsModal}>
                        <Modal.Header>
                            <Modal.Title>Statistics</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <OccupationsAndEmployeesReport/>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => this.handleCloseStatsModalButtonClick()}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </Row>


                <div className={'m-3'}>
                    <h3 className="font-weight-heavy">All occupations:</h3>
                    <Table striped bordered hover responsive={true} title={"Occupations:"}>
                        <thead>
                        <tr>
                            <th>Occupation code</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Edit occupation</th>
                            <th>Delete occupation</th>
                        </tr>
                        </thead>
                        <tbody>
                        {occupations.map((occupation) => (
                            <tr key={occupation.occupation_code}>
                                <td>
                                    {occupation.occupation_code}
                                </td>
                                <td>
                                    <InputGroup className={"mb-3"}>
                                        <FormControl
                                            placeholder={"Occupation name"}
                                            value={occupation.name}
                                            onChange={(e) => occupation.name = e.target.value}/>
                                    </InputGroup>
                                </td>
                                <td>
                                    <InputGroup className={"mb-3"}>
                                        <FormControl
                                            as="textarea" rows={3}
                                            placeholder={"Occupation description (optional)"}
                                            value={occupation.description}
                                            onChange={(e) => occupation.description = e.target.value}/>
                                    </InputGroup>
                                </td>
                                <td><Button variant="info"
                                            onClick={() => handleEditOccupationButtonClick(occupation)}>Update</Button>
                                </td>
                                <td><Button variant="danger"
                                            onClick={() => handleDeleteOccupationButtonClick(occupation.occupation_code)}>Delete</Button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </div>
            </div>
        );
    }
}


export default Occupations;