import React from "react";
import { StyleSheet, Dimensions, ScrollView, ActivityIndicator } from "react-native";
import { Button, Block, Text, Input, theme } from "galio-framework";

import { Icon, Product } from "../components";
import { quote } from '../constants';

const { width } = Dimensions.get("screen");
import {
  getAllProducts,
  insertNewProduct,
  insertManyNewProduct,
} from "../mongo/db";
import { Stitch, AnonymousCredential } from "mongodb-stitch-react-native-sdk";

export default class Products extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: null,
    };
  }

  setCategoryItems = (items, category) => {
    if(!category) {
      this.setState({
        items,
      })
    ////////////FOR TOP SELLLING
    } else if (category === 'top_selling'){
      let newItems = [];
      items.forEach((item) => {
        if(item.show_priority === 10) {
          newItems.push(item);
        }
      })
      this.setState({
        items: newItems,
      })
    /////////// FOR CATEGORY ITEMS
    } else {
      var newItems = [];
      items.forEach((item) => {
        if(item.category == category) {
          newItems.push(item);
        }
      })
      this.setState({
        items: newItems,
      })
    }
  }

  componentDidMount = () => {
    console.log(global.product_navigation_param);
    
    var category = global.product_navigation_param && global.product_navigation_param.title;
    global.product_navigation_param = null;
    var timeoutTime;
    if(!category) {
      timeoutTime = 200;
    } else {
      timeoutTime = 2000;
    }
    setTimeout(() => {
    getAllProducts().then(items => this.setCategoryItems(items, category));
    }, timeoutTime);
  };

  renderProductsNew = () => {
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
                  product={item}
                  key={key}
                  horizontal={item.full_size ? false : true}
                  full={item.full_size ? true : false}
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
          <Text style={{fontSize: 25, textAlign: 'center', padding: 20,}}>{quote()}</Text>
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
