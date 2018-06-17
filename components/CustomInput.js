import React from 'react'
import { Sae } from 'react-native-textinput-effects';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

export const CustomInput = ({value, style, label, inputHandler}) => {
  return (
    <Sae
      onChangeText={inputHandler}
      value={value}
      labelStyle={{ color: 'rgba(242, 100, 48, 1)' }}
      inputStyle={{ color: 'rgba(160, 55, 252, 1)' }}
      style={style}
      label={label}
      iconClass={FontAwesomeIcon}
      iconName={'pencil'}
      iconColor={'rgba(242, 100, 48, 1)'}
      autoCapitalize={'none'}
      autoCorrect={false}
    />
  )
}