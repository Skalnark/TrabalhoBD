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

function PaginaOnibus(props) {
	const busService = new CommonService("/GetAllBus");
	const getCommentsService = new CommonService("/GetComments");
	let query = useQuery(); // Objeto com os parametros

	var history = useHistory();

	const [thatOneBus, setThatOneBus] = useState(undefined);
	const [thoseComments, setThoseComments] = useState(undefined);

	useEffect(() => {
		if (
			query.get("idOnibus") == "" ||
			query.get("idOnibus") == undefined ||
			query.get("idOnibus") == null
		) {
			history.push({
				pathname: "/onibus",
			});
		}

		var idOnibus = query.get("idOnibus");

		busService
			.getAll()
			.then((res) => {
				setThatOneBus(res.data[idOnibus]);
			})
			.catch((error) => {
				callSnackBar("Erro ao acessar API", "error");
				console.log(error);
			});

		getCommentsService.getWithParams("bus=" + idOnibus).then((commentRes) => {
			console.log(commentRes.data);
			setThoseComments(commentRes.data);
		});
	}, []);

	function callSnackBar(message, variant = "Default") {
		props.enqueueSnackbar(message, {
			variant: variant,
			anchorOrigin: {
				vertical: "bottom",
				horizontal: "right",
			},
		});
	}

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
							<Row>
								<Col md="12">
									<Card>
										<Card.Body>
											<Form>
												<Row>
													<Col md="12">
														<Form.Group>
															<label>Comentário</label>
															<Form.Control
																cols="80"
																placeholder="Digite o seu comentário"
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
													Comentar
												</Button>
												<div className="clearfix"></div>
											</Form>
										</Card.Body>
									</Card>
								</Col>
								<Col md="12">
									<h4>Comentários</h4>
								</Col>
								{thoseComments !== undefined ? thoseComments.map(comment => {
									return (
										<Col md="12">
									<Card>
										<Card.Body>
											<Row>
												<Col md="12">
													<strong>Nathan Rodrigo</strong><p>disse:</p>
													<p>
														{comment.content}
													</p>
												</Col>
											</Row>
											<div className="clearfix"></div>
										</Card.Body>
										<Card.Footer>
											<Row>
												<Col md="12"><label style={{fontSize: 14}}>22/04/2021</label></Col>
											</Row>
										</Card.Footer>
									</Card>
								</Col>
									)
								}) : null}
								
							</Row>
						</Col>
					</Row>
				</Container>
			) : null}
		</>
	);
}

export default withSnackbar(PaginaOnibus);
