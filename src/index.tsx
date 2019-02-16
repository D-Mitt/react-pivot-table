import * as React from 'react';
import * as ReactDOM from 'react-dom';
import PivotTable from './containers/PivotTableContainer';
import { Provider } from 'react-redux';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import 'bootstrap/dist/css/bootstrap.min.css';

import configureStore from './store/configureStore';

const store = configureStore({
    title: 'SUM SALES',
    loading: false,
    salesOrdersData: {}
});

ReactDOM.render(
    <Provider store={store}>
        <PivotTable />
    </Provider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
