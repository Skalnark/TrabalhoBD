import React from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import { Box, Grid, Link, TextField } from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { useState } from "react";
import { login, isAuthenticated } from "services/AuthService";
import { withRouter } from "react-router-dom";
import { useEffect } from "react";
import { withSnackbar } from "notistack";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";
import CadastroDialog from "./CadastroDialog";

function Copyright() {
	return (
		<Typography variant="body2" color="textSecondary" align="center">
			{"Copyright ©"}
			<Link color="inherit">TransporteFacil</Link> {new Date().getFullYear()}
			{"."}
		</Typography>
	);
}

const useStyles = makeStyles((theme) => ({
	paper: {
		marginTop: theme.spacing(8),
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
	},
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.secondary.main,
	},
	form: {
		width: "100%", // Fix IE 11 issue.
		marginTop: theme.spacing(1),
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
	},
}));

function LoginIndex(props) {
	const classes = useStyles();

	const [password, setPassword] = useState("");
	const [username, setUsername] = useState("");

	const [openCadastro, setOpenCadastro] = useState(false);

	function handleOpenCadastro(value) {
		setOpenCadastro(value);
	}

	useEffect(() => {
		if (isAuthenticated()) {
			props.history.push("/inicio");
		}
	});

	function callSnackBar(message, variant = "Default") {
		props.enqueueSnackbar(message, {
			variant: variant,
			anchorOrigin: {
				vertical: "bottom",
				horizontal: "right",
			},
		});
	}

	const handleSignIn = async (e) => {
		e.preventDefault();

		if (!username || !password) {
			callSnackBar("Preencha o campo de usuário e senha!", "error");
		} else {
			try {
				// const response = await ApiService.post("/auth", {
				// 	username: userName,
				// 	password: password,
				// });
				login(username, password);
				props.history.push("/");
				callSnackBar("Login Efetuado Com Sucesso!", "success");
			} catch (err) {
				callSnackBar(
					"Erro ao realizar Login, verifique as credenciais!",
					"error"
				);
			}
		}
	};

	return (
		<div>
			<a>
				<Button onClick={() => props.history.goBack()}>
					<KeyboardBackspaceIcon />
				</Button>
			</a>
			<Container component="main" maxWidth="xs">
				<CadastroDialog
					handleCadastroDialog={handleOpenCadastro}
					openCadastro={openCadastro}
					actionOnClose={() => handleOpenCadastro(false)}
				/>
				<CssBaseline />
				<div className={classes.paper}>
					<Avatar className={classes.avatar}>
						<LockOutlinedIcon />
					</Avatar>
					<Typography component="h1" variant="h5">
						Login
					</Typography>
					<form
						className={classes.form}
						noValidate
						onSubmit={handleSignIn}
					>
						<TextField
							variant="outlined"
							margin="normal"
							required
							fullWidth
							id="usuario"
							label="Usuário"
							name="usuario"
							autoComplete="usario"
							autoFocus
							onChange={(e) => setUsername(e.target.value)}
						/>
						<TextField
							variant="outlined"
							margin="normal"
							required
							fullWidth
							name="senha"
							label="Senha"
							type="password"
							id="senha"
							autoComplete="current-senha"
							onChange={(e) => setPassword(e.target.value)}
						/>
						<Button
							type="submit"
							fullWidth
							variant="contained"
							color="primary"
							className={classes.submit}
						>
							Entrar
						</Button>
					</form>
				</div>
				<Grid container>
					<Grid item>
						<Link
							href="#"
							variant="body2"
							onClick={() => handleOpenCadastro(true)}
						>
							{"Não tem uma conta? Cadastre-se"}
						</Link>
					</Grid>
				</Grid>
				<Box mt={2}>
					<Copyright />
				</Box>
			</Container>
		</div>
	);
}

export default withRouter(withSnackbar(LoginIndex));
