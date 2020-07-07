import React, { Component } from 'react';
import Form from './common/form';

class LoginForm extends Form {
  state = {
    data: { username: '', password: '' },
    errors: {},
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        {this.renderInput('username', 'Username')}
        {this.renderInput('password', 'Password')}
        {this.renderButton('Sign in')}
      </form>
    );
  }
}

export default LoginForm;
