import express, { json } from "express";
import { notFoundHandler } from "./handlers/404";
import { errorHandler } from "./handlers/error";
import { httpErrorHandler } from "./handlers/http";
import { zodErrorHandler } from "./handlers/zod";
import { groupRouter } from "./routes/group";
import { linkRouter } from "./routes/link";

const app = express();

app.use(json());

app.use("/groups", groupRouter);
app.use("/groups/:groupId/links", linkRouter);

app.use(notFoundHandler);
app.use(zodErrorHandler);
app.use(httpErrorHandler);
app.use(errorHandler);

app.listen(8080, () => console.info("Hello from Tractoret :)"));
