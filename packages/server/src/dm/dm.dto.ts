export interface OpenDMSessionDto {
  userBId: number;
}

export interface CloseDMSessionDto {
  userBId: number;
}

export interface GetDMMessageDto {
  dmSessionId: number;
  around: number;
  before: number;
  takeCount: number;
}

export interface CreateDMMessageDto {
  dmSessionId: number;
  content: string;
}
