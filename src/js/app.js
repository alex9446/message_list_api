import React from 'react';
import ReactDOM from 'react-dom';
import Icon from '@mdi/react';
import { mdiPencil, mdiEraser, mdiFloppy, mdiPlusBox } from '@mdi/js';

function Message(props) {
  return /*#__PURE__*/React.createElement("div", {
    className: "message"
  }, /*#__PURE__*/React.createElement("p", null, props.text), /*#__PURE__*/React.createElement(Icon, {
    path: mdiPencil,
    size: 1,
    className: "mdi mdi-pencil",
    onClick: props.edit
  }), /*#__PURE__*/React.createElement(Icon, {
    path: mdiEraser,
    size: 1,
    className: "mdi mdi-eraser",
    onClick: props.delete
  }));
}

function Popup(props) {
  return /*#__PURE__*/React.createElement("div", {
    className: "popup",
    onClick: props.inherited.popup_toggle
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", null, props.elem)));
}

function MessagePopup(props) {
  const elem = /*#__PURE__*/React.createElement("div", {
    className: "new_message"
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    autoFocus: true,
    onChange: props.store_value,
    onKeyUp: e => {
      if (e.key === 'Enter') {
        props.save_value();
      }
    }
  }), /*#__PURE__*/React.createElement(Icon, {
    path: mdiFloppy,
    size: 1,
    className: "mdi mdi-floppy",
    onClick: props.save_value
  }));
  return /*#__PURE__*/React.createElement(Popup, {
    elem: elem,
    inherited: props
  });
}

class MessageList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      last_edit: null,
      messages: [],
      new_message_popup: false,
      edit_message_popup: false,
      edit_message_id: null,
      message_value: ''
    };
  }

  render_messages() {
    return this.state.messages.map(message => {
      return /*#__PURE__*/React.createElement(Message, {
        key: message.id,
        delete: () => this.message_delete(message.id),
        edit: () => this.setState({
          edit_message_popup: true,
          edit_message_id: message.id
        }),
        text: message.text
      });
    });
  }

  message_delete(id) {
    fetch('/messages/' + id, {
      method: 'DELETE'
    }).then(res => res.json()).then(result => {
      if (result.error) {
        console.warn(result.error);
      } else {
        console.debug('Message deleted!');
      }
    }).catch(error => console.warn(error));
  }

  message_store_value(e) {
    this.setState({
      message_value: e.target.value
    });
  }

  new_message_popup_toggle() {
    this.setState({
      new_message_popup: !this.state.new_message_popup
    });
  }

  new_message_save_value() {
    fetch('/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: this.state.message_value
      })
    }).then(res => res.json()).then(result => {
      if (result.error) {
        console.warn(result.error);
      } else {
        console.debug('Message created!');
      }
    }).catch(error => console.warn(error));
    this.setState({
      new_message_popup: false,
      message_value: ''
    });
  }

  edit_message_save_value() {
    fetch('/messages/' + this.state.edit_message_id, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: this.state.message_value
      })
    }).then(res => res.json()).then(result => {
      if (result.error) {
        console.warn(result.error);
      } else {
        console.debug('Message edited!');
      }
    }).catch(error => console.warn(error));
    this.setState({
      edit_message_popup: false,
      edit_message_id: null,
      message_value: ''
    });
  }

  render() {
    console.debug('Render MessageList');
    return /*#__PURE__*/React.createElement("div", null, this.state.new_message_popup ? /*#__PURE__*/React.createElement(MessagePopup, {
      popup_toggle: () => this.new_message_popup_toggle(),
      store_value: e => this.message_store_value(e),
      save_value: () => this.new_message_save_value()
    }) : null, this.state.edit_message_popup ? /*#__PURE__*/React.createElement(MessagePopup, {
      popup_toggle: () => this.setState({
        edit_message_popup: false
      }),
      store_value: e => this.message_store_value(e),
      save_value: () => this.edit_message_save_value()
    }) : null, /*#__PURE__*/React.createElement("div", {
      id: "title"
    }, "Message List"), /*#__PURE__*/React.createElement("div", {
      id: "list"
    }, this.render_messages()), /*#__PURE__*/React.createElement("div", {
      id: "add",
      className: "message",
      onClick: () => this.new_message_popup_toggle()
    }, /*#__PURE__*/React.createElement(Icon, {
      path: mdiPlusBox,
      size: 1,
      className: "mdi mdi-plus-box"
    })));
  }

  fetch_messages(last_edit) {
    fetch('/messages').then(res => res.json()).then(result => {
      if (result.error) {
        console.warn(result.error);
      } else {
        this.setState({
          last_edit: last_edit,
          messages: result
        });
      }
    }).catch(error => console.warn(error));
  }

  fetch_last_action() {
    fetch('/last_action_on_messages').then(res => res.json()).then(result => {
      if (result.value && result.value !== this.state.last_edit) {
        this.fetch_messages(result.value);
      }
    }).catch(error => console.warn(error));
  }

  componentDidMount() {
    this.fetch_messages(null);
    this.interval = setInterval(() => this.fetch_last_action(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

}

ReactDOM.render( /*#__PURE__*/React.createElement(MessageList, null), document.getElementById('root'));