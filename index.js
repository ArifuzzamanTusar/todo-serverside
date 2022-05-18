const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;

// ---Middleware 
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DBUSER}:${process.env.DBPASS}@gpu-point.o7ldd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


const startServe = async () => {
    try {
        await client.connect();
        const productCollection = client.db('gpu-point').collection('products');


        // jwt token AUTH---------------------------------Done
        app.post('/login', async (req, res) => {
            const user = req.body;
            const accessToken = jwt.sign(user, process.env.ACCESSTOKEN, { expiresIn: '1d' });
            res.send({ accessToken });
        })

        // Get All Products-------------------------- done

        app.get("/all-products", async (req, res) => {
            const cursor = productCollection.find({});
            const products = await cursor.toArray();
            res.status(200).send(products);
        });
        // ------------------------------------------




    }
    finally {

    }

}

startServe().catch(console.dir);


app.get("/", (req, res) => {
    res.json({
        mgs: "hellow Im working",
    })
})


app.listen(port, () => {
    console.log("Running on  " + port);
})