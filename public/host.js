const socket = io("/host");

// Get the session ID from the URL
const sessionId = window.location.pathname.split('/')[2];

// // Send the session ID to the server
socket.emit('sessionId', sessionId);

const sessionSocket = io("/" + sessionId);

document.getElementById('session-id').innerText = sessionId

// Generate the QR code for mobile users to join the session
const qrCode = new QRCode(document.getElementById('qr-code'), {
  text: window.location.href.replace('host', 'join'),
  width: 256,
  height: 256,
  colorDark: '#ffffff',
  colorLight: '#000000',
  correctLevel: QRCode.CorrectLevel.H
});

var graph = {
  nodes: [
    { "name": "ÆØK", "width": 120, "height": 40, "color": "#54ce59", "fontColor": "#FFFFFF" },
    { "name": "AØK", "width": 120, "height": 40, "color": "#cc0000", "fontColor": "#FFFFFF" },
    { "name": "bØf", "width": 120, "height": 40, "color": "#3D7620", "fontColor": "#000000" },
    { "name": "DNollK", "width": 120, "height": 40, "color": "#FA9907", "fontColor": "#FFFFFF" },
    { "name": "EØK", "width": 120, "height": 40, "color": "#ffff00", "fontColor": "#000000" },
    { "name": "FnollK", "width": 120, "height": 40, "color": "#222222", "fontColor": "#FFFFFF" },
    { "name": "GØS", "width": 120, "height": 40, "color": "#efc26a", "fontColor": "#06516b" },
    { "name": "HØK", "width": 120, "height": 40, "color": "#eb79ab", "fontColor": "#FFFFFF" },
    { "name": "INollK", "width": 120, "height": 40, "color": "#9F36A1", "fontColor": "#FFFFFF" },
    { "name": "KØK", "width": 120, "height": 40, "color": "#5c9143", "fontColor": "#FFFFFF" },
    { "name": "MK", "width": 120, "height": 40, "color": "#034069", "fontColor": "#FFFFFF" },
    { "name": "MnollK", "width": 120, "height": 40, "color": "#795548", "fontColor": "#FFFFFF" },
    { "name": "NollKIT", "width": 120, "height": 40, "color": "#09cdda", "fontColor": "#FFFFFF" },
    { "name": "SJØK", "width": 120, "height": 40, "color": "#1F2163", "fontColor": "#FFFFFF" },
    { "name": "TBK", "width": 120, "height": 40, "color": "#FFFFFF", "fontColor": "#000000" },
    { "name": "TDnollK", "width": 120, "height": 40, "color": "#8f1c43", "fontColor": "#FFFFFF" },
    { "name": "VØK", "width": 120, "height": 40, "color": "#3d85c6", "fontColor": "#FFFFFF" },
    { "name": "ZØK", "width": 120, "height": 40, "color": "#6E6E6E", "fontColor": "#FFFFFF" }
  ],
  links: [
  ]
};

var width = window.innerWidth,
  height = window.innerHeight;

// var cola = cola.d3adaptor(d3)
//   .linkDistance(140)
//   .size([width, height]);

const simulation = cola.d3adaptor(d3)
  .size([width, height])
  .nodes(graph.nodes)
  .links(graph.links)
  .avoidOverlaps(true)
  .linkDistance(140)
  .start(200, 200, 200);

// .force("charge", d3.forceManyBody(-1000))
// .force("link", d3.forceLink().links(graph.links).distance(140))
// .force("center", d3.forceCenter(width / 2, height / 2))
// // .force("collide", d3.forceCollide().radius(60))
// // .force("x", d3.forceX(width / 2))
// // .force("y", d3.forceY(height / 2))
// .on("tick", ticked);

var outer = d3.select("#wrapper").append("svg")
  .attr("width", width)
  .attr("height", height);

var svg = outer.append("g")

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

const node = svg.selectAll("rect")
  .data(graph.nodes)
  .enter().append("rect")
  .attr("width", function (d) { return d.width; })
  .attr("height", function (d) { return d.height; })
  .attr("rx", 5).attr("ry", 5)
  .style("fill", function (d) { return d.color; })
  .attr("class", "node");

var label = svg.selectAll("text")
  .data(graph.nodes)
  .enter().append("text")
  .text(function (d) { return d.name; })
  .style("fill", function (d) { return d.fontColor; })
  .attr("class", "label");

