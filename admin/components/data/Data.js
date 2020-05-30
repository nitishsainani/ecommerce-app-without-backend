import React from "react";
import { StyleSheet, Dimensions, ScrollView, ActivityIndicator } from "react-native";
import { Button, Block, Text, Input, theme } from "galio-framework";

import { Icon, Product, Category } from "../../../components";
import { quote } from '../../../constants';
const { width } = Dimensions.get("screen");

import { test } from "../../mongo";

import { Stitch, AnonymousCredential } from "mongodb-stitch-react-native-sdk";
import Items from "./items";
import Categories from "./ACategories";
import Options from "./options";

export default class Data extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: false,
      categories: false,
      options: false,
    };
  }

  componentDidMount = () => {
    //test();
  };

  render() {
    const {items, categories, options} = this.state;
    if(items) {
      return (
        <Block>
          <Button onPress={() => this.setState({items: false})}>Back</Button>
          <Items/>
        </Block>
      );
    } else if (categories) {
      return (
        <Block>
          <Button onPress={() => this.setState({categories: false})}>Back</Button>
          <Categories goBack={() => this.setState({categories: false})}/>
        </Block>
      );
    } else if (options) {
      return(
        <Block>
          <Button onPress={() => this.setState({options: false})}>Back</Button>
          <Options/>
        </Block>
      );
    } else {
      return (
        <Block style={{padding: 30, alignItems: 'center'}}>
          <Button onPress={() => this.setState({items: true})} style={{marginTop: 20,}}>ITEMS</Button>
          <Button onPress={() => this.setState({categories: true})} style={{marginTop: 20,}}>CATEGORIES</Button>
          <Button onPress={() => this.setState({options: true})} style={{marginTop: 20,}}>OPTIONS</Button>
        </Block>
      );
    }
  }
}
