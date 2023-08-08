import mongoose from 'mongoose';
//import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
//import { Order, OrderStatus } from './order';

// attrs needed to create an order
interface MemberAttrs {
  username: string;
  userId: string;
  status: string;
  amount: number;
  email?: string;
  phone?: string;
  stripeId?: string;
}

// attrs really stored
export interface MemberDoc extends mongoose.Document {
  username: string;
  userId: string;
  status: string;
  amount: number;
  email?: string;
  phone?: string;
  stripeId?: string;
}

interface MemberModel extends mongoose.Model<MemberDoc> {
  build(attrs: MemberAttrs): MemberDoc;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<MemberDoc | null>;
}

const memberSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      requires: true,
    },
    userId: {
      type: String,
      requires: true,
    },
    status: {
      type: String,
      requires: true,
    },
    amount: {
      type: Number,
      requires: true,
      min: 0,
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    stripeId: {
      type: String,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

// Inject the update-if-current behavior
memberSchema.set('versionKey', 'version');
//memberSchema.plugin(updateIfCurrentPlugin);

// Alternative way to do the update-if-current manually
/*
ticketSchema.pre('save', function(done) {
  // @ts-ignore
  this.$where = {
    version: this.get('version') - 1
  };

  done();
});
*/

// Add directly a new method to the object
memberSchema.statics.findByEvent = (event: { id: string; version: number }) => {
  return Member.findOne({
    _id: event.id,
    version: event.version - 1,
  });
};
memberSchema.statics.build = (attrs: MemberAttrs) => {
  return new Member({
    //_id: member.id,
    username: attrs.username,
    userId: attrs.userId,
    status: attrs.status,
    amount: attrs.amount,
    email: attrs.email,
    phone: attrs.phone
  });
};

/*
// function because on mongoose format
memberSchema.methods.isReserved = async function () {
  const existingOrder = await Order.findOne({
    ticket: this,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
      ],
    },
  });
  // Returns True if exists and False if not
  return !!existingOrder;
};
*/

const Member = mongoose.model<MemberDoc, MemberModel>('Member', memberSchema);

export { Member, memberSchema };
