import React, { Component } from 'react';
import Input from './common/input';
import Joi from '@hapi/joi';

class Register extends Component {
  state = {
    data: {
      username: '',
      password: '',
      name: '',
    },
    errors: {},
  };

  schema = Joi.object({
    username: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ['com', 'net'] },
      })
      .required(),
    password: Joi.string().min(5).max(255).required(),
    name: Joi.string().min(5).max(50).required(),
  });

  validate = () => {
    const { data } = this.state;

    const options = { abortEarly: false };

    const { error } = this.schema.validate(data, options);
    if (!error) return null;

    const errors = {};
    for (let item of error.details) {
      errors[item.path[0]] = item.message;
    }

    return errors;
  };

  handleChange = ({ currentTarget: input }) => {
    const { data } = this.state;

    data[input.name] = input.value;

    this.setState({ data });
  };

  handleSubmit = (ev) => {
    ev.preventDefault();

    const errors = this.validate();

    this.setState({ errors: errors || {} });
    if (errors) return;

    this.doSubmit();
  };

  doSubmit = () => {
    console.log('Submitted');
  };

  render() {
    const { data, errors } = this.state;
    return (
      //name, value, label
      <form onSubmit={this.handleSubmit}>
        <Input
          name="username"
          onChange={this.handleChange}
          value={data.username}
          error={errors.username}
          label="Username"
        />
        <Input
          name="password"
          onChange={this.handleChange}
          value={data.password}
          error={errors.password}
          label="Password"
        />
        <Input
          name="name"
          onChange={this.handleChange}
          value={data.name}
          error={errors.name}
          label="Name"
        />
        <button className="btn btn-primary">Sign up</button>
      </form>
    );
  }
}

export default Register;
