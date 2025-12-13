import LightningDatatable from 'lightning/datatable';
import reference from './reference.html';
import picklistEdit from './picklist/picklistEdit.html';
import picklistView from './picklist/picklistView.html';

export default class CustomDatatable extends LightningDatatable {
    static customTypes = {
        cReference: {
            template: reference,
            standardCellLayout: true,
            typeAttributes: ['label', 'recordId'],
        },
        cPicklist: {
            template: picklistView,
            editTemplate: picklistEdit,
            standardCellLayout: true,
            typeAttributes: ['value', 'context', 'options']
        }
    }
}