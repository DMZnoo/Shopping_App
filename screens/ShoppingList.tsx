import * as React from "react";
import { FlatList, StyleSheet, View, ActivityIndicator } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { Text } from "../components/Themed";
import { IState } from "../store/reducers/reducer";
import { Overlay, PricingCard, ListItem } from "react-native-elements";
import { StackNavigationProp } from "@react-navigation/stack";
import Toast from "react-native-root-toast";

import { addItem, removeItem, setCart } from "../store/actions";
import tailwind from "tailwind-rn";
import RaisedButton from "../components/RaisedButton";
import { RootStackParamList } from "../types";
import AsyncStorage from "@react-native-async-storage/async-storage";
type ShoppingListScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ShoppingList"
>;

interface IShoppingList {
  navigation: ShoppingListScreenNavigationProp;
}

const _getData = async () => {
  try {
    let data = await AsyncStorage.getItem("cart-data");
    return data != null ? JSON.parse(data) : null;
  } catch (err) {
    console.log("Error getting data: ", err);
  }
};
const ShoppingList: React.FC<IShoppingList> = ({ navigation }) => {
  const products = useSelector((state: IState) => state.products);
  const total = useSelector((state: IState) => state.total);
  const cart = useSelector((state: IState) => state.cart);
  const loading = useSelector((state: IState) => state.loading);
  const dispatch = useDispatch();
  const [visible, setVisible] = React.useState<boolean>(false);
  const [showToast, toggleToast] = React.useState<boolean>(false);
  const [addedItem, setAddedItem] = React.useState<string>("");
  const toggleOverlay = () => {
    setVisible(!visible);
  };

  React.useEffect(() => {
    _getData().then((data) => {
      if (data != null) {
        dispatch(setCart(data));
      }
    });
  }, []);

  const renderCurrentCart = () => (
    <Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
      <View style={tailwind("w-80")}>
        <Text>Total: {total}</Text>
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
                  <View style={tailwind("flex flex-row items-center")}>
                    <Text>
                      {key} ($
                      {product && product.price})
                    </Text>
                    <Text style={tailwind("ml-1")}>x {cart[key]}</Text>
                  </View>
                  <RaisedButton
                    buttonStyle={{
                      color: "white",
                      backgroundColor: "red",
                      marginLeft: "auto",
                    }}
                    onPress={() => {
                      dispatch(removeItem(key));
                    }}
                    title="REMOVE"
                  />
                </View>
              </ListItem.Content>
            </ListItem>
          );
        })}
        {Object.keys(cart).length > 0 && (
          <RaisedButton
            buttonStyle={{ color: "white", backgroundColor: "green" }}
            onPress={() => {
              toggleOverlay();
              navigation.navigate("CheckOut");
            }}
            title="Checkout"
          />
        )}
      </View>
    </Overlay>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.horizontal]}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        style={tailwind("flex p-4 mb-10")}
        ListHeaderComponent={
          <>
            <Toast
              visible={showToast}
              position={50}
              shadow={false}
              animation={false}
              hideOnPress={true}
            >
              The {addedItem} has been added!
            </Toast>
            {renderCurrentCart()}
            <Text style={styles.title}>Shopping List</Text>
          </>
        }
        data={products}
        renderItem={({ item, index }) => (
          <PricingCard
            key={item.name}
            color="#4f9deb"
            title={item.name}
            price={`$${Math.round(item.price * 100) / 100}`}
            button={
              <RaisedButton
                buttonStyle={{ color: "white" }}
                onPress={() => {
                  dispatch(addItem(item.name));
                  toggleToast(true);
                  setAddedItem(item.name);
                  setTimeout(() => toggleToast(false), 5000);
                }}
                title="ADD"
              />
            }
          />
        )}
        ListFooterComponent={
          <View style={tailwind("mb-10")}>
            <RaisedButton
              buttonStyle={{
                color: "white",
                backgroundColor: "green",
              }}
              onPress={toggleOverlay}
              title={`View Cart (${
                Object.values(cart).length > 0
                  ? Object.values(cart).reduce((a, b) => a + b)
                  : 0
              })`}
            />
          </View>
        }
        keyExtractor={(item) => item.name}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    alignSelf: "center",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
export default ShoppingList;
