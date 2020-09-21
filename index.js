const fs = require('fs');

const asks = [];
const bids = [];

for (let index = 0; index < 50000; index++) {
  asks.push({
    size: Math.round(Math.random() * 10000),
    rate: Math.round(Math.random() * 100),
  });

  bids.push({
    size: Math.round(Math.random() * 10000),
    rate: Math.round(Math.random() * 100),
  });
}

const data = {
  asks,
  bids,
};

fs.writeFile('asks_bids.json', JSON.stringify(data), function (err) {
  if (err) {
    return console.log(err);
  }
  console.log('The file was saved!');
});
