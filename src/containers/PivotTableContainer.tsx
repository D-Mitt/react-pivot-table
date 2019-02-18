import PivotTable from '../components/PivotTable';
import * as actions from '../actions/PivotTableActions';
import { SalesDataState } from '../store/Store';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import {JSONObject} from "../constants/constants";

export function mapStateToProps({ metric, loading, rowDimensions, colDimensions,
                                    salesOrdersData, dimensionMinimizedStatus}: SalesDataState) {
    return {
        metric,
        loading,
        rowDimensions,
        colDimensions,
        salesOrdersData,
        dimensionMinimizedStatus
    }
}

export function mapDispatchToProps(dispatch: Dispatch<any>) {
    return {
        importSalesOrders: () => dispatch(actions.fetchSalesOrders()),
        toggleMinimizedStatus: (dimensionValue: string,
                                dimensionMinimizedStatus: JSONObject) =>
            dispatch(actions.toggleMinimizedStatus(dimensionValue, dimensionMinimizedStatus))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PivotTable);