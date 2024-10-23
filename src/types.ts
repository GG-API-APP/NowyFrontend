export type ConversationPair = {
  _id: string;
  personOne: string;
  personOneName?: string;
  personOneDescription?: string;
  lastOriginalMessge: string;
  lastMessge: string;
  messageCount: number;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
  personTwo: string;
  personTwoName?: string;
  personTwoDescription?: string;
};

export type Conversation = {
  _id: string;
  conversationId: string;
  authorPerson: string;
  originalMessage: string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
};
