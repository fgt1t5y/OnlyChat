export interface UserSession {
  token: string;
}

export interface LoginSessions {
  [uid: number]: UserSession[];
}
