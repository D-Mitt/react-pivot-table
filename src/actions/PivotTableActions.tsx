import * as constants from '../constants/constants';
import {Dispatch} from "redux";
import * as actions from '../actions/PivotTableActions';
import {JSONObject} from "../constants/constants";
import * as _ from 'lodash';

export interface GetSalesOrders {
    type: constants.GET_SALES_ORDERS;
}

export interface ReceivedSalesOrders {
    type: constants.RECEIVED_SALES_ORDERS;
    data: constants.JSONObject;
}

export interface ToggleMinimizedStart {
    type: constants.TOGGLE_MINIMIZED_START;
}

export interface ToggleMinimizedEnd {
    type: constants.TOGGLE_MINIMIZED_END;
    data: constants.JSONObject;
}

export type SalesDataAction = GetSalesOrders | ReceivedSalesOrders | ToggleMinimizedStart | ToggleMinimizedEnd;

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

    return (dispatch: Dispatch<actions.SalesDataAction>) => {

        dispatch(getSalesOrders());
        // Fake time to get data to show `Loading...`
        setTimeout(() => {dispatch(receivedSalesOrders(constants.SalesOrderData))}, 1000);

    }

    //TODO: Implement API call when endpoint determined
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

export function toggleMinimizedStatusStart(): ToggleMinimizedStart {
    return {
        type: constants.TOGGLE_MINIMIZED_START
    }
}

export function toggleMinimizedStatusEnd(data: constants.JSONObject): ToggleMinimizedEnd {
    return {
        type: constants.TOGGLE_MINIMIZED_END,
        data: data
    }
}

export function toggleMinimizedStatus (dimensionValue: string, dimensionsMinimizedStatus: JSONObject) {
    return (dispatch: Dispatch<actions.SalesDataAction>) => {

        dispatch(toggleMinimizedStatusStart());
        if (!dimensionsMinimizedStatus[dimensionValue] || dimensionsMinimizedStatus[dimensionValue] === `max`) {
            dimensionsMinimizedStatus[dimensionValue] = `min`
        } else {
            dimensionsMinimizedStatus[dimensionValue] = `max`
        }
        const newMinimizedStatus = _.clone(dimensionsMinimizedStatus);
        dispatch(toggleMinimizedStatusEnd(newMinimizedStatus));
    }
};