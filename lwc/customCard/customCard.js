import { LightningElement, api } from 'lwc';

export default class CustomCard extends LightningElement {
    @api headerVariant = 'default';
    @api iconName = '';
    @api iconSize = 'small';
    @api footerVariant = 'default';
    @api withFooter = false;
    @api padding = 'medium';

    get hVariant() {
        return 'slds-theme_' + this.headerVariant;
    }

    get fVariant() {
        return 'slds-theme_' + this.footerVariant;
    }

    get headerStyles() {
        const baseStyles = ['slds-var-p-around_medium', 'slds-border_bottom'];

        return [...baseStyles, this.hVariant];
    }

    get headerTitle() {
        return ['slds-text-heading_small'];
    }

    get contentStyles() {
        const padding = 'slds-var-p-around_' + this.padding;
        return [padding];
    }

    get footerStyles() {
        const baseStyles = ['slds-var-p-around_medium', 'slds-border_top'];

        return [...baseStyles, this.fVariant];
    }
}