import { StackNavigationProp } from "@react-navigation/stack";
import * as React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Overlay, ListItem } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";
import tailwind from "tailwind-rn";
import RaisedButton from "../components/RaisedButton";

import { Text } from "../components/Themed";
import { hideLoading, resetCart, showLoading } from "../store/actions";
import { IState } from "../store/reducers/reducer";
import { RootStackParamList } from "../types";
type CheckOutListScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "CheckOut"
>;

interface ICheckOut {
  navigation: CheckOutListScreenNavigationProp;
}
const Checkout: React.FC<ICheckOut> = ({ navigation }) => {
  const total = useSelector((state: IState) => state.total);
  const cart = useSelector((state: IState) => state.cart);
  const products = useSelector((state: IState) => state.products);
  const loading = useSelector((state: IState) => state.loading);
  const dispatch = useDispatch();
  const [visible, setVisible] = React.useState(false);

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.horizontal]}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={tailwind("mt-20")}>
      <Overlay isVisible={visible}>
        <View style={tailwind("w-80 h-80 flex items-center justify-center")}>
          <Text style={tailwind("font-bold text-3xl mt-4 mb-4")}>
            Congratulations!
          </Text>
          <Text style={tailwind("text-lg mb-4")}>
            Your order is on its way!
          </Text>
          <RaisedButton
            buttonStyle={{ color: "white", backgroundColor: "green" }}
            onPress={() => {
              dispatch(showLoading());
              toggleOverlay();
              setTimeout(() => dispatch(resetCart()), 1000);
              setTimeout(() => {
                navigation.navigate("ShoppingList");
              }, 1000);
              setTimeout(() => {
                dispatch(hideLoading());
              }, 1000);
            }}
            title="Back to Shopping"
          />
        </View>
      </Overlay>

      <View style={tailwind("p-4")}>
        <Text style={styles.title}>Total: {total}</Text>
        {Object.keys(cart).map((key) => {
          const product = products.find((product) => product.name === key);
          return (
            <ListItem key={key} bottomDivider>
              <ListItem.Content>
                <View
                  style={tailwind(
                    "flex flex-row items-center justify-between w-full"
                  )}
                >
                  <Text>
                    {key} ($
                    {product && product.price})
                  </Text>
                  <Text style={tailwind("ml-1")}>x {cart[key]}</Text>
                </View>
              </ListItem.Content>
            </ListItem>
          );
        })}
        <View style={tailwind("mt-4")}>
          <RaisedButton
            buttonStyle={{
              color: "white",
              backgroundColor: "green",
            }}
            onPress={toggleOverlay}
            title="Place Order"
          />
        </View>
        <View style={tailwind("mt-4")}>
          <RaisedButton
            buttonStyle={{
              color: "white",
              backgroundColor: "red",
            }}
            onPress={() => navigation.navigate("ShoppingList")}
            title="Cancel Order"
          />
        </View>
      </View>
    </View>
  );
};
export default Checkout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
});
