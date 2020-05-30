import React from "react";
import { StyleSheet, Dimensions, ScrollView, ActivityIndicator, TextInput, Picker, Switch } from "react-native";
import { Button, Block, Text, Input, theme } from "galio-framework";

import { Icon, Category } from "../../../components/";
import { quote } from '../../../constants';
const { width } = Dimensions.get("screen");
import {
  getAllProducts,
  insertNewProduct,
  insertManyNewProduct,
  getAllCategories,
  updateProduct, insertNewEntry, updateCarousel, deleteEntry,
} from "../../mongo";
import { Stitch, AnonymousCredential } from "mongodb-stitch-react-native-sdk";
import {
  Image,
  TouchableWithoutFeedback,
} from "react-native";
import { getImage } from "../../image/imagePick";


export default class AProduct extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      showCategories: false,
      product: this.props.product,
    };
  }

  getImageObject = () => {
    const { product, full, imageStyle } = this.props;
    const imageStyles = [
      styles.image,
      full ? styles.fullImage : styles.horizontalImage,
      imageStyle,
    ];

    if (product.image != null && product.image !== "") {
      return <Image source={{ uri: product.image }} style={imageStyles} />;
    } else {
      return (
        <Image
          source={require("../../../assets/images/default_product.png")}
          style={imageStyles}
        />
      );
    }
  };

  saveProduct = () => {
    if(this.props.new) {
      insertNewEntry('items', this.state.product).then(id => {
        if(id) {
          let {product} = this.state;
          product._id = id;
          this.props.insertNew(product);
        }
      })
    } else {
      let product = this.state.product;
      updateProduct(product);
    }
  }

  changeImage = (res) => {
    let {product} = this.state;
    if (res) {
      if(res.data.medium !== null && res.data.medium !== undefined) {
        product.image = res.data.medium.url;
      } else {
        product.image = res.data.image.url;
      }
      this.setState({
        product,
      });
    }
  }

  changeName = (text) => {
    let {product} = this.state;
    product.title = text;
    this.setState({product});
  }

  changePrice = (text) => {
    let {product} = this.state;
    product.price = parseInt(text);
    this.setState({product});
  }

  changePriority = (text) => {
    let {product} = this.state;
    product.show_priority = parseInt(text);
    this.setState({product});
  }

  changeCategory = (index) => {
    console.log(this.props.categories[index]._id);
    let {product} = this.state;
    product.category = this.props.categories[index]._id;
    this.setState({product});
  }

  changeDisabled = (text) => {
    let {product} = this.state;
    product.in_stock = !product.in_stock;
    this.setState({product});
  }

  deleteProduct = () => {
    if(this.props.new) {
      this.props.deleteEntry();
    } else {
      deleteEntry('items', this.state.product._id).then((res) => {
        if (res) {
          this.props.deleteEntry(this.state.product._id);
        }
      })
    }
  }

  // getCategory = (id) => {
  //   const {categories} = this.props;
  //   for (let i=0; i<categories.length; ++i) {
  //     if(categories)
  //   }
  // }

  render() {
    const { navigation, horizontal, style, priceColor, categories } = this.props;
    const { showCategories, product } = this.state;

    return (
      <Block
        card
        flex
        style={[styles.product, styles.shadow, style]}
      >
        <TouchableWithoutFeedback>
          <Block flex style={[styles.imageContainer, styles.shadow]}>
            {this.getImageObject()}
          </Block>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback>
          <Block key={this.props.product}>
            <Text>Name</Text>
            <TextInput style={{padding: 10, borderWidth: 1}} onChangeText={text => this.changeName(text)} key={this.state.product.title ? 'Loaded' : 'NotLoadeds'}  defaultValue={product.title}/>
            <Text>Image</Text>
            <TextInput onFocus={() => getImage(this.changeImage)} style={{padding: 10, borderWidth: 1}} defaultValue={product.image}/>
            <Text>Price</Text>
            <TextInput style={{padding: 10, borderWidth: 1}} onChangeText={text => this.changePrice(text)} keyboardType={'number-pad'} defaultValue={product.price.toString()}/>
            <Text>Show Priority</Text>
            <TextInput style={{padding: 10, borderWidth: 1}} onChangeText={text => this.changePriority(text)} keyboardType={'number-pad'} defaultValue={product.show_priority.toString()}/>
            <Button onPress={()=> this.setState({showCategories: !showCategories})}>Select Category</Button>
            {showCategories ?
              <Picker
                selectedValue={product.category && product.category.toString()}
                onValueChange={(itemValue, index) => this.changeCategory(index)}
              >
                {categories.map((category, key) => {
                  return(
                    <Picker.Item key={key} label={category.title} value={category._id.toString()}/>
                  );
                })}
              </Picker> :
              <Block/>}
            <Text style={{marginTop: 10}}>Disabled</Text>
            <Switch
              trackColor={{ false: "#767577", true: "green" }}
              ios_backgroundColor="#3e3e3e"
              onValueChange={this.changeDisabled}
              value={!product.in_stock}
            />
            <Button color={'green'} onPress={this.saveProduct}>SAVE</Button>
            <Button color={'red'} onPress={this.deleteProduct}>DELETE</Button>
          </Block>
        </TouchableWithoutFeedback>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  product: {
    backgroundColor: theme.COLORS.WHITE,
    marginVertical: theme.SIZES.BASE,
    borderWidth: 0,
    minHeight: 114,
  },
  productTitle: {
    flex: 1,
    flexWrap: "wrap",
    paddingBottom: 6,
  },
  productDescription: {
    padding: theme.SIZES.BASE / 2,
  },
  imageContainer: {
    elevation: 1,
  },
  image: {
    borderRadius: 3,
    marginHorizontal: theme.SIZES.BASE / 2,
    marginTop: 0
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
