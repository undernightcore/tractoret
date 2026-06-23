import express, { json } from "express";
import { notFoundHandler } from "./handlers/404";
import { errorHandler } from "./handlers/error";
import { httpErrorHandler } from "./handlers/http";
import { zodErrorHandler } from "./handlers/zod";

const app = express();

app.use(json());

app.use(notFoundHandler);
app.use(zodErrorHandler);
app.use(httpErrorHandler);
app.use(errorHandler);

app.listen(8080, () => console.info("Hello from Tractoret :)"));
