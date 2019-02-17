import * as React from "react";
import { JSONObject} from "../constants/constants";
import * as _ from 'lodash';
import ArrayLike = jasmine.ArrayLike;

export interface PivotTableProps {
    title?: string;
    loading?: boolean;
    rowDimensions?: string[];
    colDimenions?: string[];
    metric?: string;
    salesOrdersData?: JSONObject;
    importSalesOrders?: () => void;
};

export interface TitleHeadingProps {
    title?: string;
    importSalesOrders?: () => void;
};

export interface DisplayDataProps {
    loading?: boolean;
    salesOrdersData?: JSONObject;
};

const TitleHeading = ({title, importSalesOrders}: TitleHeadingProps) => {
    return (<div className={`titleHeading`}>
                <div className={`title`}>
                    {title}
                </div>
            <button className={`importButton`} onClick = {importSalesOrders} > Import Data </button>
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
                             salesOrdersData: JSONObject,
                             metric: string): any => {

    let newDimensionNumber = previousDimension + 1;

    if (newDimensionNumber === combinedDimensions.length) {

        return sumMetric(metric, salesOrdersData, combinedDimensions, dimensionObj);
    } else {
        return _.chain(salesOrdersData.data as ArrayLike<JSONObject>)
            .filter(function(o) {
                return o[combinedDimensions[previousDimension]] === dimensionObj[combinedDimensions[previousDimension]];
            })
            .sortBy(combinedDimensions[newDimensionNumber])
            .uniqBy(combinedDimensions[newDimensionNumber])
            .keyBy(combinedDimensions[newDimensionNumber])
            .mapValues((obj) => {

                return buildDataSet(obj, newDimensionNumber, combinedDimensions,
                    salesOrdersData, metric);
            })
            .value();
    }
};

/*
    Look to see if an entry has all requested dimensions and then Sum them and round.
 */
export const sumMetric = (metric: string,
                          salesOrdersData: JSONObject,
                          combinedDimensions: string[],
                          dimensionObj: JSONObject): any => {
    let sum:number = _.chain(salesOrdersData.data as ArrayLike<JSONObject>)
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

// const numberWithCommas = (x:number):string => {
//     return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
// }

const DisplayData = ({loading, salesOrdersData}: DisplayDataProps) => {
    if (loading) {
        return (
            <div className={`loading`}>
                Loading...
            </div>
        );
    } else if (salesOrdersData && salesOrdersData.data) {

        let rowDimensions = ['category', 'subCategory'];
        let colDimensions = ['state'];
        let metric = 'sales';
        let combinedDimensions = rowDimensions.concat(colDimensions);

        // filter data based on row and column dimensions specified in the code
        let filteredData = _.chain(salesOrdersData.data as ArrayLike<JSONObject>)
            .sortBy(combinedDimensions[0])
            .uniqBy(combinedDimensions[0])
            .keyBy(combinedDimensions[0])
            .mapValues((obj) => {

                return buildDataSet(obj, 0, combinedDimensions,
                    salesOrdersData, metric);
            })
            .value();

        let colDim = _.chain(salesOrdersData.data as ArrayLike<JSONObject>)
            .sortBy(colDimensions[0])
            .uniqBy(colDimensions[0])
            .map(colDimensions[0])
            .value();
        let tds: any[] = [];
        let trs: any[] = [];

        _.forEach(filteredData, (dimension, i) => {
            tds = [];
            tds.push(<td className={`firstRowDimension`} rowSpan={_.size(filteredData[i])}>{i}</td>);
            let isNewRow = false;
            let dimTotals: JSONObject = {};
            _.forEach(dimension, (dim2, ind2) => {
                let totals: number[] = [];
                if (isNewRow) {
                    tds = [];
                }
                tds.push(<td className={`secondRowDimension`}>{ind2}</td>);

                _.forEach(colDim as ArrayLike<string>, (obj) => {
                    if (!dim2[obj]) {
                        tds.push(<td>0</td>);
                        totals.push(0);
                    } else {
                        tds.push(<td>{dim2[obj].toLocaleString()}</td>);
                        totals.push(dim2[obj]);
                    }
                });

                dimTotals[ind2] = totals;
                trs.push(<tr>{tds}</tr>);
                isNewRow = true;
            });
            let subTotal: any[] = [];
            subTotal.push(<td className={`subTotal`} colSpan={rowDimensions.length}>{`${i} Total`}</td>);

            for(let j = 0; j < colDim.length; j++) {
                let colDimTotal: number = 0;
                _.forEach(dimTotals, (array) => {
                    if (array) {
                        colDimTotal += array[j];
                    }
                })
                subTotal.push(<td className={`subTotalValue`}>{colDimTotal.toLocaleString()}</td>);
            }

            trs.push(<tr>{subTotal}</tr>)
        });

        let colHeadings: any[] = [];
        let rowHeadings: any[] = [];
        let leftValue:number = 0;

        _.forEach(rowDimensions, (obj) => {
            // If last row heading, add shadow border
            if (rowDimensions.indexOf(obj) + 1 ===_.size(rowDimensions)) {
                rowHeadings.push(<td style={{left: `${leftValue}px`}} className={`finalStickyFirstColDimension`}>{_.capitalize(obj)}</td>);
            } else {
                rowHeadings.push(<td style={{left: `${leftValue}px`}} className={`leftStickyFirstColDimension`}>{_.capitalize(obj)}</td>);
                leftValue += 115;
            }
        });

        _.forEach(colDim as ArrayLike<string>, (obj) => {
            colHeadings.push(<td className={`firstColDimension`}>{obj}</td>);
        });

        // Grand Totals
        let grandTotals: any[] = [];
        grandTotals.push(<td className={`grandTotal`} colSpan={rowDimensions.length}>{`Grand Total`}</td>);

        _.forEach(colDim, (obj) => {
            let colDimGrandTotal: number = _.chain(salesOrdersData.data as ArrayLike<JSONObject>)
                .filter((o) => {
                    return obj === o[colDimensions[0]];
                })
                .sumBy(metric)
                .round()
                .value()
            grandTotals.push(<td className={`grandTotalValue`}>{colDimGrandTotal.toLocaleString()}</td>);
        });

        return (
            <div>
                <table>
                    <thead>
                        <tr>
                            <th className={`rowHeading`} colSpan={_.size(rowDimensions)}>PRODUCTS</th>
                            <th className={`colHeading`} colSpan={Math.min(_.size(colDim), 8)}>{_.toUpper(colDimensions[0])}</th>
                            <th style={{backgroundColor: `rgba(2, 40, 115, 1);`}} colSpan={_.size(colDim) - 8}>{}</th>
                        </tr>
                        <tr>
                            {rowHeadings}
                            {colHeadings}
                        </tr>
                    </thead>
                    <tbody>
                        {trs}
                        <tr>
                            {grandTotals}
                        </tr>
                    </tbody>

                </table>
            </div>
        );
    }
    return(<div></div>);
};

const PivotTable = ({title, loading, salesOrdersData, importSalesOrders}: PivotTableProps) => {

    return (
        <div className="PivotTable">
            <TitleHeading title={title} importSalesOrders={importSalesOrders} />
            <DisplayData loading={loading} salesOrdersData={salesOrdersData} />
        </div>
    );
};

export default PivotTable;
