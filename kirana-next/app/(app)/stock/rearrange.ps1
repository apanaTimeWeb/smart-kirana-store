$ErrorActionPreference = "Stop"
cd c:\Users\satya\Desktop\PojectsToWork\smart-kirana-store\kirana-next\app\`(app`)\stock\stock_components

mkdir Contexts, Shared, Layout, Dashboard, SearchAndFilter, Table, Mobile, Dialogs, Dialogs\ProductCreator, Dialogs\PurchaseDialog, Dialogs\EditVariantDialog -Force

Move-Item StockContext.tsx Contexts\
Move-Item StockProductCreatorContext.tsx Contexts\
Move-Item StockEditVariantDialogContext.tsx Contexts\

Rename-Item StockConstants.ts StockSharedConstants.ts
Move-Item StockSharedConstants.ts Shared\
Move-Item StockTypes.ts Shared\
Move-Item StockUtils.ts Shared\
Move-Item StockDraftTemplates.ts Shared\
Move-Item StockBadge.tsx Shared\
Move-Item StockUnitSelector.tsx Shared\

Move-Item StockMainLayout.tsx Layout\
Move-Item StockHeader.tsx Layout\

Move-Item StockStatsGrid.tsx Dashboard\

Move-Item StockSearchBar.tsx SearchAndFilter\
Move-Item StockFilterBar.tsx SearchAndFilter\

Move-Item StockMainTable.tsx Table\
Move-Item StockTableRow.tsx Table\
Move-Item StockPagination.tsx Table\

Move-Item StockMobileList.tsx Mobile\
Move-Item StockMobileCard.tsx Mobile\

Move-Item StockProductCreator.tsx Dialogs\ProductCreator\
Move-Item StockProductCreatorIdentitySection.tsx Dialogs\ProductCreator\
Move-Item StockProductCreatorPriceFields.tsx Dialogs\ProductCreator\
Move-Item StockProductCreatorStockPricingSection.tsx Dialogs\ProductCreator\
Move-Item StockProductCreatorUnitField.tsx Dialogs\ProductCreator\
Move-Item StockProductCreatorExtraVariantsSection.tsx Dialogs\ProductCreator\
Move-Item StockProductCreatorFooter.tsx Dialogs\ProductCreator\
Move-Item StockProductCreatorNameField.tsx Dialogs\ProductCreator\
Move-Item StockLivePreview.tsx Dialogs\ProductCreator\
Move-Item StockExtraVariantRow.tsx Dialogs\ProductCreator\

Move-Item StockPurchaseDialog.tsx Dialogs\PurchaseDialog\
Move-Item StockPurchaseDialogProductSelector.tsx Dialogs\PurchaseDialog\
Move-Item StockPurchaseDialogQuantityRateFields.tsx Dialogs\PurchaseDialog\
Move-Item StockPurchaseDialogSupplierExpiryFields.tsx Dialogs\PurchaseDialog\
Move-Item StockPurchaseDialogStockPreview.tsx Dialogs\PurchaseDialog\

Move-Item StockEditVariantDialog.tsx Dialogs\EditVariantDialog\
Move-Item StockEditVariantDialogFooter.tsx Dialogs\EditVariantDialog\
Move-Item StockEditVariantDialogNameExpiryRow.tsx Dialogs\EditVariantDialog\
Move-Item StockEditVariantDialogPriceMarginSection.tsx Dialogs\EditVariantDialog\
Move-Item StockEditVariantDialogStockExtrasSection.tsx Dialogs\EditVariantDialog\
Move-Item StockEditVariantDialogUnitSection.tsx Dialogs\EditVariantDialog\
