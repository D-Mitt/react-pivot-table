import * as React from 'react';
import * as ReactDOM from 'react-dom';
import PivotTable from './containers/PivotTableContainer';
import { Provider } from 'react-redux';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

import configureStore from './store/configureStore';

const store = configureStore({
    metric: 'sales',
    loading: false,
    rowDimensions: ['segment', 'subCategory'],
    colDimensions: ['state'],
    salesOrdersData: {},
    dimensionMinimizedStatus: {}
});

ReactDOM.render(
    <Provider store={store}>
        <PivotTable />
    </Provider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
