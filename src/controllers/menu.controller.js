const data = require("../data");

const getAllMenus = (req, res) => {
  res.json(data.menus);
};

const getMenuById = (req, res) => {
  const id = parseInt(req.params.id);
  const foundMenu = data.menus.find((c) => c.id === id);
  if (foundMenu) {
    res.json(foundMenu);
  } else {
    res.status(404).send("Menu Not Found");
  }
};

const createMenu = (req, res) => {
  const newMenu = req.body;
  data.menus.push(newMenu);
  res.status(201).json(newMenu);
};

const updateMenu = (req, res) => {
  const id = parseInt(req.params.id);
  const updatedMenu = req.body;
  const index = data.menus.findIndex((c) => c.id === id);
  if (index !== -1) {
    data.menus[index] = { ...data.menus[index], ...updatedMenu };
    res.json(data.menus[index]);
  } else {
    res.status(404).send("Menu Not Found");
  }
};

const deleteMenu = (req, res) => {
  const id = parseInt(req.params.id);
  const index = data.menus.findIndex((c) => c.id === id);
  if (index !== -1) {
    const deletedMenu = data.menus.splice(index, 1);
    res.json(deletedMenu[0]);
  } else {
    res.status(404).send("Menu Not Found");
  }
};

module.exports = {
  getAllMenus,
  getMenuById,
  createMenu,
  updateMenu,
  deleteMenu,
};
