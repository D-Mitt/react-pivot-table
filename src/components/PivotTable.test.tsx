import * as React from 'react';
import * as enzyme from 'enzyme';
import PivotTable from './PivotTable';
import {JSONObject} from "../constants/constants";

describe("TitleHeading", () => {
    it('renders the correct title when loaded', () => {
        const pivotTable = enzyme.shallow(newPivotTable());
        const titleHeading = pivotTable.find("TitleHeading");

        expect(titleHeading.dive().find(".title").text()).toEqual('SUM SALES')
    });

    it('renders the correct Import Button when loaded', () => {
        const pivotTable = enzyme.shallow(newPivotTable());
        const titleHeading = pivotTable.find("TitleHeading");
        const importButton = titleHeading.dive().find(".importButton");

        expect(importButton.text()).toEqual('Import Data');
    });

    it('renders the correct data when Import Data button clicked', () => {
        const pivotTable = enzyme.shallow(newPivotTable());
        const titleHeading = pivotTable.find("TitleHeading");
        // console.log(titleHeading.dive().debug());
        const importButton = titleHeading.dive().find(".importButton");

        importButton.simulate('click');
        expect(defaultImportSalesOrders).toHaveBeenCalledTimes(1);
    });
});

describe("DisplayData", () => {
    it('renders loading message if data is loading', () => {
        const pivotTable = enzyme.shallow(createPivotTable('sales', true, [], [], {}, {}));
        const displayData = pivotTable.find("DisplayData");

        const loading = displayData.dive().find(".loading");
        expect(loading.text()).toEqual("Loading...");
    });

    it('renders table if data is finished loading', () => {
        const pivotTable = enzyme.shallow(createPivotTable('sales',
            false,
            ['category', 'subCategory'],
            ['state'],
            salesData,
            {}));

        const displayData = pivotTable.find("DisplayData");

        const table = displayData.dive().find("table");
        expect(table).toBeTruthy();
    });
});

describe("DisplayData Table Headings", () => {
    it('renders table main rowHeadings', () => {
        const pivotTable = enzyme.shallow(createPivotTable('sales',
            false,
            ['category', 'subCategory'],
            ['state'],
            salesData,
            {}));

        const displayData = pivotTable.find("DisplayData");

        const rowHeading = displayData.dive().find(".rowHeading");
        expect(rowHeading.text()).toEqual("PRODUCTS");
    });

    it('renders table main colHeadings', () => {
        const pivotTable = enzyme.shallow(createPivotTable('sales',
            false,
            ['category', 'subCategory'],
            ['country'],
            salesData,
            {}));

        const displayData = pivotTable.find("DisplayData");
        const colHeading = displayData.dive().find(".colHeading");
        expect(colHeading.text()).toEqual("COUNTRY");
    });

    it('renders row dimension heading', () => {
        const pivotTable = enzyme.shallow(createPivotTable('sales',
            false,
            ['subCategory'],
            ['country'],
            salesData,
            {}));

        const displayData = pivotTable.find("DisplayData");

        const firstColDimension = displayData.dive().find(".finalStickyFirstColDimension");
        expect(firstColDimension.text()).toEqual("Subcategory");
    });

    it('renders 2 row dimension headings', () => {
        const pivotTable = enzyme.shallow(createPivotTable('sales',
            false,
            ['category', 'subCategory'],
            ['country'],
            salesData,
            {}));

        const displayData = pivotTable.find("DisplayData");

        const firstStickyColDimension = displayData.dive().find(".leftStickyFirstColDimension");
        expect(firstStickyColDimension.text()).toEqual("Category");
        const secondStickyColDimension = displayData.dive().find(".finalStickyFirstColDimension");
        expect(secondStickyColDimension.text()).toEqual("Subcategory");
    });

    it('renders multiple row dimension headings', () => {
        const pivotTable = enzyme.shallow(createPivotTable('sales',
            false,
            ['category', 'subCategory', 'region'],
            ['country'],
            salesData,
            {}));

        const displayData = pivotTable.find("DisplayData");

        const firstStickyColDimension = displayData.dive().find(".leftStickyFirstColDimension");
        expect(firstStickyColDimension.at(0).text()).toEqual("Category");
        const secondStickyColDimension = displayData.dive().find(".leftStickyFirstColDimension");
        expect(secondStickyColDimension.at(1).text()).toEqual("Subcategory");
        const lastStickyColDimension = displayData.dive().find(".finalStickyFirstColDimension");
        expect(lastStickyColDimension.text()).toEqual("Region");
    });

    it('renders col dimension heading', () => {
        const pivotTable = enzyme.shallow(createPivotTable('sales',
            false,
            ['subCategory'],
            ['country'],
            salesData,
            {}));

        const displayData = pivotTable.find("DisplayData");
        const firstColDimension = displayData.dive().find(".colDimension");
        expect(firstColDimension.text()).toEqual("United States");
    });

    // TODO: uncomment once ability to do more than one col Dimension
    // it('renders multiple col dimension headings', () => {
    //     const pivotTable = enzyme.shallow(createPivotTable('sales',
    //         false,
    //         ['subCategory'],
    //         ['country', 'state'],
    //         salesData,
    //         {}));
    //
    //     const displayData = pivotTable.find("DisplayData");
    //     console.log(displayData.dive().debug());
    //
    //     const firstColDimension = displayData.dive().at(0).find(".colDimension");
    //     expect(firstColDimension.text()).toEqual("United States");
    //
    //     const lastColDimension = displayData.dive().at(1).find(".colDimension");
    //     expect(lastColDimension.text()).toEqual("Alabama");
    // });
});

