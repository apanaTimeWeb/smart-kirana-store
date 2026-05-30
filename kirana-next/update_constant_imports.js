const fs = require('fs');
const path = require('path');

const historyDir = path.join(__dirname, 'app/(app)/history');

function replaceInFile(filePath, replacements) {
    let content = fs.readFileSync(filePath, 'utf8');
    for (const { searchValue, replaceValue } of replacements) {
        content = content.replace(searchValue, replaceValue);
    }
    fs.writeFileSync(filePath, content);
}

// 1. HistoryBillCard.tsx
replaceInFile(path.join(historyDir, 'components', 'BillList', 'HistoryBillCard.tsx'), [
    { searchValue: 'import { HistoryBill, HISTORY_PAYMENT_MODE_STYLES } from "../../shared/HistoryTypes";', replaceValue: 'import { HistoryBill } from "../../shared/HistoryTypes";\nimport { HISTORY_PAYMENT_MODE_STYLES } from "../../shared/HistorySharedConstants";' },
]);

// 2. HistoryBillDetailsHeader.tsx
replaceInFile(path.join(historyDir, 'components', 'BillDetailsDialog', 'HistoryBillDetailsHeader.tsx'), [
    { searchValue: 'import { HISTORY_PAYMENT_MODE_STYLES } from "../../shared/HistoryTypes";', replaceValue: 'import { HISTORY_PAYMENT_MODE_STYLES } from "../../shared/HistorySharedConstants";' },
]);

// 3. HistoryBillItemReturnRow.tsx
replaceInFile(path.join(historyDir, 'components', 'Returns', 'HistoryBillItemReturnRow.tsx'), [
    { searchValue: 'import { HistoryReturnQtys, HISTORY_DEFAULT_UNIT } from "../../shared/HistoryTypes";', replaceValue: 'import { HistoryReturnQtys } from "../../shared/HistoryTypes";\nimport { HISTORY_DEFAULT_UNIT } from "../../shared/HistorySharedConstants";' },
]);

console.log("Constants imports fixed successfully.");
