import { IState } from "../reducers/reducer";
import * as actions from "./actionTypes";

export function showLoading() {
  return {
    type: actions.SHOW_LOADING,
  };
}

export function hideLoading() {
  return {
    type: actions.HIDE_LOADING,
  };
}

export function addItem(item: string) {
  return {
    type: actions.ADD_ITEM,
    item: item,
  };
}

export function removeItem(item: string) {
  return {
    type: actions.REMOVE_ITEM,
    item: item,
  };
}

export function resetCart() {
  return {
    type: actions.RESET_CART,
  };
}

export function setCart(data: IState) {
  return {
    type: actions.SET_CART,
    data: data
  }
}