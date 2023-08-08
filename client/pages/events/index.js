"use client";

import Link from "next/link";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Stack from 'react-bootstrap/Stack';
import Table from 'react-bootstrap/Table';

const EventIndex = ({ events }) => {
  const eventList = events.map(event => {
    return (
      <tr key={event.id}>
        <td>{event.title}</td>
        <td className="text-center">{event.amount}</td>
        <td className="text-center" suppressHydrationWarning>{new Date(event.endDate).toLocaleDateString()}</td>
        <td className="text-center">{event.status}</td>
        <td className="text-center">
          <Link href="/events/[eventId]" as={`/events/${event.id}`}>View</Link>
          {'  '}
          { event.status !== 'Closed' &&
          <Link href="/events/[eventId]/update" as={`/events/${event.id}/update`}>Edit</Link>}
        </td>
      </tr>
    );
  });
  
  return (
    <Container><Stack gap={3}>
    <Row className="justify-content-md-center">
      <h4>List of Events</h4>
      <Table responsive="sm" striped bordered hover size="sm">
        <thead>
          <tr>
            <th>Title</th>
            <th className="text-center">Amount</th>
            <th className="text-center">End Date</th>
            <th className="text-center">Status</th>
            <th className="text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {eventList.length ? eventList : <p>no events</p>}
        </tbody>
      </Table>
    </Row>
    </Stack></Container>
  );

}

EventIndex.getInitialProps = async (context, client) => {
  const { data } = await client.get('/api/events');
  return { events: data };
};

export default EventIndex;