describe("DisplayData Table data", () => {
    it('renders table main rowHeadings', () => {
        const pivotTable = enzyme.shallow(createPivotTable('sales',
            false,
            ['category', 'subCategory'],
            ['state'],
            salesData,
            {}));

        const displayData = pivotTable.find("DisplayData");

        const rowHeading = displayData.dive().find(".rowHeading");
        expect(rowHeading.text()).toEqual("PRODUCTS");
    });
});

describe("DisplayData Table plus/minus buttons", () => {
    it('renders table main rowHeadings', () => {
        const pivotTable = enzyme.shallow(createPivotTable('sales',
            false,
            ['category', 'subCategory'],
            ['state'],
            salesData,
            {}));

        const displayData = pivotTable.find("DisplayData");

        const rowHeading = displayData.dive().find(".rowHeading");
        expect(rowHeading.text()).toEqual("PRODUCTS");
    });
});

describe("DisplayData Table plus/minus buttons", () => {
    it('renders plus button on subtotal row when state is minimized', () => {
        const pivotTable = enzyme.shallow(createPivotTable('sales',
            false,
            ['category', 'subCategory'],
            ['state'],
            salesData,
            {"Furniture": "min"}));

        const displayData = pivotTable.find("DisplayData");
        const button = displayData.dive().find(".plusMinusButton");
        expect(button.at(0).text()).toEqual("+");
    });

    it('renders minus button on row heading when state is expanded', () => {
        const pivotTable = enzyme.shallow(createPivotTable('sales',
            false,
            ['category', 'subCategory'],
            ['state'],
            salesData,
            {"Furniture": "max"}));

        const displayData = pivotTable.find("DisplayData");
        const firstRowDimension = displayData.dive().find(".firstRowDimension");
        expect(firstRowDimension.at(0).text()).toEqual("-Furniture");

        const button = displayData.dive().find(".plusMinusButton");
        expect(button.at(0).text()).toEqual("-");
    });

    it('renders minus button on row heading when state does not exist', () => {
        const pivotTable = enzyme.shallow(createPivotTable('sales',
            false,
            ['category', 'subCategory'],
            ['state'],
            salesData,
            {}));

        const displayData = pivotTable.find("DisplayData");

        const firstRowDimension = displayData.dive().find(".firstRowDimension");
        expect(firstRowDimension.at(0).text()).toEqual("-Furniture");

        const button = displayData.dive().find(".plusMinusButton");
        expect(button.at(0).text()).toEqual("-");
    });

    it('renders minus and plus buttons', () => {
        const pivotTable = enzyme.shallow(createPivotTable('sales',
            false,
            ['category', 'subCategory'],
            ['state'],
            salesData,
            {"Furniture": "max",
            "Office Supplies": "min"}));

        const displayData = pivotTable.find("DisplayData");
        const firstRowDimension = displayData.dive().find(".firstRowDimension");
        const subTotalRow = displayData.dive().find(".subTotal");
        expect(firstRowDimension.at(0).text()).toEqual("-Furniture");

        const button = displayData.dive().find(".plusMinusButton");
        expect(button.at(0).text()).toEqual("-");

        expect(subTotalRow.at(1).text()).toEqual("+Office Supplies Total");
        expect(button.at(1).text()).toEqual("+");
    });
});

describe("DisplayData Table errors", () => {

});

const newPivotTable: any = () => {
    return <PivotTable  metric={'sales'}
                        loading={false}
                        rowDimensions={['segment', 'subCategory']}
                        colDimensions={['state']}
                        salesOrdersData={{}}
                        dimensionMinimizedStatus={{}}
                        importSalesOrders={defaultImportSalesOrders}
                        toggleMinimizedStatus={defaultToggleMinimizedStatus} />;
}

