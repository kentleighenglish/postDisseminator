import r from "rethinkdb";
import debugFunc from "debug";

const debug = debugFunc("db:utils");

export const tables = {
	"users": {
		secondaryIndices: ["username"]
	},
	"posts": {},
	"sessions": {
		secondaryIndices: ["token"]
	}
};

const {
	RETHINK_HOST,
	RETHINK_DATABASE,
	RETHINK_PORT,
	RETHINK_USERNAME,
	RETHINK_PASSWORD
} = process.env;

const run = async query => {
	await checkAsserts();

	try {
		const conn = await r.connect({
			host: RETHINK_HOST,
			port: RETHINK_PORT,
			user: RETHINK_USERNAME,
			password: RETHINK_PASSWORD
		});

		return query.run(conn);
	} catch(e) {
		console.error(e);
		return false;
	}
}

const checkAsserts = async () => {
	await assertDb();

	await Promise.all(Object.keys(tables).map(async table => {
		await assertTable(table);
	}));
}

const assertTable = async (table, db = RETHINK_DATABASE) => {
	const conn = await r.connect({
		host: RETHINK_HOST,
		port: RETHINK_PORT,
		user: RETHINK_USERNAME,
		password: RETHINK_PASSWORD
	});

	const tableList = await r.db(db).tableList().run(conn);

	if(!tableList.includes(table)) {
		const { secondaryIndices = [], ...config } = tables[table] || {};

		await r.db(db).tableCreate(table, config).run(conn);

		await Promise.all(secondaryIndices.map(async (index) => {
			if (typeof index === "string") {
				await r.db(db).table(table).indexCreate(index).run(conn);
			}
		}));

		debug(`Table Created: ${table}`);
	}
};

const assertDb = async (db = RETHINK_DATABASE) => {
	const conn = await r.connect({
		host: RETHINK_HOST,
		port: RETHINK_PORT,
		user: RETHINK_USERNAME,
		password: RETHINK_PASSWORD
	});

	const dbList = await r.dbList().run(conn);

	if (!dbList.includes(db)) {
		await r.dbCreate(db).run(conn);
		debug(`DB Created: ${db}`);
	}
};

export const db = {
	...r,
	run,
	mainDb: () => r.db(RETHINK_DATABASE),
	assertTable,
	assertDb,
	tables
}
