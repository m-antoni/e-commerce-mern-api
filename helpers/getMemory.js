const os = require("os");

function formatMemory(bytes) {
  const mb = bytes / 1024 / 1024;
  const gb = mb / 1024;

  if (gb >= 1) return `${gb.toFixed(1)} GB`;
  return `${mb.toFixed(0)} MB`;
}

function getMemory() {
  const free = formatMemory(os.freemem());
  const total = formatMemory(os.totalmem());
  return { free, total };
}

module.exports = getMemory;
