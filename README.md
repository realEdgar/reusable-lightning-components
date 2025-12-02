# Reusable Lightning Components

## Description:
This project contains reusable Aura and Lightning Web Components. ready to use in any project.

### Reusable Components:
* Card
    * `c-custom-card`
        * Public Properties and expected values:
            - _iconName_: any valid slds icon e.g.: `standard:account`,`utility:delete`, etc.
            - _iconSize_: xx-small, x-small, small (default), medium, large
            - _headerVariant_: can be any that matches with the "slds-theme_<headerVariant>", e.g., default (defaulted), shade, inverse, error, success, etc.
            - _footerVariant_: can be any that matches with the "slds-theme_<footerVariant>", e.g., default (defaulted), shade, inverse, error, success, etc.
            - _withFooter_: just define when you want to show the footer, it is false by default.
            - _padding_: padding on body. allowed values: xx-small, x-small, small, medium (default), large, x-large, xx-large
        * Static styles:
            - header: slds-var-p-around_medium, slds-border_bottom
            - footer: slds-var-p-around_medium, slds-border_top
        * slots:
            - title
            - actions
            - body
            - footer
* Navigation: leveraging NavigationMixin
    * `navigationMixinUtility`
        * modules:
            - **`navigateToRecordPage`**: 
                - *Description*: navigate to a record page:
                    - view
                    - edit (not supported in LWR)
                    - clone (not supported in LWR)
                - *Params*:
                    - @param {recordId} <string>: identifier of the record to navigate to. 
                    - @param {pageName} <string>: defines the page to navigate to: 'view', 'edit' or 'clone'
                - *prerequisites*:
                    - import { NavigationMixin } from 'lightning/navigation'
                    - export default class ... extends NavigationMixin(LightningElement)
                - *Steps*:
                    1. import { navigateToRecordPage } from 'c/navigationMixinUtility';
                    2. Define a `recordId` and a `pageName`
                    3. Pass to the module like this navigateToRecordPage.call(this, recordId, pageName);
                        * call method allows keep the component context (this) in the module.