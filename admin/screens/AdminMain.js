import React from "react";
import { StyleSheet, Dimensions, ScrollView, ActivityIndicator, TextInput } from "react-native";
import { Button, Block, Text, theme } from "galio-framework";

import { Icon, Product, Category } from "../../components";
import { quote } from '../../constants';
const { width } = Dimensions.get("screen");
import {
  getAllProducts,
  insertNewProduct,
  insertManyNewProduct,
  getAllCategories,
} from "../../mongo/db";
import { Stitch, AnonymousCredential } from "mongodb-stitch-react-native-sdk";
import ATabs from "../components/ATabs";

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allow: false,
    };
  }


  componentDidMount = () => {

  };

  handleChange = (text) => {
    if(text === 'kalash@2670') {
      this.setState({
        allow: true,
      });
    }
  }

  render() {
    if(this.state.allow) {
      return (<ATabs/>);
    } else {
      return (
        <Block flex center style={{padding: 20, marginTop: 60}}>
          <Text>Enter Password</Text>
          <TextInput
            style = {{backgroundColor:'white', marginTop: 20, padding:20, width:200, }}
            underlineColorAndroid = "transparent"
            placeholder = "Enter Password Here"
            autoCapitalize = "none"
            onChangeText = {this.handleChange}
          />

        </Block>
      );
    }

  }

}



/* This is static rendering of products
  renderProducts = () => {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.products}>
        <Block flex>
          <Product product={products[0]} horizontal />
          <Block flex row>
            <Product product={products[1]} style={{ marginRight: theme.SIZES.BASE }} />
            <Product product={products[2]} />
          </Block>
          <Product product={products[3]} horizontal />
          <Product product={products[4]} full />
        </Block>
      </ScrollView>
    )
  }*/