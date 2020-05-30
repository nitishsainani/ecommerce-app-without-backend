import React from "react";
import { StyleSheet, Dimensions, ScrollView, ActivityIndicator, TextInput } from "react-native";
import { Button, Block, Text, Input, theme } from "galio-framework";

import { quote } from '../../../constants';
const { width } = Dimensions.get("screen");
import {
  getAllProducts,
  insertNewProduct,
  insertManyNewProduct,
  getAllCategories,
  updateOptions,
  getOptions,
} from "../../mongo";
import { Stitch, AnonymousCredential } from "mongodb-stitch-react-native-sdk";
import Category from './ACategory';

export default class Categories extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      options: null,
    };
  }

  updateOptions = () => {
    updateOptions(this.state.options);
  }

  componentDidMount = () => {
    getOptions().then(options => {
      this.setState({options, })
    })
  };

  updateField = (field, value) => {
    let {options} = this.state;
    options[field] = parseInt(value)
    this.setState({options}, () => {
      console.log(this.state)})
  }

  render() {
    if(!this.state.options) return <Block/>
    let {min_order_value, delivery_charge, free_delivery_value} = this.state.options;
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.products}
      >
        <Block center style={styles.home}>
          <Text style={{padding: 20, margin: 10}} >min order value</Text>
          <TextInput style={{padding: 20, margin: 10, backgroundColor: 'white', width: 100}} keyboardType={'number-pad'} defaultValue={min_order_value.toString()} onChangeText={text => this.updateField('min_order_value', text)}/>
          <Text style={{padding: 20, margin: 10}} >delivery charge</Text>
          <TextInput style={{padding: 20, margin: 10, backgroundColor: 'white', width: 100}} keyboardType={'number-pad'} defaultValue={delivery_charge.toString()} onChangeText={text => this.updateField('delivery_charge', text)}/>
          <Text style={{padding: 20, margin: 10}} >free delivery value</Text>
          <TextInput style={{padding: 20, margin: 10, backgroundColor: 'white', width: 100}} keyboardType={'number-pad'} defaultValue={free_delivery_value.toString()} onChangeText={text => this.updateField('free_delivery_value', text)}/>
          <Button onPress={this.updateOptions}>SAVE</Button>
        </Block>
        <Block style={{height: 200}}/>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  home: {
    width: width,
  },
  products: {
    width: width - theme.SIZES.BASE * 2,
    paddingVertical: theme.SIZES.BASE * 2,
  },
});

//////////////////////////
/////////////////////////

