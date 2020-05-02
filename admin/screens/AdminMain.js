import React from "react";
import { StyleSheet, Dimensions, ScrollView, ActivityIndicator } from "react-native";
import { Button, Block, Text, Input, theme } from "galio-framework";

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

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
    this.screens = {

    }
  }

  getView = () => {

  }

  componentDidMount = () => {

  };

  render() {
    return (
      <Block flex center style={{}}>

      </Block>
    );
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