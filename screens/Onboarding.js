import React from 'react';
import { Image, StyleSheet, StatusBar, Dimensions, Platform } from 'react-native';
import { Block, Button, Text, theme } from 'galio-framework';

const { height, width } = Dimensions.get('screen');

import materialTheme from '../constants/Theme';
import Images from '../constants/Images';

export default class Onboarding extends React.Component {
  componentDidMount = () => {
    setTimeout(()=>{
      this.props.navigation.navigate('App');
    }, 1000);
  }

  render() {
    return (
      <Block flex style={[styles.container, {backgroundColor: 'white', alignItems: 'center'}]}>
        <Image style={{marginTop:200}} source={require("../assets/images/default_product.png")} />
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.COLORS.BLACK,
  },
  padded: {
    paddingHorizontal: theme.SIZES.BASE * 2,
    position: 'relative',
    bottom: theme.SIZES.BASE,
  },
  button: {
    width: width - theme.SIZES.BASE * 4,
    height: theme.SIZES.BASE * 3,
    shadowRadius: 0,
    shadowOpacity: 0,
  },
});
