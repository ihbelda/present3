"use client";

import Link from "next/link";
import { useEffect, useState } from 'react';
import Router from 'next/router';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import Row from 'react-bootstrap/Row';
import Stack from 'react-bootstrap/Stack';

const EventShow = ({ event, currentUser }) => {
  const [isLoading, setLoading] = useState(false);
  const [isBeforeLaunching, setBeforeLaunching] = useState(true);
  const [isAfterLaunching, setAfterLaunching] = useState(false);
  const [isAfterClosing, setAfterClosing] = useState(false);
  const [newPendingAmount, setNewPendingAmount] = useState(event.amount);

  const deleteMember = async (memberId) => {
    //event.preventDefault();
    const response = await fetch(`/api/events/${event.id}/members/${memberId}/delete`, {
      method: 'DELETE'
    });
    if (response) Router.push(`/events/${event.id}`);
  };

  const launchEvent = async () => {
    //event.preventDefault();
    setLoading(true);
    const response = await fetch(`/api/events/${event.id}/launch`, {
      method: 'POST'
    });
    if (response) {
      Router.push(`/events/${event.id}`);
      setLoading(false);
    }
  };

  const closeEvent = async () => {
  const response = await fetch(`/api/events/${event.id}/close`, {
      method: 'POST'
    });
    console.log("Response: ", response);
    if (response) {
      Router.push(`/events/`);
    }
    console.log("Cerrando event: ");
  };

  const memberList = event.members == undefined || event.members.length == 0 ?
    <tr>No members yet</tr>
    :event.members.map(member => {
      return (
        <tr key={member.id}>
          <td>{member.username}</td>
          <td className="text-center">{member.amount}</td>
          <td className="text-center">{member.email}</td>
          <td className="text-center">{member.status}</td>
          { !isAfterClosing && 
          <td className="text-center align-middle"><button onClick={() => deleteMember(member.id)} className="btn btn-link">Delete</button></td>}
        </tr>
      );
    });

  // Enable and Disable the Launch and Close Buttons
  useEffect(() => {
    // Buttons apperance
    if (event.status === 'Created') {
      setBeforeLaunching(true);
      setAfterLaunching(false);
      setAfterClosing(false);
    } else if (event.status === 'Launched')  { 
      setBeforeLaunching(false);
      setAfterLaunching(true); 
      setAfterClosing(false);     
    } else { // event.status == closed
      setAfterClosing(true);
    }

    // Update Pending Amount
    let totalAmount = 0;
    if (event.members !== undefined && event.members.length >= 0) {
    event.members.map(member => {
      totalAmount = totalAmount + member.amount;
    });
    }
    setNewPendingAmount(event.amount-totalAmount)
    
  }, [isBeforeLaunching, isAfterLaunching, isAfterClosing, isLoading, memberList]);

  return (
    <Container><Stack gap={3}>
    <Row className="justify-content-md-center">
    <Card style={{ width: '98%' }}>
      <Card.Body>
        <Card.Title>{event.title}</Card.Title>
        <Card.Text>Status: {event.status}</Card.Text>
        <Card.Text>{newPendingAmount}€ pending to collect of a total of {event.amount}€</Card.Text>
      </Card.Body>
    </Card>
    </Row>
    <Row className="justify-content-md-center">
    <h5>List of Participants</h5>
    <Table responsive>
      <thead>
        <tr>
          <th>User</th>
          <th className="text-center">Amount</th>
          <th className="text-center">Email</th>
          <th className="text-center">Status</th>
          <th className="text-center">Actions</th>
        </tr>
      </thead>
      <tbody> 
        {memberList}
        { !isAfterClosing && 
        <Link href="/events/[eventId]/members/new" as={`/events/${event.id}/members/new`}>Add</Link>}
      </tbody>
    </Table>
    </Row>
    { (isBeforeLaunching && !isAfterClosing) && <Row>
      <Button variant="primary" disabled={isLoading || event.members == undefined || event.members.length == 0} onClick={() => !isLoading ? launchEvent():null}>{isLoading ? 'Processing…' : 'Launch & Notify members'}</Button>
    </Row>}
    { (isAfterLaunching && !isAfterClosing) && <Row>
      <Button variant="primary" disabled={isLoading} onClick={() => !isLoading ? closeEvent():null}>{isLoading ? 'Processing…' : 'Close Event'}</Button>
    </Row>}
    <Row>
      <Button variant="secondary" title="Go back" onClick={() => Router.back()}>Back</Button>
    </Row></Stack></Container>
  );

};

EventShow.getInitialProps = async (context, client) => {
  const { eventId } = context.query;
  const { data } = await client.get(`/api/events/${eventId}`);

  return { event: data };
};

export default EventShow;