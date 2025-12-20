import { LightningElement, wire } from 'lwc';
import { navigateToRecordPage, navigateToObjectPage, navigateToApp } from 'c/navigationMixinUtility';
import { NavigationMixin } from 'lightning/navigation';
import { getObjectInfos } from 'lightning/uiObjectInfoApi';
import ACCOUNT from '@salesforce/schema/Account';
import CONTACT from '@salesforce/schema/Contact';
import OPPORTUNITY from '@salesforce/schema/Opportunity';
import CASE from '@salesforce/schema/Case';
import getObjectsListView from '@salesforce/apex/TestingReusableComponentsController.getObjectsListView';

const T = new Date();

const ALLOWED_OBJECTS = [ACCOUNT, CONTACT, OPPORTUNITY, CASE];
const DEFAULT_VALUES = new Map();
DEFAULT_VALUES.set('Case', { Status: 'Working', Priority: 'Medium', Origin: 'Email' });
DEFAULT_VALUES.set('Opportunity', { Name: 'Test Opportunity', Amount: 10000, StageName: 'Prospecting', CloseDate: `${T.getFullYear()}-${T.getMonth()}-${T.getDate()}` });
DEFAULT_VALUES.set('Account', { Name: 'Test Opportunity', Rating: 'Hot', Phone: '4613353233', Type: 'Customer - Channel', Industry: 'Banking', AnnualRevenue: 123456789, Active__c: 'Yes' });
DEFAULT_VALUES.set('Contact', { FistName: 'Lyra', LastName: 'Valkyria', Email: 'contact@example.com', MobilePhone: '6457984561', AccountId: '001bm00000yCm6MAAS'});

export default class NavigationMixinTesting extends NavigationMixin(LightningElement) {
    recordId;
    selectedPage = 'view';
    selectedObjectPage = 'home';
    selectedObject = 'Account';
    selectedListView;
    appTarget;
    
    get pageOptions() {
        return [
            { label: 'View', value: 'view' },
            { label: 'Edit', value: 'edit' },
            { label: 'Clone', value: 'clone' },
        ];
    }

    get objectPageOptions() {
        return [
            { label: 'Home Page', value: 'home' },
            { label: 'New Record', value: 'new' },
            { label: 'List View', value: 'list' },
        ];
    }

    get isListPage() {
        return this.selectedObjectPage === 'list';
    }

    get objectOptions() {
        return this.objectInfos.data?.results?.map(obj => {
            return { label: obj.result.label, value: obj.result.apiName }
        }) || [];
    }

    get listViewsOptions() {
        return this.listViews.data?.map(list => ({ label: list.Name, value: list.DeveloperName })) || [];
    }

    get defaultRecordTypeId() {
        return this.objectInfos.data?.results?.find(obj => obj.result.apiName === this.selectedObject)?.result.defaultRecordTypeId;
    }

    @wire(getObjectInfos, { objectApiNames: ALLOWED_OBJECTS })
    objectInfos;

    @wire(getObjectsListView, { objectApiName: '$selectedObject' })
    listViews;

    handleChosenAccount(event) {
        this.recordId = event.detail.recordId;
    }

    handlePageChange(event) {
        this.selectedPage = event.detail.value;
    }

    handleNavigateToRecordPage() {
        navigateToRecordPage.call(this, this.recordId, this.selectedPage);
    }

    handleObjectPageChange(event) {
        this.selectedObjectPage = event.detail.value;
        if (this.selectedObjectPage !== 'list') {
            this.selectedListView = undefined;
        }
    }

    handleSelectedListChange(event) {
        this.selectedListView = event.detail.value;
    }

    handleObjectChange(event) {
        this.selectedObject = event.detail.value;
    }

    handleNavigateToObjectPage() {
        const defaultValues = DEFAULT_VALUES.get(this.selectedObject);
        navigateToObjectPage.call(this, this.selectedObject, this.selectedObjectPage, defaultValues, this.defaultRecordTypeId, this.selectedListView);
    }

    handleChangeApp(event) {
        this.appTarget = event.detail.value;
    }

    handleNavigateToApp() {
        navigateToApp.call(this, this.appTarget);
    }
}