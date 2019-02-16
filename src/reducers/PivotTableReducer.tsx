import { SalesOrdersAction } from '../actions/PivotTableActions';
import { StoreState } from '../store/Store';
import { GET_SALES_ORDERS, RECEIVED_SALES_ORDERS } from '../constants/constants';

export function salesOrdersData(state: StoreState, action: SalesOrdersAction): StoreState {
    switch (action.type) {
        case GET_SALES_ORDERS:
            return { ...state, loading: true };
        case RECEIVED_SALES_ORDERS:
            return { ...state, loading: false, salesOrdersData: action.data };
    }
    return state;
}