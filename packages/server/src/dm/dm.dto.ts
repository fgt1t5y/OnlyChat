export interface OpenDMSessionDto {
  userBId: number;
}

export interface CloseDMSessionDto {
  userBId: number;
}

export interface GetDMMessageDto {
  dmSessionId: number;
  after: number;
  takeCount: number;
}

export interface CreateDMMessageDto {
  dmSessionId: number;
  content: string;
}