const createPivotTable: any = (metric: string,
                               loading: boolean,
                               rowDimensions: string[],
                               colDimensions: string[],
                               salesOrderData: JSONObject,
                               dimensionMinimizedStatus: JSONObject) => {
    return <PivotTable  metric={metric}
                        loading={loading}
                        rowDimensions={rowDimensions}
                        colDimensions={colDimensions}
                        salesOrdersData={salesOrderData}
                        dimensionMinimizedStatus={dimensionMinimizedStatus}
                        importSalesOrders={defaultImportSalesOrders}
                        toggleMinimizedStatus={defaultToggleMinimizedStatus} />;
}

const salesData = {
    data: [
        {
            "rowId": 1,
            "orderId": "CA-2016-152156",
            "orderDate": "11/8/16",
            "shipDate": "11/11/16",
            "customerId": "CG-12520",
            "shipMode": "Second Class",
            "customerName": "Claire Gute",
            "segment": "Consumer",
            "country": "United States",
            "city": "Henderson",
            "state": "Kentucky",
            "postalCode": 42420,
            "region": "South",
            "productId": "FUR-BO-10001798",
            "category": "Furniture",
            "subCategory": "Bookcases",
            "productName": "Bush Somerset Collection Bookcase",
            "sales": 261.96,
            "quantity": 2,
            "discount": 0,
            "profit": 41.9136
        },
        {
            "rowId": 2,
            "orderId": "CA-2016-152156",
            "orderDate": "11/8/16",
            "shipDate": "11/11/16",
            "shipMode": "Second Class",
            "customerId": "CG-12520",
            "customerName": "Claire Gute",
            "segment": "Consumer",
            "country": "United States",
            "city": "Henderson",
            "state": "Kentucky",
            "postalCode": 42420,
            "region": "South",
            "productId": "FUR-CH-10000454",
            "category": "Furniture",
            "subCategory": "Chairs",
            "productName": "Hon Deluxe Fabric Upholstered Stacking Chairs, Rounded Back",
            "sales": 731.94,
            "quantity": 3,
            "discount": 0,
            "profit": 219.582
        },
        {
            "rowId": 3,
            "orderId": "CA-2016-138688",
            "orderDate": "6/12/16",
            "shipDate": "6/16/16",
            "shipMode": "Second Class",
            "customerId": "DV-13045",
            "customerName": "Darrin Van Huff",
            "segment": "Corporate",
            "country": "United States",
            "city": "Los Angeles",
            "state": "California",
            "postalCode": 90036,
            "region": "West",
            "productId": "OFF-LA-10000240",
            "category": "Office Supplies",
            "subCategory": "Labels",
            "productName": "Self-Adhesive Address Labels for Typewriters by Universal",
            "sales": 14.62,
            "quantity": 2,
            "discount": 0,
            "profit": 6.8714
        },
        {
            "rowId": 4,
            "orderId": "US-2015-108966",
            "orderDate": "10/11/15",
            "shipDate": "10/18/15",
            "shipMode": "Standard Class",
            "customerId": "SO-20335",
            "customerName": "Sean O'Donnell",
            "segment": "Consumer",
            "country": "United States",
            "city": "Fort Lauderdale",
            "state": "Florida",
            "postalCode": 33311,
            "region": "South",
            "productId": "FUR-TA-10000577",
            "category": "Furniture",
            "subCategory": "Tables",
            "productName": "Bretford CR4500 Series Slim Rectangular Table",
            "sales": 957.5775,
            "quantity": 5,
            "discount": 0.45,
            "profit": -383.031
        },
        {
            "rowId": 5,
            "orderId": "US-2015-108966",
            "orderDate": "10/11/15",
            "shipDate": "10/18/15",
            "shipMode": "Standard Class",
            "customerId": "SO-20335",
            "customerName": "Sean O'Donnell",
            "segment": "Consumer",
            "country": "United States",
            "city": "Fort Lauderdale",
            "state": "Florida",
            "postalCode": 33311,
            "region": "South",
            "productId": "OFF-ST-10000760",
            "category": "Office Supplies",
            "subCategory": "Storage",
            "productName": "Eldon Fold 'N Roll Cart System",
            "sales": 22.368,
            "quantity": 2,
            "discount": 0.2,
            "profit": 2.5164
        }
    ]
};

const defaultImportSalesOrders = jest.fn()
const defaultToggleMinimizedStatus = jest.fn();