import * as constants from '../constants/constants';
import {Dispatch} from "redux";
import * as actions from '../actions/PivotTableActions';

export interface GetSalesOrders {
    type: constants.GET_SALES_ORDERS;
}

export interface ReceivedSalesOrders {
    type: constants.RECEIVED_SALES_ORDERS;
    data: constants.JSONObject;
}

export type SalesOrdersAction = GetSalesOrders | ReceivedSalesOrders;

export function getSalesOrders(): GetSalesOrders {
    return {
        type: constants.GET_SALES_ORDERS
    }
}

export function receivedSalesOrders(data: constants.JSONObject): ReceivedSalesOrders {
    return {
        type: constants.RECEIVED_SALES_ORDERS,
        data: data
    }
}

export function fetchSalesOrders () {

    return (dispatch: Dispatch<actions.SalesOrdersAction>) => {

        dispatch(getSalesOrders());
        // Fake time to get data to show `Loading...`
        setTimeout(() => {dispatch(receivedSalesOrders(constants.SalesOrderData))}, 2000);

    }

        // Use below for calling GET on an API endpoint
        // fetch('some url path')
        //     .then(response => {
        //         return response.json();
        //     })
        //     .then(data => {
        //
        //         dispatch(receivedSalesOrders(data));
        //     });
};