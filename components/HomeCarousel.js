import * as React from 'react';
import {
  Text,
  View,
  SafeAreaView,
  Dimensions,
  Image } from 'react-native';

import {theme} from 'galio-framework';
import {getCarousel} from '../mongo/db'
import Carousel from 'react-native-snap-carousel';
const { width } = Dimensions.get("screen");

export default class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      activeIndex:0,
      carouselItems: null,
    }
  }

  _renderItem({item,index}){
    return (
      <View style={{
        height: 200,
      }}>
        <Image style={{resizeMode: 'stretch', height: 200, width: width - theme.SIZES.BASE * 2, borderRadius: 5}} source={{uri: item.image}} />
      </View>
    )
  }

  scrollCarouselTo = (index) => {
    let offset = (index) * (width - theme.SIZES.BASE * 2);
    if(this.carousel) {
      this.carousel._scrollTo(offset);
    }
  }

  handleCarouselScroll = () => {
    let length = this.state.carouselItems.length;
    let timeToChange = 5;
    let timeInterval = timeToChange*1000;
    let currentIndex = 1
    setInterval(() => {
      this.scrollCarouselTo(currentIndex);
      currentIndex = (currentIndex+1) % length;
    }, timeInterval);
  }

  initialize = () => {
    getCarousel().then((carouselItems) => {
      this.setState({carouselItems}, this.handleCarouselScroll);
    });
  }

  componentDidMount() {
    this.initialize();
  }

  render() {
    return (
      <SafeAreaView style={{flex: 1, marginBottom: 10, }}>
        <View style={{ flex: 1, flexDirection:'row', justifyContent: 'center', }}>
          <Carousel
            layout={"default"}
            ref={ref => this.carousel = ref}
            data={this.state.carouselItems}
            sliderWidth={300}
            itemWidth={width - theme.SIZES.BASE * 2}
            renderItem={this._renderItem}
            onSnapToItem = { index => this.setState({activeIndex:index}) } />
        </View>
      </SafeAreaView>
    );
  }
}
