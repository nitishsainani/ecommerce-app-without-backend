import React from 'react';
import { withNavigation } from '@react-navigation/compat';
import { TouchableOpacity, StyleSheet, Platform, Dimensions, View } from 'react-native';
import { Button, Block, NavBar, Input, Text, theme } from 'galio-framework';

import Icon from './Icon';
import materialTheme from '../constants/Theme';

const { height, width } = Dimensions.get('window');
const iPhoneX = () => Platform.OS === 'ios' && (height === 812 || width === 812 || height === 896 || width === 896);

const ChatButton = ({isWhite, style, navigation}) => (
  <TouchableOpacity style={[styles.button, style]} onPress={() => navigation.navigate('Pro')}>
    <Icon
      family="GalioExtra"
      size={16}
      name="chat-33"
      color={theme.COLORS[isWhite ? 'WHITE' : 'ICON']}
    />
    <Block middle style={styles.notify} />
  </TouchableOpacity>
);

const BasketButton = ({isWhite, style, navigation}) => (
  <TouchableOpacity style={[styles.button, style]} onPress={() => navigation.navigate('Pro')}>
    <Icon
      family="GalioExtra"
      size={16}
      name="basket-simple"
      color={theme.COLORS[isWhite ? 'WHITE' : 'ICON']}
    />
    <Block middle style={styles.notify} />
  </TouchableOpacity>
);

const SearchButton = ({isWhite, style, navigation}) => (
  <TouchableOpacity style={[styles.button, style]} onPress={() => navigation.navigate('Pro')}>
    <Icon
      size={16}
      family="entypo"
      name="magnifying-glass"
      color={theme.COLORS[isWhite ? 'WHITE' : 'ICON']}
    />
  </TouchableOpacity>
);

class Header extends React.Component {
  handleLeftPress = () => {
    const { back, navigation } = this.props;
    return (back ? navigation.goBack() : navigation.openDrawer());
  }

  renderRight = () => {
    const { white, title, navigation } = this.props;

    if (title === 'Title') {
      return [
        <ChatButton key='chat-title' navigation={navigation} isWhite={white} />,
        <BasketButton key='basket-title' navigation={navigation} isWhite={white} />
      ]
    }

    switch (title) {
      case 'Home':
        return ([
          <Block style={[styles.button, {marginRight: 0, paddingRight: 0}]}><Text>Cart</Text></Block>,
          <BasketButton key='basket-home' navigation={navigation} isWhite={white} />
        ]);
      case 'Products':
        return ([
          <Block style={[styles.button, {marginRight: 0, paddingRight: 0}]}><Text>Cart</Text></Block>,
          <BasketButton key='basket-home' navigation={navigation} isWhite={white} />
        ]);
      case 'Deals':
        return ([
          <Block style={[styles.button, {marginRight: 0, paddingRight: 0}]}><Text>Cart</Text></Block>,
          <BasketButton key='basket-categories' navigation={navigation} />
        ]);
      case 'Categories':
        return ([
          <Block style={[styles.button, {marginRight: 0, paddingRight: 0}]}><Text>Cart</Text></Block>,
          <BasketButton key='basket-categories' navigation={navigation} isWhite={white} />
        ]);
      case 'Category':
        return ([
          <Block style={[styles.button, {marginRight: 0, paddingRight: 0}]}><Text>Cart</Text></Block>,
          <BasketButton key='basket-deals' navigation={navigation} isWhite={white} />
        ]);
      case 'Profile':
        return ([
          <Block style={[styles.button, {marginRight: 0, paddingRight: 0}]}><Text>Cart</Text></Block>,
          <BasketButton key='basket-deals' navigation={navigation} isWhite={white} />
        ]);
      case 'Product':
        return ([
          <Block style={[styles.button, {marginRight: 0, paddingRight: 0}]}><Text>Cart</Text></Block>,
          <BasketButton key='basket-product' navigation={navigation} isWhite={white} />
        ]);
      case 'Search':
        return ([
          <Block style={[styles.button, {marginRight: 0, paddingRight: 0}]}><Text>Cart</Text></Block>,
          <BasketButton key='basket-search' navigation={navigation} isWhite={white} />
        ]);
      case 'Settings':
        return ([
          <Block style={[styles.button, {marginRight: 0, paddingRight: 0}]}><Text>Cart</Text></Block>,
          // <ChatButton key='chat-search' navigation={navigation} isWhite={white} />,
          <BasketButton key='basket-search' navigation={navigation} isWhite={white} />
        ]);
      default:
        break;
    }
  }

