import PivotTable from '../components/PivotTable';
import * as actions from '../actions/PivotTableActions';
import { StoreState } from '../store/Store';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

export function mapStateToProps({ title, loading, salesOrdersData}: StoreState) {
    return {
        title,
        loading,
        salesOrdersData
    }
}

export function mapDispatchToProps(dispatch: Dispatch<any>) {
    return {
        importSalesOrders: () => dispatch(actions.fetchSalesOrders())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PivotTable);