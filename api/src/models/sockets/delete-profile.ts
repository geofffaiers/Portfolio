import { BaseMessage } from './base-message';
import { MessageType } from './message-type';

export class DeleteProfile extends BaseMessage {
    type: MessageType.DELETE_PROFILE = MessageType.DELETE_PROFILE;
}
