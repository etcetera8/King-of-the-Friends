import React from 'react';
import { TabNavigator, TabBarBottom } from 'react-navigation';
import { Icon } from 'react-native-elements';

import Home from './Home';
import Account from './Account';
import TeamManager from './TeamManager';

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
    },
  TeamManager: {
    screen: TeamManager,
    navigationOptions: {
      tabBarLabel: 'Team',
      tabBarIcon: ({ tintColor }) => <Icon type="font-awesome" name="dots-three-horizontal" type="entypo" size={24} color={tintColor} />,
    }
  }
  })
