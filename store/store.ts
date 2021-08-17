import { createStore } from "redux";
import reducer from "./reducers/reducer";

const store = createStore(
  reducer,
  typeof window !== "undefined" &&
    window.__REDUX_DEVTOOLS_EXTENSION__ &&
    window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;
