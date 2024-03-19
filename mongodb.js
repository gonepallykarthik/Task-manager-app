const { MongoClient, ObjectId } = require("mongodb");
const username = encodeURIComponent("node_app");
const password = encodeURIComponent("karthik31@");
const connectionUrl = `mongodb+srv://${username}:${password}@cluster0.9cosh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(connectionUrl);
const database = "bank";
const collectionName = "accounts";

const db = client.db(database).collection(collectionName);

const connectToDatabase = async () => {
  try {
    await client.connect();
    console.log("successfully connected to database");
  } catch (err) {
    console.log("error connecting to database", err);
  }
};

const sampleAccount = {
  accountHolder: "bro",
  account_type: "checking",
  balance: 157623,
  last_updated: new Date(),
};

const getAccountByName = async (name) => {
  const account = await db.findOne({ accountHolder: name });
  console.log(account);
};

const main = async () => {
  try {
    await connectToDatabase();
    await getAccountByName("bro");
    const updated = await db.updateOne(
      { _id: new ObjectId("65df3b7aa5487b89076fcd29") },
      { $inc:{balance:20} }
    );
    console.log(updated.acknowledged);
  } catch (err) {
    console.log(err);
  } finally {
    await client.close();
  }
};

main()
  .then((data) => console.log(data))
  .catch((err) => console.log(err));
