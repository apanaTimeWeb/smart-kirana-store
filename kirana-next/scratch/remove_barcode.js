const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '..', 'lib', 'data.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

if (data.productMasters) {
  data.productMasters.forEach(pm => {
    delete pm.barcode;
  });
}

if (data.products) {
  data.products.forEach(p => {
    delete p.barcode;
  });
}

fs.writeFileSync(dataPath, JSON.stringify(data, null, 4));
console.log('Removed barcode from data.json');
