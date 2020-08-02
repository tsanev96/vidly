import React, { Component } from 'react';
import Form from './common/form';
import { login } from '../services/authService';
import Joi from '@hapi/joi';

class LoginForm extends Form {
  state = {
    data: { username: '', password: '' },
    errors: {},
  };

  schema = {
    username: Joi.string().required().label('Username'),
    password: Joi.string().required().label('Password'),
  };

  doSubmit = async () => {
    try {
      const { username, password } = this.state.data;
      const { data: jwt } = await login(username, password);
      localStorage.setItem('token', jwt);
      window.location = '/';
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        const errors = this.state;
        errors.username = ex.response.data;
        this.setState({ errors });
      }
    }
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        {this.renderInput('username', 'Username')}
        {this.renderInput('password', 'Password', 'password')}
        {this.renderButton('Sign in')}
      </form>
    );
  }
}

export default LoginForm;
