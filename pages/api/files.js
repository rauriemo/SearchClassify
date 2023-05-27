import clientPromise from "../../lib/mongodb";


// async function saveFile(file) {
//     try {
//         const database = client.db("SearchClassify");
//         const files = database.collection("files");
//         const result = await files.insertOne(file);
//         console.log(`A document was inserted with the _id: ${result.insertedId}`);
//       } finally {
//         await client.close();
//       }
// };

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("SearchClassify")

  switch (req.method) {
    case "POST":
      console.log(req.body);
      let bodyObject = JSON.parse(req.body);
      let savedFiles = await db.collection("files").insertOne(bodyObject);
      console.log(`document saved: ${savedFiles.acknowledged}`);
      break;
    case "GET":
      const allFiles = await db.collection("files").find({}).toArray();
      res.json({ status: 200, data: allFiles });
      break;
  }
  // try {
      
  //     const files = database.collection("files");
  //     const options = { ordered: true };
  //     const result = await files.insertMany(arrayOfFiles, options);
  //     console.log(`${result.insertedCount} documents were inserted`);
  //   } finally {
  //     await client.close();
  //   }
};
