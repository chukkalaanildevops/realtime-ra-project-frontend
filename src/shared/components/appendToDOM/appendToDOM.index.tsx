import React from 'react';
import ReactDOM from 'react-dom';
class AppendToDOM extends React.Component {
  el: any;
  constructor(props: {} | Readonly<{}>) {
    super(props);
    this.el = document.createElement('div');
    this.el.style.display = 'block';
    // this.el.style.position = 'absolute';
    // this.el.style.left = 0;
    // this.el.style.top = 0;
    // this.el.style.width = '100%';
    // The <div> is a necessary container for our
    // content, but it should not affect our layout.
    // Only works in some browsers, but generally
    // doesn't matter since this is at
    // the end anyway. Feel free to delete this line.
  }

  componentDidMount() {
    document.body.appendChild(this.el);
  }

  componentWillUnmount() {
    document.body.removeChild(this.el);
  }

  render() {
    return ReactDOM.createPortal(this.props.children, this.el);
  }
}

export default AppendToDOM;
