const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const pageTsx = path.join(rootDir, 'page.tsx');
let pageContent = fs.readFileSync(pageTsx, 'utf8');
pageContent = pageContent.replace(/\.\/billing_components\/BillingContext/g, './context/BillingContext');
pageContent = pageContent.replace(/\.\/billing_components\/BillingProductMainGrid/g, './components/Products/BillingProductMainGrid');
pageContent = pageContent.replace(/\.\/billing_components\/BillingCartMainPanel/g, './components/Cart/BillingCartMainPanel');
pageContent = pageContent.replace(/\.\/billing_components\/BillingMobileResponsiveLayout/g, './components/Layout/BillingMobileResponsiveLayout');
pageContent = pageContent.replace(/\.\/billing_components\/BillingLooseItemQuantityPicker/g, './components/Dialogs/BillingLooseItemQuantityPicker');
pageContent = pageContent.replace(/\.\/billing_components\/BillingWhatsAppInvoiceDialog/g, './components/Dialogs/BillingWhatsAppInvoiceDialog');
fs.writeFileSync(pageTsx, pageContent);

function processDir(dir, level) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      processDir(fullPath, level + 1);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;

      const relativePrefix = level === 1 ? '../' : '../../'; // level 1 is context/ or constants/, level 2 is components/Cart/
      
      const replacements = {
        './BillingTypes': `${relativePrefix}constants/BillingSharedConstants`,
        './BillingUtils': `${relativePrefix}utils/BillingSharedUtils`,
        './BillingWhatsAppUtils': `${relativePrefix}utils/BillingWhatsAppUtils`,
        './BillingContext': `${relativePrefix}context/BillingContext`
      };

      for (const [oldPath, newPath] of Object.entries(replacements)) {
        const regex = new RegExp(`from "${oldPath}"`, 'g');
        if (regex.test(content)) {
          content = content.replace(regex, `from "${newPath}"`);
          changed = true;
        }
      }

      // Fix cross-feature imports in components
      // e.g. BillingCartMainPanel imports BillingCustomerSelector
      if (level === 2) {
        // e.g. from "./BillingCustomerSelector" to "../Customer/BillingCustomerSelector"
        const featureMap = {
          'BillingCustomerSelector': 'Customer',
          'BillingProductMainGrid': 'Products',
          'BillingCartMainPanel': 'Cart',
          'BillingLooseItemQuantityPicker': 'Dialogs',
          'BillingWhatsAppInvoiceDialog': 'Dialogs',
          'BillingMobileResponsiveLayout': 'Layout',
          // we can just regex for from "./Billing..." and check if it's in the same folder or not.
        };
        
        // Let's manually replace specific known cross-feature imports
        const crossImports = [
          { pattern: /from "\.\/(BillingCustomer[^"]*)"/g, dest: 'Customer' },
          { pattern: /from "\.\/(BillingProduct[^"]*)"/g, dest: 'Products' },
          { pattern: /from "\.\/(BillingCart[^"]*)"/g, dest: 'Cart' },
          { pattern: /from "\.\/(BillingMobile[^"]*)"/g, dest: 'Layout' },
          { pattern: /from "\.\/(BillingLoose[^"]*)"/g, dest: 'Dialogs' },
          { pattern: /from "\.\/(BillingWhatsAppInvoice[^"]*)"/g, dest: 'Dialogs' },
        ];

        // Figure out current feature
        const currentFeature = path.basename(dir);

        for (const { pattern, dest } of crossImports) {
          content = content.replace(pattern, (match, p1) => {
            if (currentFeature === dest) return `from "./${p1}"`;
            return `from "../${dest}/${p1}"`;
          });
          changed = true;
        }
      }

      if (changed) {
        fs.writeFileSync(fullPath, content);
      }
    }
  }
}

processDir(path.join(rootDir, 'components'), 2);
processDir(path.join(rootDir, 'context'), 1);
processDir(path.join(rootDir, 'constants'), 1);
processDir(path.join(rootDir, 'utils'), 1);

console.log('Imports refactored');
