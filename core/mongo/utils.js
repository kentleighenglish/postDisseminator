import { MongoClient } from "mongodb";
import debugFunc from "debug";

const debug = debugFunc("db:utils");

export const collections = {
	"users": {
		secondaryIndices: ["username"]
	},
	"posts": {},
	"sessions": {
		secondaryIndices: ["token"]
	}
};

const {
	MONGO_URI,
	MONGO_DATABASE
} = process.env;

export const run = async query => {
	try {
		const client = await MongoClient.connect(MONGO_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			tlsAllowInvalidHostnames: true
		});

		const db = client.db(MONGO_DATABASE);

		const response = await query(db);

		await client.close();

		return response;
	} catch(e) {
		console.error(e);
		return false;
	}
}

export const assertCollection = async (collection, db = MONGO_DATABASE) => {
	const collectionList = await run(db => db.collections());

	if (!map(collectionList, "namespace").includes(`${MONGO_DATABASE}.${collection}`)) {
		await run(db => db.createCollection(collection));
		debug(`Collection Created: ${collection}`);
	}
	const { secondaryIndices = [] } = collections[collection] || {};
	await Promise.all(secondaryIndices.map(async (index) => {
		try {
			if (typeof index === "string") {
				await run(db => db.collection(collection).createIndex({[index]: 1}));
			}
		} catch (e) {
			console.error(`Failed creating index on ${collection} with field ${index}. `, e);
		}
	}));
};

export const assertAllCollections = async (db = MONGO_DATABASE) => {
	await Promise.all(Object.keys(entryRelations).map(async key => await assertCollection(key, db)))
}
