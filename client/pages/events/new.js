"use client";

import { useState } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request'; 
import Stack from 'react-bootstrap/Stack';
 
const NewEvent = () => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [endDate, setEndDate] = useState('');
  const { doRequest, errors } = useRequest({
    url: '/api/events',
    method: 'post',
    body: {
      title, amount, endDate
    },
    onSuccess: (event) => Router.push('/events'),
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

    const setupMinDate = () => {
    console.log("MIN: ",new Date().toISOString().split("T")[0] )
    document.getElementById("date").min = new Date().toISOString().split("T")[0];
  };

  // Now we can use <> to encapsulate html in react
  return (
    <> 
      <form onSubmit={onSubmit}>
        <Stack gap={3}>
        <h4>Create an Event</h4>
        <div className="form-group">
          <label>Title of the Event</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="form-control" />
        </div>
        <div className="form-group">
          <label>Total amount to collect</label>
          <input value={amount}  onBlur={onBlur} onChange={(e) => setAmount(e.target.value)} className="form-control" />
        </div>  
        <div className="form-group">
          <label>Deadline date to collect</label>
          <input id="date" type= "date" onBlur={setupMinDate} value={endDate} onChange={(e) => setEndDate(e.target.value)} className="form-control" />
        </div>
        {errors}
        <button className="btn btn-primary">Submit</button>  
        <button className="btn btn-secondary" title="Go back" onClick={() => Router.back()}>Back</button>  
        </Stack>  
      </form>
    </>
  );
};

export default NewEvent;