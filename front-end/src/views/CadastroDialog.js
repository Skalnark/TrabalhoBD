import React, { useState } from "react";

import CommonService from "services/CommonService";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import { TextField } from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { withSnackbar } from "notistack";

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

function CadastroDialog({
	handleCadastroDialog,
	openCadastro,
	actionOnClose,
	enqueueSnackbar,
}) {
	const classes = useStyles();

	const cadastroService = new CommonService("/SignUp");

	const [usuario, setUsuario] = useState("");
	const [senha, setSenha] = useState("");
	const [email, setEmail] = useState("");

	function cadastrar() {
		var body = {
			username: usuario,
			password: senha,
			email: email,
		};

		cadastroService
			.create(body)
			.then((res) => {
            callSnackBar("Cadastro Feito Com Sucesso!", "success");
            actionOnClose();
			})
			.catch((error) => {
				callSnackBar("Credenciais inválidas", "error");
				console.log(error);
			});
	}

	function callSnackBar(message, variant = "Default") {
		enqueueSnackbar(message, {
			variant: variant,
			anchorOrigin: {
				vertical: "bottom",
				horizontal: "right",
			},
		});
	}

	return (
		<div>
			<Dialog
				open={openCadastro}
				onClose={() => handleCadastroDialog(false)}
				handleClose={() => handleCadastroDialog(false)}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
				handleClose={() => actionOnClose()}
			>
				<DialogActions>
					<Container component="main" maxWidth="xs">
						<CssBaseline />
						<div className={classes.paper}>
							<Avatar className={classes.avatar}>
								<LockOutlinedIcon />
							</Avatar>
							<Typography component="h1" variant="h5">
								Cadastro
							</Typography>
							<form className={classes.form} noValidate>
								<TextField
									variant="outlined"
									margin="normal"
									required
									fullWidth
									id="usuario"
									label="Usuário"
									name="usuario"
									autoComplete="usuario"
									autoFocus
									onChange={(e) => setUsuario(e.target.value)}
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
									onChange={(e) => setSenha(e.target.value)}
								/>
								<TextField
									variant="outlined"
									margin="normal"
									required
									fullWidth
									name="email"
									label="Email"
									type="email"
									id="email"
									autoComplete="current-email"
									onChange={(e) => setEmail(e.target.value)}
								/>
								<Button
									fullWidth
									variant="contained"
									color="primary"
									className={classes.submit}
									onClick={cadastrar}
								>
									Cadastrar-se
								</Button>
							</form>
						</div>
					</Container>
				</DialogActions>
			</Dialog>
		</div>
	);
}

export default withSnackbar(CadastroDialog);
