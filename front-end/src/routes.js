import Home from "views/Home.js";
import Onibus from "views/Onibus.js";
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
    name: "Ônibus",
    icon: "nc-icon nc-bus-front-12",
    component: Onibus,
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
