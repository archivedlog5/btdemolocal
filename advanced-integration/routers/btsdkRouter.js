import "dotenv/config";
import express from "express";
import * as btusdktils from "../utils/bt-sdk-utils.js";

const app = express();
app.set("view engine", "ejs");

const BTSDKVIEWSDIR = "btsdkviews/";

const router = express.Router();

router.post("/btclienttoken", async (req, res) => {
    try {
        btusdktils.gateway.clientToken.generate(req.body, (err, response) => {
            res.send(response.clientToken);
        });
    }
    catch (err) {
        res.status(500).send(err.message);
    }
});

router.post("/btusclienttoken", async (req, res) => {
    try {
        btusdktils.usGateway.clientToken.generate(req.body, (err, response) => {
            res.send(response.clientToken);
        });
    }
    catch (err) {
        res.status(500).send(err.message);
    }
});

router.get("/dropincardsonly", async (req, res) => {
    try {
        res.render(BTSDKVIEWSDIR + "dropincardsonly");
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.post("/dropincardsonlycheckout", async (req, res) => {
    try {
        console.log(req.body);
        const requestBody = req.body;
        await btusdktils.createTransactionSale(requestBody, res);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.get("/dropincardsandppec", async (req, res) => {
    try {
        res.render(BTSDKVIEWSDIR + "dropincardsandppec");
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.get("/dropincardsppecvenmo", async (req, res) => {
    try {
        res.render(BTSDKVIEWSDIR + "dropincardsppecvenmo");
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.post("/dropincardsandppeccheckout", async (req, res) => {
    try {
        console.log(req.body);
        const requestBody = req.body;
        await btusdktils.createTransactionSale(requestBody, res);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.post("/dropincardsppecvenmocheckout", async (req, res) => {
    try {
        console.log(req.body);
        const requestBody = req.body;
        await btusdktils.createTransactionSale(requestBody, res);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.get("/dropinvaultpayment", async (req, res) => {
    try {
        res.render(BTSDKVIEWSDIR + "dropinvaultpayment");
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.post("/dropinvaultpaymentcheckout", async (req, res) => {
    try {
        console.log(req.body);
        const requestBody = req.body;
        //res.json(req.body);
        await btusdktils.createTransactionSale(requestBody, res);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.get("/dropinvaultedcustomer", async (req, res) => {
    try {
        res.render(BTSDKVIEWSDIR + "dropinvaultedcustomer");
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.post("/dropinvaultedcustomercheckout", async (req, res) => {
    try {
        console.log(req.body);
        const requestBody = req.body;
        await btusdktils.createTransactionSale(requestBody, res);
        //res.json(req.body);

    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.get("/hostedfieldscards", async (req, res) => {
    try {
        res.render(BTSDKVIEWSDIR + "hostedfieldscards");
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.post("/hostedfieldscardscheckout", async (req, res) => {
    try {
        console.log(req.body);
        const requestBody = req.body;
        await btusdktils.createTransactionSale(requestBody, res);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.get("/paypaljssdkmerchantload", async (req, res) => {
    try {
        res.render(BTSDKVIEWSDIR + "paypaljssdkmerchantload");
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.post("/paypaljssdkmerchantloadcheckout", async (req, res) => {
    try {
        console.log(req.body);
        const requestBody = req.body;
        await btusdktils.createTransactionSale(requestBody, res);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.get("/paypaljssdkbtloadecs", async (req, res) => {
    try {
        res.render(BTSDKVIEWSDIR + "paypaljssdkbtloadecs");
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.post("/paypaljssdkbtloadecscheckout", async (req, res) => {
    try {
        console.log(req.body);
        const requestBody = req.body;
        await btusdktils.createTransactionSale(requestBody, res);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.get("/paypaljssdkbtloadecm", async (req, res) => {
    try {
        res.render(BTSDKVIEWSDIR + "paypaljssdkbtloadecm");
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.post("/paypaljssdkbtloadecmcheckout", async (req, res) => {
    try {
        console.log(req.body);
        const requestBody = req.body;
        await btusdktils.createTransactionSale(requestBody, res);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.get("/btlpm", async (req, res) => {
    try {
        res.render(BTSDKVIEWSDIR + "btlpm");
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.post("/btlpmcheckout", async (req, res) => {
    try {
        console.log(req.body);
        const requestBody = req.body;
        await btusdktils.createTransactionSale(requestBody, res);
        //res.json(req.body);

    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.get("/ach", async (req, res) => {
    try {
        res.render(BTSDKVIEWSDIR + "ach");
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.post("/achcheckout", async (req, res) => {
    try {
        console.log(req.body);
        const requestBody = req.body;
        console.log(req.body);
        await btusdktils.createTransactionSale(requestBody, res);
        //res.json(req.body);
        

    } catch (err) {
        res.status(500).send(err.message);
    }
});



export default router;

