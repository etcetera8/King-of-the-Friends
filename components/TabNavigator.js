import React from 'react';
import { TabNavigator, TabBarBottom } from 'react-navigation';
import { Icon } from 'react-native-elements';

import Home from './Home';
import Account from './Account';

export const Tabs = TabNavigator({
  Home: {
    screen: Home,
    navigationOptions: {
      tabBarIcon: ({ tintColor }) => <Icon type="font-awesome" name="home" size={24} color={tintColor} />,
    }
  },
  Account: {
    screen: Account,
    navigationOptions: {
      tabBarLabel: 'Account',
      tabBarIcon: ({ tintColor }) => <Icon type="font-awesome" name="user" size={24} color={tintColor} />,
      }
    }
  })
