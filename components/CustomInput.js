import React from 'react'
import { Sae } from 'react-native-textinput-effects';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
const defaultLabel = { color: 'rgba(242, 100, 48, 1)' };
const defaultInput = { color: 'rgba(160, 55, 252, 1)' };

export const CustomInput = ({ value, style, label, inputHandler, labelColor = defaultLabel, inputColor = defaultInput, iconColor = 'rgba(242, 100, 48, 1)'}) => {
  return (
    <Sae
      onChangeText={inputHandler}
      value={value}
      labelStyle={labelColor}
      inputStyle={inputColor}
      style={style}
      label={label}
      iconClass={FontAwesomeIcon}
      iconName={'pencil'}
      iconColor={iconColor}
      autoCapitalize={'none'}
      autoCorrect={false}
    />
  )
}