  renderSearch = () => {
    const { navigation } = this.props;
    return (
      <Input
        right
        color="black"
        style={styles.search}
        placeholder="What are you looking for?"
        onFocus={() => navigation.navigate('Products')}
        iconContent={<Icon size={16} color={theme.COLORS.MUTED} name="magnifying-glass" family="entypo" />}
      />
    )
  }

  renderTabs = () => {
    const { navigation, tabTitleLeft, tabTitleRight, white, title, } = this.props;
    if (title != 'Products') {
      return (
        <Block row style={styles.tabs}>
          <Button shadowless style={[styles.tab, styles.divider]} onPress={() => {global.product_navigation_param = {title:'top_selling'};navigation.navigate('Products');}}>
            <Block row middle>
              <Icon name="grid" family="feather" style={{ paddingRight: 8 }} />
              <Text size={16} style={styles.tabTitle}>{tabTitleLeft || 'Top Selling'}</Text>
            </Block>
          </Button>
          <Button shadowless style={styles.tab} onPress={() => navigation.navigate('Products')}>
            <Block row middle>
              <Icon size={16} name="search1" family="AntDesign" style={{ paddingRight: 8 }} />
              <Text size={16} style={styles.tabTitle}>{tabTitleRight || 'Search'}</Text>
            </Block>
          </Button>
        </Block>
      )
    } else return;
  }

  renderHeader = () => {
    const { search, tabs, title } = this.props;
    if(title !== 'Products') {
      if (search || tabs) {
        return (
          <Block center>
            {search ? this.renderSearch() : null}
            {/*{tabs ? this.renderTabs() : null}*/}
          </Block>
        )
      }
    }
    return null;
  }

  render() {
    const { back, title, white, transparent, navigation } = this.props;
    // const { routeName } = navigation.state;
    const noShadow = ["Search", "Categories", "Deals", "Pro", "Profile"].includes(title);
    const headerStyles = [
      !noShadow ? styles.shadow : null,
      transparent ? { backgroundColor: 'rgba(0,0,0,0)' } : null,
    ];

    return (
      <Block style={headerStyles}>
        <NavBar
          back={back}
          title={title == 'Home' ? 'Kalash Namkeen' : title}
          style={styles.navbar}
          onRightPress={()=> navigation.navigate('Pro')}
          transparent={transparent}
          right={this.renderRight()}
          rightStyle={{ alignItems: 'center' }}
          leftStyle={{ flex: 0.3, paddingTop: 2  }}
          leftIconName={(back ? 'chevron-left' : 'navicon')}
          leftIconColor={white ? theme.COLORS.WHITE : theme.COLORS.ICON}
          titleStyle={[
            styles.title,
            {color: theme.COLORS[white ? 'WHITE' : 'ICON']},
          ]}
          onLeftPress={this.handleLeftPress}
        />
        {this.renderHeader()}
      </Block>
    );
  }
}

export default withNavigation(Header);

const styles = StyleSheet.create({
  button: {
    padding: 12,
    position: 'relative',
  },
  title: {
    textAlign: 'center',
    width: '100%',
    fontSize: 16,
    fontWeight: 'bold',
  },
  navbar: {
    paddingVertical: 0,
    paddingBottom: iPhoneX() ? theme.SIZES.BASE * 1.5 : theme.SIZES.BASE * 0.2,
    paddingTop: iPhoneX() ? theme.SIZES.BASE * 4 : theme.SIZES.BASE,
    zIndex: 5,
    height: 50,
  },
  shadow: {
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.2,
    elevation: 3,
  },
  notify: {
    backgroundColor: materialTheme.COLORS.LABEL,
    borderRadius: 4,
    height: theme.SIZES.BASE / 2,
    width: theme.SIZES.BASE / 2,
    position: 'absolute',
    top: 8,
    right: 8,
  },
  header: {
    backgroundColor: theme.COLORS.WHITE,
  },
  divider: {
    borderRightWidth: 0.3,
    borderRightColor: theme.COLORS.MUTED,
  },
  search: {
    height: 40,
    width: width - 32,
    borderWidth: 1,
    borderRadius: 25,
    backgroundColor: '#e6e6e6',
  },
  tabs: {
    marginBottom: 24,
    marginTop: 2,
    elevation: 4,
  },
  tab: {
    backgroundColor: theme.COLORS.TRANSPARENT,
    width: width * 0.50,
    borderRadius: 0,
    borderWidth: 0,
    height: 24,
    elevation: 0,
  },
  tabTitle: {
    lineHeight: 19,
    fontWeight: '300'
  },
})