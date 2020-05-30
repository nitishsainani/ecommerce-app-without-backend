import React from 'react';
import { withNavigation } from '@react-navigation/compat';
import {
  StyleSheet,
  Dimensions,
  Image,
  TouchableWithoutFeedback,
  View,
  TextInput} from 'react-native';
import {Block, Button, } from 'galio-framework';

import {getImage} from "../../image/imagePick";
import {updateCarousel, insertNewEntry, deleteEntry} from "../../mongo";

const { width } = Dimensions.get('screen');

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      item: this.props.item,
    }
  }

  changeImage = (res) => {
    let {item} = this.state;
    if (res) {
      if(res.data.medium !== null && res.data.medium !== undefined) {
        item.image = res.data.medium.url;
      } else {
        item.image = res.data.image.url;
      }
      this.setState({
        item,
      });
    }
  }

  saveCarousel = () => {
    if(this.props.new) {
      insertNewEntry('carousel', this.state.item).then((id)=> {
        if(id) {
          let {item} = this.state;
          item.id = id;
          this.props.insertNewEntry(item);
        }
      })
    } else {
      let item = this.state.item;
      updateCarousel(item);
    }
  }

  deleteCarousel = () => {
    if(this.props.new) {
      this.props.deleteEntry();
    } else {
      deleteEntry('carousel', this.state.item._id).then((res) => {
        if (res) {
          this.props.deleteEntry(this.state.item._id);
        }
      })
    }
  }

  render() {
    let {item} = this.props;
    return(
      <Block style={{marginVertical: 20}}>
        <Image style={{height: 200}} source={{uri: item.image}} />
        <TextInput onFocus={() => getImage(this.changeImage)} style={{padding: 10, borderWidth: 1}} defaultValue={item.image}/>
        <Button color={'green'} onPress={this.saveCarousel}>SAVE</Button>
        <Button style={{marginVertical: 5,}} color={'red'} onPress={this.deleteCarousel}>DELETE</Button>
      </Block>
    );
  }
}