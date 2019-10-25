var PF = require("pathfinding");

function findPath(from, to, walls, offset) {
  let distanceX = Math.abs(from.x - to.x) + 1 + offset * 2;
  let distanceY = Math.abs(from.y - to.y) + 1 + offset * 2;

  let startX = from.x;
  if (to.x < startX) {
    startX = to.x;
  }

  let startY = from.y;
  if (to.y < startY) {
    startY = to.y;
  }

  var grid = new PF.Grid(distanceX, distanceY);
  for (var i = 0; i < walls.length; i++) {
    try {
    
      grid.setWalkableAt(
        Math.abs(startX - walls[i].x) + offset,
        Math.abs(startY - walls[i].y) + offset,
        false
      );
    } catch {}
  }
  var finder = new PF.AStarFinder();
  var path = finder.findPath(
    Math.abs(startX - from.x) + offset,
    Math.abs(startY - from.y) + offset,
    Math.abs(startX - to.x) + offset,
    Math.abs(startY - to.y) + offset,

    grid
  );
  path.forEach(route => {
    route[0] = route[0] + startX - offset;
    route[1] = route[1] + startY - offset;
  });


  return path;
}

let from = { x: 3, y: 2 };
let to = { x: 1, y: 5 };
let walls = [
  { x: 2, y: 4 },
  { x: 2, y: 5 },
  { x: 2, y: 6 },
  { x: 2, y: 7 },
  { x: 1, y: 3 },
  { x: 1, y: 4 },
  { x: 0, y: 3 }
];
let offset = 5;
-
console.log(findPath(from, to, walls, offset));

// export default findPath;
