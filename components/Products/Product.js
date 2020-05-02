import React from "react";
import { withNavigation } from "@react-navigation/compat";
import {
  StyleSheet,
  Dimensions,
  Image,
  TouchableWithoutFeedback,
} from "react-native";
import { Block, Text, theme } from "galio-framework";
import {
  addProductToCart,
  removeProductFromCart,
  getCountFromCart,
} from "../../services/cartHandle";
import materialTheme from "../../constants/Theme";
import Icon from "../Icon";
const { width } = Dimensions.get("screen");

class Product extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
    };
  }

  getImageObject = () => {
    const { product, full, imageStyle } = this.props;
    const imageStyles = [
      styles.image,
      full ? styles.fullImage : styles.horizontalImage,
      imageStyle,
    ];

    if (product.image != null && product.image != "") {
      return <Image source={{ uri: product.image }} style={imageStyles} />;
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
    addProductToCart(this.props.product).then(count => {
      this.setState({
        count
      });
    })
    this.props.onChangeProduct && this.props.onChangeProduct();
  };

  removeFromCart = (item) => {
    removeProductFromCart(this.props.product).then(count => {
      this.setState({
        count
      });
    })
    this.props.onChangeProduct && this.props.onChangeProduct();
  };

  render() {
    const { navigation, product, horizontal, style, priceColor } = this.props;

    return (
      <Block
        row={horizontal}
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
          <Block flex space="between" style={styles.productDescription}>
            <Text size={20} style={styles.productTitle}>
              {product.title}
            </Text>
            <Block row={true}>
              <Text
                style={{ marginRight: 20 }}
                size={25}
                muted={!priceColor}
                color={priceColor}
              >
                ₹{product.price}
              </Text>
              <Block
                row={true}
                style={{ flex: 1, flexDirection: "row-reverse" }}
              >
                <TouchableWithoutFeedback onPress={() => this.addToCart(product)}>
                  <Block style={{ marginRight: 3, marginLeft: 3, height: 30, width: 30 }}>
                    <Icon family="AntDesign" size={25} name="pluscircleo" />
                  </Block>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback>
                  <Block style={{ height: 30, width: 40 }}>
                    <Text
                      style={{ textAlign: 'center' }}
                      size={25}
                      muted={!priceColor}
                      color={priceColor}
                    >
                      {this.state.count}
                    </Text>
                  </Block>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => this.removeFromCart(product)}>
                  <Block style={{ marginRight: 3, marginLeft: 3, height: 30, width: 30 }}>
                    <Icon family="AntDesign" size={25} name="minuscircleo" />
                  </Block>
                </TouchableWithoutFeedback>
              </Block>
            </Block>
          </Block>
        </TouchableWithoutFeedback>
      </Block>
    );
  }
}

export default withNavigation(Product);

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
    marginTop: -16,
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
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 0.1,
    elevation: 2,
  },
});
