const socket = io("/host");

// Get the session ID from the URL
const sessionId = window.location.pathname.split("/")[2];

// // Send the session ID to the server
socket.emit("sessionId", sessionId);

const sessionSocket = io("/" + sessionId);

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

var graph = {
	nodes: [
		{
			name: "ÆØK",
			width: 80,
			height: 30,
			color: "#54ce59",
			fontColor: "#FFFFFF",
		},
		{
			name: "AØK",
			width: 80,
			height: 30,
			color: "#cc0000",
			fontColor: "#FFFFFF",
		},
		{
			name: "bØf",
			width: 80,
			height: 30,
			color: "#3D7620",
			fontColor: "#000000",
		},
		{
			name: "DNollK",
			width: 80,
			height: 30,
			color: "#FA9907",
			fontColor: "#FFFFFF",
		},
		{
			name: "EØK",
			width: 80,
			height: 30,
			color: "#ffff00",
			fontColor: "#000000",
		},
		{
			name: "FnollK",
			width: 80,
			height: 30,
			color: "#222222",
			fontColor: "#FFFFFF",
		},
		{
			name: "GØS",
			width: 80,
			height: 30,
			color: "#efc26a",
			fontColor: "#06516b",
		},
		{
			name: "HØK",
			width: 80,
			height: 30,
			color: "#eb79ab",
			fontColor: "#FFFFFF",
		},
		{
			name: "INollK",
			width: 80,
			height: 30,
			color: "#9F36A1",
			fontColor: "#FFFFFF",
		},
		{
			name: "KØK",
			width: 80,
			height: 30,
			color: "#5c9143",
			fontColor: "#FFFFFF",
		},
		{
			name: "MK",
			width: 80,
			height: 30,
			color: "#034069",
			fontColor: "#FFFFFF",
		},
		{
			name: "MnollK",
			width: 80,
			height: 30,
			color: "#795548",
			fontColor: "#FFFFFF",
		},
		{
			name: "NollKIT",
			width: 80,
			height: 30,
			color: "#09cdda",
			fontColor: "#FFFFFF",
		},
		{
			name: "SJØK",
			width: 80,
			height: 30,
			color: "#1F2163",
			fontColor: "#FFFFFF",
		},
		{
			name: "TBK",
			width: 80,
			height: 30,
			color: "#FFFFFF",
			fontColor: "#000000",
		},
		{
			name: "TDnollK",
			width: 80,
			height: 30,
			color: "#8f1c43",
			fontColor: "#FFFFFF",
		},
		{
			name: "VØK",
			width: 80,
			height: 30,
			color: "#3d85c6",
			fontColor: "#FFFFFF",
		},
		{
			name: "ZØK",
			width: 80,
			height: 30,
			color: "#6E6E6E",
			fontColor: "#FFFFFF",
		},
	],
	links: [],
};

var width = window.innerWidth,
	height = window.innerHeight;

// var cola = cola.d3adaptor(d3)
//   .linkDistance(140)
//   .size([width, height]);

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

var outer = d3
	.select("#wrapper")
	.append("svg")
	.attr("width", width)
	.attr("height", height);

var svg = outer.append("g");

// .append("g")
// var pageBounds = { x: Number(window.innerWidth*0.3), y: 10, width: Number(width), height: Number(height) }
// var realGraphNodes = graph.nodes.slice(0),
//   fixedNode = { fixed: true, fixedWeight: 100 },
//   topLeft = { ...fixedNode, x: 10, y: 10 },
//   tlIndex = graph.nodes.push(topLeft) - 1,
//   bottomRight = { ...fixedNode, x: 10 + pageBounds.width, y: 10 + pageBounds.height },
//   brIndex = graph.nodes.push(bottomRight) - 1,
//   constraints = [];

// for (var i = 0; i < realGraphNodes.length; i++) {
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

var label = svg
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
		.attr("stroke-width", (d) => (d.value == 1 ? "1.5px" : "2.5px"))
		.attr("stroke", (d) => (d.value == 1 ? "#74c0fc" : "#ffa8a8"))
		.attr("fill", "none")
		.attr("class", "link")
		.lower()
		.transition()
		.duration(1000)
		.attr("d", (d) => {
			var x1 = d.source.x;
			var y1 = d.source.y;
			var x2 = d.target.x;
			var y2 = d.target.y;

			// Defaults for normal edge.
			var drx = 0;
			var dry = 0;
			var xRotation = 0; // degrees
			var largeArc = 0; // 1 or 0
			var sweep = 0; // 1 or 0

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

			return (
				"M" +
				x1 +
				"," +
				y1 +
				"A" +
				drx +
				"," +
				dry +
				" " +
				xRotation +
				"," +
				largeArc +
				"," +
				sweep +
				" " +
				x2 +
				"," +
				y2
			);
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

var addTestConnection = (
	word1 = Math.floor(Math.random() * graph.nodes.length),
	word2 = Math.floor(Math.random() * graph.nodes.length),
) => {
	var data = {
		sessionId: sessionId,
		word1: graph.nodes[word1].name,
		word2: graph.nodes[word2].name,
		strength: Math.floor(Math.random() * 2) + 1,
	};
	addData(data);
	updateAll();
};

var nameToIndex = (name) => {
	for (var i = 0; i < graph.nodes.length; i++) {
		if (graph.nodes[i].name === name) {
			return i;
		}
	}
	return -1;
};

var updateFacts = () => {
	var facts = document.getElementById("facts");
	// add facts like: total connections. most connections number

	// calculate most number of duplicates ignoring offset field
	strongestConnection =
		graph.links.reduce((a, b) => (a.offset > b.offset ? a : b)).offset * 2;
	if (strongestConnection <= 0) {
		strongestConnection = Math.abs(strongestConnection) + 1;
	}

	facts.innerHTML = `Total connections:\n<b>${graph.links.length}</b>
  <br>Strongest connection:\n<b>${strongestConnection}</b>
  `;
};

var updateAll = () => {
	updateFacts();
	simulation.links(graph.links);
	simulation.start(200, 200, 200);
};

var addData = (data) => {
	var word1 = nameToIndex(data.word1);
	var word2 = nameToIndex(data.word2);

	if (word1 === -1 || word2 === -1) {
		return;
	}

	var offset = 0;
	// var linkIndex = -1;
	for (var i = graph.links.length - 1; i >= 0; i--) {
		var link = graph.links[i];
		if (
			(link.source == word1 && link.target == word2) ||
			(link.source == word2 && link.target == word1) ||
			(link.source.index == word1 && link.target.index == word2) ||
			(link.source.index == word2 && link.target.index == word1)
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

sessionSocket.on("word", (data) => {
	console.log(data);
	addData(data);
	updateAll();
});

// Handle cached data
socket.on("cachedData", (data) => {
	console.log("Received cached data from server");
	console.log(data);

	for (link of data) {
		addData(link);
	}

	updateAll();
	console.log("Cached data added to graph");
});
