import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import {salesOrdersData} from '../reducers/PivotTableReducer';

export default function configureStore(initialState: any) {
    return createStore(
        salesOrdersData,
        initialState,
        applyMiddleware(thunk)
    );
}