import React, { useEffect, useState } from "react";

// react-bootstrap components
import { Card, Container, Row, Col } from "react-bootstrap";

import { withSnackbar } from "notistack";

import CommonService from "services/CommonService";
import UtilsFunctions from "Utils/UtilsFunctions";

function ListaOnibus(props) {
	const busService = new CommonService("/GetAllBus");

	const [busList, setBusList] = useState(undefined);

	useEffect(() => {
		busService
			.getAll()
			.then((res) => {
				setBusList(res.data);
			})
			.catch((error) => {
				callSnackBar("Erro ao acessar API", "error");
				console.log(error);
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

	function generatePath(idOnibus) {
		//gera o url com os parametros de busca
		var path = "/onibus/pagina?idOnibus=" + idOnibus;
		history.push(encodeURI(path));
	}

	return (
		<>
			<Container fluid>
				<Row>
					{busList !== undefined
						? busList.map((bus) => {
								return (
									<Col md="3" lg="2">
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
													<a
														href={"/onibus/pagina?idOnibus=" + bus.id_bus}
													>
														<img
															alt="..."
															className="avatar border-gray"
															src={
																require("assets/img/faces/onibus.jpg")
																	.default
															}
														></img>
														<h5 className="title">
															Número: {bus.id_bus}
														</h5>
													</a>
												</div>
												<p
													className="description text-center"
													style={{
														display: "flex",
														flexDirection: "column",
														alignItems: "start",
														padding: "5px",
													}}
												>
													<div style={{marginBottom: "4px"}}>
														<strong>Linha: </strong>
														{bus.line_code}
													</div>
													<div style={{marginBottom: "4px"}}>
														<strong>Passageiros: </strong>
														{bus.passenger_count}
													</div>
													<div style={{marginBottom: "4px"}}>
														<strong>Saída: </strong>
														{UtilsFunctions.formatTimeStampToHours(
															bus.departure_time
														)}
													</div>
												</p>
											</Card.Body>
										</Card>
									</Col>
								);
						  })
						: null}
				</Row>
			</Container>
		</>
	);
}

export default withSnackbar(ListaOnibus);
