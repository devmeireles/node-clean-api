const http = require("http");
const url = require("url");

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

const handleGetRequest = (req, res) => {
  const id = parseInt(req.pathname.split("/")[2]);

  if (!isNaN(id)) {
    const foundMenu = menus.find((c) => c.id === id);
    if (foundMenu) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(foundMenu));
    } else {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Menu Not Found");
    }
    return;
  }

  if (req.pathname === "/menus") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(menus));
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
  }
};

const handlePostRequest = (req, res) => {
  if (req.pathname === "/menus") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      const newMenu = JSON.parse(body);
      menus.push(newMenu);
      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify(newMenu));
    });
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
  }
};

const handlePutRequest = (req, res) => {
  if (req.pathname.startsWith("/menus/")) {
    const id = parseInt(req.pathname.split("/")[2]);
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      const updatedMenu = JSON.parse(body);
      const index = menus.findIndex((c) => c.id === id);
      if (index !== -1) {
        menus[index] = { ...menus[index], ...updatedMenu };
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(menus[index]));
      } else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Menu Not Found");
      }
    });
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
  }
};

const handleDeleteRequest = (req, res) => {
  if (req.pathname.startsWith("/menus/")) {
    const id = parseInt(req.pathname.split("/")[2]);
    const index = menus.findIndex((c) => c.id === id);
    if (index !== -1) {
      const deletedMenu = menus.splice(index, 1);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(deletedMenu[0]));
    } else {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Menu Not Found");
    }
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
  }
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);

  switch (req.method) {
    case "GET":
      handleGetRequest(parsedUrl, res);
      break;
    case "POST":
      handlePostRequest(parsedUrl, req, res);
      break;
    case "PUT":
      handlePutRequest(parsedUrl, req, res);
      break;
    case "DELETE":
      handleDeleteRequest(parsedUrl, res);
      break;
    default:
      res.writeHead(405, { "Content-Type": "text/plain" });
      res.end("Method Not Allowed");
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
