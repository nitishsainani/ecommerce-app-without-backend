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
  Clipboard
} from "react-native";
import { Block, Button, Text, theme } from "galio-framework";
import { LinearGradient } from "expo-linear-gradient";
import { Icon, Product } from "../components";
import { getCartProducts, emptyCart } from "../services/cartHandle";
const { height, width } = Dimensions.get("screen");
import { Images, materialTheme } from "../constants";
import { HeaderHeight } from "../constants/utils";
import { getOptions, insertOrder } from "../mongo/db";
import t from "tcomb-form-native";
import { sendMessage } from "../admin/Telegram";

export default class Pro extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: null,
      total: 0,
      totalCart: 0,
      buttonText: "Next",
      addressState: false,
      options: null,
      showPayment: false,
    };
  }

  generateOrderMessage = (values, items, totalPrice) => {
    let {options} = this.state;
    let freeDelivery = totalPrice >= options.free_delivery_value;
    totalPrice = freeDelivery ? totalPrice : totalPrice+options.delivery_charge;
    let OrderString = "";
    OrderString += 'NEW ORDER GENERATED\n';
    OrderString += '=====================\n';
    OrderString += 'NAME: ' + values.name + '\n';
    OrderString += 'PHONE: ' + values.phone + '\n';
    OrderString += '=====================\n';
    OrderString += 'ADDRESS: \n';
    OrderString += values['Address Line 1'] + '\n';
    OrderString += values['Address Line 2'] + '\n';
    OrderString += 'Landmark: ' + values['Landmark'] + '\n';
    OrderString += '=====================\n';
    OrderString += 'ORDER SUMMARY\n\n';
    let totalCount = 0;
    for(let i=0; i<items.length; ++i) {
      let item = items[i];
      totalCount += item.count;
      OrderString +=
        item.title + '\n' +
        item.price + '\t\t\tX\t\t\t' + item.count + '\t\t\t' + (item.count*item.price).toString() + '\n\n';
    }
    OrderString += '=====================\n';
    OrderString += 'TOTAL COUNT OF ITEMS\n';
    OrderString += totalCount + '\n';
    OrderString += '=====================\n';
    OrderString += 'Delivery Charge\n';
    OrderString += (freeDelivery ? '0' : options.delivery_charge.toString()) + '\n';
    OrderString += '=====================\n';
    OrderString += 'TOTAL AMOUNT\n';
    OrderString += totalPrice + '\n';
    return OrderString;
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
      if (values.phone.toString().length !== 10) throw "";
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
      Object.assign(order, {date: new Date()});
      Object.assign(order, {status: 'Pending'});
      Object.assign(order, {items: JSON.stringify(this.state.items)});
      insertOrder(order).then(res => {
        if(res) {
          Alert.alert(
            "SUCCESS",
            "We thank you for shopping at KALASH!\nWe Look forward to serve you better.",
            [{ text: "Great", onPress: () => console.log("OK Pressed") }]
          );
          emptyCart().then(r => {});
          sendMessage(this.generateOrderMessage(values, this.state.items, this.state.totalCart)).then(r => {
            this.setState({showPayment: true})
          })
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

  goToAddressFormStep = () => {
    let {options} = this.state;
    if(!options) return;
    if (this.state.totalCart + options.delivery_charge < options.min_order_value) {
      Alert.alert(
        "Order Amount",
        "Sorry, We cannot accept order less than " + (options.min_order_value),
        [{ text: "I Understand", onPress: () => console.log("OK Pressed") }]
      );
    } else {
      this.setState({
        addressState: true,
        buttonText: 'Place Order',
      });
    }
  };

  handleButton = () => {
    if (this.state.addressState) {
      this.placeOrder();
    } else {
      this.goToAddressFormStep();
    }
  };

  calculateTotal = () => {
    console.log('heress')
    var { items } = this.state;
    if (!items) {
      return;
    }
    var total = 0;
    items.forEach((item) => {
      total += item.price * item.count;
    });
    this.setState({
      totalCart: total,
    });
  };

  setProductsFromCart = () => {
    setTimeout(() => {
      getCartProducts()
        .then((items) => {
          if(!items || (items && items.length === 0)) {
            this.setState({noItems: true, })
          } else {
            this.setState({items, })
          }
        })
        .then(() => this.calculateTotal());
    }, 100);
  };

  componentDidMount = () => {
    this.setProductsFromCart();
    getOptions().then(options => {
      console.log(options);
      this.setState({options, showPayment: false})
    })
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
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.products}
      >
        <Block flex style={{padding: 10}}>
          <Form ref={(c) => (this._form = c)} type={model}/>
        </Block>
      </ScrollView>
    );
  }

  getProductsView = () => {
    return (
      <Block flex center style={styles.cart}>
        {this.renderCartProducts()}
      </Block>
    );
  };

  getDeliveryView = () => {
    let {options, totalCart} = this.state;
    if(totalCart >= options.free_delivery_value) {
      return (
        <Block flex style={{paddingLeft: 30, paddingVertical: 10, }}>
          <Text style={{fontSize: 20, color: 'green'}}>{"Your order is eligible for FREE Delivery"}</Text>
        </Block>
      )
    } else {
      return (
        <Block flex style={{paddingLeft: 30, paddingVertical: 10}}>
          <Text style={{fontSize: 20}}>{"Delivery Charges: ₹" + options.delivery_charge}</Text>
          <Text style={{fontSize: 16}}>
            {"Get FREE Delivery on orders above "}
            <Text style={{color: 'red', }}>₹{options.free_delivery_value}</Text>
          </Text>
        </Block>
      );
    }
  }

  getPaymentView = () => {
    console.log('Here');
    // await Clipboard.setString(this.state.text);
    let {options} = this.state;
    let payment_image = options.payment_image;
    let mobile = options.payment_mobile;
    return(
      <Block style={{padding: 20, alignItems: 'center', marginTop: 100}}>
        <Image source={{ uri: payment_image }} style={{resizeMode: 'stretch', width: 300, height: 100, alignItems: 'center', justifyContent: 'center'}} />
        <Text style={{textAlign: 'center', fontSize: 20}}>Pay Through PayTM for fast delivery.</Text>
        <Button onPress={() => {Clipboard.setString(mobile);}} style={{textAlign: 'center', fontSize: 20, marginTop: 20}}>{'COPY MOBILE NUMBER'}</Button>
        <Text style={{textAlign: 'center', fontSize: 20, padding: 20}}>{mobile}</Text>
        <Button onPress={() => {this.props.navigation.navigate('Home');}} style={{textAlign: 'center', fontSize: 20, marginTop: 20, backgroundColor: 'green'}}>{'DONE'}</Button>
      </Block>
    )
  }

  render() {
    let {options, totalCart, noItems, showPayment} = this.state;
    if(!options) return <Block/>;
    if(noItems) return <Text style={{padding: 100, textAlign: 'center', alignContent: 'center', marginTop: 100, fontSize: 20, color: 'grey'}} >NO ITEMS IN CART</Text>
    // console.log(showPayment);
    if(showPayment) {
      return this.getPaymentView();
    }
    let total = totalCart >= options.free_delivery_value ? totalCart : totalCart + options.delivery_charge
    return (
      <Block flex>
        {this.state.addressState ? this.getFormView() : this.getProductsView()}
        <Block style={{ height: 150 }} card>
          {this.getDeliveryView()}
          <Block flex row={true} style={{ paddingHorizontal: 30, paddingBottom: 5 }}>
            <Text style={{ fontSize: 25, width: width * 0.3 }}>TOTAL:</Text>
            <Text style={{ fontSize: 25, width: width * 0.3 }}>
              ₹{total}
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
