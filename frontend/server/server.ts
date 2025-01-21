// main server
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import path, { resolve, dirname } from "path";
import { fileURLToPath } from "url";
// logger
import expressWinston from "express-winston";
import logger, { errLogger } from "./logger.js";
// parsers
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
// other utils
import dotenv from "dotenv";
import axios, { AxiosError, AxiosResponse } from "axios";
import {
  ChangePasswordGet,
  ContactFormGet,
  LoginGet,
  RegisterGet,
  Task,
  TasksGet,
  TasksIdCreate,
  TasksIdDelete,
  TasksIdGet,
  TasksIdUpdate,
  Token,
  User,
  UserTasks,
  UsersGet,
} from "../src/utils_other/types.js";
import multer from "multer";
import FormData from "form-data";

const upload = multer();

// ----------------- Config ----------------- //
dotenv.config({ path: ".env" });
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = path.resolve(__dirname, "../../");
const MODE = process.env.VITE_MODE?.trim();
const RUN_ON_DOCKER = process.env.RUN_ON_DOCKER?.trim();

const BACKEND_PROTOCOL = process.env.BACKEND_PROTOCOL?.trim();
const BACKEND_HOST = process.env.BACKEND_HOST?.trim();
const BACKEND_PORT = process.env.BACKEND_PORT?.trim();

const FRONTEND_PORT_DEV = process.env.FRONTEND_PORT_DEV?.trim();
const FRONTEND_PORT_PROD = process.env.FRONTEND_PORT_PROD?.trim();

const ACCESS_TOKEN_EXPIRE_HOURS =
  process.env.VITE_ACCESS_TOKEN_EXPIRE_HOURS?.trim();

const envVars = {
  MODE,
  RUN_ON_DOCKER,
  BACKEND_PROTOCOL,
  BACKEND_HOST,
  BACKEND_PORT,
  FRONTEND_PORT_DEV,
  FRONTEND_PORT_PROD,
  ACCESS_TOKEN_EXPIRE_HOURS,
};
const notSet =
  !MODE ||
  !RUN_ON_DOCKER ||
  !BACKEND_PROTOCOL ||
  !BACKEND_HOST ||
  !BACKEND_PORT ||
  !FRONTEND_PORT_DEV ||
  !FRONTEND_PORT_PROD ||
  !ACCESS_TOKEN_EXPIRE_HOURS;
if (notSet) {
  logger.error("Environment variables not set!");
  for (const [name, value] of Object.entries(envVars)) {
    if (!value) {
      logger.error(`${name} = '${value}'`);
    } else {
      logger.warn(`${name} = '${value}'`);
    }
  }
  process.exit(1);
}

const isProd = MODE === "production";
const port = isProd ? FRONTEND_PORT_PROD : FRONTEND_PORT_DEV;
const BACKEND_URL = `${BACKEND_PROTOCOL}://${BACKEND_HOST}:${BACKEND_PORT}`;

const app = express();
// ----------------- Middleware ----------------- //--config nodemon.json
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// ----------------- Auth Middleware ----------------- //
declare module 'express-serve-static-core' {
  interface Request {
    token?: string;
  }
}
const authenticate = (req: Request, res: Response, next: NextFunction) => { 
  const token: string | undefined = req.cookies.access_token
  if (!token) {
    res.status(401).send("Access Denied: No Token Provided!");
  } else {
    req.token = token; // Attach token to the request object
    next(); 
  }
};

