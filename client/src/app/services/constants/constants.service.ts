import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConstantsService {

  // api routes
  API_USER: string = 'server/user';
  API_LOGIN: string = 'server/user/login';
  API_FIND_BY_USERNAME: string = 'server/user/find-by-username';
  API_FIND_BY_EMAIL: string = 'server/user/find-one-by-email';
  API_FIND_FORGOT_USER_BY_EMAIL: string = 'server/user/find-forgot-user-by-email';
  API_GET_QUESTION: string = 'server/user/get-question';
  API_ANSWER_QUESTION: string = 'server/user/answer-question';
  API_RESET_PASSWORD: string = 'server/user/reset-password';

  // sockets
  SOCKET_TO_LOGIN: string = 'login';
  SOCKET_FROM_LOGIN_CONFIRMED: string = 'loginConfirmed';
  SOCKET_TO_LOGOUT: string = 'logout';
  SOCKET_TO_ADD_MESSAGE: string = 'addMessage';
  SOCKET_TO_OPEN_ROOM: string = 'openRoom';
  SOCKET_TO_CLOSE_ROOM: string = 'closeRoom';
  SOCKET_TO_JOIN_ROOM: string = 'joinRoom';
  SOCKET_TO_LEAVE_ROOM: string = 'leaveRoom';
  SOCKET_TO_CREATE_ROOM: string = 'createRoom';
  SOCKET_TO_FILTER_ALL_ROOMS: string = 'filterAllRooms';
  SOCKET_TO_PAGINATE_MY_ROOMS: string = 'paginateMyRooms';
  SOCKET_TO_PAGINATE_ALL_ROOMS: string = 'paginateAllRooms';
  SOCKET_FROM_MY_ROOMS: string = 'rooms';
  SOCKET_FROM_ALL_ROOMS: string = 'allRooms';
  SOCKET_FROM_MESSAGES: string = 'messages';
  SOCKET_FROM_MESSAGE_ADDED: string = 'messageAdded';
  SOCKET_FROM_USER_DISCONNECTED: string = 'userDisconnected';

  // local storage
  STORAGE_TOKEN: string = 'quest_app_token';
  STORAGE_USER: string = 'user';

  SECURITY_QUESTIONS: string[] = [
    'In what city were you born?',
    'What is the name of your favorite pet?',
    'What is your mother\'s maiden name?',
    'What high school did you attend?',
    'What is the name of your first school?',
    'What was the make of your first car?',
    'What was your favorite food as a child?'
  ];

}
