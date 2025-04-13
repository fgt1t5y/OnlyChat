export interface SendFriendRequestDto {
  receiverId: number;
}

export interface AcceptFriendRequestDto {
  friendRequestId: number;
}

export interface CancelFriendRequestDto {
  friendRequestId: number;
}
