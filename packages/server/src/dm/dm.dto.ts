export interface OpenDMSessionDto {
  userBId: number;
}

export interface GetDMMessageDto {
  dmSessionId: number;
  after: number;
  takeCount: number;
}
