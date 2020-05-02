import React from "react";
import {
  ImageBackground,
  Image,
  StyleSheet,
  StatusBar,
  Dimensions,
  Platform,
  ActivityIndicator,
  ScrollView,
  Alert,
} from "react-native";
import { Block, Button, Text, theme } from "galio-framework";
import { LinearGradient } from "expo-linear-gradient";
import { Icon, Product } from "../components";
import { getCartProducts, emptyCart } from "../services/cartHandle";
const { height, width } = Dimensions.get("screen");
import { Images, materialTheme } from "../constants";
import { HeaderHeight } from "../constants/utils";
import { getMinOrderValue, insertOrder } from "../mongo/db";
import t from "tcomb-form-native";

export default class Pro extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: null,
      total: 0,
      buttonText: "Next",
      addressState: false,
    };
  }

  validateValues = (values) => {
    if (values.name.length < 5) {
      Alert.alert(
        "",
        "Enter Full Name",
        [{ text: "I Understand", onPress: () => console.log("OK Pressed") }]
      );
      return false;
    }
    if (values['Address Line 1'].length < 5) {
      Alert.alert(
        "",
        "Address Line 1 too short",
        [{ text: "I Understand", onPress: () => console.log("OK Pressed") }]
      );
      return false;
    }
    if (values['Address Line 2'].length < 5) {
      Alert.alert(
        "",
        "Address Line 2 too short",
        [{ text: "I Understand", onPress: () => console.log("OK Pressed") }]
      );
      return false;
    }
    if (values.Landmark.length < 2) {
      Alert.alert(
        "",
        "Add Proper Landmark near your address",
        [{ text: "I Understand", onPress: () => console.log("OK Pressed") }]
      );
      return false;
    }
    try {
      if (values.phone.toString().length != 10) throw "";
      if (parseInt(values.phone.toString()[0], 10) < 6) throw "";
    } catch(err) {
      Alert.alert(
        "",
        "Mobile Number Invalid",
        [{ text: "I Understand", onPress: () => console.log("OK Pressed") }]
      );
      return false;
    }
    return true;
  }

  placeOrder = () => {
    var order = {}
    const values = this._form.getValue();
    if(values && this.validateValues(values)){
      console.log(values);
      Object.assign(order, values);
      Object.assign(order, new Date());
      Object.assign(order, {status: 'Pending'});
      Object.assign(order, {items: JSON.stringify(this.state.items)});
      insertOrder(order).then(res => {
        if(res) {
          Alert.alert(
            "SUCCESS",
            "Order Places Successfully!",
            [{ text: "Great", onPress: () => console.log("OK Pressed") }]
          );
          emptyCart();
          this.props.navigation.navigate('Home');
          return;
        } else {
          Alert.alert(
            "Failure",
            "Something Went Wrong, Please Try again",
            [{ text: "OK", onPress: () => console.log("OK Pressed") }]
          );
        }
      })
    }
  };

  goToFormStep = () => {
    getMinOrderValue().then((min_order_value) => {
      if (this.state.total < min_order_value) {
        Alert.alert(
          "Order Amount",
          "Sorry, We cannot accept order less than " + min_order_value,
          [{ text: "I Understand", onPress: () => console.log("OK Pressed") }]
        );
      } else {
        this.setState({
          addressState: true,
          buttonText: 'Place Order',
        });
      }
    });
  };

  handleButton = () => {
    if (this.state.addressState) {
      this.placeOrder();
    } else {
      this.goToFormStep();
    }
  };

  calculateTotal = () => {
    var { items } = this.state;
    if (!items) {
      return;
    }
    var total = 0;
    items.forEach((item) => {
      total += item.price * item.count;
    });
    this.setState({
      total,
    });
  };

  setProductsFromCart = () => {
    setTimeout(() => {
      getCartProducts()
        .then((items) => this.setState({ items }))
        .then(() => this.calculateTotal());
    }, 100);
  };

  componentDidMount = () => {
    this.setProductsFromCart();
  };

  renderCartProducts = () => {
    const { items } = this.state;
    if (items) {
      return (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.products}
        >
          <Block flex>
            {items.map((item, key) => {
              return (
                <Product
                  onChangeProduct={this.setProductsFromCart}
                  product={item}
                  key={key}
                  horizontal={true}
                />
              );
            })}
          </Block>
        </ScrollView>
      );
    } else {
      return (
        <Block style={{ justifyContent: "center", marginTop: 60 }}>
          <ActivityIndicator size="large" color="black" />
        </Block>
      );
    }
  };

  getFormView = () => {
    const Form = t.form.Form;
    const model = t.struct({
      name: t.String,
      phone: t.Number,
      "Address Line 1": t.String,
      "Address Line 2": t.String,
      Landmark: t.String,
    });

    return (
      <Block flex style={{padding: 10}}>
        <Form ref={(c) => (this._form = c)} type={model}/>
      </Block>
    );
  }

  getProductsView = () => {
    return (
      <Block flex center style={styles.cart}>
        {this.renderCartProducts()}
      </Block>
    );
  };

  render() {
    return (
      <Block flex>
        {this.state.addressState ? this.getFormView() : this.getProductsView()}
        <Block style={{ height: 100 }} card>
          <Block flex row={true} style={{ padding: 30 }}>
            <Text style={{ fontSize: 30, width: width * 0.3 }}>TOTAL:</Text>
            <Text style={{ fontSize: 30, width: width * 0.3 }}>
              ₹{this.state.total}
            </Text>
            <Button
              shadowless
              style={styles.button}
              color={materialTheme.COLORS.BUTTON_COLOR}
              onPress={this.handleButton}
            >
              {this.state.buttonText}
            </Button>
          </Block>
        </Block>
        <Block style={{ height: 20 }}></Block>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  cart: {
    width: width,
  },
  products: {
    width: width - theme.SIZES.BASE * 2,
    paddingVertical: theme.SIZES.BASE * 2,
  },
  button: {
    width: width * 0.25,
    padding: 5,
    alignContent: "flex-start",
  },
});
