import React from "react";
import { StyleSheet, Dimensions, ScrollView, ActivityIndicator } from "react-native";
import { Button, Block, Text, Input, theme } from "galio-framework";

import { Icon, Product, Category } from "../components/";
import { quote } from '../constants';
const { width } = Dimensions.get("screen");
import {
  getAllProducts,
  insertNewProduct,
  insertManyNewProduct,
  getAllCategories,
} from "../mongo/db";
import { Stitch, AnonymousCredential } from "mongodb-stitch-react-native-sdk";

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: null,
    };
  }

  componentDidMount = () => {
    setTimeout(() => {
    getAllCategories().then(categories => {
      this.setState({
        categories
      });
    })}, 3000);
  };

  renderProductsNew = () => {
    const { categories } = this.state;
    if (categories) {
      return (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.products}
        >
          <Block flex>
            {categories.map((category, key) => {
              return (
                <Category
                  category={category}
                  key={key}
                  full
                />
              );
            })}
          </Block>
        </ScrollView>
      );
    } else {
      return (
        <Block style={{justifyContent: "center", marginTop: 60}}>
          <ActivityIndicator  size="large" color="black" />
          <Text style={{fontSize: 25, textAlign: 'center', }}>{quote()}</Text>
        </Block>
      );
    }
  };

  render() {
    return (
      <Block flex center style={styles.home}>
        {this.renderProductsNew()}
      </Block>
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
