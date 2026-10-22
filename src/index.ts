import express from "express";
import menuRouter from "./routes/menu.route";
import { errorMiddleware } from "./middleware/error.middleware";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/api", menuRouter);

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
