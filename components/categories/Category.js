import React from 'react';
import { withNavigation } from '@react-navigation/compat';
import {StyleSheet, Dimensions, Image, TouchableWithoutFeedback, View} from 'react-native';
import { Block, Text, theme } from 'galio-framework';

import materialTheme from '../../constants/Theme';

const { width } = Dimensions.get('screen');

class Category extends React.Component {
  getImageObject = () => {
    const { category, full, imageStyle } = this.props;
    const imageStyles = [styles.image, full ? styles.fullImage : styles.horizontalImage, imageStyle];

    if (category.image != null && category.image != "") {
      return <Image source={{ uri: category.image }} style={imageStyles} />;
    } else {
      return <Image source={require('../../assets/images/default_product.png')} style={imageStyles} />;
    }
  }

  render() {
    const { navigation, category, horizontal, style } = this.props;
    return (
      <Block row={horizontal} card flex style={[styles.product, styles.shadow, style]}>
        <TouchableWithoutFeedback onPress={() => {
          if(category.in_stock) {
            global.product_navigation_param = category;
            navigation.navigate('Products', {category});
          }
        }}>
          <Block flex style={[styles.imageContainer, styles.shadow]}>
            {category.in_stock ? null : <View style={[styles.horizontalImage, styles.overlay]}>
              <Text
                style={{textAlign:'center', fontSize: 20, fontWeight: '700', marginTop: 40, padding: 10}}
              >OUT OF STOCK</Text>
            </View>}
            {this.getImageObject()}
          </Block>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={() => {
          if(category.in_stock) {
            global.product_navigation_param = category;
            navigation.navigate('Products', {category});
          }
        }}>
          <Block flex space="between" style={styles.productDescription}>
            <Text size={14} style={styles.productTitle}>{category.title.toUpperCase()}</Text>
          </Block>
        </TouchableWithoutFeedback>
      </Block>
    );
  }
}

export default withNavigation(Category);

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
    marginVertical: theme.SIZES.BASE / 2.5,
    borderWidth: 0,
    minHeight: 114,
  },
  productTitle: {
    flexWrap: 'wrap',
    paddingBottom: 6,
    fontSize: 15,
    textAlign: 'left',
    color: 'red',
  },
  productDescription: {
    justifyContent:'center',
    flex: 1,
    padding: theme.SIZES.BASE / 2,
  },
  imageContainer: {
    elevation: 1,
  },
  image: {
    borderRadius: 3,
    marginHorizontal: theme.SIZES.BASE / 2,
  },
  horizontalImage: {
    height: 150,
    width: 'auto',
  },
  fullImage: {
    height: 215,
    width: width - theme.SIZES.BASE * 3,
  },
  shadow: {
    shadowColor: theme.COLORS.BLACK,
    shadowOffset: { width: 1, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 0.1,
    elevation: 2,
  },
});