import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDb from './config/db';
import LoginRoute from './routers/LoginRoute';
import getTeamLeadRoute from './routers/GetTeamLeadRoute';
// import ProjectRoute from './routers/admin/projectRoutes'
import post_project_route from './routers/admin/post_project_route';
import DashboardAdmin from './routers/admin/Dashboard';
import Addtasks from './routers/admin/AddTask';
import DashboardTL from './routers/teamlead/DashboardTL';
import sendTasks from './routers/teamlead/sendTasks';
import updateTasks from './routers/teamlead/updateTasks';
import myteam from './routers/teamlead/myteam';
import teammember from './routers/teamlead/teammember';
import tasks from './routers/teamlead/tasks';
import markcompleted from './routers/teamlead/markcompleted';
import teamLeadReportRoutes from "./routers/teamlead/report";

dotenv.config();

const app = express();

app.use(cors({
  origin: 'http://localhost:5173', // change to your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true,
}));

app.use(express.json());

connectDb();

app.use("/auth", LoginRoute);


//Manager Routes
app.use("/manager", getTeamLeadRoute);
app.use("/manager", post_project_route);
app.use("/manager",DashboardAdmin);
app.use("/manager", Addtasks);


//Team Lead Routes
app.use("/teamlead", DashboardTL);
app.use("/teamlead", sendTasks);
app.use("/teamlead", updateTasks);
app.use("/teamlead", myteam);
app.use('/teamlead', teammember);
app.use('/teamlead', tasks);
app.use('/teamlead', markcompleted);
app.use("/teamlead", teamLeadReportRoutes);
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
