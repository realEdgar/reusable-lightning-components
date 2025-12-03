import { NavigationMixin } from 'lightning/navigation';
import { encodeDefaultFieldValues } from 'lightning/pageReferenceUtils';
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

/**
 * @description: navigate to an object page: home, new, or list
 * @example: home | navigateToObjectPage.call(this, 'Account', 'home');
 * @example: new  | navigateToObjectPage.call(this, 'Account', 'new', { Name: 'Acme', Email: 'test@text.com' }, '012300000012BYN', undefined);
 * @example: list | navigateToObjectPage.call(this, 'Account', 'list', undefined, undefined, 'All');
 * Note: NavigationMixin is required in the component you want to use this module: ... extends NavigationMixin(LightningElement) {}
 * Note 2: See README file for more details.
*/
function navigateToObjectPage(objectApiName, pageName, defaultValues, recordTypeId, filterName) {
    const pageReference = {
        type: 'standard__objectPage',
        attributes: {
            objectApiName,
            actionName: pageName
        }
    }
    if (pageName === 'list' && filterName !== undefined) {
        pageReference.state = { filterName }
    }

    if (pageName === 'new' && (defaultValues !== undefined || recordTypeId !== undefined)) {
        pageReference.state = { recordTypeId, defaultFieldValues: encodeDefaultFieldValues(defaultValues) }
    }

    this[NavigationMixin.Navigate](pageReference);
}

export { navigateToRecordPage, navigateToObjectPage }