simulation.on("tick", function () {
  node.transition().duration(1000)
    .attr('x', function (d) { return d.x - d.width / 2; })
    .attr('y', function (d) { return d.y - d.height / 2; });

  svg.selectAll("path")
    .data(graph.links)
    .join('path')
    .attr('stroke-width', function (d) { return d.value == 1 ? "1.5px" : "2.5px"; })
    .attr('stroke', function (d) { return d.value == 1 ? "#74c0fc" : "#ffa8a8"; })
    .attr('fill', 'none')
    .attr("class", "link")
    .lower().transition().duration(1000)
    .attr("d", function (d) {
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
        x1 = d.source.x + 40 + d.offset * 5;
        y1 = d.source.y;
        x2 = d.target.x - 40 - d.offset * 5;
        y2 = d.target.y;
        drx = 20;
        dry = 20;
      } else {
        x1 += d.offset * 7;
        y1 += d.offset * 7;
        x2 += d.offset * 7;
        y2 += d.offset * 7;
      }

      return "M" + x1 + "," + y1 + "A" + drx + "," + dry + " " + xRotation + "," + largeArc + "," + sweep + " " + x2 + "," + y2;
    });
  // .attr('x1', function (d) { return d.source.x + d.offset * 5; })
  // .attr('y1', function (d) { return d.source.y + d.offset * 5; })
  // .attr('x2', function (d) { return d.target.x + d.offset * 5; })
  // .attr('y2', function (d) { return d.target.y + d.offset * 5; })

  label.transition().duration(1000)
    .attr('x', function (d) { return d.x; })
    .attr('y', function (d) { return d.y + d.height / 4; })
});

var addTestConnection = (word1 = Math.floor(Math.random() * graph.nodes.length), word2 = Math.floor(Math.random() * graph.nodes.length)) => {
  var data = {
    word1: graph.nodes[word1].name,
    word2: graph.nodes[word2].name,
  };

  var offset = 0;
  var linkIndex = -1;
  for (var i = graph.links.length - 1; i >= 0; i--) {
    var link = graph.links[i];
    if ((link.source.name == data.word1 && link.target.name == data.word2) || (link.source.name == data.word2 && link.target.name == data.word1)) {
      linkIndex = i;

      if (link.offset > 0) {
        offset = link.offset * -1;
      } else {
        offset = link.offset * -1 + 1;
      }

      break;
    }
  }

  graph.links.push({ source: word1, target: word2, value: Math.floor(Math.random() * 2) + 1, offset: offset });
  updateFacts();
  simulation.links(graph.links);
  simulation.start(200, 200, 200);
}

var nameToIndex = (name) => {
  for (var i = 0; i < graph.nodes.length; i++) {
    if (graph.nodes[i].name === name) {
      return i;
    }
  }
  return -1;
}

var updateFacts = () => {
  var facts = document.getElementById('facts');
  // add facts like: total connections. most connections number

  // calculate most number of duplicates ignoring offset field
  strongestConnection = graph.links.reduce((a, b) => a.offset > b.offset ? a : b).offset*2
  if (strongestConnection <= 0) {
    strongestConnection = Math.abs(strongestConnection) + 1
  }

  facts.innerHTML = `Total connections:\n<b>${graph.links.length}</b>
  <br>Strongest connection:\n<b>${strongestConnection}</b>
  `;
}

sessionSocket.on('word', (data) => {
  console.log(data);
  var word1 = nameToIndex(data.word1);
  var word2 = nameToIndex(data.word2);

  if (word1 === -1 || word2 === -1) {
    return;
  }

  var offset = 0;
  // var linkIndex = -1;
  for (var i = graph.links.length - 1; i >= 0; i--) {
    var link = graph.links[i];
    if ((link.source.name == data.word1 && link.target.name == data.word2) || (link.source.name == data.word2 && link.target.name == data.word1)) {
      // linkIndex = i;

      if (link.offset > 0) {
        offset = link.offset * -1;
      } else {
        offset = link.offset * -1 + 1;
      }

      break;
    }
  }

  // if (linkIndex === -1) {
  // console.log('new link');
  graph.links.push({ source: word1, target: word2, value: data.strength, offset: offset });
  // } else {
  //   console.log('existing link');
  //   graph.links[linkIndex].value += data.strength;
  // }
  updateFacts();
  simulation.links(graph.links);
  simulation.start(200, 200, 200);
});