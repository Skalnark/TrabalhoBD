/*!

=========================================================
* Light Bootstrap Dashboard React - v2.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/light-bootstrap-dashboard-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/light-bootstrap-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Home from "views/Home.js";
import UserProfile from "views/UserProfile.js";
import TableList from "views/TableList.js";
import Typography from "views/Typography.js";
import Icons from "views/Icons.js";

const dashboardRoutes = [
  {
    path: "/inicio",
    name: "Início",
    icon: "nc-icon nc-chart-pie-35",
    component: Home
  },
  {
    path: "/onibus",
    name: "Procurar ônibus",
    icon: "nc-icon nc-bus-front-12",
    component: UserProfile,
  },
  {
    path: "/table",
    name: "Linhas",
    icon: "nc-icon nc-bullet-list-67",
    component: TableList,
  },
  {
    path: "/typography",
    name: "Typography",
    icon: "nc-icon nc-paper-2",
    component: Typography
  },
  {
    path: "/iconss",
    name: "Icons",
    icon: "nc-icon nc-atom",
    component: Icons
  }
];

export default dashboardRoutes;
