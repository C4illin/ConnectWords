const express = require("express");
const http = require("node:http");
const socketIO = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketIO(server, { perMessageDeflate: { threshold: 1024 } });

// Store the current session IDs
const sessionIds = [];
const sessionIdCache = {};

app.use(cors());
app.use("/", express.static("public"));

app.get("/host", (req, res) => {
	// generate session id and send to /host/:sessionId
	// sessionID is four numbers as string with leading zeros
	// e.g. 0001, 0002, 0003, etc.
	let sessionId = Math.floor(Math.random() * 10000)
		.toString()
		.padStart(4, "0");
	while (sessionIds.includes(sessionId)) {
		sessionId = Math.floor(Math.random() * 10000)
			.toString()
			.padStart(4, "0");
	}

	sessionIdCache[sessionId] = {};

	// store words, colors, and textColors in cache
	const words = req.query.words;
	const colors = req.query.colors;
	const textColors = req.query.textColors;

	const filteredData = words
		.map((word, index) => {
			return { word, color: colors[index], textColor: textColors[index] };
		})
		.filter((item) => item.word !== "");

	sessionIdCache[sessionId].words = filteredData.map((item) => item.word);
	sessionIdCache[sessionId].colors = filteredData.map((item) => item.color);
	sessionIdCache[sessionId].textColors = filteredData.map(
		(item) => item.textColor,
	);

	sessionIds.push(sessionId);
	res.redirect(`/host/${sessionId}`);
});

// Serve the HTML file and static assets for hosting sessions
app.get("/host/:sessionId", (req, res) => {
	res.sendFile(`${__dirname}/views/host.html`);
});

// app.get("/wordlist.js", (req, res) => {
// 	let source = `const wordList = ${JSON.stringify(sessionIdCache[req.query.sessionId].words)};`

// 	res.setHeader("Content-Type", "application/javascript");
// 	res.send(source);
// });

io.of("/host").on("connection", (socket) => {
	console.log("New client connected to host");

	// Handle new session ID data
	socket.on("sessionId", (sessionId) => {
		// Join the specified session namespace
		socket.join(sessionId);
		console.log(`Host joined session ${sessionId}`);

		// Get the namespace with the same name as the session ID
		const sessionNamespace = io.of(`/${sessionId}`);

		// allow 500 listeners
		sessionNamespace.setMaxListeners(500);

		// Listen for the 'word' event on the session namespace
		sessionNamespace.on("word", (data) => {
			console.log(data);

			// Emit the 'word' event with the data to the host namespace
			io.of("/host").emit("word", data);
		});

		if (!(sessionId in sessionIds)) {
			sessionIds.push(sessionId);
		}

		// send cached data to host
		if (sessionId in sessionIdCache) {
			console.log("Sending cached data to host");
			socket.emit("cachedData", {
				cache: sessionIdCache[sessionId].connections,
				words: sessionIdCache[sessionId].words,
				colors: sessionIdCache[sessionId].colors,
				textColors: sessionIdCache[sessionId].textColors,
			});

			// console.log("Sending word data to host");
			// socket.emit("words", );
		}

		// Delete cached data after 24 hours
		setTimeout(
			() => {
				if (sessionId in sessionIdCache) {
					sessionIdCache[sessionId] = {};
				}

				if (sessionIds.includes(sessionId)) {
					sessionIds.splice(sessionIds.indexOf(sessionId), 1);
				}
			},
			24 * 60 * 60 * 1000,
		);
	});

	// Handle socket disconnections
	socket.on("disconnect", () => {
		console.log("Client disconnected from host");
	});
});

app.get("/words/:sessionId.json", (req, res) => {
	const { sessionId } = req.params;

	if (sessionId in sessionIdCache) {
		res.json({ words: sessionIdCache[sessionId].words });
	} else {
		res.json({ words: [] });
	}
});

app.get("/join", (req, res) => {
	// get sessionId = req.query.sessionId
	// if sessionId is in sessionIds, redirect to /join/:sessionId
	// else show message that session does not exist
	const { sessionId } = req.query;
	if (sessionIds.includes(sessionId)) {
		res.redirect(`/join/${sessionId}`);
	} else {
		res.send("Session does not exist");
	}
});

// Serve the HTML file and static assets for joining sessions
app.get("/join/:sessionId", (req, res) => {
	const { sessionId } = req.params;

	if (!sessionIds.includes(sessionId)) {
		res.send("Session does not exist");
		return;
	}

	res.sendFile(`${__dirname}/views/join.html`);
});

// Handle new socket connections for joining sessions
io.of("/join").on("connection", (socket) => {
	console.log("New client connected to join");

	socket.on("word", (data) => {
		console.log(data);

		// cache data
		if (!(data.sessionId in sessionIdCache)) {
			sessionIdCache[data.sessionId] = {};
			sessionIdCache[data.sessionId].connections = [];
		} else if (!("connections" in sessionIdCache[data.sessionId])) {
			sessionIdCache[data.sessionId].connections = [];
		}

		sessionIdCache[data.sessionId].connections.push(data);

		// emit word data to host namespace
		io.of(`/${data.sessionId}`).emit("word", data);
	});

	// Handle new session ID data
	socket.on("sessionId", (sessionId) => {
		// Join the specified session namespace
		socket.join(sessionId);
		console.log(`Client joined session ${sessionId}`);
	});

	// Handle socket disconnections
	socket.on("disconnect", () => {
		console.log("Client disconnected from join");
	});
});

// Start the server
const port = process.env.PORT || 3000;
server.listen(port, () => {
	console.log(`Server listening available on http://127.0.0.1:${port}`);
});
