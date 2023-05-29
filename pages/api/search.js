import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
    const client = await clientPromise;
    const db = client.db("SearchClassify");

    console.log("SERVER - @FILE SEARCH");

    let bodyObject;
    if (typeof req.body === 'string') {
        bodyObject = JSON.parse(req.body)
    } else {
          bodyObject = req.body;
    };

    let searchWords = bodyObject.searchWords;

    console.log("SERVER - SEARCH WORDS: ")
    console.log(searchWords);

    let searchRegex;

    if (Array.isArray(searchWords)) {
        searchRegex = searchWords.map(word => new RegExp(word, 'i'));
    } else if (typeof searchWords === 'string') {
        searchRegex = [new RegExp(searchWords, 'i')];
    } else {
        res.status(400).json({ status: 400, error: 'Invalid searchWords type. Expected a string or an array of strings.' });
        return;
    }

    const files = await db.collection('files').find({ 
        tags: { 
            $in: searchRegex
        } 
    }).toArray();

    res.json({ status: 200, data: files });

};