import "dotenv/config";
import express from "express";
//import * as btusdktils from "../utils/bt-sdk-utils.js";
import * as btgraphql from "../utils/bt-graphql.js";

const app = express();
app.set("view engine", "ejs");

const BTGQLVIEWSDIR = "btgqlviews/";

const router = express.Router();

/*
router.post("/btauthorizationfingerprint", async (req, res) => {
    try {
        btusdktils.gateway.clientToken.generate(req.body, (err, response) => {
            let bufferObj = Buffer.from(response.clientToken, "base64");
            let decodedString = bufferObj.toString("utf8");
            let decodedJsonObj = JSON.parse(decodedString);
            let authorizationFingerprint = decodedJsonObj.authorizationFingerprint;
            res.send(authorizationFingerprint);
        });
    }
    catch (err) {
        res.status(500).send(err.message);
    }
});
*/

router.get("/ping", async (req, res) => {
    res.json(await btgraphql.ping());

});

router.post("/btclienttoken", async (req, res) => {
    const requestBody = req.body;
    console.log(requestBody);
    const response = await btgraphql.clientToken(requestBody);
    res.send(response.data.createClientToken.clientToken);
});

router.get("/dropincardsonly", async (req, res) => {
    try {
        res.render(BTGQLVIEWSDIR + "dropincardsonly");
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.post("/dropincardsonlycheckout", async (req, res) => {
    try {
        console.log(req.body);
        const requestBody = req.body;
        await btgraphql.createTransactionSale(requestBody, res);
        //res.json(response);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.get("/dropincardsandppec", async (req, res) => {
    try {
        res.render(BTGQLVIEWSDIR + "dropincardsandppec");
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.post("/dropincardsandppeccheckout", async (req, res) => {
    try {
        console.log(req.body);
        const requestBody = req.body;
        await btgraphql.createTransactionSale(requestBody, res);
        //res.json(response);
    } catch (err) {
        res.status(500).send(err.message);
    }
});


router.get("/dropinvaultpayment", async (req, res) => {
    try {
        res.render(BTGQLVIEWSDIR + "dropinvaultpayment");
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.post("/dropinvaultpaymentcheckout", async (req, res) => {
    try {
        console.log(req.body);
        const requestBody = req.body;
        await btgraphql.createTransactionSale(requestBody, res);
        //res.json(response);
    } catch (err) {
        res.status(500).send(err.message);
    }
});


router.get("/dropinvaultedcustomer", async (req, res) => {
    try {
        res.render(BTGQLVIEWSDIR + "dropinvaultedcustomer");
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.post("/dropinvaultedcustomercheckout", async (req, res) => {
    try {
        console.log(req.body);
        const requestBody = req.body;
        await btgraphql.createTransactionSale(requestBody, res);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.get("/hostedfieldscards", async (req, res) => {
    try {
        res.render(BTGQLVIEWSDIR + "hostedfieldscards");
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.post("/hostedfieldscardscheckout", async (req, res) => {
    try {
        console.log(req.body);
        const requestBody = req.body;
        await btgraphql.createTransactionSale(requestBody, res);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.get("/paypaljssdkmerchantload", async (req, res) => {
    try {
        res.render(BTGQLVIEWSDIR + "paypaljssdkmerchantload");
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.post("/paypaljssdkmerchantloadcheckout", async (req, res) => {
    try {
        console.log(req.body);
        const requestBody = req.body;
        await btgraphql.createTransactionSale(requestBody, res);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.get("/paypaljssdkbtloadecs", async (req, res) => {
    try {
        res.render(BTGQLVIEWSDIR + "paypaljssdkbtloadecs");
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.post("/paypaljssdkbtloadecscheckout", async (req, res) => {
    try {
        console.log(req.body);
        const requestBody = req.body;
        await btgraphql.createTransactionSale(requestBody, res);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.get("/paypaljssdkbtloadecm", async (req, res) => {
    try {
        res.render(BTGQLVIEWSDIR + "paypaljssdkbtloadecm");
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.post("/paypaljssdkbtloadecmcheckout", async (req, res) => {
    try {
        console.log(req.body);
        const requestBody = req.body;
        await btgraphql.createTransactionSale(requestBody, res);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

export default router;

