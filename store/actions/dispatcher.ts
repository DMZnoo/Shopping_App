import { IState } from "../reducers/reducer";
import store from "../store";
import * as actions from "./index";

export function showLoading() {
  store.dispatch(actions.showLoading());
}

export function hideLoading() {
  store.dispatch(actions.hideLoading());
}

export function addItem(item: string) {
  store.dispatch(actions.addItem(item));
}

export function removeItem(item: string) {
  store.dispatch(actions.removeItem(item));
}

export function resetCart() {
  store.dispatch(actions.resetCart());
}

export function setCart(data: IState) {
  store.dispatch(actions.setCart(data));
}