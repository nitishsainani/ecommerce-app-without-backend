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
import AProduct from './AProduct';

export default class Items extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: null,
      categories: null,
      show: false,
      showItems: null,
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

  onChangeSearch = (search) => {
    let { items, categories } = this.state;
    let showItems = [];
    console.log(search.length);
    if(search.length > 2 && items && categories) {
      for(let i=0; i<items.length; ++i) {
        console.log(items[i].title.includes(search));

        if(items[i].title.toLowerCase().includes(search.toLowerCase())) {
          showItems.push(items[i]);
        }
      }
      this.setState({showItems, show: true});
    } else if(search.length === 0){
      this.setState({show: false});
    }
  }

  renderProductsNew = () => {
    let { showItems, categories, show, } = this.state;
    let items = showItems;
    if (items && categories && show) {
      return (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.products}
        >
          <Block flex>
            {items.map((item, key) => {
              return (
                <AProduct
                  product={item}
                  key={key}
                  horizontal={true}
                  categories={categories}
                />
              );
            })}
          </Block>
          <Block style={{height: 500}}/>
        </ScrollView>
      );
    } else {
      return (<Block/>);
    }
  };

  render() {
    return (
      <Block center style={styles.home}>
        <Block style={{justifyContent: "center"}}>
          <Text style={{textAlign:'center', padding: 5}}>SEARCH</Text>
          <TextInput style={{backgroundColor: 'white', width: width* 0.8, padding: 20}} onChangeText={(text) => this.onChangeSearch(text)} />
        </Block>
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

