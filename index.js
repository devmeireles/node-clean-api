const express = require("express");

const app = express();
app.use(express.json());

const PORT = 3000;

let menus = [
  {
    id: 1,
    name: "Hot Potato Wedges",
    price: 59.9,
  },
  {
    id: 2,
    name: "Flander's Fries",
    price: 49.9,
  },
];

app.get("/menus", (req, res) => {
  res.json(menus);
});

app.get("/menus/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const foundMenu = menus.find((c) => c.id === id);
  if (foundMenu) {
    res.json(foundMenu);
  } else {
    res.status(404).send("Menu Not Found");
  }
});

app.post("/menus", (req, res) => {
  const newMenu = req.body;
  menus.push(newMenu);
  res.status(201).json(newMenu);
});

app.put("/menus/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const updatedMenu = req.body;
  const index = menus.findIndex((c) => c.id === id);
  if (index !== -1) {
    menus[index] = { ...menus[index], ...updatedMenu };
    res.json(menus[index]);
  } else {
    res.status(404).send("Menu Not Found");
  }
});

app.delete("/menus/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = menus.findIndex((c) => c.id === id);
  if (index !== -1) {
    const deletedMenu = menus.splice(index, 1);
    res.json(deletedMenu[0]);
  } else {
    res.status(404).send("Menu Not Found");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
