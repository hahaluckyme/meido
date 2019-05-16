const fs = require('fs').promises;
const deepmerge = require('deepmerge');

async function load(path, defaultValue) {
  return await fs.readFile(`data/${path}`, 'utf8')
    .then(data => JSON.parse(data))
    .catch(err => defaultValue);
}

async function dump(path, json) {
  await fs.writeFile(`data/${path}`, JSON.stringify(json, null, 2));
}

// loads from an array with reverse timestamp
async function loadTimestamp(path) {
  const arr = (await load(path, []))
    .sort((a, b) => a.timestamp - b.timestamp);
  return arr;
}

// id-based array sorted by time desc using .id and .timestamp
async function dumpIdTimestamp(path, delta_arr) {
  const old_arr = await load(path, []);

  const id_map = {};
  for (const elem of old_arr) {
    id_map[elem.id] = elem;
  }

  for (const elem of delta_arr) {
    id_map[elem.id] = deepmerge(id_map[elem.id], elem);
  }

  const new_arr = Object.values(id_map)
    .sort((a, b) => b.timestamp - a.timestamp);
  dump(path, new_arr);
  return new_arr;
}

async function loadTrigger(path) {
  return await load(path, {});
}

async function dumpTrigger(path, delta_map) {
  const old_map = await load(path, {});
  const new_map = deepmerge(old_map, delta_map);
  dump(path, new_map);
  return new_map;
}

async function merge(path, delta_json, sortByFunc) {
  const old_json = await load(path);
  const new_json = deepmerge(old_json, delta_json);

  if (sortByFunc !== undefined && Array.isArray(new_json)) {
    new_json.sort((a, b) => sortByFunc(a) - sortByFunc(b));
  }

  dump(path, new_json);
  return new_json;
}

module.exports = {
  dump,
  load,
  loadTimestamp,
  dumpIdTimestamp,
  loadTrigger,
  dumpTrigger,
  merge,
};
