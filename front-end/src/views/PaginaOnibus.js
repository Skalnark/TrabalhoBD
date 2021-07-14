// react-bootstrap components
import { Button, Card, Form, Container, Row, Col } from "react-bootstrap";

import { withSnackbar } from "notistack";

import CommonService from "services/CommonService";
import UtilsFunctions from "Utils/UtilsFunctions";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useHistory } from "react-router";

function useQuery() {
	return new URLSearchParams(useLocation().search);
}

function PaginaOnibus() {
	const busService = new CommonService("/GetAllBus");
   let query = useQuery(); // Objeto com os parametros
   
   var history = useHistory();

	const [thatOneBus, setThatOneBus] = useState(undefined);

	useEffect(() => {
      console.log(query.get("idOnibus") + "oxe");
      
      if (query.get("idOnibus") == "" || query.get("idOnibus") == undefined || query.get("idOnibus") == null
      ) {
         history.push({
            pathname: "/onibus"
         })
      }

		busService
			.getAll()
			.then((res) => {
				setThatOneBus(res.data[query.get("idOnibus")]);
			})
			.catch((error) => {
				callSnackBar("Erro ao acessar API", "error");
				console.log(error);
			});
	}, []);

	return (
		<>
			{thatOneBus !== undefined ? (
				<Container fluid>
					<Row>
						<Col>
							<Card className="card-user">
								<div className="card-image">
									<img
										alt="..."
										src={
											require("assets/img/photo-1431578500526-4d9613015464.jpeg")
												.default
										}
									></img>
								</div>
								<Card.Body>
									<div className="author">
										<img
											alt="..."
											className="avatar border-gray"
											src={
												require("assets/img/faces/onibus.jpg")
													.default
											}
										></img>
										<h5 className="title">{thatOneBus.id_bus - 1}</h5>

										<p
											className="description text-center"
											style={{
												display: "flex",
												flexDirection: "column",
												alignItems: "center",
												width: "50%",
											}}
										>
											<div style={{ marginBottom: "4px" }}>
												<strong>Linha: </strong>
												{thatOneBus.line_code}
											</div>
											<div style={{ marginBottom: "4px" }}>
												<strong>Passageiros: </strong>
												{thatOneBus.passenger_count}
											</div>
											<div style={{ marginBottom: "4px" }}>
												<strong>Saída: </strong>
												{UtilsFunctions.formatTimeStampToHours(
													thatOneBus.departure_time
												)}
											</div>
										</p>
									</div>
								</Card.Body>
								<hr></hr>
								<div className="button-container mr-auto ml-auto">
									<Button
										className="btn-simple btn-icon"
										href="#pablo"
										onClick={(e) => e.preventDefault()}
										variant="link"
									>
										<i className="fab fa-facebook-square"></i>
									</Button>
									<Button
										className="btn-simple btn-icon"
										href="#pablo"
										onClick={(e) => e.preventDefault()}
										variant="link"
									>
										<i className="fab fa-twitter"></i>
									</Button>
									<Button
										className="btn-simple btn-icon"
										href="#pablo"
										onClick={(e) => e.preventDefault()}
										variant="link"
									>
										<i className="fab fa-google-plus-square"></i>
									</Button>
								</div>
							</Card>
						</Col>
						<Col md="7">
							<Card>
								<Card.Header>
									<Card.Title as="h4">Edit Profile</Card.Title>
								</Card.Header>
								<Card.Body>
									<Form>
										<Row>
											<Col className="pr-1" md="5">
												<Form.Group>
													<label>Company (disabled)</label>
													<Form.Control
														defaultValue="Creative Code Inc."
														disabled
														placeholder="Company"
														type="text"
													></Form.Control>
												</Form.Group>
											</Col>
											<Col className="px-1" md="3">
												<Form.Group>
													<label>Username</label>
													<Form.Control
														defaultValue="michael23"
														placeholder="Username"
														type="text"
													></Form.Control>
												</Form.Group>
											</Col>
											<Col className="pl-1" md="4">
												<Form.Group>
													<label htmlFor="exampleInputEmail1">
														Email address
													</label>
													<Form.Control
														placeholder="Email"
														type="email"
													></Form.Control>
												</Form.Group>
											</Col>
										</Row>
										<Row>
											<Col className="pr-1" md="6">
												<Form.Group>
													<label>First Name</label>
													<Form.Control
														defaultValue="Mike"
														placeholder="Company"
														type="text"
													></Form.Control>
												</Form.Group>
											</Col>
											<Col className="pl-1" md="6">
												<Form.Group>
													<label>Last Name</label>
													<Form.Control
														defaultValue="Andrew"
														placeholder="Last Name"
														type="text"
													></Form.Control>
												</Form.Group>
											</Col>
										</Row>
										<Row>
											<Col md="12">
												<Form.Group>
													<label>Address</label>
													<Form.Control
														defaultValue="Bld Mihail Kogalniceanu, nr. 8 Bl 1, Sc 1, Ap 09"
														placeholder="Home Address"
														type="text"
													></Form.Control>
												</Form.Group>
											</Col>
										</Row>
										<Row>
											<Col className="pr-1" md="4">
												<Form.Group>
													<label>City</label>
													<Form.Control
														defaultValue="Mike"
														placeholder="City"
														type="text"
													></Form.Control>
												</Form.Group>
											</Col>
											<Col className="px-1" md="4">
												<Form.Group>
													<label>Country</label>
													<Form.Control
														defaultValue="Andrew"
														placeholder="Country"
														type="text"
													></Form.Control>
												</Form.Group>
											</Col>
											<Col className="pl-1" md="4">
												<Form.Group>
													<label>Postal Code</label>
													<Form.Control
														placeholder="ZIP Code"
														type="number"
													></Form.Control>
												</Form.Group>
											</Col>
										</Row>
										<Row>
											<Col md="12">
												<Form.Group>
													<label>About Me</label>
													<Form.Control
														cols="80"
														defaultValue="Lamborghini Mercy, Your chick she so thirsty, I'm in
                          that two seat Lambo."
														placeholder="Here can be your description"
														rows="4"
														as="textarea"
													></Form.Control>
												</Form.Group>
											</Col>
										</Row>
										<Button
											className="btn-fill pull-right"
											type="submit"
											variant="info"
										>
											Update Profile
										</Button>
										<div className="clearfix"></div>
									</Form>
								</Card.Body>
							</Card>
						</Col>
					</Row>
				</Container>
			) : null}
		</>
	);
}

export default withSnackbar(PaginaOnibus);
