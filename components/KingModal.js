import React, { Component } from 'react';
import { View, Modal, TouchableHighlight, Text } from 'react-native';

export default class KingModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      modalVisible: true
    }
  }

  componentDidMount() {
    if (this.props.currentChallengeActive === false) {
      console.log('show modal');
      this.setState({modalVisible: true})
    } else {
      console.log('show modal');
    }
  }

  setModalVisible = () => {
    this.setState({modalVisible: !this.state.modalVisible})
  }

  render() {
    console.log("i should be showing", this.props)
    return (
      <View style={{ marginTop: 22 }}>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            alert('Modal has been closed.');
          }}>
          <View style={{ marginTop: 22 }}>
            <View>
              <Text>Winner, challenge over</Text>

              <TouchableHighlight
                onPress={() => {
                  this.setModalVisible();
                }}>
                <Text>Hide Modal</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>
        </View>
    ) 
  }

}