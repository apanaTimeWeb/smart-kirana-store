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

// 1. page.tsx
replaceInFile(path.join(historyDir, 'page.tsx'), [
    { searchValue: '"./history_components/HistoryBillListContainer"', replaceValue: '"./components/BillList/HistoryBillListContainer"' },
    { searchValue: '"./history_components/HistoryContext"', replaceValue: '"./context/HistoryContext"' }
]);

// 2. HistoryContext.tsx
replaceInFile(path.join(historyDir, 'context', 'HistoryContext.tsx'), [
    { searchValue: 'import { HistoryBill } from "./HistoryTypes";', replaceValue: 'import { HistoryBill } from "../shared/HistoryTypes";' },
    // Also add useMemo
    { searchValue: 'import React, { createContext, useContext, useState } from "react";', replaceValue: 'import React, { createContext, useContext, useState, useMemo } from "react";' },
    { 
        searchValue: `  return (
    <HistoryContext.Provider 
      value={{ 
        bills, 
        isLoadingBills, 
        settings, 
        currency,
        selectedBill,
        setSelectedBill,
        isDialogOpen,
        setIsDialogOpen,
        openBillDetails
      }}
    >`,
        replaceValue: `  const contextValue = useMemo(() => ({
    bills,
    isLoadingBills,
    settings,
    currency,
    selectedBill,
    setSelectedBill,
    isDialogOpen,
    setIsDialogOpen,
    openBillDetails
  }), [bills, isLoadingBills, settings, currency, selectedBill, isDialogOpen]);

  return (
    <HistoryContext.Provider value={contextValue}>`
    }
]);

// 3. HistoryBillListContainer.tsx
replaceInFile(path.join(historyDir, 'components', 'BillList', 'HistoryBillListContainer.tsx'), [
    { searchValue: 'from "./HistoryContext"', replaceValue: 'from "../../context/HistoryContext"' },
    { searchValue: 'from "./HistoryTypes"', replaceValue: 'from "../../shared/HistoryTypes"' },
    { searchValue: 'from "./HistorySearchFilter"', replaceValue: 'from "../Common/HistorySearchFilter"' },
    { searchValue: 'from "./HistoryBillDetailsDialog"', replaceValue: 'from "../BillDetailsDialog/HistoryBillDetailsDialog"' },
]);

// 4. HistoryBillCard.tsx
replaceInFile(path.join(historyDir, 'components', 'BillList', 'HistoryBillCard.tsx'), [
    { searchValue: 'from "./HistoryTypes"', replaceValue: 'from "../../shared/HistoryTypes"' },
]);

// 5. HistoryBillDetailsDialog.tsx
replaceInFile(path.join(historyDir, 'components', 'BillDetailsDialog', 'HistoryBillDetailsDialog.tsx'), [
    { searchValue: 'from "./HistoryContext"', replaceValue: 'from "../../context/HistoryContext"' },
    { searchValue: 'from "./HistoryPrintUtils"', replaceValue: 'from "../../utils/HistoryPrintUtils"' },
    { searchValue: 'from "./HistoryWhatsAppUtils"', replaceValue: 'from "../../utils/HistoryWhatsAppUtils"' },
    { searchValue: 'from "./HistoryBillItemsReturnList"', replaceValue: 'from "../Returns/HistoryBillItemsReturnList"' },
    { searchValue: 'from "./HistoryBillReturnSuccessScreen"', replaceValue: 'from "../Returns/HistoryBillReturnSuccessScreen"' },
    { searchValue: 'from "./HistoryTypes"', replaceValue: 'from "../../shared/HistoryTypes"' },
]);

// 6. HistoryBillDetailsHeader.tsx
replaceInFile(path.join(historyDir, 'components', 'BillDetailsDialog', 'HistoryBillDetailsHeader.tsx'), [
    { searchValue: 'from "./HistoryTypes"', replaceValue: 'from "../../shared/HistoryTypes"' },
    { searchValue: 'from "./HistoryContext"', replaceValue: 'from "../../context/HistoryContext"' },
]);

// 7. HistoryBillItemsReturnList.tsx
replaceInFile(path.join(historyDir, 'components', 'Returns', 'HistoryBillItemsReturnList.tsx'), [
    { searchValue: 'from "./HistoryContext"', replaceValue: 'from "../../context/HistoryContext"' },
    { searchValue: 'from "./HistoryTypes"', replaceValue: 'from "../../shared/HistoryTypes"' },
    { searchValue: 'from "./HistorySearchFilter"', replaceValue: 'from "../Common/HistorySearchFilter"' },
]);

// 8. HistoryBillItemReturnRow.tsx
replaceInFile(path.join(historyDir, 'components', 'Returns', 'HistoryBillItemReturnRow.tsx'), [
    { searchValue: 'from "./HistoryTypes"', replaceValue: 'from "../../shared/HistoryTypes"' },
]);

// 9. HistoryPrintUtils.ts
replaceInFile(path.join(historyDir, 'utils', 'HistoryPrintUtils.ts'), [
    { searchValue: 'from "./HistoryTypes"', replaceValue: 'from "../shared/HistoryTypes"' },
]);

// 10. HistoryWhatsAppUtils.ts
replaceInFile(path.join(historyDir, 'utils', 'HistoryWhatsAppUtils.ts'), [
    { searchValue: 'from "./HistoryTypes"', replaceValue: 'from "../shared/HistoryTypes"' },
]);

console.log("Imports fixed successfully.");
