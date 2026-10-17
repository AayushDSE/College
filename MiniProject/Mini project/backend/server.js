const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

const client = new MongoClient("mongodb://127.0.0.1:27017");

const dbName = "eventDB";
let registrationsCollection;

app.get("/", (req, res) => {
    res.send("Event Registration API is running");
});

app.post("/registrations", async (req, res) => {
    const registration = req.body;

    const result = await registrationsCollection.insertOne(registration);

    res.send({
        message: "Registration added successfully",
        id: result.insertedId
    });
});

app.get("/registrations", async (req, res) => {
    const registrations = await registrationsCollection.find().toArray();

    res.send(registrations);
});

app.put("/registrations/:id", async (req, res) => {
    const id = req.params.id;
    const updatedRegistration = req.body;

    const result = await registrationsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedRegistration }
    );

    res.send({
        message: "Registration updated successfully",
        result: result
    });
});

app.delete("/registrations/:id", async (req, res) => {
    const id = req.params.id;

    const result = await registrationsCollection.deleteOne({
        _id: new ObjectId(id)
    });

    res.send({
        message: "Registration deleted successfully",
        result: result
    });
});

async function connectDB() {
    await client.connect();

    const db = client.db(dbName);
    registrationsCollection = db.collection("registrations");

    console.log("MongoDB connected successfully");
    console.log("Database:", dbName);
}

connectDB();

app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});
