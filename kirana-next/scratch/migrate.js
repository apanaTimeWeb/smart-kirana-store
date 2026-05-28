const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'app', '(app)', 'khata');
const destDir = path.join(__dirname, '..', 'app', '(app)', 'suppliers');

function copyAndReplace(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (let entry of entries) {
    if (entry.name.endsWith('.md')) continue; // skip md files

    const srcPath = path.join(src, entry.name);
    let newName = entry.name
      .replace(/khata/g, 'suppliers')
      .replace(/Khata/g, 'Supplier')
      .replace(/Customer/g, 'Supplier')
      .replace(/customer/g, 'supplier');
      
    const destPath = path.join(dest, newName);

    if (entry.isDirectory()) {
      copyAndReplace(srcPath, destPath);
    } else {
      let content = fs.readFileSync(srcPath, 'utf8');
      
      // Perform string replacements
      content = content.replace(/customers/g, 'suppliers');
      content = content.replace(/customer/g, 'supplier');
      content = content.replace(/Customers/g, 'Suppliers');
      content = content.replace(/Customer/g, 'Supplier');
      content = content.replace(/khata_components/g, 'suppliers_components');
      content = content.replace(/khata\.css/g, 'suppliers.css');
      content = content.replace(/--khata/g, '--supplier');
      content = content.replace(/Khata/g, 'Supplier');
      // Replace any stray 'khata' where it refers to the path or variable name
      content = content.replace(/khata/g, 'supplier');
      
      // Some API fixes based on what's in lib/api/suppliers.ts
      // storeAddKhataTransaction -> storeAddSupplierTransaction
      
      fs.writeFileSync(destPath, content);
    }
  }
}

copyAndReplace(srcDir, destDir);
console.log('Migration complete');