// ----------------- Auth ----------------- //
app.post("/api/auth/", authenticate, (req, res) => {
  const token = req.token;   
  axios
    .post(
      `${BACKEND_URL}/api/auth/`,
      {},
      { 
        headers: { 
          Authorization: `Bearer ${token}`,  
        },
      }
    )
    .then((response: AxiosResponse<string>) => {
      console.log(response.data);
      res.status(response.status).send(response.data);
    })
    .catch((error: AxiosError<{ detail: string }>) => {
      console.log(error.response?.data.detail)
      res.clearCookie("access_token");
      if (error.response) {
        res.status(error.response.status).send(error.response.data.detail);
      } else {
        res.status(502).send("No response from the server");
      }
    }); 
});
// ----------------- Login ----------------- //
app.post("/api/login/", upload.none(), (req, res) => {
  const data = req.body as LoginGet;
  const formData = new FormData();
  formData.append("username", data.username);
  formData.append("password", data.password);
  axios
    .post(`${BACKEND_URL}/api/login/`, formData)
    .then((response: AxiosResponse<Token>) => {
      if (response && response.status === 200) {
        const token = response.data.access_token;
        // Set the token in a cookie 
        res.cookie("access_token", token, {
          sameSite: "strict",
          httpOnly: true /* accessible only by the server */,
          secure: isProd /* HTTPS only */,
          maxAge: 1000 * 60 * 60 * +ACCESS_TOKEN_EXPIRE_HOURS /* x hours */,
        });

        res.status(200).send("Login successful!");
      }
    })
    .catch((error: AxiosError<{ detail: string }>) => {
      if (error.response) {
        res.status(error.response.status).send(error.response.data.detail);
      } else {
        res.status(502).send("No response from the server");
      }
    });
});
// ----------------- Register ----------------- //
app.post("/api/user/", upload.none(), (req, res) => {
  const data = req.body as RegisterGet;
  const formData = new FormData();
  formData.append("username", data.username);
  formData.append("email", data.email);
  formData.append("password", data.password);
  axios
    .post(`${BACKEND_URL}/api/user/`, formData)
    .then((response: AxiosResponse<string>) => {
      console.log(response.data);
      if (response && response.status === 201) {
        res.status(201).send("Registration successful!");
      }
    })
    .catch((error: AxiosError<{ detail: string }>) => {
      if (error.response) {
        res.status(error.response.status).send(error.response.data);
      } else {
        res.status(502).send("No response from the server");
      }
    });
});
// ----------------- Logout ----------------- //
app.post("/logout/", (req, res) => {
  const token: string | undefined = req.cookies.access_token
  if (!token) {
    res.redirect("/");
  } else {
    res.clearCookie("access_token");
    res.redirect("/");
  }
});
// ----------------- Change Password ----------------- //
app.put("/api/change-password/", authenticate, upload.none(), (req, res) => {
  const token = req.token;    
  const data = req.body as ChangePasswordGet;
  const formData = new FormData();
  formData.append("new_password", data.new_password);
  formData.append("old_password", data.old_password);
  axios
    .put(`${BACKEND_URL}/api/change-password/`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response: AxiosResponse<string>) => {
      console.log(response.data);
      if (response && response.status === 200) {
        res.status(200).send("Chaged password successfully!");
      }
    })
    .catch((error: AxiosError<{ detail: string }>) => {
      if (error.response) {
        res.status(error.response.status).send(error.response.data);
      } else {
        res.status(502).send("No response from the server");
      }
    }); 
});
// ----------------- Contact ----------------- //
app.post("/api/contact/", upload.none(), (req, res) => {
  const data = req.body as ContactFormGet;
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("email", data.email);
  formData.append("subject", data.subject);
  formData.append("message", data.message);
  axios
    .post(`${BACKEND_URL}/api/contact/`, formData)
    .then((response: AxiosResponse<string>) => {
      console.log(response.data);
      res.status(response.status).send(response.data);
    })
    .catch((error: AxiosError<Record<string, string>>) => {
      if (error.response) {
        res.status(error.response.status).send(error.response.data.detail);
      } else {
        res.status(502).send({ detail: "No response from the server" });
      }
    });
});
// ----------------- Users ----------------- //
app.get("/api/user/", authenticate, (req, res) => {
  const token = req.token;    
  axios
    .get(`${BACKEND_URL}/api/user/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response: AxiosResponse<User>) => {
      res.status(response.status).send(response.data);
    })
    .catch((error: AxiosError<{ detail: string }>) => {
      if (error.response) {
        res.status(error.response.status).send(error.response.data.detail);
      } else {
        res.status(502).send("No response from the server");
      }
    }); 
});
app.post("/api/users/", authenticate, (req, res) => {
  const token = req.token;    
  const data = req.body as UsersGet;
  axios
    .post(`${BACKEND_URL}/api/users/`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response: AxiosResponse<UserTasks[]>) => {
      console.log(response.data);
      res.status(response.status).send(response.data);
    })
    .catch((error: AxiosError<{ detail: string }>) => {
      if (error.response) {
        res.status(error.response.status).send(error.response.data.detail);
      } else {
        res.status(502).send("No response from the server");
      }
    }); 
});
// ----------------- Tasks ----------------- //
app.post("/api/tasks/", authenticate, (req, res) => {
  const token = req.token;    
  const data = req.body as TasksGet; 
  axios
    .post(`${BACKEND_URL}/api/tasks/`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response: AxiosResponse<Task>) => {
      console.log(response.data);
      res.status(response.status).send(response.data);
    })
    .catch((error: AxiosError<{ detail: string }>) => {
      if (error.response) {
        res.status(error.response.status).send(error.response.data.detail);
      } else {
        res.status(502).send("No response from the server");
      }
    }); 
});
app.post("/api/task/", authenticate, (req, res) => {
  const token = req.token;    
  const data = req.body as TasksIdGet; 
  axios
    .get(`${BACKEND_URL}/api/task/${data.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response: AxiosResponse<Task>) => {
      console.log(response.data);
      res.status(response.status).send(response.data);
    })
    .catch((error: AxiosError<{ detail: string }>) => {
      if (error.response) {
        res.status(error.response.status).send(error.response.data.detail);
      } else {
        res.status(502).send("No response from the server");
      }
    }); 
});
app.post("/api/task/create", authenticate, (req, res) => {
  const token = req.token;    
  const data = req.body as TasksIdCreate
  axios
    .post(`${BACKEND_URL}/api/task/`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response: AxiosResponse<Task>) => {
      console.log(response.data);
      res.status(response.status).send(response.data);
    })
    .catch((error: AxiosError<{ detail: string }>) => {
      if (error.response) {
        res.status(error.response.status).send(error.response.data.detail);
      } else {
        res.status(502).send("No response from the server");
      }
    }); 
});
app.put("/api/task/", authenticate, (req, res) => {
  const token = req.token;    
  const data = req.body as TasksIdUpdate
  axios
    .put(
      `${BACKEND_URL}/api/task/${data.id}`,
      {
        title: data.title,
        description: data.description,
        completed: data.completed,
        due_date: data.due_date,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then((response: AxiosResponse<Task>) => {
      console.log(response.data);
      res.status(response.status).send(response.data);
    })
    .catch((error: AxiosError<{ detail: string }>) => {
      if (error.response) {
        res.status(error.response.status).send(error.response.data.detail);
      } else {
        res.status(502).send("No response from the server");
      }
    }); 
});
app.delete("/api/task/", authenticate, (req, res) => {
  const token = req.token;    
  const data = req.body as TasksIdDelete; 
  axios
    .delete(`${BACKEND_URL}/api/task/${data.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response: AxiosResponse<string>) => {
      console.log(response.data);
      res.status(response.status).send(response.data);
    })
    .catch((error: AxiosError<{ detail: string }>) => {
      if (error.response) {
        res.status(error.response.status).send(error.response.data.detail);
      } else {
        res.status(502).send("No response from the server");
      }
    }); 
});

// ----------------- Logger ----------------- //
app.use(
  expressWinston.logger({
    winstonInstance: logger,
    statusLevels: true,
    msg: "HTTP {{req.method}} {{req.url}}",
    expressFormat: true,
    colorize: true,
    responseWhitelist: ["body"],
  })
);

// ----------------- DEV 🛠️ & PROD 🚀 ----------------- //
if (isProd) {
  logger.debug("Production Mode 🚀");
  app.use(express.static(path.join(__dirname, "../../dist")));
} else {
  logger.debug("Development Mode 🛠️");
  const vite = await import("vite");
  const viteDevMiddleware = (
    await vite.createServer({
      root,
      server: {
        middlewareMode: true,
        host: "0.0.0.0",
        port: 3000,
        strictPort: true,
        watch: {
          usePolling: RUN_ON_DOCKER === "on" ? true : false,
        },
        // HMR config
        // hmr: {
        //   host: '0.0.0.0',
        //   port: 24678,
        //   protocol: "ws",
        // }
      },
    })
  ).middlewares;
  app.use(viteDevMiddleware);

  // Custom middlewares from vite
  // const middlewaresToUse = [
  //   'viteHMRPingMiddleware',
  //   'viteTransformMiddleware',
  //   'viteServeStaticMiddleware',
  //   'viteHtmlFallbackMiddleware',
  //   'viteIndexHtmlMiddleware',
  //   'viteErrorMiddleware'
  // ];

  // for (let i = 0; i < viteDevMiddleware.stack.length; i++) {
  //   const middleware = viteDevMiddleware.stack[i];//@ts-ignore
  //   if (middlewaresToUse.includes(middleware.handle.name)) {//@ts-ignore
  //     app.use(middleware.handle);//@ts-ignore
  //     console.log(`Using middleware: ${middleware.handle.name}`);
  //   }
  // }
  // app.use(express.static(path.join(__dirname, "../../dist")));
}

// ----------------- Routes ----------------- //
// resolve from root
const staticPath = "../../dist";
app.get("/", (_req, res) => {
  res.sendFile(resolve(path.join(__dirname, `${staticPath}/index.html`)));
});
app.get("/*", (_req, res) => {
  res.sendFile(resolve(path.join(__dirname, `${staticPath}/index.html`)));
});
// add more for MPA
// app.get("/app*", (_req, res) => {
//   res.sendFile(resolve(path.join(__dirname, `${staticPath}/app.html`)));
// });

// ----------------- Block bots ----------------- //
app.get("/robots.txt", (_req, res) => {
  res.sendFile(resolve(path.join(__dirname, `../../src/robots.txt`)));
});

// ----------------- Not Found ----------------- //
// uncomment for MPA
// app.get('*', (_req, res) => {
//   res.status(404).sendFile(resolve(path.join(__dirname, `${staticPath}/404.html`)));
// });

// ----------------- Error Logger ----------------- //
app.use(
  expressWinston.errorLogger({
    winstonInstance: errLogger,
  })
);

// ----------------- Server ----------------- //
app.listen(port, () => {
  logger.debug(`Server => http://localhost:${port}`);
});
