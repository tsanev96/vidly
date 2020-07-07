import React, { Component } from 'react';
import Input from './input';
import Joi from '@hapi/joi';
import Select from './select';

class Form extends Component {
  validate = () => {
    const { data } = this.state;

    const options = { abortEarly: false };

    const { error } = Joi.object(this.schema).validate(data, options);
    if (!error) return null;

    const errors = {};
    for (let item of error.details) {
      errors[item.path[0]] = item.message;
    }

    return errors;
  };

  validateProperty = ({ name, value }) => {
    const obj = { [name]: value };
    const schema = {
      [name]: this.schema[name],
    };

    const { error } = Joi.object(schema).validate(obj);
    if (error) return error.details[0].message;
  };

  handleChange = ({ currentTarget: input }) => {
    const { data, errors } = this.state;
    const errorMessage = this.validateProperty(input);

    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];

    data[input.name] = input.value;

    this.setState({ data, errors });
  };

  handleSubmit = (ev) => {
    ev.preventDefault();

    const errors = this.validate();

    this.setState({ errors: errors || {} });
    if (errors) return;

    this.doSubmit();
  };

  renderInput = (name, label, type = 'text') => {
    const { data, errors } = this.state;

    return (
      <Input
        value={data[name]}
        onChange={this.handleChange}
        error={errors[name]}
        name={name}
        label={label}
        type={type}
      />
    );
  };

  renderSelect = (name, label, items) => {
    const { data, errors } = this.state;

    return (
      <Select
        name={name}
        label={label}
        onChange={this.handleChange}
        options={items}
        value={data[name]}
        error={errors[name]}
      />
    );
  };

  renderButton = (label) => {
    return (
      <button className="btn btn-sm btn-primary" disabled={this.validate()}>
        {label}
      </button>
    );
  };
}

export default Form;
