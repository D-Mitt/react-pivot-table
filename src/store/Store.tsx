export interface SalesDataState {
    metric: string;
    loading: boolean;
    rowDimensions: string[];
    colDimensions: string[];
    salesOrdersData: object;
    dimensionMinimizedStatus: object;
}