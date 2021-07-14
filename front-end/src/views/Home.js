import React, { useEffect, useState } from "react";
// react-bootstrap components
import {
  Card,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import { useHistory } from "react-router";
import { withSnackbar } from "notistack";

import CommonService from "services/CommonService";
import UtilsFunctions from "Utils/UtilsFunctions";

function Home(props) {
  var history = useHistory();

  const busService = new CommonService("/GetAllBus")
  const lineService = new CommonService("/get-all-line")
  const stationService = new CommonService("/get-all-station")
  const passengerService = new CommonService("/get-all-passenger")

  const [busList, setBusList] = useState(undefined);
  const [lineList, setLineList] = useState(undefined);
  const [stationList, setStationList] = useState(undefined);
  const [passengerList, setPassengerList] = useState(undefined);

  useEffect(() => {

    busService.getAll().then((res) => {
      setBusList(res.data);
    }).catch((error) => {
      callSnackBar("Erro ao acessar API", "error");
      console.log(error);
    });
    lineService.getAll().then((res) => {
      setLineList(res.data);
    })
    stationService.getAll().then((res) => {
      setStationList(res.data);
    })
    passengerService.getAll().then((res) => {
      setPassengerList(res.data);
    })

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
      <Container fluid>
        <Row>
          <Col lg="3" sm="6">
            <Card className="card-stats">
              <Card.Body>
                <Row>
                  <Col xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-bus-front-12 text-primary"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category">Ônibus</p>
                      <Card.Title as="h4">{busList !== undefined ? busList.length : 0}</Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer>
                <hr></hr>
                <div className="stats">
                  Número de ônibus em circulação
                </div>
              </Card.Footer>
            </Card>
          </Col>
          <Col lg="3" sm="6">
            <Card className="card-stats">
              <Card.Body>
                <Row>
                  <Col xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-bullet-list-67 text-success"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category">Linhas</p>
                      <Card.Title as="h4">{lineList !== undefined ? lineList.length : 0}</Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer>
                <hr></hr>
                <div className="stats">
                  Número de Linhas
                </div>
              </Card.Footer>
            </Card>
          </Col>
          <Col lg="3" sm="6">
            <Card className="card-stats">
              <Card.Body>
                <Row>
                  <Col xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-vector text-danger"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category">Terminais</p>
                      <Card.Title as="h4">{stationList !== undefined ? stationList.length : 0}</Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer>
                <hr></hr>
                <div className="stats">
                  Número de terminais de ônibus
                </div>
              </Card.Footer>
            </Card>
          </Col>
          <Col lg="3" sm="6">
            <Card className="card-stats">
              <Card.Body>
                <Row>
                  <Col xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-single-02 text-primary"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category">Usuários</p>
                      <Card.Title as="h4">{passengerList !== undefined ? passengerList.length : 0}</Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer>
                <hr></hr>
                <div className="stats">
                  Número de Usuários Cadastrados
                </div>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default withSnackbar(Home);
