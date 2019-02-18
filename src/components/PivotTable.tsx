import * as React from "react";
import {JSONObject, JSONValue} from "../constants/constants";
import * as _ from 'lodash';
import ArrayLike = jasmine.ArrayLike;

export interface PivotTableProps {
    metric?: string;
    loading?: boolean;
    rowDimensions?: string[];
    colDimensions?: string[];
    salesOrdersData?: JSONObject;
    dimensionMinimizedStatus?: JSONObject;
    importSalesOrders?: () => void;
    toggleMinimizedStatus?: (dimensionValue: string, dimensionMinimizedStatus: JSONObject) => void;
};

export interface TitleHeadingProps {
    metric?: string;
    importSalesOrders?: () => void;
};

export interface DisplayDataProps {
    metric?: string;
    loading?: boolean;
    rows?: string[];
    cols?: string[];
    salesOrdersData?: JSONObject;
    toggleMinimizedStatus?: (dimensionValue: string, dimensionMinimizedStatus: JSONObject) => void;
    dimensionMinimizedStatus?: JSONObject;
};

const TitleHeading = ({metric, importSalesOrders}: TitleHeadingProps) => {
    return (<div className={`titleHeading`}>
                <div className={`title`} id={`title`}>
                    {`${_.toUpper(`SUM ${metric}`)}`}
                </div>
            <button className={`importButton`} onClick = {importSalesOrders} >Import Data</button>
            </div>
    );
};

/*
    Recursively find all unique dimensions under a previous dimension. Once the last dimension is reached, filter
    on these dimensions and sum the values.
 */
export const buildDataSet = (dimensionObj: JSONObject,
                             previousDimension: number,
                             combinedDimensions: string[],
                             data: ArrayLike<JSONObject>,
                             metric: string): any => {

    let newDimensionNumber = previousDimension + 1;

    if (newDimensionNumber === combinedDimensions.length) {

        return sumMetric(metric, data, combinedDimensions, dimensionObj);
    } else {
        return _.chain(data)
            .filter(function(o) {
                return o[combinedDimensions[previousDimension]] === dimensionObj[combinedDimensions[previousDimension]];
            })
            .sortBy(combinedDimensions[newDimensionNumber])
            .uniqBy(combinedDimensions[newDimensionNumber])
            .keyBy(combinedDimensions[newDimensionNumber])
            .mapValues((obj) => {

                return buildDataSet(obj, newDimensionNumber, combinedDimensions,
                    data, metric);
            })
            .value();
    }
};

/*
    Look to see if an entry has all requested dimensions and then Sum them and round.
 */
export const sumMetric = (metric: string,
                          data: ArrayLike<JSONObject>,
                          combinedDimensions: string[],
                          dimensionObj: JSONObject): any => {
    let sum:number = _.chain(data)
        .filter((o) => {
            let parametersMatch = true;
            _.forEach(combinedDimensions, (dim) => {
                if (o[dim] !== dimensionObj[dim]) {
                    parametersMatch = false;
                }
            })
            return parametersMatch;
        })
        .sumBy(metric)
        .round()
        .value();

    return sum;
};

// Sub Totals
export const displaySubTotal = (rowDimensions: string[],
                                colDimensions: string[],
                                colDimValues: JSONValue[],
                                rowDimensionValue: string,
                                rowDimensionIndex: number,
                                metric: string,
                                salesOrdersData: JSONObject,
                                showRows: boolean,
                                button: any): any[] => {
    let subTotals: any[] = [];
    if (showRows) {
        subTotals.push(<td key={`sub-total-row-heading`}
                           className={`subTotal`} colSpan={rowDimensions.length}>{`${rowDimensionValue} Total`}</td>);
    } else {
        subTotals.push(<td key={`sub-total-row-heading`}
                           className={`subTotal`} colSpan={rowDimensions.length}>
            {button}
            {`${rowDimensionValue} Total`}
            </td>);
    }

    _.forEach(colDimValues, (obj) => {
        let colDimSubTotal: number = _.chain(salesOrdersData.data as ArrayLike<JSONObject>)
            .filter((o) => {

                return (obj === o[colDimensions[0]] && rowDimensionValue === o[rowDimensions[rowDimensionIndex]]);
            })
            .sumBy(metric)
            .round()
            .value()

        subTotals.push(<td key={`${obj}-sub-total-row-value`}
                           className={`subTotalValue`}>{colDimSubTotal.toLocaleString()}</td>);
    });

    return subTotals;
}

