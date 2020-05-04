import React from "react";
import { StyleSheet, Dimensions, ScrollView, ActivityIndicator, TextInput, Picker, Switch } from "react-native";
import { Button, Block, Text, Input, theme } from "galio-framework";

import { quote } from '../../../constants';
const { width } = Dimensions.get("screen");
import {
  updateCategory,
} from "../../mongo"
import { Stitch, AnonymousCredential } from "mongodb-stitch-react-native-sdk";
import {
  Image,
  TouchableWithoutFeedback,
} from "react-native";
import { getImage } from "../../image/imagePick";


export default class Category extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      category: this.props.category,
    };
  }

  getImageObject = () => {
    const { category, full, imageStyle } = this.props;
    const imageStyles = [
      styles.image,
      full ? styles.fullImage : styles.horizontalImage,
      imageStyle,
    ];

    if (category.image != null && category.image !== "") {
      return <Image source={{ uri: category.image }} style={imageStyles} />;
    } else {
      return (
        <Image
          source={require("../../../assets/images/default_product.png")}
          style={imageStyles}
        />
      );
    }
  };

  saveCategory = () => {
    updateCategory(this.state.category);
  }

  changeImage = (res) => {
    let {category} = this.state;
    if (res) {
      if(res.data.medium !== null && res.data.medium !== undefined ) {
        category.image = res.data.medium.url;
      } else {
        category.image = res.data.image.url;
      }
      this.setState({
        category,
      });
    }
  }

  changeName = (text) => {
    let {category} = this.state;
    category.title = text;
    this.setState({category,});
    console.log(this.state);
  }

  changePriority = (text) => {
    let {category} = this.state;
    category.priority = parseInt(text);
    this.setState({category,});
    console.log(this.state);
  }

  changeDisabled = (text) => {
    let {category} = this.state;
    category.in_stock = !category.in_stock;
    this.setState({category,});
    console.log(this.state);
  }

  render() {
    const { navigation, horizontal, style, priceColor, categories } = this.props;
    const { showCategories, category } = this.state;
    return (
      <Block
        card
        flex
        style={[styles.category, styles.shadow, style]}
      >
        <TouchableWithoutFeedback>
          <Block flex style={[styles.imageContainer, styles.shadow]}>
            {this.getImageObject()}
          </Block>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback>
          <Block>
            <Text>Name</Text>
            <TextInput style={{padding: 10, borderWidth: 1}} onChangeText={text => this.changeName(text)} defaultValue={category.title}/>
            <Text>Image</Text>
            <TextInput onFocus={() => getImage(this.changeImage)} style={{padding: 10, borderWidth: 1}} defaultValue={category.image}/>
            <Text>Show Priority</Text>
            <TextInput style={{padding: 10, borderWidth: 1}} onChangeText={text => this.changePriority(text)} defaultValue={category.priority.toString()}/>
            <Text style={{marginTop: 10}}>Disabled</Text>
            <Switch
              trackColor={{ false: "#767577", true: "green" }}
              ios_backgroundColor="#3e3e3e"
              onValueChange={this.changeDisabled}
              value={!category.in_stock}
            />
            <Button color={'green'} onPress={this.saveCategory}>SAVE</Button>
          </Block>
        </TouchableWithoutFeedback>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  category: {
    backgroundColor: theme.COLORS.WHITE,
    marginVertical: theme.SIZES.BASE,
    borderWidth: 0,
    minHeight: 114,
  },
  categoryTitle: {
    flex: 1,
    flexWrap: "wrap",
    paddingBottom: 6,
  },
  categoryDescription: {
    padding: theme.SIZES.BASE / 2,
  },
  imageContainer: {
    elevation: 1,
  },
  image: {
    borderRadius: 3,
    marginHorizontal: theme.SIZES.BASE / 2,
    marginTop: -16,
  },
  horizontalImage: {
    height: 130,
    width: "auto",
  },
  fullImage: {
    height: 215,
    width: width - theme.SIZES.BASE * 3,
  },
  shadow: {
    shadowColor: theme.COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 0.1,
    elevation: 2,
  },
});
