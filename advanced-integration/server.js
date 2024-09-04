import "dotenv/config";
import express from "express";
import https from "https";
import fs from "fs";
import { fileURLToPath } from "url";
import * as path from "path";
import btsdkRouter from "./routers/btsdkRouter.js";
import btgqlRouter from "./routers/btgqlRouter.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const { PORT = 443 } = process.env;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.use("/css", express.static(path.join(__dirname, "css")));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/highlight", express.static(path.join(__dirname, "public/highlight")));
app.use("/scripts", express.static(path.join(__dirname, "scripts")));

app.use(
  "/btsdkscripts",
  express.static(path.join(__dirname, "public/btsdkscripts"))
);
app.use(
  "/btgqlscripts",
  express.static(path.join(__dirname, "public/btgqlscripts"))
);

app.get("/", async (req, res) => {
  res.send(
    "<h3>CWEN BT Demo (Braintree JSSDK + Braintree Server SDK) </h3>" +
      "BT sandbox login: </br>" +
      "https://sandbox.braintreegateway.com/login </br>" +
      "username: cwen5 </br>" +
      "password: 1qazXSW2 </br>" +
      "Linked PayPal Account: cwenhkb@business.com </br>" +
      "Password: 1qazXSW2 </br></br>" +
      "<a href='https://localhost/btsdk/dropincardsonly' target='_blank'>DropIn UI Cards Only</a></br>" +
      "<a href='https://localhost/btsdk/dropincardsandppec' target='_blank'>DropIn UI Cards + PPEC</a></br>" +
      "<a href='https://localhost/btsdk/dropincardsppecvenmo' target='_blank'>DropIn UI Cards + PPEC + Venmo</a></br>" +
      "<a href='https://localhost/btsdk/dropinvaultpayment' target='_blank'>DropIn UI Vault Payment Method For Customer</a></br>" +
      "<a href='https://localhost/btsdk/dropinvaultedcustomer' target='_blank'>DropIn UI Vaulted Customer</a></br>" +
      "<a href='https://localhost/btsdk/hostedfieldscards' target='_blank'>Hosted Fields Cards</a></br>" +
      "<a href='https://localhost/btsdk/paypaljssdkmerchantload' target='_blank'>BT + PayPal JSSDK (Merchant Load)</a></br>" +
      "<a href='https://localhost/btsdk/paypaljssdkbtloadecs' target='_blank'>BT + PayPal JSSDK (BT Load) ECS</a></br>" +
      "<a href='https://localhost/btsdk/paypaljssdkbtloadecm' target='_blank'>BT + PayPal JSSDK (BT Load) ECM</a></br>" +
      "<a href='https://localhost/btsdk/btlpm' target='_blank'>BT LPM(APM)</a></br>" +
      "<a href='https://localhost/btsdk/ach' target='_blank'>BT ACH</a></br>" +
      "<HR align=left width=900 color=#987cb9 SIZE=10>" +
      "<h3>CWEN BT Demo (Braintree JSSDK + GraphQL API) </h3>" +
      "<a href='https://localhost/btgql/dropincardsonly' target='_blank'>DropIn UI Cards Only</a></br>" +
      "<a href='https://localhost/btgql/dropincardsandppec' target='_blank'>DropIn UI Cards + PPEC</a></br>" +
      "<a href='https://localhost/btgql/dropinvaultpayment' target='_blank'>DropIn UI Vault Payment Method For Customer</a></br>" +
      "<a href='https://localhost/btgql/dropinvaultedcustomer' target='_blank'>DropIn UI Vaulted Customer</a></br>" +
      "<a href='https://localhost/btgql/hostedfieldscards' target='_blank'>Hosted Fields Cards</a></br>" +
      "<a href='https://localhost/btgql/paypaljssdkmerchantload' target='_blank'>BT + PayPal JSSDK (Merchant Load)</a></br>" +
      "<a href='https://localhost/btgql/paypaljssdkbtloadecs' target='_blank'>BT + PayPal JSSDK (BT Load) ECS</a></br>" +
      "<a href='https://localhost/btgql/paypaljssdkbtloadecm' target='_blank'>BT + PayPal JSSDK (BT Load) ECM</a></br>"
  );
});

app.use("/btsdk", btsdkRouter);
app.use("/btgql", btgqlRouter);

https
  .createServer(
    {
      key: fs.readFileSync("certs/localhost/localhost+3-key.pem"),
      cert: fs.readFileSync("certs/localhost/localhost+3.pem"),
    },
    app
  )
  .listen(PORT, () => {
    console.log("Listening...");
  });
