import React from "react";
import { StyleSheet, Dimensions, ScrollView, ActivityIndicator, TextInput } from "react-native";
import { Button, Block, Text, Input, theme } from "galio-framework";

import { Icon, Category } from "../../../components/";
import { quote } from '../../../constants';
const { width } = Dimensions.get("screen");
import {
  getAllProducts,
  insertNewProduct,
  insertManyNewProduct,
  getAllCategories,
} from "../../mongo";
import { Stitch, AnonymousCredential } from "mongodb-stitch-react-native-sdk";
import Product from './AProduct';

export default class Items extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: null,
      categories: null,
    };
  }

  componentDidMount = () => {
    setTimeout(() => {
      getAllProducts().then(items => this.setState({items, }));
    }, 100);
    setTimeout(() => {
      getAllCategories().then(categories => this.setState({categories,}))
    }, 100);
  };

  renderProductsNew = () => {
    let { items, categories } = this.state;
    if (items && categories) {
      items = items.slice(1, 10);
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
                  horizontal={true}
                  categories={categories}
                />
              );
            })}
          </Block>
        </ScrollView>
      );
    } else {
      return (
        <Block style={{backgroundColor:'red', justifyContent: "center", marginTop: 60}}>
          <ActivityIndicator  size="large" color="black" />
          <Text style={{fontSize: 25, textAlign: 'center', padding: 20,}}>{quote()}</Text>
        </Block>
      );
    }
  };

  render() {
    return (
      <Block center style={styles.home}>
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

//////////////////////////
/////////////////////////

