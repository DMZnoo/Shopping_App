import * as actionTypes from "../actions/actionTypes";
import { Map } from 'immutable';
import AsyncStorage from "@react-native-async-storage/async-storage";

export type IProduct = { name: string; price: number };

export interface IState {
  loading: boolean;
  products: IProduct[];
  total: number;
  cart: {
    [product: string]: number
  };
}

const products: IProduct[] = [
  { name: "Sledgehammer", price: 125.75 },
  { name: "Axe", price: 190.5 },
  { name: "Bandsaw", price: 562.13 },
  { name: "Chisel", price: 12.9 },
  { name: "Hacksaw", price: 18.45 },
];

const initState: IState = {
  loading: false,
  products: products,
  cart: {},
  total: 0,
};

const _storeData = async (data: IState) => {
  try {
    await AsyncStorage.setItem(
      'cart-data',
      JSON.stringify(data)
    );
  } catch (err) {
    console.log("Error setting data: ", err);
  }
};

export default function reducer(
  state = initState,
  action: { type: string; item?: string, data?: IState }
) {
  switch (action.type) {
    case actionTypes.SHOW_LOADING: {
      return {
        ...state,
        loading: true
      };
    }

    case actionTypes.HIDE_LOADING: {
      return {
        ...state,
        loading: false
      };
    }

    case actionTypes.ADD_ITEM: {
      let tempTotal = state.total;
      let tempCart = { ...state.cart };
      
      products.forEach((product) => {
        if (product.name === action.item) {
          if (Object.keys(tempCart).indexOf(product.name) != -1) {
            tempCart[product.name]++;
          } else {
            tempCart[product.name] = 1;
          }
          tempTotal += product.price;
          tempTotal = Math.round(tempTotal * 100) / 100;
        }
      });

      _storeData({
        ...state,
        cart: tempCart,
        total: tempTotal
      });
      return {
        ...state,
        cart: tempCart,
        total: tempTotal
      };
    }

    case actionTypes.REMOVE_ITEM: {
      let tempTotal = state.total;
      let tempCart = { ...state.cart };

      products.forEach((product) => {
        if (product.name === action.item) {
          if (Object.keys(tempCart).indexOf(product.name) != -1) {
            if (tempCart[product.name] > 1) {
              tempCart[product.name]--;
            } else {
              delete tempCart[product.name];
            }
            tempTotal -= product.price;
            tempTotal = Math.round(tempTotal * 100) / 100;
          }
        }
      });
      
      _storeData({
        ...state,
        cart: tempCart,
        total: tempTotal
      });
      return {
        ...state,
        cart: tempCart,
        total: tempTotal
      };
    }
      
    case actionTypes.SET_CART: {
      return {
        ...action.data
      }
    }
      
    case actionTypes.RESET_CART: {
      _storeData({
        ...initState
      });
      return initState;
    };
      
    default:
      return state;
  }
}
