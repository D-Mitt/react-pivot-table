import { SalesDataAction } from '../actions/PivotTableActions';
import { SalesDataState } from '../store/Store';
import * as constants from '../constants/constants';
import * as _ from 'lodash';

export function salesOrdersData(state: SalesDataState, action: SalesDataAction): SalesDataState {
    const nextState = _.clone(state);
    switch (action.type) {
        case constants.GET_SALES_ORDERS:
            nextState.loading = true;
            return nextState;
        case constants.RECEIVED_SALES_ORDERS:
            nextState.loading = false;
            nextState.salesOrdersData = action.data;
            return nextState;
        case constants.TOGGLE_MINIMIZED_START:
            return nextState;
        case constants.TOGGLE_MINIMIZED_END:
            nextState.dimensionMinimizedStatus = action.data;
            return nextState;
    }
    return state;
}