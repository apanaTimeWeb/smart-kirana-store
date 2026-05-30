const fs = require('fs');
const path = require('path');

const baseDir = path.resolve('c:/Users/satya/Desktop/PojectsToWork/smart-kirana-store/kirana-next/app/(app)/stock/stock_components');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    if(fs.statSync(dirPath).isDirectory()) walkDir(dirPath, callback);
    else callback(dirPath);
  });
}

walkDir(baseDir, (filePath) => {
  if (!filePath.endsWith('.tsx')) return;
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (content.includes('"use client"') || content.includes("'use client'")) return;

  const regex = /\b(useState|useEffect|useContext|useMemo|useCallback|useRef|useReducer|useStock|onClick|onChange|onSubmit|onKeyDown)\b/;
  if (regex.test(content)) {
    fs.writeFileSync(filePath, '"use client";\n\n' + content);
    console.log(`Added "use client" to ${filePath}`);
  }
});
