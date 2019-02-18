This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

# A Simple Pivot Table
## Build and Run
### Running App
- Build by running ```npm install```
- Run app with ```npm start```
- In a browser, navigate to ```http://localhost:3000```

### Running Tests
- Run ```npm run test```

## Brief Architectural Overview
- To create this app I utilized the `create-react-app` module from npm.
- Tests can be found in the component directories.
- Redux is used for storing state.
- Stateless components are used.
- Jest and Enzyme are used to aid testing.

## Assumptions and Simplifications
- Kept pivot table components within one file for ease of use.
- Currently setup to handle 1-2 row dimensions, 1 column dimension, and one metric value.
- Metric values can only be numbers.

## Next Steps...
- Handle more than 2 types of row dimensions (currently able to retrieve data with more than 2 types of row dimensions, but cannot display).
- Split out components comprising the pivot table into their respective classes.
- Stickiness of columns should be responsive when columns change width.
- Table Sizing for smaller datasets needs to be adjusted
- Currently, data is hardcoded to return when the `Import Data` Button is clicked. commented-out code should be used when API endpoint is determined.
- Split up Reducers.
- Add UI Configuration Items:
  - Color Themes
  - Hide Null/0 values
  - Table Density
  - Ability to add or remove dimensions, metrics and regenerate table
