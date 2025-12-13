import express from "express";
import exphbs from "express-handlebars";
import path from "path";
import { fileURLToPath } from "url";
import config from "./config.js";
import { sessionMiddleware } from "./session.js";
import routes from "./routes/index.js";
import helpers from "./utils/helpers.js";
import MemoryStore from "memorystore";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Express app
const app = express();

// Configure Handlebars
app.engine(
  "hbs",
  exphbs.engine({
    extname: ".hbs",
    defaultLayout: "main",
    layoutsDir: path.join(__dirname, "layout"),
    partialsDir: [
      path.join(__dirname, "components"),
      path.join(__dirname, "pages"),
      { dir: path.join(__dirname, "pages", "landing"), namespace: "landing" },
    ],
    helpers: helpers,
  }),
);

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "pages"));

// Session middleware
app.use(sessionMiddleware);

// Custom flash middleware
app.use((req, res, next) => {
  res.locals.flash = req.session.flash || {
    success: [],
    error: [],
    info: [],
    warning: [],
  };
  req.session.flash = { success: [], error: [], info: [], warning: [] };
  next();
});

// HTMX detection middleware
app.use((req, res, next) => {
  req.isHtmx = req.headers["hx-request"] === "true";
  req.htmx = {
    target: req.headers["hx-target"],
    trigger: req.headers["hx-trigger"],
    currentUrl: req.headers["hx-current-url"],
  };
  next();
});

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files (if any)
app.use(express.static("public"));

// Routes
app.use("/", routes);

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
    version: "1.0.0",
  });
});

export default app;
