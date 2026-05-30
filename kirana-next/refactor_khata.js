const fs = require('fs');
const path = require('path');

const basePath = path.join(process.cwd(), 'app', '(app)', 'khata');
const oldDir = path.join(basePath, 'khata_components');

const fileMap = {
  'KhataCustomerListContainer.tsx': 'components/CustomerList',
  'KhataCustomerListHeader.tsx': 'components/CustomerList',
  'KhataCustomerListItem.tsx': 'components/CustomerList',
  'KhataCustomerListSkeleton.tsx': 'components/CustomerList',
  'KhataCustomerListEmptyState.tsx': 'components/CustomerList',
  'KhataLedgerDialog.tsx': 'components/Ledger',
  'KhataLedgerContainer.tsx': 'components/Ledger',
  'KhataLedgerHeader.tsx': 'components/Ledger',
  'KhataLedgerActions.tsx': 'components/Ledger',
  'KhataLedgerSearch.tsx': 'components/Ledger',
  'KhataLedgerTable.tsx': 'components/Ledger',
  'KhataLedgerTableRow.tsx': 'components/Ledger',
  'KhataLedgerTransactionItemsList.tsx': 'components/Ledger',
  'KhataAddCustomerDialog.tsx': 'components/Forms',
  'KhataTransactionForm.tsx': 'components/Forms',
  'KhataReminderDialog.tsx': 'components/Forms',
  'KhataContext.tsx': 'context',
  'KhataTypes.ts': 'types',
  'KhataConstants.ts': 'constants',
  'KhataPrintUtils.ts': 'utils'
};

// 1. Create directories
const dirs = new Set(Object.values(fileMap));
for (const dir of dirs) {
  const fullPath = path.join(basePath, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
}

// 2. Move files
for (const [file, dir] of Object.entries(fileMap)) {
  const oldPath = path.join(oldDir, file);
  const newPath = path.join(basePath, dir, file);
  if (fs.existsSync(oldPath)) {
    fs.renameSync(oldPath, newPath);
  }
}

// 3. Update imports in all files in basePath
function updateImports(filePath) {
  if (fs.statSync(filePath).isDirectory()) {
    const files = fs.readdirSync(filePath);
    for (const file of files) {
      updateImports(path.join(filePath, file));
    }
  } else if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // We only need to replace relative imports to khata_components files.
    // e.g., from "./KhataConstants" or from "../KhataConstants"
    
    // Create a mapping of file name (without extension) to its new absolute-ish path
    const importMap = {};
    for (const [file, dir] of Object.entries(fileMap)) {
      const name = file.replace(/\.tsx?$/, '');
      importMap[name] = `@/app/(app)/khata/${dir}/${name}`;
    }

    // Replace relative imports to files in fileMap
    // Pattern: from "./KhataSomething" or from "../KhataSomething" or from "../../khata_components/KhataSomething"
    // Also consider dynamic imports or just simple strings
    const importRegex = /(from\s+['"]|import\s+['"])([^'"]+)['"]/g;
    
    content = content.replace(importRegex, (match, prefix, importPath) => {
      // Extract the filename being imported
      const parts = importPath.split('/');
      const importedFile = parts[parts.length - 1];
      
      // If the imported file is one of our components/files
      if (importMap[importedFile]) {
        modified = true;
        return `${prefix}${importMap[importedFile]}"`;
      }
      return match;
    });

    // We also need to add "use client"; to UI components
    // If it imports React hooks or uses onClick, etc. 
    // Wait, the prompt says: "Next.js App Router uses Server Components by default, so you MUST explicitly include "use client"; at the top of any file that uses hooks...".
    // Most components in `khata_components` were likely client components but since they were imported into page.tsx under a context, maybe they relied on the context boundary. But now they are separated.
    // Let's just blindly add it to all .tsx files that have hooks or events, or we can just add it to files if they don't have it and they contain "useContext" or "useState" or "useKhata".
    
    if (filePath.endsWith('.tsx') || filePath.endsWith('KhataContext.tsx')) {
      const hookPatterns = ['useKhata', 'useState', 'useEffect', 'useContext', 'useMemo', 'useCallback', 'onClick', 'onSubmit', 'onChange', 'createContext'];
      const needsUseClient = hookPatterns.some(p => content.includes(p));
      if (needsUseClient && !content.includes('"use client"')) {
        content = '"use client";\n' + content;
        modified = true;
      }
    }

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated imports in ${filePath}`);
    }
  }
}

updateImports(basePath);

// Delete old directory if empty
if (fs.existsSync(oldDir) && fs.readdirSync(oldDir).length === 0) {
  fs.rmdirSync(oldDir);
}

console.log("Refactoring complete.");
