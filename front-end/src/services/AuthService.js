export const USUARIO_KEY = "@bus-Usuario";
export const SENHA_KEY = "@bus-Senha";

export const isAuthenticated = () => {
	const usuario = localStorage.getItem(USUARIO_KEY);
	const senha = localStorage.getItem(SENHA_KEY);

	if (usuario !== null && senha !== null) {

		return true;
	}

	return false;
};

export const getAuth = () => {
	return {
		username: localStorage.getItem(USUARIO_KEY),
		password: localStorage.getItem(SENHA_KEY),
	};
};

export const login = (usuario, senha) => {
	localStorage.setItem(USUARIO_KEY, usuario);
	localStorage.setItem(SENHA_KEY, senha);
};

export const logout = () => {
	localStorage.removeItem(USUARIO_KEY);
	localStorage.removeItem(SENHA_KEY);
};
