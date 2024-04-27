const socket = io("/host");

// Get the session ID from the URL
const sessionId = window.location.pathname.split("/")[2];

// Send the session ID to the server
socket.emit("sessionId", sessionId);

const sessionSocket = io(`/${sessionId}`);

document.getElementById("session-id").innerText = sessionId;

// Generate the QR code for mobile users to join the session
const qrCode = new QRCode(document.getElementById("qr-code"), {
	text: window.location.href.replace("host", "join"),
	width: 256,
	height: 256,
	colorDark: "#ffffff",
	colorLight: "#000000",
	correctLevel: QRCode.CorrectLevel.H,
});

const graph = {
	nodes: [],
	links: [],
};

const nodeHeight = 30;
const nodeWidth = 80;

const drawGraph = () => {
	const width = window.innerWidth;
	const height = window.innerHeight;

	const simulation = cola
		.d3adaptor(d3)
		.size([width, height])
		.nodes(graph.nodes)
		.links(graph.links)
		.avoidOverlaps(true)
		.jaccardLinkLengths(140)
		.start(200, 200, 200);

	// .force("charge", d3.forceManyBody(-1000))
	// .force("link", d3.forceLink().links(graph.links).distance(140))
	// .force("center", d3.forceCenter(width / 2, height / 2))
	// // .force("collide", d3.forceCollide().radius(60))
	// // .force("x", d3.forceX(width / 2))
	// // .force("y", d3.forceY(height / 2))
	// .on("tick", ticked);

	const outer = d3
		.select("#wrapper")
		.append("svg")
		.attr("width", width)
		.attr("height", height);

	const svg = outer.append("g");

	// .append("g")
	// let pageBounds = { x: Number(window.innerWidth*0.3), y: 10, width: Number(width), height: Number(height) }
	// let realGraphNodes = graph.nodes.slice(0),
	//   fixedNode = { fixed: true, fixedWeight: 100 },
	//   topLeft = { ...fixedNode, x: 10, y: 10 },
	//   tlIndex = graph.nodes.push(topLeft) - 1,
	//   bottomRight = { ...fixedNode, x: 10 + pageBounds.width, y: 10 + pageBounds.height },
	//   brIndex = graph.nodes.push(bottomRight) - 1,
	//   constraints = [];

	// for (let i = 0; i < realGraphNodes.length; i++) {
	//   constraints.push({ axis: 'x', type: 'separation', left: tlIndex, right: i, gap: 100 });
	//   constraints.push({ axis: 'y', type: 'separation', left: tlIndex, right: i, gap: 100 });
	//   constraints.push({ axis: 'x', type: 'separation', left: i, right: brIndex, gap: 100 });
	//   constraints.push({ axis: 'y', type: 'separation', left: i, right: brIndex, gap: 100 });
	// }
	// .constraints(constraints)

	const node = svg
		.selectAll("rect")
		.data(graph.nodes)
		.enter()
		.append("rect")
		.attr("width", (d) => d.width)
		.attr("height", (d) => d.height)
		.attr("rx", 5)
		.attr("ry", 5)
		.style("fill", (d) => d.color)
		.attr("class", "node");

	const label = svg
		.selectAll("text")
		.data(graph.nodes)
		.enter()
		.append("text")
		.text((d) => d.name)
		.style("fill", (d) => d.fontColor)
		.attr("class", "label");

	simulation.on("tick", () => {
		node
			.transition()
			.duration(1000)
			.attr("x", (d) => d.x - d.width / 2)
			.attr("y", (d) => d.y - d.height / 2);

		svg
			.selectAll("path")
			.data(graph.links)
			.join("path")
			.attr("stroke-width", "2px")
			.attr("stroke", (d) => {
				switch (d.value) {
					case 1:
						return "#3C71F7";
					case 2:
						return "#398712";
					case 3:
						return "#F2DF0D";
					case 4:
						return "#FF9500";
					case 5:
						return "#D93526";
					default:
						return "#3C71F7";
				}
			})
			.attr("fill", "none")
			.attr("class", "link")
			.lower()
			.transition()
			.duration(1000)
			.attr("d", (d) => {
				let x1 = d.source.x;
				let y1 = d.source.y;
				let x2 = d.target.x;
				let y2 = d.target.y;

				// Defaults for normal edge.
				let drx = 0;
				let dry = 0;
				const xRotation = 0; // degrees
				const largeArc = 0; // 1 or 0
				const sweep = 0; // 1 or 0

				// Self edge.
				if (x1 === x2 && y1 === y2) {
					x1 = d.source.x + 20 + d.offset * 3;
					y1 = d.source.y;
					x2 = d.target.x - 20 - d.offset * 3;
					y2 = d.target.y;
					drx = 10;
					dry = 10;
				} else {
					x1 += d.offset * 7;
					y1 += d.offset * 7;
					x2 += d.offset * 7;
					y2 += d.offset * 7;
				}

				return `M${x1},${y1}A${drx},${dry} ${xRotation},${largeArc},${sweep} ${x2},${y2}`;
			});
		// .attr('x1', function (d) { return d.source.x + d.offset * 5; })
		// .attr('y1', function (d) { return d.source.y + d.offset * 5; })
		// .attr('x2', function (d) { return d.target.x + d.offset * 5; })
		// .attr('y2', function (d) { return d.target.y + d.offset * 5; })

		label
			.transition()
			.duration(1000)
			.attr("x", (d) => d.x)
			.attr("y", (d) => d.y + d.height / 4);
	});

	const addTestConnection = (
		word1 = Math.floor(Math.random() * graph.nodes.length),
		word2 = Math.floor(Math.random() * graph.nodes.length),
	) => {
		const data = {
			word1: graph.nodes[word1].name,
			word2: graph.nodes[word2].name,
			strength: Math.floor(Math.random() * 2) + 1,
		};
		addData(data);
		updateAll();
	};

	const updateFacts = () => {
		const facts = document.getElementById("facts");
		// add facts like: total connections. most connections number

		// calculate most number of duplicates ignoring offset field
		let strongestConnection = 0;

		if (graph.links.length > 0) {
			strongestConnection =
				graph.links.reduce((a, b) => (a.offset > b.offset ? a : b), {
					offset: 0,
				}).offset * 2;
		}

		if (strongestConnection <= 0) {
			strongestConnection = Math.abs(strongestConnection);
		}

		facts.innerHTML = `Total connections:\n<b>${graph.links.length}</b>
  <br>Strongest connection:\n<b>${strongestConnection}</b>
  `;
	};

	const updateAll = () => {
		updateFacts();
		simulation.links(graph.links);
		simulation.start(200, 200, 200);
	};

	sessionSocket.on("word", (data) => {
		console.log(data);
		addData(data);
		updateAll();
	});
};

