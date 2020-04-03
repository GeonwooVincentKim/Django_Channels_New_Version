import React from 'react';
import { Modal, Button } from 'antd';
// Importing Form
import Form from "./Form";

class AddChatModal extends React.Component {
  render() {
    console.log('Testing.....');
    return (
        <Modal
          centered
          footer={ null }
          visible={this.props.isVisible}
          onCancel={this.props.close}
        >
          <Form />
        </Modal>
    );
  }
}

export default AddChatModal;