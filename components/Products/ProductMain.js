import React from "react";
import {withNavigation} from "@react-navigation/compat";
import {Dimensions, Image, StyleSheet, TouchableWithoutFeedback,View} from "react-native";
import {Block, Text, theme} from "galio-framework";
import {addProductToCart, getCountFromCart, removeProductFromCart,} from "../../services/cartHandle";
import { Icon } from 'galio-framework';

const {width} = Dimensions.get("screen");

class Product extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
    };
  }

  getImageObject = () => {
    const {product, full, imageStyle} = this.props;
    const imageStyles = [
      styles.image,
      full ? styles.fullImage : styles.horizontalImage,
      imageStyle,
    ];

    if (product.image != null && product.image !== "") {
      return <Image source={{uri: product.image}} style={imageStyles}/>;
    } else {
      return (
        <Image
          source={require("../../assets/images/default_product.png")}
          style={imageStyles}
        />
      );
    }
  };

  componentDidMount = () => {
    getCountFromCart(this.props.product).then(count => {
      this.setState({
        count
      });
    })
  };

  addToCart = (item) => {
    if(!item.in_stock) {
      return;
    }
    addProductToCart(this.props.product).then(count => {
      this.setState({
        count
      });
    })
    this.props.onChangeProduct && this.props.onChangeProduct();
  };

  removeFromCart = (item) => {
    if(!item.in_stock) {
      return;
    }
    removeProductFromCart(this.props.product).then(count => {
      this.setState({
        count
      });
    })
    this.props.onChangeProduct && this.props.onChangeProduct();
  };

  getZeroCountView = () => {
    const {navigation, product, horizontal, style, priceColor} = this.props;
    return(
      <Block
        row={true}
        style={{flex: 1, flexDirection: "row-reverse"}}
      >
        <TouchableWithoutFeedback onPress={() => this.addToCart(product)}>
          <Block style={{height: 20, width: 20, justifyContent: 'center', alignItems:'center', }}>
            <Icon color={'grey'} family="AntDesign" size={15} name="pluscircleo"/>
          </Block>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback>
          <Block style={{height: 15, width: 'auto'}}>
            <Text
              style={{textAlign: 'center'}}
              size={15}
              muted={!priceColor}
              color={priceColor}
            >
              Add
            </Text>
          </Block>
        </TouchableWithoutFeedback>
      </Block>
    );
  }

  getNonZeroCountView = () => {
    const {navigation, product, horizontal, style, priceColor} = this.props;
    return(
      <Block
        row={true}
        style={{flex: 1, flexDirection: "row-reverse"}}
      >
        <TouchableWithoutFeedback onPress={() => this.addToCart(product)}>
          <Block style={{height: 20, width: 20, justifyContent: 'center', alignItems:'center',}}>
            <Icon color={'grey'} family="AntDesign" size={15} name="pluscircleo"/>
          </Block>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback>
          <Block style={{height: 15, width: 25}}>
            <Text
              style={{textAlign: 'center'}}
              size={15}
              muted={!priceColor}
              color={priceColor}
            >
              {this.state.count}
            </Text>
          </Block>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={() => this.removeFromCart(product)}>
          <Block style={{height: 20, width: 20, justifyContent: 'center', alignItems:'center', }}>
            <Icon color={'grey'} family="AntDesign" size={15} name="minuscircleo"/>
          </Block>
        </TouchableWithoutFeedback>
      </Block>
    );
  }

  render() {
    const {navigation, product, horizontal, style, priceColor} = this.props;

    return (

        <Block
          row={horizontal}
          card
          flex
          style={[styles.product, styles.shadow, style]}
        >
          <TouchableWithoutFeedback>
            <Block flex style={[styles.imageContainer, styles.shadow]}>
              {product.in_stock ? null : <View style={[styles.horizontalImage, styles.overlay]}>
                <Text
                  style={{textAlign:'center', fontSize: 20, fontWeight: '700', marginTop: 40, padding: 10}}
                >OUT OF STOCK</Text>
              </View>}
              {this.getImageObject()}
            </Block>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback>
            <Block flex space="between" style={styles.productDescription}>
              <Text size={15} style={styles.productTitle}>
                {product.title}
              </Text>
              <Block row={true}>
                <Text
                  style={{marginRight: 20}}
                  size={15}
                  muted={!priceColor}
                  color={priceColor}
                >
                  ₹{product.price}
                </Text>
                {this.state.count === 0 ?
                this.getZeroCountView() :
                this.getNonZeroCountView()}
              </Block>
            </Block>
          </TouchableWithoutFeedback>
        </Block>
    );
  }
}

export default withNavigation(Product);

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex:10,
    backgroundColor: 'rgba(255,255,255, 0.7)',
  },
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
    marginTop: 0,
  },
  horizontalImage: {
    height: 122,
    width: "auto",
  },
  fullImage: {
    height: 215,
    width: width - theme.SIZES.BASE * 3,
  },
  shadow: {
    shadowColor: theme.COLORS.BLACK,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 4,
    shadowOpacity: 0.1,
    elevation: 2,
  },
});
