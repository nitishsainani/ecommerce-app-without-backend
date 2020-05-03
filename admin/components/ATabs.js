import React from "react";
import {
  StyleSheet,
  Dimensions,
  ScrollView,
  ActivityIndicator,
  TextInput,
  View,
  TouchableOpacity,
} from "react-native";
import { Button, Block, Text, theme } from "galio-framework";
import { Icon, Product, Category } from "../../components";
import { quote } from '../../constants';
const { height, width } = Dimensions.get("screen");
import {
  getAllProducts,
  insertNewProduct,
  insertManyNewProduct,
  getAllCategories,
} from "../../mongo/db";
import { Stitch, AnonymousCredential } from "mongodb-stitch-react-native-sdk";
import { TabView, SceneMap } from 'react-native-tab-view';
import Animated from 'react-native-reanimated';
import Data from "./data/Data";
import { getImage } from "../image/imagePick";


const OrdersRoute = () => (
  <View style={[styles.container, { backgroundColor: '#ff4081' }]} />
);

const DataRoute = () => (
  <Data/>
);

const ThirdRoute = () => (
  <View style={[styles.container, { backgroundColor: '#623ab7' }]} />
);

export default class ATabs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      routes: [
        { key: 'orders', title: 'Orders' },
        { key: 'data', title: 'Data' },
        { key: 'third', title: 'Third' },
      ],
    };
  }

  componentDidMount = () => {
  }

  _handleIndexChange = index => this.setState({ index });

  _renderTabBar = props => {
    const inputRange = props.navigationState.routes.map((x, i) => i);

    return (
      <View style={styles.tabBar}>
        {props.navigationState.routes.map((route, i) => {
          const color = Animated.color(
            Animated.round(
              Animated.interpolate(props.position, {
                inputRange,
                outputRange: inputRange.map(inputIndex =>
                  inputIndex === i ? 255 : 0
                ),
              })
            ),
            0,
            0
          );

          return (
            <TouchableOpacity
              style={styles.tabItem}
              onPress={() => this.setState({ index: i })}>
              <Animated.Text style={{ color }}>{route.title}</Animated.Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  _renderScene = SceneMap({
    orders: OrdersRoute,
    data: DataRoute,
    third: ThirdRoute,
  });

  render() {
    return (
      <TabView
        navigationState={this.state}
        renderScene={this._renderScene}
        renderTabBar={this._renderTabBar}
        onIndexChange={this._handleIndexChange}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    paddingTop: 10,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
  },
});
