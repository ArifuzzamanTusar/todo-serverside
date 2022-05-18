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



const uri = `mongodb+srv://${process.env.DBUSER}:${process.env.DBPASS}@tusar.0dmv3.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


const startServe = async () => {
    try {
        await client.connect();
        const taskCollection = client.db('gpu-point').collection('products');


        // jwt token AUTH---------------------------------Done
        app.post('/login', async (req, res) => {
            const user = req.body;
            const accessToken = jwt.sign(user, process.env.ACCESSTOKEN, { expiresIn: '1d' });
            res.send({ accessToken });
        })



        // add task 
        app.post('/task', async (req, res) => {
            const task = req.body;
            const result = await taskCollection.insertOne(task);
            if (result) {
                res.status(201).send(result);
            } else {
                res.send({ message: "something error happpend" })
            }
        });

        // ----------------

        // Find
        app.get('/task', async (req, res) => {
            const email = req.query.email;
            const filter = { email: email }
            const tasks = await taskCollection.find(filter).toArray();
            res.status(200).send(tasks);
        });

        // ------------ 

        // Update
        app.put('/task/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true };
            const updatedDoc = {
                $set: { completed: true }
            }
            const result = await taskCollection.updateOne(filter, updatedDoc, options);
            res.send(result)
        });

        // -------------

        // Delete
        app.delete('/task/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const result = await taskCollection.deleteOne(filter);

            if (result) {
                res.send(result);
            } else {
                res.send({ message: "something error happpend" })
            }
        });
        // ------------ 



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