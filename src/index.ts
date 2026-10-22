import express from "express";
import menuRouter from "./routes/menu.route";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/api", menuRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