// Grand Totals
export const displayGrandTotals = (rowDimensions: string[],
                                   colDimensions: string[],
                                   colDimValues: JSONValue[],
                                   metric: string,
                                   salesOrdersData: JSONObject): any[] => {
    let grandTotals: any[] = [];
    grandTotals.push(<td key={`grand-total-row-heading`}
                         className={`grandTotal`} colSpan={rowDimensions.length}>{`Grand Total`}</td>);

    _.forEach(colDimValues, (obj) => {
        let colDimGrandTotal: number = _.chain(salesOrdersData.data as ArrayLike<JSONObject>)
            .filter((o) => {
                return obj === o[colDimensions[0]];
            })
            .sumBy(metric)
            .round()
            .value()
        grandTotals.push(<td key={`${obj}-grand-total-row-value`}
                             className={`grandTotalValue`}>{colDimGrandTotal.toLocaleString()}</td>);
    });

    return grandTotals;
}

export const getRowHeadings = (rowDimensions: string[], cellSize: number[]): any[] => {
    let rowHeadings: any[] = [];
    let leftValue:number = 0;
    let count: number = 0;

    _.forEach(rowDimensions, (obj) => {
        // If last row heading, add shadow border
        if (rowDimensions.indexOf(obj) + 1 ===_.size(rowDimensions)) {
            rowHeadings.push(<td key={`${obj}-row-heading`}
                                 style={{left: `${leftValue}px`}}
                                 className={`finalStickyFirstColDimension`}>{_.capitalize(obj)}</td>);
        } else {
            rowHeadings.push(<td key={`${obj}-row-heading`}
                                 style={{left: `${leftValue}px`}}
                                 className={`leftStickyFirstColDimension`}>{_.capitalize(obj)}</td>);
            leftValue += cellSize[count];
        }
        count++;
    });

    return rowHeadings;
}

export const getColHeadings = (colDimValues: JSONValue[], colSpan: number): any[] => {
    let colHeadings: any[] = [];
    _.forEach(colDimValues, (obj) => {
        colHeadings.push(<td key={`${obj}-col-heading`} colSpan={colSpan} className={`colDimension`}>{obj}</td>);
    });

    return colHeadings;
}

const getFilteredData = (data: ArrayLike<JSONObject>, combinedDimensions: string[], metric: string): JSONObject => {
    return _.chain(data)
        .sortBy(combinedDimensions[0])
        .uniqBy(combinedDimensions[0])
        .keyBy(combinedDimensions[0])
        .mapValues((obj) => {

            return buildDataSet(obj, 0, combinedDimensions,
                data, metric as string);
        })
        .value();
}

const getColDimensionValues = (data: ArrayLike<JSONObject>, colDimension: string): JSONValue[] => {
    return _.chain(data)
        .sortBy(colDimension)
        .uniqBy(colDimension)
        .map(colDimension)
        .value();
}

const getPlusMinusButton = (toggleMinimizedStatus: (dimensionValue: string, dimensionMinimizedStatus: JSONObject) => void,
                            showRows: boolean,
                            dimensionValue: string,
                            dimensionMinimizedStatus: JSONObject): any => {
    if (toggleMinimizedStatus) {

        if (showRows) {
            return <button key={`${dimensionValue}-button`}
                           className={`plusMinusButton`}
                             onClick = {(e) => {
                                 toggleMinimizedStatus(dimensionValue, dimensionMinimizedStatus) as any
                             }} >
                {`-`}
            </button>
        } else {
           return <button key={`${dimensionValue}-button`}
                          className={`plusMinusButton`}
                             onClick = {(e) => {
                                 toggleMinimizedStatus(dimensionValue, dimensionMinimizedStatus) as any
                             }} >
                {`+`}
            </button>
        }
    }
}

