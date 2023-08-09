import { Publisher, MemberCreatedEvent, Subjects } from '@anei/common';

export class MemberCreatedPublisher extends Publisher<MemberCreatedEvent> {
  readonly subject = Subjects.MemberCreated;
}
