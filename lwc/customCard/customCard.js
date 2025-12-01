import { LightningElement, api } from 'lwc';

export default class CustomCard extends LightningElement {
    @api headerVariant = 'default';
    @api iconName = '';
    @api iconSize = 'small';
    @api footerVariant = 'default';

    get hVariant() {
        return 'slds-theme_' + this.headerVariant;
    }

    get fVariant() {
        return 'slds-theme_' + this.footerVariant;
    }

    get headerStyles() {
        const baseStyles = ['slds-var-p-around_medium'];

        return [...baseStyles, this.hVariant];
    }

    get headerTitle() {
        return ['slds-text-heading_small'];
    }

    get contentStyles() {
        const baseStyles = ['slds-var-p-around_medium', 'slds-border_top', 'slds-border_bottom'];

        return [...baseStyles];
    }

    get footerStyles() {
        const baseStyles = ['slds-var-p-around_medium', ];

        return [...baseStyles, this.fVariant];
    }
}