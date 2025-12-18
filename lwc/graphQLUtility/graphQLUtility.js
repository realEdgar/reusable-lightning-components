const FALSY_VALUES = [0, '', false, null, undefined];
const INVALID_MSG = 'Invalid objectApiName or fields';
/**
 * @description: Builds a query for a single object
 * @param {String} objectApiName 
 * @param {List<Object>} params: object e.g.: { label, type }
 * @param {List<Object> or string} filters: object e.g.: { fieldName, operator, value }
 * @param {List<String>} fields
 * @returns {GraphQLResult} GraphQLResult: { query, error }
 */
const buildSingleObjectQuery = (objectApiName, params, filters, fields) => {
    let result;
    try {
        if (FALSY_VALUES.includes(objectApiName) || FALSY_VALUES.includes(fields) || (typeof fields === 'object' && FALSY_VALUES.includes(fields.length))) {
            let graphQLResponse = new GraphQLResult(undefined, INVALID_MSG);
            return graphQLResponse;
        }

        let objectNameQL = objectApiName.replaceAll('__c', '').replaceAll('_', '');
        let method = `get${objectNameQL}`;
        let filtersMap = '';
        if (params) {
            method = `get${objectNameQL}(${params.map(param => (`${param.label}: ${param.type}`)).join(',')})`;
        }

        if (!FALSY_VALUES.includes(filters)) {
            if (typeof filters === 'string') {
                filtersMap = `(where: { ${filters} })`;
            } else if (typeof filters === 'object' && !Array.isArray(filters)) {
                filtersMap = `(where: {${filters.map(filter => (` ${filter.fieldName}: { ${filter.operator}: ${filter.value} } `)).join(' ')}})`;
            }
        }

        const query = `query ${method} { uiapi { query { ${objectApiName}${filtersMap} { edges { node { Id ${fields.map(field => (`${field} { value displayValue }`)).join(' ')} } } } } } }`;

        result = new GraphQLResult(query, undefined);
    } catch(error) {
        result = new GraphQLResult(undefined, error);
    }
    
    return result;   
}

const parseGQL = (objectApiName, data) => {
    return data.uiapi.query[objectApiName].edges.map(({ node }) => {
        const newRecord = {}
        for (const key in node) {
            let value;
            if (key === 'Id') {
                value = node[key];
            } else {
                value = node[key]?.value ?? node[key]?.displayValue;
            }
            newRecord[key] = value;
        }

        return newRecord;
    });
}

class GraphQLResult {
    query;
    error;
    constructor(query, error) {
        this.query = query;
        this.error = error;
    }
}

export {
    buildSingleObjectQuery,
    parseGQL
}