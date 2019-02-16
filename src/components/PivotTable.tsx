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

export const filterByRowDimensions = (rowDimensions: string[]) => {
    // Make JSON Array of first row dimensions

};

const TitleHeading = ({title, importSalesOrders}: TitleHeadingProps) => {
    return (<div>
            <div>
                {title}
            </div>
            <div>
                <button
                    onClick = {importSalesOrders} > Import
                    Data </button>
            </div></div>
    );
};

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
            .uniqBy(combinedDimensions[newDimensionNumber])
            .keyBy(combinedDimensions[newDimensionNumber])
            .mapValues((obj) => {

                return buildDataSet(obj, newDimensionNumber, combinedDimensions,
                    salesOrdersData, metric);
            })
            .value();
    }
};

export const sumMetric = (metric: string,
                          salesOrdersData: JSONObject,
                          combinedDimensions: string[],
                          dimensionObj: JSONObject): any => {
    return _.chain(salesOrdersData.data as ArrayLike<JSONObject>)
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
        .value();
};

const DisplayData = ({loading, salesOrdersData}: DisplayDataProps) => {
    if (loading) {
        return (
            <div>
                Loading...
            </div>
        );
    } else if (salesOrdersData && salesOrdersData.data) {

        let rowDimensions = ['category', 'subCategory'];
        let colDimensions = ['state'];
        let metric = 'sales';
        let combinedDimensions = rowDimensions.concat(colDimensions);

        // console.log(salesOrdersData);
        // console.log(salesOrdersData as JSONObject);
        // console.log(salesOrdersData.data as JSONArray);
        // console.log(salesOrdersData.data[0] as JSONObject);
        // console.log(salesOrdersData.data[0]['category'] as JSONValue);

        let filteredData = _.chain(salesOrdersData.data as ArrayLike<JSONObject>)
            .uniqBy(combinedDimensions[0])
            .keyBy(combinedDimensions[0])
            .mapValues((obj) => {

                return buildDataSet(obj, 0, combinedDimensions,
                    salesOrdersData, metric);
            })
            .value();
        console.log("filteredData", filteredData);

        // let test2 = _.chain(salesOrdersData.data as ArrayLike<JSONObject>)
        //     .uniqBy(rowDimensions[0])
        //     .map((obj) => {
        //         return obj.category;
        //     })
        //     .value();
        // console.log("test2", test2);


        return (
            <div>
                <p>{salesOrdersData.data[0][rowDimensions[0]]}</p>
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
