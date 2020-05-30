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
} from "../../mongo";
import { Stitch, AnonymousCredential } from "mongodb-stitch-react-native-sdk";
import Category from './ACategory';

export default class Categories extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: null,
      newShow: false,
    };
  }

  componentDidMount = () => {
    setTimeout(() => {
      getAllCategories().then(categories => this.setState({categories,}))
    }, 100);
  };

  renderCategories = () => {
    let { categories } = this.state;
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
                  horizontal={true}
                  onSaveNewCategory={this.props.goBack}
                />
              );
            })}
          </Block>
          <Block style={{height: 500}}/>
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

  getNewView = () => {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.products}
      >
        <Block flex>
          <Category
            category={{
              title: "",
              image: "",
              priority: 0,
              in_stock: true,
            }}
            horizontal={true}
            new
            onSaveNewCategory={this.props.goBack}
          />
        </Block>
        <Block style={{height: 500}}/>
      </ScrollView>
    );
  }

  render() {
    let {newShow} = this.state;
    return (
      <Block center style={styles.home}>
        {newShow ? <Block/> : <Button onPress={() => this.setState({newShow: true, })}>INSERT NEW</Button>}
        {newShow ? this.getNewView() : this.renderCategories()}
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

