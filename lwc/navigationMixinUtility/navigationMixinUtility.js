import { NavigationMixin } from 'lightning/navigation';
/**
 * @description: navigate to a record page: view, edit or clone
 * @example: navigateToRecordPage.call(this, '001bm00000yCm6QAAS', 'view');
 * Note: NavigationMixin is required in the component you want to use this module: ... extends NavigationMixin(LightningElement) {}
 */
function navigateToRecordPage(recordId, pageName) {
    const pageReference = {
        type: 'standard__recordPage',
        attributes: {
            recordId,
            actionName: pageName
        }
    }
    this[NavigationMixin.Navigate](pageReference);
}

export { navigateToRecordPage }