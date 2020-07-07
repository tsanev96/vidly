import React from 'react';
import Form from './common/form';
import Joi from '@hapi/joi';

class Register extends Form {
  state = {
    data: {
      username: '',
      password: '',
      name: '',
    },
    errors: {},
  };

  schema = {
    username: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ['com', 'net'] },
      })
      .required(),
    password: Joi.string().min(5).max(255).required(),
    name: Joi.string().min(5).max(50).required(),
  };

  doSubmit = () => {
    console.log('Submitted');
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        {this.renderInput('username', 'Username')}
        {this.renderInput('password', 'Password', 'password')}
        {this.renderInput('name', 'Name')}
        {this.renderButton('Sign up')}
      </form>
    );
  }
}

export default Register;
