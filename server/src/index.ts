import express, { Express } from "express";
import { save, list, load, saveScore, listScores } from './routes';
import bodyParser from 'body-parser';


// Configure and start the HTTP server.
const port: number = 8088;
const app: Express = express();
app.use(bodyParser.json());
app.post("/api/save", save);
app.get("/api/list", list);
app.get("/api/load", load);
app.post("/api/saveScore", saveScore);
app.get("/api/listScores", listScores);
app.listen(port, () => console.log(`Server listening on ${port}`));