const nameToIndex = (name) => {
	for (let i = 0; i < graph.nodes.length; i++) {
		if (graph.nodes[i].name === name) {
			return i;
		}
	}
	return -1;
};

const addData = (data) => {
	const word1 = nameToIndex(data.word1);
	const word2 = nameToIndex(data.word2);

	if (word1 === -1 || word2 === -1) {
		return;
	}

	let offset = 0;
	// let linkIndex = -1;
	for (let i = graph.links.length - 1; i >= 0; i--) {
		const link = graph.links[i];
		if (
			(link.source === word1 && link.target === word2) ||
			(link.source === word2 && link.target === word1) ||
			(link.source.index === word1 && link.target.index === word2) ||
			(link.source.index === word2 && link.target.index === word1)
		) {
			// linkIndex = i;

			if (link.offset > 0) {
				offset = link.offset * -1;
			} else {
				offset = link.offset * -1 + 1;
			}

			break;
		}
	}
	graph.links.push({
		source: word1,
		target: word2,
		value: data.strength,
		offset: offset,
	});

	// if (linkIndex === -1) {
	// console.log('new link');
	// } else {
	//   console.log('existing link');
	//   graph.links[linkIndex].value += data.strength;
	// }
};

// Handle cached data
socket.on("cachedData", (data) => {
	console.log("Received cached data from server");

	const words = data?.words;
	const connections = data?.cache;

	console.log(words);

	for (const word of words) {
		graph.nodes.push({
			name: word,
			width: nodeWidth,
			height: nodeHeight,
			color: "#FFFFFF",
			fontColor: "#000000",
		});
	}

	if (connections) {
		for (const link of connections) {
			addData(link);
		}
	}

	drawGraph();
	console.log("Cached data added to graph");
});
