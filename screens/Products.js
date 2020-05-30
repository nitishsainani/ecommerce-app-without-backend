import React from "react";
import { StyleSheet, Dimensions, ScrollView, ActivityIndicator, TextInput } from "react-native";
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
        search: true,
        showItems: [],
        items,
      })
    ////////////FOR TOP SELLLING
    } else if (category.title === 'top_selling'){
      let newItems = [];
      items.forEach((item) => {
        if(!item.category) {
          newItems.push(item);
        }
      })
      this.setState({
        items: newItems,
      })
    /////////// FOR CATEGORY ITEMS
    } else {
      console.log("in comparison");
      var newItems = [];
      items.forEach((item) => {
        if(item.category && category._id && item.category.equals(category._id)) {
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
    
    var category = global.product_navigation_param;
    console.log(category);
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

  onChangeSearch = (search) => {
    let { items } = this.state;
    let showItems = [];
    if(search.length > 1 && items) {
      for(let i=0; i<items.length; ++i) {
        if(items[i].title.toLowerCase().includes(search.toLowerCase())) {
          showItems.push(items[i]);
        }
      }
      this.setState({showItems});
    } else if(search.length <= 1){
      this.setState({showItems: []});
    }
  }

  renderProductsNew = () => {
    let { items, search, showItems } = this.state;
    if (items) {
      if(search) {
        items = showItems;
      }
      return (
        <Block>
          {search ?
            <Input
              right
              color="black"
              style={styles.search}
              placeholder="What are you looking for?"
              onChangeText={this.onChangeSearch}
              iconContent={<Icon size={16} color={theme.COLORS.MUTED} name="magnifying-glass" family="entypo" />}
            />:
          <Block/>}
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
                    horizontal={!item.full_size}
                    full={!!item.full_size}
                  />
                );
              })}
            </Block>
          </ScrollView>
        </Block>
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
  search: {
    height: 48,
    borderWidth: 1,
    borderRadius: 3,
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
