import { Listener, MemberCreatedEvent, Subjects } from '@anei/common';
import { queueGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { User } from '../../models/user';
//import { TickerUpdatedPublisher } from '../publishers/ticket-updated-publishers';

export class MemberCreatedListener extends Listener<MemberCreatedEvent> {
  readonly subject = Subjects.MemberCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: MemberCreatedEvent['data'], msg: Message) {
    const { username, email } = data;
    var user = await User.findOne({ username });

    // 2 SCENARIOS
    // CASE 1: the user doesn't exist, we need to create it from scratch
    // CASE 2: the user already exist, we need to modify the user
    if (!user) {
      // Build the user from scratch
      const newUser = User.build({
        username,
        password: '',
        email,
        role: 'member',
      }); 
      await newUser.save();
    } else {
    // Modify a current user
    user.set({
      email,
      role: 'member',
    });
    await user.save();
  }

    // // Need to inform everyone by publishing an event
    // // new TickerUpdatedPublisher(natsWrapper.client); // ok but need to import nats, tests more difficult
    // await new TickerUpdatedPublisher(this.client).publish({
    //   // best approach
    //   id: ticket.id,
    //   price: ticket.price,
    //   title: ticket.title,
    //   userId: ticket.userId,
    //   orderId: ticket.orderId,
    //   version: ticket.version,
    // });

    // ack the event
    msg.ack();
  }
}
