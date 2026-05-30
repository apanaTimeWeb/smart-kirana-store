const fs = require('fs');
const path = require('path');

const baseDir = path.resolve('c:/Users/satya/Desktop/PojectsToWork/smart-kirana-store/kirana-next/app/(app)/stock/stock_components');

const fileLocations = {
  'StockContext': 'Contexts',
  'StockProductCreatorContext': 'Contexts',
  'StockEditVariantDialogContext': 'Contexts',
  'StockConstants': 'Shared',
  'StockSharedConstants': 'Shared',
  'StockTypes': 'Shared',
  'StockUtils': 'Shared',
  'StockDraftTemplates': 'Shared',
  'StockBadge': 'Shared',
  'StockUnitSelector': 'Shared',
  'StockMainLayout': 'Layout',
  'StockHeader': 'Layout',
  'StockStatsGrid': 'Dashboard',
  'StockSearchBar': 'SearchAndFilter',
  'StockFilterBar': 'SearchAndFilter',
  'StockMainTable': 'Table',
  'StockTableRow': 'Table',
  'StockPagination': 'Table',
  'StockMobileList': 'Mobile',
  'StockMobileCard': 'Mobile',
  'StockProductCreator': 'Dialogs/ProductCreator',
  'StockProductCreatorIdentitySection': 'Dialogs/ProductCreator',
  'StockProductCreatorPriceFields': 'Dialogs/ProductCreator',
  'StockProductCreatorStockPricingSection': 'Dialogs/ProductCreator',
  'StockProductCreatorUnitField': 'Dialogs/ProductCreator',
  'StockProductCreatorExtraVariantsSection': 'Dialogs/ProductCreator',
  'StockProductCreatorFooter': 'Dialogs/ProductCreator',
  'StockProductCreatorNameField': 'Dialogs/ProductCreator',
  'StockLivePreview': 'Dialogs/ProductCreator',
  'StockExtraVariantRow': 'Dialogs/ProductCreator',
  'StockPurchaseDialog': 'Dialogs/PurchaseDialog',
  'StockPurchaseDialogProductSelector': 'Dialogs/PurchaseDialog',
  'StockPurchaseDialogQuantityRateFields': 'Dialogs/PurchaseDialog',
  'StockPurchaseDialogSupplierExpiryFields': 'Dialogs/PurchaseDialog',
  'StockPurchaseDialogStockPreview': 'Dialogs/PurchaseDialog',
  'StockEditVariantDialog': 'Dialogs/EditVariantDialog',
  'StockEditVariantDialogFooter': 'Dialogs/EditVariantDialog',
  'StockEditVariantDialogNameExpiryRow': 'Dialogs/EditVariantDialog',
  'StockEditVariantDialogPriceMarginSection': 'Dialogs/EditVariantDialog',
  'StockEditVariantDialogStockExtrasSection': 'Dialogs/EditVariantDialog',
  'StockEditVariantDialogUnitSection': 'Dialogs/EditVariantDialog',
};

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir(baseDir, (filePath) => {
  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;
  let originalContent = fs.readFileSync(filePath, 'utf8');
  let content = originalContent;

  const fileDir = path.dirname(filePath);
  
  content = content.replace(/(from|import)\s+['"](\.\.?\/[a-zA-Z0-9_/]+)['"]/g, (match, kw, importPath) => {
    const importedName = path.basename(importPath);
    if (fileLocations[importedName]) {
      let targetDirRelative = fileLocations[importedName];
      let finalImportedName = importedName === 'StockConstants' ? 'StockSharedConstants' : importedName;
      let targetDirFull = path.join(baseDir, targetDirRelative);
      let newRelative = path.relative(fileDir, path.join(targetDirFull, finalImportedName));
      newRelative = newRelative.replace(/\\/g, '/');
      if (!newRelative.startsWith('.')) {
        newRelative = './' + newRelative;
      }
      return `${kw} "${newRelative}"`;
    }
    return match;
  });

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${filePath}`);
  }
});
