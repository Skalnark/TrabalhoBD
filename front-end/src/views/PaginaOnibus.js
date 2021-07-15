// react-bootstrap components
import { Button, Card, Form, Container, Row, Col } from "react-bootstrap";

import { withSnackbar } from "notistack";

import CommonService from "services/CommonService";
import UtilsFunctions from "Utils/UtilsFunctions";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useHistory } from "react-router";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { isAuthenticated } from "services/AuthService";
import axios from "axios";
import qs from "qs";

function useQuery() {
	return new URLSearchParams(useLocation().search);
}

function PaginaOnibus(props) {
	const busService = new CommonService("/get-bus-by-id");
	const getCommentsService = new CommonService("/GetComments");
	const postCommentService = new CommonService("/CreateComment");
	let query = useQuery(); // Objeto com os parametros

	var history = useHistory();

	const [thatOneBus, setThatOneBus] = useState(undefined);
	const [thoseComments, setThoseComments] = useState(undefined);

	const [openDialog, setOpenDialog] = useState(false);

	const [comentario, setComentario] = useState("");

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
			.getWithParams("bus=" + idOnibus)
			.then((res) => {
				setThatOneBus(res.data);
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

	function comentar() {
		if (!isAuthenticated()) {
			handleDialog(true);
		}

		var idOnibus = query.get("idOnibus");

		let body = {
			id_bus: idOnibus,
			id_passenger: "2",
			content: comentario,
		};

		var authOptions = {
			method: "POST",
			url: "http://localhost:3000/CreateComment",
			data: qs.stringify(body),
			headers: {
				'Authorization': "Basic bmF0aGFuOnNlbmhhMTIz",
				"Content-Type": "application/x-www-form-urlencoded",
			},
			json: true,
		};

		axios(authOptions)
			.then(function (response) {
				console.log(response.data);
				console.log(response.status);
			})
			.catch(function (error) {
				callSnackBar("Erro ao acessar API", "error");
				console.log(error);
			});

		postCommentService
			.createWithParams(body)
			.then((res) => {
				setBusList(res.data);
			})
			.catch((error) => {
				callSnackBar("Erro ao acessar API", "error");
				console.log(error);
			});
	}

	function renderDialogo() {
		return (
			<div>
				<Dialog
					open={openDialog}
					onClose={() => handleDialog(false)}
					handleClose={() => handleDialog(false)}
					aria-labelledby="alert-dialog-title"
					aria-describedby="alert-dialog-description"
				>
					<DialogTitle id="alert-dialog-title">
						{"Para comentar, é necessário estar logado!"}
					</DialogTitle>
					<DialogContent
						style={{ display: "flex", justifyContent: "space-between" }}
					>
						<Button
							onClick={() => handleDialog(false)}
							color="primary"
							autoFocus
						>
							Voltar
						</Button>
						<Button
							onClick={() =>
								history.push({
									pathname: "/login",
								})
							}
							color="primary"
							autoFocus
						>
							Fazer Login
						</Button>
					</DialogContent>
				</Dialog>
			</div>
		);
	}

	function handleDialog(action) {
		setOpenDialog(action);
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
										<h5 className="title">
											Ônibus de número: {thatOneBus.id_bus}
										</h5>

										<p
											className="description text-center"
											style={{
												display: "flex",
												flexDirection: "column",
												alignItems: "start",
												width: "100%",
												paddingLeft: "10%",
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
																onChange={(e) =>
																	setComentario(e.target.value)
																}
															></Form.Control>
														</Form.Group>
													</Col>
												</Row>
												<Button
													className="btn-fill pull-right"
													variant="info"
													onClick={() => comentar()}
												>
													Comentar
												</Button>
												<div className="clearfix"></div>
											</Form>
										</Card.Body>
									</Card>
								</Col>
								{renderDialogo()}
								<Col md="12">
									<h4>Comentários</h4>
								</Col>
								{thoseComments !== undefined
									? thoseComments.map((comment) => {
											return (
												<Col md="12">
													<Card>
														<Card.Body>
															<Row>
																<Col md="12">
																	<strong>
																		{comment.username}{" "}
																	</strong>
																	<p
																		style={{
																			display: "inline",
																		}}
																	>
																		disse:
																	</p>
																	<p
																		style={{
																			marginTop: "5px",
																		}}
																	>
																		{comment.content}
																	</p>
																</Col>
															</Row>
															<div className="clearfix"></div>
														</Card.Body>
														<Card.Footer>
															<Row>
																<Col md="12">
																	<label
																		style={{ fontSize: 14 }}
																	>
																		22/04/2021
																	</label>
																</Col>
															</Row>
														</Card.Footer>
													</Card>
												</Col>
											);
									  })
									: null}
							</Row>
						</Col>
					</Row>
				</Container>
			) : null}
		</>
	);
}

export default withSnackbar(PaginaOnibus);
