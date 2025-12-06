import LightningDatatable from 'lightning/datatable';
import reference from './reference.html';

export default class CustomDatatable extends LightningDatatable {
    static customTypes = {
        cReference: {
            template: reference,
            standardLayout: true,
            typeAttributes: ['label', 'recordId'],
        }
    }
}