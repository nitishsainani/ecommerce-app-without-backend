import React from 'react';
import { withNavigation } from '@react-navigation/compat';
import {StyleSheet,
  Dimensions,
  Image,
  TouchableWithoutFeedback,
  View,
  Text,
  ScrollView } from 'react-native';
import {getTable} from "../../mongo";
import CarouselItem from "./CarouselItem";
import { Button, Block, Input, theme } from "galio-framework";

export default class Carousel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      carouselItems: null,
      newShow: false,
    }
  }

  componentDidMount() {
    getTable('carousel').then((carouselItems) => {
      this.setState({carouselItems});
    });
  }

  deleteEntry = (id) => {
    let {carouselItems: items} = this.state;
    let newItems = [];
    for(let i=0; i<items.length; ++i) {
      if(items[i]._id !== id) {
        newItems.push(items[i]);
      }
    }
    this.setState({carouselItems: newItems});
  }

  insertNew = (newItem) => {
    let {carouselItems} = this.state;
    carouselItems = [newItem].concat(carouselItems);
    this.setState({carouselItems, newShow: false});
  }

  getNewView = () => {
    return (
      <Block>
        <CarouselItem
          item={{}}
          deleteEntry={() => {this.setState({newShow:false})}}
          new
          insertNewEntry={this.insertNew}
        />
      </Block>
    );
  }

  render() {
    let {carouselItems, newShow} = this.state;
    if(carouselItems) {
      return(
        <ScrollView>
          {newShow ?
              this.getNewView():
              <Button onPress={() => {this.setState({newShow: true})}}>INSERT NEW</Button>}
          {carouselItems.map(((item, key) => {
            return (
              <CarouselItem
                item={item}
                key={key}
                deleteEntry={this.deleteEntry}
              />
            );
          }))}
        </ScrollView>
      )
    } else {
      return (
        <Block>
          <Text style={{padding: 50, fontSize: 30, }}>Loading...</Text>
        </Block>
      );
    }
  }
}