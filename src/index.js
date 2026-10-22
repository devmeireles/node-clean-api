const express = require("express");

const {
  getAllMenus,
  getMenuById,
  createMenu,
  updateMenu,
  deleteMenu,
} = require("./controllers/menu.controller");

const app = express();
app.use(express.json());

const PORT = 3000;

const menuRouter = express.Router();

menuRouter.get("/menus", (req, res) => {
  getAllMenus(req, res);
});

menuRouter.get("/menus/:id", (req, res) => {
  getMenuById(req, res);
});

menuRouter.post("/menus", (req, res) => {
  createMenu(req, res);
});

menuRouter.put("/menus/:id", (req, res) => {
  updateMenu(req, res);
});

menuRouter.delete("/menus/:id", (req, res) => {
  deleteMenu(req, res);
});

app.use("/api", menuRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
