
import React from "react";
import { StyleSheet, Dimensions, ScrollView } from "react-native";
import { Button, Block, Text, Input, theme } from "galio-framework";

import { Icon, Product } from "../components/";

const { width } = Dimensions.get("screen");
import { getAllProducts } from "../mongo/db";
//import { Stitch, AnonymousCredential } from "mongodb-stitch-react-native-sdk";

export default class Home extends React.Component {
  // test = () => {
  //   Stitch.initializeDefaultAppClient("").then((client) => {
  //     this.setState({ client })
  //     this.state.client.auth
  //       .loginWithCredential(new AnonymousCredential())
  //       .then((user) => {
  //         console.log(`Successfully logged in as user ${user.id}`);
  //         this.setState({ currentUserId: user.id });
  //         this.setState({ currentUserId: client.auth.user.id });
  //       })
  //       .catch((err) => {
  //         console.log(`Failed to log in anonymously: ${err}`);
  //         this.setState({ currentUserId: undefined });
  //       });
  //   });
  // };

  renderProductsNew = () => {
    // this.test();
    const items = getAllProducts();
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.products}
      >
        <Block flex>
          {items.map((item, key) => {
            return (
              <Product
                product={item}
                key={key}
                horizontal={item.fullSize ? false : true}
                full={item.fullSize ? true : false}
              />
            );
          })}
        </Block>
      </ScrollView>
    );
  };

  render() {
    return (
      <Block flex center style={styles.home}>
        {this.renderProductsNew()}
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

/* This is static rendering of products
  renderProducts = () => {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.products}>
        <Block flex>
          <Product product={products[0]} horizontal />
          <Block flex row>
            <Product product={products[1]} style={{ marginRight: theme.SIZES.BASE }} />
            <Product product={products[2]} />
          </Block>
          <Product product={products[3]} horizontal />
          <Product product={products[4]} full />
        </Block>
      </ScrollView>
    )
  }*/
