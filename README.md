# Reusable Lightning Components

## Description:
This project contains reusable Lightning Web Components. ready to use in any project.

### Reusable Components:

#### Card: 
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
#### Navigation: leveraging NavigationMixin
* `navigationMixinUtility`
   * **`navigateToRecordPage`**: 
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
           - import { navigateToRecordPage } from 'c/navigationMixinUtility';
           - Define a `recordId` and a `pageName`
           - Pass to the module like this navigateToRecordPage.call(this, recordId, pageName);
               * call method allows keep the component context (this) in the module.
   * **`navigateToApp`**: 
       - *Description*: navigate to an App like standard__Sales, standard__LightningSales, etc.
       - *Params*:
           - @param: {appTarget} <String>: app api name supported by the navigation mixin.
       - *Prerequisites*:
           - import { NavigationMixin } from 'lightning/navigation'
           - export default class ... extends NavigationMixin(LightningElement)
       - *Steps*:
           - import { navigateToApp } from 'c/navigationMixinUtility';
           - Define an `appTarget` and pass to the module.
           - use in your component like this: navigateToApp.call(this, 'LightningSales');
   * **`navigateToObjectPage`**:
      - *Description*: navigate to an object page: home, new or list.
      - *Required Params*:
         - {objectApiName} <string>: any supported Salesforce Object Standard or Custom Object.
         - {pageName} <string>: defines the page to navigate to: 'home', 'new' or 'list'.
      - *Prerequisites*:
         - import { NavigationMixin } from 'lightning/navigation'
         - export default class ... extends NavigationMixin(LightningElement)
      - *Steps*:
         - import { navigateToObjectPage } from 'c/navigationMixinUtility';
         - Define a `objectApiName` and `pageName`. optionally, define `defaultValues`, `recordTypeId` or `filterName` as per your requirements.
         - Call the method as you need like the following:
            * navigateToObjectPage.call(this, 'Account', 'home') => navigat to Account Default List (pinned list view).
            * navigateToObjectPage.call(this, 'Account', 'new') => navigat to Account new form with no default values.
            * navigateToObjectPage.call(this, 'Account', 'new', undefined, '001xxxxxxxxxxx') => navigat to Account new form with no default values but with recordTypeId defined.
            * navigateToObjectPage.call(this, 'Account', 'new', {Name: 'Default Name', ... }) => navigat to Account new form with default values.
            * navigateToObjectPage.call(this, 'Account', 'new', {Name: 'Default Name', ... }, '001xxxxxxxxxxx') => navigat to Account new form with default values and a recordTypeId defined.
            * navigateToObjectPage.call(this, 'Account', 'list', undefined, undefined, 'AllAccounts') => navigat to 'All Accounts' list view.
#### Custom LightningDatatable: reusable custom lightning-datatable data type. it extends lightning-datatable functionality.
* `customDatatable`
   * **`customDatatypes`**:
      - `cReference`: build any link on a data table that let users navigate to any available record page:
         - type attributes:
            - `label`: value to be displayed in front of the link
            - `recordId`: record identifier to navigate to.
         - auxiliar components:
         - `c-reference`: manage the logic to navigate. it receives a label and the record Id. (it can be reused in other contexts.)
