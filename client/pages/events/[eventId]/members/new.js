"use client";

import { useState } from 'react';
import Router from 'next/router'; // to redirect to another page
import useRequest from '../../../../hooks/use-request'; 
import Stack from 'react-bootstrap/Stack';

const NewMember = ({ event, eventId, currentUser }) => {
  const [username, setUsername] = useState('');
  const [amount, setAmount] = useState('');
  const [email, setEmail] = useState('');
  
  const { doRequest, errors } = useRequest({
    url: `/api/events/${eventId}/members`,
    method: 'post',
    body: {
      username, amount, email
    },
    onSuccess: (event) => Router.push(`/events/${eventId}`),
  });

  const onSubmit = (event) => {
    event.preventDefault();
    doRequest();
  };

  const onBlur = () => {
    const value = parseFloat(amount);
    if (isNaN(value)) {
      return;
    }
    setAmount(value.toFixed(2)); // rounding into 2 decimals
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <Stack gap={3}>
        <h4>Please introduce Member's info</h4>
        <div className="form-group">
          <label>Username</label>
          <input value={username} onChange={(e) => setUsername(e.target.value)} className="form-control" />
        </div>
        <div className="form-group">
          <label>Amount</label>
          <input value={amount}  onBlur={onBlur} onChange={(e) => setAmount(e.target.value)} className="form-control" />
        </div>  
        <div className="form-group"> 
          <label>Email</label>
          <input value={email}  onBlur={onBlur} onChange={(e) => setEmail(e.target.value)} className="form-control" />
        </div>  
        {errors}
        <button className="btn btn-primary">Create</button>   
        <button className="btn btn-secondary" title="Go back" onClick={() => Router.back()}>Back</button>
        </Stack>   
      </form>
    </>
  );
};

NewMember.getInitialProps = async (context, client) => {
  const { eventId } = context.query;
  return { eventId };
};

export default NewMember;