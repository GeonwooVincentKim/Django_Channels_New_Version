import React from "react";
import { Button, Select } from "antd";
import { Form } from '@ant-design/compatible';
import axios from "axios";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import * as navActions from "../store/actions/nav";
import * as messageActions from "../store/actions/message";
import { HOST_URL } from "../settings";

const FormItem = Form.Item;

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class HorizontalAddChatForm extends React.Component {
  state = {
    usernames: [],
    error: null
  };

  // Easiest way to show value, and that value is constantly updating
  // as a new list of values that's inside the form.
  // It is not necessary to constantly add them ourselves.
  // That something that's already done for us.
  handleChange = value => {
    this.setState({
      usernames: value
    });
  };

  // To disabled submit button at the beginning.
  componentDidMount() {
    this.props.form.validateFields();
  }

  handleSubmit = e => {
    // Destructuring usernames using this notation.
    const { usernames } = this.state;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // this.props.username is our usernames.
        const combined = [...usernames, this.props.username];
        console.log(combined);
        axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
        axios.defaults.xsrfCookieName = "csrftoken";
        axios.defaults.headers = {
          "Content-Type": "application/json",
          Authorization: `Token ${this.props.token}`
        };
        axios
          .post("${HOST_URL}/chat/create/", {
            messages: [],
            participants: combined
          })
          .then(res => {
            // Add a .then method to handle getting that response and
            // basically once we get the response we want to navigate to the chat
            // that we just created.

            // To close the pop-up and get User Chats.
            // `/${res.data.id}` is the Chat id we just created.
            this.props.history.push(`/${res.data.id}`);
            // Once we've closed the chat then we can say
            // this.props.getUserChats.
            this.props.closeAddChatPopup();
            // And that takes in 'this.props.username'.
            // Show username and token as an arguments.
            this.props.getUserChats(this.props.username, this.props.token);
          })
          .catch(err => {
            // Show the errors.
            console.error(err);
            this.setState({
              error: err
            });
          });
      }
    });
  };

  render() {
    const {
      getFieldDecorator,
      getFieldsError,
      getFieldError,
      isFieldTouched
    } = this.props.form;

    // Only Show error after a field is touched.
    const userNameError =
      isFieldTouched("userName") && getFieldError("userName");
    return (
      <Form layout="inline" onSubmit={this.handleSubmit}>
        {this.state.error ? `${this.state.error}` : null}
        <FormItem
          validateStatus={userNameError ? "error" : ""}
          help={userNameError || ""}
        >
          {getFieldDecorator("userName", {
            rules: [
              {
                required: true,
                message:
                  "Please input the username of the person you want to chat with"
              }
            ]
          })(
            // Select
            <Select
              mode="tags"
              style={{ width: "100%" }}
              placeholder="Tags Mode"
              onChange={this.handleChange}
            >
              {[]}
            </Select>
          )}
        </FormItem>
        <FormItem>
          <Button
            type="primary"
            htmlType="submit"
            disabled={hasErrors(getFieldsError())}
          >
            Start a chat
          </Button>
        </FormItem>
      </Form>
    );
  }
}

const AddChatForm = Form.create()(HorizontalAddChatForm);

const mapStateToProps = state => {
  return {
    token: state.auth.token,
    username: state.auth.username
  };
};

const mapDispatchToProps = dispatch => {
  return {
    closeAddChatPopup: () => dispatch(navActions.closeAddChatPopup()),
    // Show the Chat ID who just come into to that Chat.
    getUserChats: (username, token) =>
      dispatch(messageActions.getUserChats(username, token))
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(AddChatForm)
);