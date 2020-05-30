import React from "react";
import { StyleSheet, Dimensions, ScrollView, ActivityIndicator } from "react-native";
import { Button, Block, Text, Input, theme } from "galio-framework";

import { Icon, Product, Category, HomeCarousel } from "../components";
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
          <HomeCarousel/>
          <Block flex>
            {categories.map((category, key) => {
              return (
                <Category
                  category={category}
                  key={key}
                  horizontal
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
    paddingVertical: 10,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.2)'
  },
});

/* This is static rendering of products
  renderProducts = () => {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.products}>
        <Block flex>
          <ProductMain.js product={products[0]} horizontal />
          <Block flex row>
            <ProductMain.js product={products[1]} style={{ marginRight: theme.SIZES.BASE }} />
            <ProductMain.js product={products[2]} />
          </Block>
          <ProductMain.js product={products[3]} horizontal />
          <ProductMain.js product={products[4]} full />
        </Block>
      </ScrollView>
    )
  }*/
