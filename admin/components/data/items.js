import React from "react";
import { StyleSheet, Dimensions, ScrollView, ActivityIndicator, TextInput } from "react-native";
import { Button, Block, Text, Input, theme } from "galio-framework";

import { Icon, Category } from "../../../components/";
import { quote } from '../../../constants';
const { width } = Dimensions.get("screen");
import {
  getAllProducts,
  insertNewProduct,
  insertManyNewProduct,
  getAllCategories,
} from "../../mongo";
import { Stitch, AnonymousCredential } from "mongodb-stitch-react-native-sdk";
import AProduct from './AProduct';
import CarouselItem from "../carousel/CarouselItem";

export default class Items extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: null,
      categories: null,
      show: false,
      showItems: null,
      newShow: false,
    };
  }

  componentDidMount = () => {
    this.setState({showItems: false});
    setTimeout(() => {
      getAllProducts().then(items => this.setState({items, }));
    }, 100);
    setTimeout(() => {
      getAllCategories().then(categories => this.setState({categories,}))
    }, 100);
  };

  onClickSearch = () => {
    this.setState({showItems: []}, () => {
      let search = this.search;
      if(search === "") {
        return;
      }
      let { items, categories } = this.state;
      let showItems = [];
      if(items && categories) {
        for (let i = 0; i < items.length; ++i) {
          if (items[i].title.toLowerCase().includes(search.toLowerCase())) {
            showItems.push(items[i]);
          }
        }
        this.setState({showItems, show: true});
      }
    });
  }

  onChangeSearch = (search) => {
    this.search = search;
  }

  renderProductsNew = () => {
    let { showItems, categories, show, newShow } = this.state;
    let items = showItems;
    if (items && categories && show) {
      return (
        <Block>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.products}
          >
            <Block flex>
              {items.map((item, key) => {
                return (
                  <AProduct
                    product={item}
                    key={key}
                    horizontal={true}
                    categories={categories}
                    deleteEntry={this.deleteEntry}
                  />
                );
              })}
            </Block>
            <Block style={{height: 700}}/>
          </ScrollView>
        </Block>
      );
    } else {
      return (<Block/>);
    }
  };

  deleteEntry = (id) => {
    let {items} = this.state;
    let newItems = [];
    for(let i=0; i<items.length; ++i) {
      if(items[i]._id !== id) {
        newItems.push(items[i]);
      }
    }
    this.setState({items: newItems, showItems: []});
  }

  insertNew = (newItem) => {
    let {items} = this.state;
    items = [newItem].concat(items);
    this.setState({items, newShow: false, showItems: null});
  }

  getNewView = () => {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.products}
      >
        <Block flex>
          <AProduct
            product={{title: '', price:0, image: '', show_priority: 0, in_stock: true}}
            full={true}
            categories={this.state.categories}
            deleteEntry={()=>{this.setState({newShow: false})}}
            new
            insertNew={this.insertNew}
          />
        </Block>
        <Block height={700} />
      </ScrollView>
    );
  }

  render() {
    let {newShow, showItems} = this.state;
    return (
      <Block center style={styles.home}>
        <Block style={{justifyContent: "center"}}>
          {showItems && newShow && false ? <Block/> :
            <Block>
              <Text style={{textAlign:'center', padding: 5}}>SEARCH</Text>
              <TextInput style={{backgroundColor: 'white', width: width* 0.8, padding: 20}} onChangeText={(text) => this.onChangeSearch(text)} />
              <Button style={{marginBottom: 20}} onPress={this.onClickSearch}>SEARCH</Button>
              <Button onPress={() => {this.setState({newShow: true})}}>INSERT NEW</Button>
            </Block>}
          {newShow ?
            this.getNewView(): null}
            {/*<Button onPress={() => {this.setState({newShow: true})}}>INSERT NEW</Button>}*/}
        </Block>
        {newShow ?
          <Block>
            <Text style={{textAlign:'center', padding: 5}}>SEARCH</Text>
            <TextInput style={{backgroundColor: 'white', width: width* 0.8, padding: 20}} onChangeText={(text) => this.onChangeSearch(text)} />
            <Button style={{marginBottom: 20}} onPress={this.onClickSearch}>SEARCH</Button>
          </Block> :
          this.renderProductsNew()}
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

//////////////////////////
/////////////////////////

