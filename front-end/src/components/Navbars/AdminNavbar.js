import React, { Component } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Navbar, Container, Nav, Dropdown, Button } from "react-bootstrap";
import {
	Popper,
	makeStyles,
	Hidden,
	Grow,
	Paper,
	ClickAwayListener,
	MenuItem,
	MenuList,
	Divider,
} from "@material-ui/core";
import { Person } from "@material-ui/icons";
import { isAuthenticated } from "services/AuthService";

import styles from "assets/jss/headerLinksStyle.js";

import routes from "routes.js";

import { logout } from "./../../services/AuthService";

const useStyles = makeStyles(styles);

function Header() {
	const history = useHistory();

	const classes = useStyles();

	const location = useLocation();
	const mobileSidebarToggle = (e) => {
		e.preventDefault();
		document.documentElement.classList.toggle("nav-open");
		var node = document.createElement("div");
		node.id = "bodyClick";
		node.onclick = function () {
			this.parentElement.removeChild(this);
			document.documentElement.classList.toggle("nav-open");
		};
		document.body.appendChild(node);
	};

	const [openProfile, setOpenProfile] = React.useState(null);

	const handleClickProfile = (event) => {
		if (openProfile && openProfile.contains(event.target)) {
			setOpenProfile(null);
		} else {
			setOpenProfile(event.currentTarget);
		}
	};

	const handleLogout = () => {
		setOpenProfile(null);
		logout();
	};

	const handleCloseProfile = () => {
		setOpenProfile(null);
	};

	const getBrandText = () => {
		for (let i = 0; i < routes.length; i++) {
			if (location.pathname.indexOf(routes[i].path) !== -1) {
				return routes[i].name;
			}
		}
		return "Brand";
	};

	return (
		<Navbar bg="light" expand="lg">
			<div style={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
				<div className="d-flex justify-content-center align-items-center ml-2 ml-lg-0">
					<Button
						variant="dark"
						className="d-lg-none btn-fill d-flex justify-content-center align-items-center rounded-circle p-2"
						onClick={mobileSidebarToggle}
					>
						<i className="fas fa-ellipsis-v"></i>
					</Button>
					<Navbar.Brand
						href="#home"
						onClick={(e) => e.preventDefault()}
						className="mr-2"
					>
						{getBrandText()}
					</Navbar.Brand>
				</div>
				<div>
					<Navbar.Collapse id="basic-navbar-nav">
						<div className={classes.manager}>
							<Button
								color={window.innerWidth > 959 ? "primary" : "white"}
								justIcon={window.innerWidth > 959}
								simple={!(window.innerWidth > 959)}
								aria-owns={
									openProfile ? "profile-menu-list-grow" : null
								}
								aria-haspopup="true"
								onClick={handleClickProfile}
								className={classes.buttonLink}
							>
								<Person className={classes.icons} />
								<Hidden mdUp implementation="css">
									<p className={classes.linkText}>Perfil</p>
								</Hidden>
							</Button>
							<Popper
								open={Boolean(openProfile)}
								anchorEl={openProfile}
								transition
								disablePortal
								className={!openProfile ? "popperClose" : "popperNav"}
							>
								{({ TransitionProps, placement }) => (
									<Grow
										{...TransitionProps}
										id="profile-menu-list-grow"
										style={{
											transformOrigin:
												placement === "bottom"
													? "center top"
													: "center bottom",
										}}
									>
										{isAuthenticated() ? (
											<Paper>
												<ClickAwayListener
													onClickAway={handleCloseProfile}
												>
													<MenuList role="menu">
														<Divider light />
														<MenuItem
															onClick={handleLogout}
															className={classes.dropdownItem}
														>
															Logout
														</MenuItem>
													</MenuList>
												</ClickAwayListener>
											</Paper>
										) : (
											<Paper>
												<ClickAwayListener
													onClickAway={handleCloseProfile}
												>
													<MenuList role="menu">
														<Divider light />
														<MenuItem
															onClick={() =>
																history.push("/login")
															}
															className={classes.dropdownItem}
														>
															Fazer Login
														</MenuItem>
													</MenuList>
												</ClickAwayListener>
											</Paper>
										)}
									</Grow>
								)}
							</Popper>
						</div>
					</Navbar.Collapse>
				</div>
			</div>
		</Navbar>
	);
}

export default Header;
