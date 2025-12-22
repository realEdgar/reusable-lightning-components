import { LightningElement, wire, api } from 'lwc';
import { gql, graphql } from 'lightning/graphql';
import { getPicklistValues, getObjectInfo } from 'lightning/uiObjectInfoApi';
import LEADSOURCE_FIELD from '@salesforce/schema/Contact.LeadSource';
import { parseGQL } from 'c/graphQLUtility';
import { NavigationMixin } from 'lightning/navigation';
import { navigateToObjectPage } from 'c/navigationMixinUtility';
import { updateRecord } from 'lightning/uiRecordApi';

const COLS = [
    { label: 'Name', fieldName: 'Name', type: 'cReference', typeAttributes: { label: { fieldName: 'Name' }, recordId: { fieldName: 'Id' } } },
    { label: 'Email', fieldName: 'Email', email: 'email' },
    { label: 'Phone', fieldName: 'Phone', type: 'phone' },
    { label: 'Title', fieldName: 'Title' },
    { label: 'LeadSource', fieldName: 'LeadSource', editable: true, type: 'cPicklist', 
        typeAttributes: { 
            value: { fieldName: 'LeadSource' }, 
            context: { fieldName: 'Id' }, 
            options: { fieldName: 'leadSourceOptions' } 
        } 
    },
];

const query = `
    query getContact($accountId: ID) {
        uiapi {
            query {
                Contact(where: { AccountId: { eq: $accountId } }) {
                    edges {
                        node {
                            Id
                            Name { value displayValue }
                            Email { value displayValue }
                            Phone { value displayValue }
                            Title { value displayValue }
                            LeadSource { value displayValue }
                        }
                    }
                }
            }
        }
    }
`;

const CONTACT_API = 'Contact';

export default class AccountRelatedContacts extends NavigationMixin(LightningElement) {
    @api recordId;
    columns = COLS;
    contactsData = [];
    initContacts = [];
    refreshRelatedContacts;
    sourceOptions = [];
    draftValues = [];
    isLoading = true;

    get isData() {
        return this.contactsData.length > 0;
    }

    get noRelatedContacts() {
        return this.contactsData.length;
    }

    @wire(getObjectInfo, { objectApiName: CONTACT_API })
    contactInfo

    @wire(getPicklistValues, { recordTypeId: '$contactInfo.data.defaultRecordTypeId', fieldApiName: LEADSOURCE_FIELD })
    handlePicklistValues({ error, data }) {
        if (data) {
            this.sourceOptions = data.values.map(entry => ({ label: entry.label, value: entry.value }));
        } else if (error) {
            console.error(error);
        }
    }

    get variables() {
        return { accountId: this.recordId };
    }

    @wire(graphql, {
        query: gql`${query}`,
        variables: '$variables'
    }) handleRelatedContacts({ data, errors, refresh }) {
        this.refreshRelatedContacts = refresh;
        if (data) {
            this.contactsData = parseGQL(CONTACT_API, data).map(record => ({ ...record, leadSourceOptions: this.sourceOptions }));
            this.initContacts = this.contactsData;
            this.isLoading = false;
        } else if (errors) {
            this.isLoading = false;
            console.error(errors);
        }
    }

    async handleContactRefresh() {
        return this.refreshRelatedContacts();
    }

    handleCreateRelatedContact(){
        const defaultValues = { AccountId: this.recordId }

        navigateToObjectPage.apply(this, [CONTACT_API, 'new', defaultValues]);
    }

    handleCellChange(event) {
        const draftValue = event.detail.draftValues[0];
        const existingDraftValue = this.draftValues.find(entry => entry.Id === draftValue.Id);
        if (existingDraftValue) {
            Object.assign(existingDraftValue, draftValue);
        } else {
            this.draftValues.push(draftValue);
        }
        this.contactsData = this.contactsData.map(record => {
            if (record.Id === draftValue.Id) {
                return { ...record, ...draftValue };
            }
            return record;
        });
    }

    async handleSave(event) {
        this.isLoading = true;
        const draftValues = event.detail.draftValues;
        try {
            const updates = draftValues.map(fields => updateRecord({fields }));
            await Promise.all(updates);
            this.draftValues = [];
            this.handleContactRefresh();
        } catch(error) {
            this.isLoading = false;
            this.draftValues = [];
            this.contactsData = this.initContacts;
            console.error(error);
        }
    }

    handleCancel() {
        this.contactsData = this.initContacts;
        this.draftValues = [];
    }
}