const DisplayData = ({metric, loading, rows, cols, salesOrdersData, toggleMinimizedStatus, dimensionMinimizedStatus}: DisplayDataProps) => {
    let rowDimensions: string[] = rows as string[];
    let colDimensions: string[] = cols as string[];
    let combinedDimensions = rowDimensions.concat(colDimensions);

    if (loading) {
        return (
            <div className={`loading`}>
                Loading...
            </div>
        );
    } else if (salesOrdersData && salesOrdersData.data) {

        // filter data based on row and column dimensions specified in the code
        let filteredData: JSONObject = getFilteredData(salesOrdersData.data as ArrayLike<JSONObject>,
            combinedDimensions,
            metric as string);

        let colDimValues = getColDimensionValues(salesOrdersData.data as ArrayLike<JSONObject>,
            colDimensions[0]);

        let tds: any[] = [];
        let trs: any[] = [];

        _.forEach(filteredData as JSONObject, (dimension, i) => {
            tds = [];
            let status: any = _.find(dimensionMinimizedStatus as JSONObject, (value, ind) => {
                return i === ind;
            });
            let showRows: boolean = (!status || status as string === `max`);
            let button: any = getPlusMinusButton(toggleMinimizedStatus as
                (dimensionValue: string, dimensionMinimizedStatus: JSONObject) => void,
                showRows,
                i,
                dimensionMinimizedStatus as JSONObject);

            if (showRows) {
                if (rowDimensions.length === 1) {
                    tds.push(<td key={`${i}-row-dimension`}
                                 className={`secondRowDimension`} rowSpan={_.size(filteredData[i] as JSONObject)}>
                        {button}
                        {i}
                    </td>);
                } else {
                    tds.push(<td key={`${i}-row-dimension`}
                                 className={`firstRowDimension`} rowSpan={_.size(filteredData[i] as JSONObject)}>
                                {button}
                                {i}
                            </td>);

                    // TODO: Recursive function here to deal with more than 2 row dimensions
                    let isNewRow = false;
                    let dimTotals: JSONObject = {};
                    _.forEach(dimension as JSONObject, (dim2, ind2) => {
                        let totals: number[] = [];
                        if (isNewRow) {
                            tds = [];
                        }
                        tds.push(<td key={`${ind2}-row-dimension`} className={`secondRowDimension`}>{ind2}</td>);

                        _.forEach(colDimValues as ArrayLike<string>, (obj) => {
                            if (!dim2 || !dim2[obj]) {
                                tds.push(<td key={`${ind2}-${obj}-value`} className={`valueRow`}>0</td>);
                                totals.push(0);
                            } else {
                                tds.push(<td key={`${ind2}-${obj}-value`} className={`valueRow`}>{dim2[obj].toLocaleString()}</td>);
                                totals.push(dim2[obj]);
                            }
                        });

                        dimTotals[ind2] = totals;
                        trs.push(<tr key={`${ind2}-row`}>{tds}</tr>);
                        isNewRow = true;
                    });
                }
            }

            // Add a SubTotal Row
            trs.push(<tr key={`${i}-subtotal-row`}>{displaySubTotal(rowDimensions,
                colDimensions,
                colDimValues,
                i, 0, metric as string, salesOrdersData, showRows, button)}</tr>)
        });

        return (
            <div>
                <table>
                    <thead>
                        <tr>
                            <th className={`rowHeading`} colSpan={_.size(rowDimensions)}>PRODUCTS</th>
                            <th className={`colHeading`} colSpan={Math.min(_.size(colDimValues), 8)}>{_.toUpper(colDimensions[0])}</th>
                            <th style={{backgroundColor: `rgba(2, 40, 115, 1)`}}
                                colSpan={_.size(colDimValues) - Math.min(8, _.size(colDimValues))}>
                                {}
                            </th>
                        </tr>
                        <tr>
                            {getRowHeadings(rowDimensions, [144])}
                            {getColHeadings(colDimValues, 1)}
                        </tr>
                    </thead>
                    <tbody>
                        {trs}
                        <tr>
                            {displayGrandTotals(rowDimensions, colDimensions, colDimValues, metric as string, salesOrdersData)}
                        </tr>
                    </tbody>

                </table>
            </div>
        );
    }
    return(<div></div>);
};

const PivotTable = ({metric,
                        loading,
                        rowDimensions,
                        colDimensions,
                        salesOrdersData,
                        dimensionMinimizedStatus,
                        importSalesOrders,
                        toggleMinimizedStatus}: PivotTableProps) => {

    return (
        <div className="PivotTable">
            <TitleHeading metric={metric} importSalesOrders={importSalesOrders} />
            <DisplayData metric={metric}
                         loading={loading}
                         rows={rowDimensions}
                         cols={colDimensions}
                         salesOrdersData={salesOrdersData}
                         toggleMinimizedStatus={toggleMinimizedStatus}
                         dimensionMinimizedStatus={dimensionMinimizedStatus}/>
        </div>
    );
};

export default PivotTable;
