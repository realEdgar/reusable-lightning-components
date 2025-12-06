import { LightningElement, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class Reference extends NavigationMixin(LightningElement) {
    @api label;
    @api recordId;

    handleNavigate() {
        const pageReference = {
            type: 'standard__recordPage',
            attributes: {
                recordId: this.recordId,
                actionName: 'view'
            }
        };
        this[NavigationMixin.Navigate](pageReference);
    }
}