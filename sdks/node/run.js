const NodeClient = require("./node-client");

let ip = process.argv.length > 2 ? process.argv[2] : "127.0.0.1";
let port = process.argv.length > 3 ? process.argv[3] : "8081";

let map;
let resources = [];
let nearest_resource = {};
let walls = [];
let enemy_base = {};
let myUnits = [];
let allUnits = [];

let client = new NodeClient(
  ip,
  port,
  dataUpdates => {
    updateMap(dataUpdates, map);
	myUnits = updateUnits(dataUpdates, myUnits);

	allUnits = dataUpdates.unit_updates;
    console.log(allUnits);
  },
  () => {
    let cmds = generateCommands(myUnits, map);
    // console.log(cmds);
    return cmds;
  }
);

function updateMap(dataUpdates, map) {
  try {
    let tiles = dataUpdates.tile_updates;
    if (tiles !== []) {
      tiles.forEach(tile => {
        updateResources(tile);
        updateWalls(tile);
      });
    }
  } catch (err) {
    console.log(err);
  }
}
function updateWalls(tile) {
  if (tile.blocked === true) {
    checkWalls(tile) === true ? null : walls.push({ x: tile.x, y: tile.y });
    // console.log("Walls:", walls);
  }
}

function updateResources(tile) {
  if (tile.resources !== null && tile.resources !== undefined) {
    checkResources(tile) === true
      ? null
      : resources.push({ x: tile.x, y: tile.y, total: tile.resources.total });
    // console.log("Resources:", resources);
    updateNearestResource();
  }
}

function updateNearestResource() {
  let distance = 1000;
  resources.forEach(resource => {
    let tempDistance = Math.abs(resource.x - resource.y);
    if (tempDistance < distance) {
      distance = tempDistance;
      nearest_resource = resource;
    }
  });
  //   console.log("Nearest Resource:", nearest_resource);
}

function checkWalls(tile) {
  let contains = false;
  walls.forEach(wall => {
    if (wall.x === tile.x && wall.y === tile.y) {
      contains = true;
    }
  });
  return contains;
}

function checkResources(tile) {
  let contains = false;
  resources.forEach(resource => {
    if (resource.x === tile.x && resource.y === tile.y) {
      contains = true;
    }
  });
  return contains;
}

function updateUnits(dataUpdates, units) {
  // Update your units based on data updates
  // Currently this code just maintains an array of your unit's ids
  let ids = units.concat(dataUpdates.unit_updates.map(u => u.id));
  return ids.filter((val, idx) => ids.indexOf(val) === idx);
}

function generateCommands(units, map) {
  // Generate commands here, currently just choosing a random
  // unit and a random direction
  return [
    {
      command: "MOVE",
      dir: ["N", "E", "S", "W"][Math.floor(Math.random() * 4)],
      unit: units[Math.floor(Math.random() * units.length)]
    },
  ];
}
