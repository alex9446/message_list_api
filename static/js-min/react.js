function Message(a){return/*#__PURE__*/React.createElement("div",{className:"message"},/*#__PURE__*/React.createElement("p",null,a.text),/*#__PURE__*/React.createElement("span",{className:"mdi mdi-pencil",onClick:a.edit}),/*#__PURE__*/React.createElement("span",{className:"mdi mdi-eraser",onClick:a.delete}))}function Popup(a){return/*#__PURE__*/React.createElement("div",{className:"popup",onClick:a.inherited.popup_toggle},/*#__PURE__*/React.createElement("div",{onClick:a=>a.stopPropagation()},/*#__PURE__*/React.createElement("div",null,a.elem)))}function MessagePopup(a){const b=/*#__PURE__*/React.createElement("div",{className:"new_message"},/*#__PURE__*/React.createElement("input",{type:"text",autoFocus:!0,onChange:a.store_value,onKeyUp:b=>{"Enter"===b.key&&a.save_value()}}),/*#__PURE__*/React.createElement("span",{className:"mdi mdi-floppy",onClick:a.save_value}));return/*#__PURE__*/React.createElement(Popup,{elem:b,inherited:a})}class MessageList extends React.Component{constructor(a){super(a),this.state={last_edit:null,messages:[],new_message_popup:!1,edit_message_popup:!1,edit_message_id:null,message_value:""}}render_messages(){return this.state.messages.map(a=>/*#__PURE__*/React.createElement(Message,{key:a.id,delete:()=>this.message_delete(a.id),edit:()=>this.setState({edit_message_popup:!0,edit_message_id:a.id}),text:a.text}))}message_delete(a){fetch("/messages/"+a,{method:"DELETE"}).then(a=>a.json()).then(a=>{a.error?console.warn(a.error):console.debug("Message deleted!")}).catch(a=>console.warn(a))}message_store_value(a){this.setState({message_value:a.target.value})}new_message_popup_toggle(){this.setState({new_message_popup:!this.state.new_message_popup})}new_message_save_value(){fetch("/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({text:this.state.message_value})}).then(a=>a.json()).then(a=>{a.error?console.warn(a.error):console.debug("Message created!")}).catch(a=>console.warn(a)),this.setState({new_message_popup:!1,message_value:""})}edit_message_save_value(){fetch("/messages/"+this.state.edit_message_id,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({text:this.state.message_value})}).then(a=>a.json()).then(a=>{a.error?console.warn(a.error):console.debug("Message edited!")}).catch(a=>console.warn(a)),this.setState({edit_message_popup:!1,edit_message_id:null,message_value:""})}render(){return console.debug("Render MessageList"),/*#__PURE__*/React.createElement("div",null,this.state.new_message_popup?/*#__PURE__*/React.createElement(MessagePopup,{popup_toggle:()=>this.new_message_popup_toggle(),store_value:a=>this.message_store_value(a),save_value:()=>this.new_message_save_value()}):null,this.state.edit_message_popup?/*#__PURE__*/React.createElement(MessagePopup,{popup_toggle:()=>this.setState({edit_message_popup:!1}),store_value:a=>this.message_store_value(a),save_value:()=>this.edit_message_save_value()}):null,/*#__PURE__*/React.createElement("div",{id:"title"},"Message List"),/*#__PURE__*/React.createElement("div",{id:"list"},this.render_messages()),/*#__PURE__*/React.createElement("div",{id:"add",className:"message",onClick:()=>this.new_message_popup_toggle()},/*#__PURE__*/React.createElement("span",{className:"mdi mdi-plus-box"})))}fetch_messages(a){fetch("/messages").then(a=>a.json()).then(b=>{b.error?console.warn(b.error):this.setState({last_edit:a,messages:b})}).catch(a=>console.warn(a))}fetch_last_action(){fetch("/last_action_on_messages").then(a=>a.json()).then(a=>{a.value&&a.value!==this.state.last_edit&&this.fetch_messages(a.value)}).catch(a=>console.warn(a))}componentDidMount(){this.fetch_messages(null),this.interval=setInterval(()=>this.fetch_last_action(),1e3)}componentWillUnmount(){clearInterval(this.interval)}}ReactDOM.render(/*#__PURE__*/React.createElement(MessageList,null),document.getElementById("root"));