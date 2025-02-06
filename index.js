const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 3000;
const { MongoClient, ServerApiVersion } = require("mongodb");

const app = express();

app.use(cors());
app.use(express.json());

// gCnG8NsOuY46BkPP
// visa-nav

const uri =
  "mongodb+srv://visa-nav:gCnG8NsOuY46BkPP@cluster0.e3qys.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    // collections
    const usersCollection = client.db("visaNav").collection("users");
    const visasCollection = client.db("visaNav").collection("visas");
    const applicationsCollection = client
      .db("visaNav")
      .collection("applications");

    //--------------->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> users api
    // Get All Users
    app.get("/users", async (req, res) => {
      const users = await usersCollection.find().toArray();
      res.json(users);
    });

    // Register User
    app.post("/register", async (req, res) => {
      const { name, email, photoURL } = req.body;
      const existingUser = await usersCollection.findOne({ email });
      if (existingUser)
        return res.status(400).json({ message: "User already exists" });

      const newUser = { name, email, photoURL, createdAt: new Date() };
      const result = await usersCollection.insertOne(newUser);
      res.json(result);
    });

    // Get User by Email
    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const user = await usersCollection.findOne({ email });
      res.json(user);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
