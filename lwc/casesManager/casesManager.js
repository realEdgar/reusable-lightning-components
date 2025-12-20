import { LightningElement, wire } from 'lwc';
import { gql, graphql } from 'lightning/graphql';
import { buildSingleObjectQuery, parseGQL } from 'c/graphQLUtility';
import { getObjectInfo, getPicklistValues } from 'lightning/uiObjectInfoApi';
import CASE_OBJ from '@salesforce/schema/Case';
import STATUS_FIELD from '@salesforce/schema/Case.Status';
import { navigateToRecordPage } from 'c/navigationMixinUtility';
import { NavigationMixin } from 'lightning/navigation';
import userId from '@salesforce/user/Id';

const PARAMS = [
    { label: '$statuses', type: '[Picklist]' },
    { label: '$ownerId', type: 'ID' },
    { label: '$caseNumber', type: 'String' }
];
const FILTERS = 'and: [{ Status: { in: $statuses } } { OwnerId: { eq: $ownerId } } { CaseNumber: { like: $caseNumber } }]';
const FIELDS = ['CaseNumber', 'Status', 'Subject', 'Description', 'CreatedDate', 'ClosedDate'];
const ORDERBY = 'orderBy: { CaseNumber: { order: DESC }  }';
const { query } = buildSingleObjectQuery('Case', PARAMS, FILTERS, FIELDS, 9, ORDERBY); // module

export default class CasesManager extends NavigationMixin(LightningElement) {
    statuses = [];
    caseNumber = '';
    statusOptions = [];
    selectedStatus = '';
    cases = [];
    _refresh;
    errors;

    isLoading = true;

    get caseQuery() {
        return this.statuses.length > 0 ? gql`${query}` : undefined;
    }

    get isData() {
        return this.cases.length > 0;
    }

    get isErrors() {
        return this.errors;
    }

    get errorMessages() {
        const messages = [];
        if (this.errors) {
            if (Array.isArray(this.errors)) {
                this.errors.forEach(error => messages.push(error.message));
            } else {
                messages.push(this.errors.body.message);
            }
        }
        return messages.join(',\n');
    }
    
    get variables() {
        return { statuses: this.statuses, ownerId: userId, caseNumber: `%${this.caseNumber}%` }
    }

    @wire(getObjectInfo, { objectApiName: CASE_OBJ })
    caseInfo;

    @wire(getPicklistValues, { recordTypeId: '$caseInfo.data.defaultRecordTypeId', fieldApiName: STATUS_FIELD })
    handlePicklistValues({ data, error }) {
        if (data) {
            const statuses = data.values.map(entry => ({ label: entry.label, value: entry.value }));
            statuses.unshift({ label: 'All', value: '' });
            this.statusOptions = statuses;
            this.statuses = data.values.map(({ value }) => value);
        } else if (error) {
            this.isLoading = false;
            this.errors = error;
        }
    }

    @wire(graphql, {
        query: '$caseQuery',
        variables: '$variables'
    }) handleCases({ data, errors, refresh }){
        this._refresh = refresh;
        if (data) {
            this.cases = parseGQL('Case', data).map(record => ({...record, isClosed: record.Status === 'Closed' })); // module
            console.log(data);
            this.isLoading = false;
        } else if (errors) {
            this.isLoading = false;
            this.errors = errors;
        }
    }

    handleStatusChange(event) {
        this.selectedStatus = event.detail.value;
        if (this.selectedStatus) {
            this.statuses = [this.selectedStatus];
        } else {
            this.statuses = this.statusOptions.map(({ value }) => value);
        }
    }

    handleCaseNumberChange(event) {
        this.caseNumber = event.detail.value;
    }

    handleNavigateRecord(event) {
        const recordId = event.target.dataset.id;
        navigateToRecordPage.call(this, recordId, 'view');
    }

    async handleRefresh() {
        return this._refresh();
    }
}