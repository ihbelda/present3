"use client";

import { useState } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';
import Stack from 'react-bootstrap/Stack';

export default () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { doRequest, errors } = useRequest({
    url: '/api/users/signin', 
    method: 'post',
    body: {
      username, 
      password
    },
    onSuccess: () => Router.push('/events')
  });

  // Arrow function array -since ES6
  const onSubmit = async (event) => {
    event.preventDefault(); // To ensure we don't submit the form if any errors
    await doRequest();
  }
 
  return (
    <>
    <form onSubmit={onSubmit} >
      <Stack gap={3}>
      <h4>Please enter your username and password</h4>
      <div className="form-group">
        <label>Username</label>
        <input 
          value={username} 
          onChange={e => setUsername(e.target.value)}
          className="form-control" />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input 
          value={password}
          onChange={e => setPassword(e.target.value)}
          type="password" className="form-control" />
      </div>
      {errors}
      <button className="btn btn-primary">Sign In</button>
      </Stack>
    </form>
    </>
  );
};