import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { MemberDoc, memberSchema } from './member';

interface EventAttrs {
  title: string;
  ownerId: string;
  status: string;
  amount: number;
  pendingAmount: number;
  endDate: Date;
  members?: [MemberDoc];
  type?: string;
}

// Have the possibility to add more attributes in the future
interface EventDoc extends mongoose.Document {
  title: string;
  ownerId: string;
  status: string;
  amount: number;
  pendingAmount: number;
  endDate: Date;
  members?: [MemberDoc];
  type?: string;
  version: number;
}

interface EventModel extends mongoose.Model<EventDoc> {
  build(attrs: EventAttrs): EventDoc;
}

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    ownerId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      //enum: Object.values(OrderStatus),
      //default: OrderStatus.Created,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    pendingAmount: {
      type: Number,
      required: true,
    },
    endDate: {
      type: mongoose.Schema.Types.Date,
      required: true,
    },
    members: {
      type: [memberSchema],
      default: undefined,
    },
    type: {
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

// Use version capability of mongoose
eventSchema.set('versionKey', 'version');
eventSchema.plugin(updateIfCurrentPlugin);

eventSchema.statics.build = (attrs: EventAttrs) => {
  return new Event(attrs);
};

const Event = mongoose.model<EventDoc, EventModel>('Event', eventSchema);

export { Event };
