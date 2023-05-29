import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("SearchClassify")

  console.log("SERVER - @FILE SAVE");

  switch (req.method) {
    case "POST":
      let bodyObject = JSON.parse(req.body);
      let savedFile = await db.collection("files").insertOne(bodyObject);
      console.log(`SERVER - document saved: ${savedFile.acknowledged}`);
      console.log(`SERVER - INSERTED ID: ${savedFile.insertedId}`);
      res.status(200).json({ insertedId: savedFile.insertedId });
      break;
    case "GET":
      const allFiles = await db.collection("files").find({}).toArray();
      res.json({ status: 200, data: allFiles });
      break;
  }
};

// try {
  //     const files = database.collection("files");
  //     const options = { ordered: true };
  //     const result = await files.insertMany(arrayOfFiles, options);
  //     console.log(`${result.insertedCount} documents were inserted`);
  //   } finally {
  //     await client.close();
  //   }
