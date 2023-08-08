"use client";

import { useState } from 'react';
import Router from 'next/router'; // to redirect to another page
import useRequest from '../../../../hooks/use-request';
import StripeCheckout from 'react-stripe-checkout';
import Stack from 'react-bootstrap/Stack';

const RegisterMember = ({ event, eventId, memberId, member, currentUser }) => {
  const [amount, setAmount] = useState(member.amount);
  const [email, setEmail] = useState(member.email);
  
  const { doRequest, errors } = useRequest({
    url: `/api/events/${eventId}/members/${memberId}/subscribe`,
    method: 'post',
    body: {
      amount, email
    },
    onSuccess: (event) => Router.push(`/events/${eventId}/members/thanks`),
  });

  return (
    <>
      <Stack gap={3}>
      <h4>Pay & Register</h4>
        <div className="form-group">
          <label>Amount</label>
          <input disabled = {true} value={member.amount} className="form-control" />
        </div>  
        <div className="form-group"> 
          <label>Email</label>
          <input disabled = {true} value={member.email} className="form-control" />
        </div>  
        {errors}
        <div>
          <StripeCheckout 
            token={({ id }) => doRequest({ token:id })} //we want to call doRequest to pass the token id
            stripeKey="pk_test_51NT28pByYZZFg3li6VLPtZaLmWs56PI6XyvDxdEF5AHDcXahMVzpoiLIglaYTMldxxCDjszyph1xs5cwIP2Ehsnm00xrqdHSML"
            amount={member.amount * 100}
            email={member.email}/>
        </div>
        <button className="btn btn-secondary" title="Go back" onClick={() => Router.back()}>Back</button>
      </Stack>     
    </>
  );
};

RegisterMember.getInitialProps = async (context, client) => {
  const { eventId, memberId } = context.query;
  const { data } = await client.get(`/api/events/${eventId}/members/${memberId}`);

  return { eventId, memberId, member: data };
};

export default RegisterMember;