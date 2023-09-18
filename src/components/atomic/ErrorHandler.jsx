import { Component } from 'react';
import Swal from 'sweetalert2';

export default class ErrorHandler extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error(error, errorInfo);
    this.setState({ hasError: true });
  }

  handleReloadPage = () => {
    Swal.fire({
      title: 'Error!',
      text: 'Ha ocurrido un error, se recargara la página!',
      icon: 'error',
      timer: 2500,
      timerProgressBar: true,
      showConfirmButton: false
    })
    .then(() => {
      window.location.href = '/';
    });
  };

  render() {
    if (this.state.hasError) {
      return this.handleReloadPage();
    }

    return this.props.children;
  }
}
