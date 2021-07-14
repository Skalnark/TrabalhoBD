/*eslint-disable*/
import React from "react";

import { Redirect, Route, Router, Switch } from "react-router-dom";
import ListaOnibus from "./ListaOnibus";
import PaginaOnibus from "./PaginaOnibus";

export default function SearchPage(props) {

	return (
		<Router history={props.history}>
			<Switch>
				<Route path="/onibus/lista">
					<ListaOnibus />
				</Route>
				<Route path="/onibus/pagina">
					<PaginaOnibus />
				</Route>
				<Redirect from="/" to="/onibus/lista"/>
			</Switch>
		</Router>
	);
}