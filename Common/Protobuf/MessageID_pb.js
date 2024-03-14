/**
 * @fileoverview
 * @enhanceable
 * @suppress {messageConventions} JS Compiler reports an error if a variable or
 *     field starts with 'MSG_' and isn't a translatable message.
 * @public
 */
// GENERATED CODE -- DO NOT EDIT!

var jspb = require('google-protobuf');
var goog = jspb;
var global = Function('return this')();

goog.exportSymbol('proto.CardTypes', null, global);
goog.exportSymbol('proto.GameErrorCode', null, global);
goog.exportSymbol('proto.GameState', null, global);
goog.exportSymbol('proto.LoginType', null, global);
goog.exportSymbol('proto.PKGTypeID', null, global);
goog.exportSymbol('proto.ServerType', null, global);
goog.exportSymbol('proto.UserGameState', null, global);
/**
 * @enum {number}
 */
proto.PKGTypeID = {
  PKG_SERVER_MESSAGE_BEGIN: 0,
  PKG_SERVER_STATE: 1,
  PKG_SERVER_SHUTDOWN: 2,
  PKG_SERVER_GAME_ROOM_INFO: 10,
  PKG_SERVER_NOTIFY_USER_JOIN_GAME: 11,
  PKG_SERVER_MESSAGE_MAX: 999,
  PKG_GAME_VERSION: 1000,
  PKG_GATE_SERVER_LIST: 1001,
  PKG_GAME_LOGIN: 1003,
  PKG_GAME_ERROR: 1004,
  PKG_GAME_ACCOUNT_INFO: 1005,
  PKG_GAME_JOIN: 1100,
  PKG_GAME_CREATE: 1101,
  PKG_GAME_JOIN_INFO: 1102,
  PKG_GAME_START: 2000
};

/**
 * @enum {number}
 */
proto.ServerType = {
  EST_NONE: 0,
  EST_MANAGER_SERVER: 1,
  EST_LOBBY_SERVER: 2,
  EST_GATE_SERVER: 3,
  EST_GAME_SERVER: 4
};

/**
 * @enum {number}
 */
proto.GameErrorCode = {
  GEC_SUCCESS: 0,
  GEC_GAME_VERSION_ERROR: 1,
  GEC_ILLEGAL_ACCESS: 2,
  GEC_INVALID_LOGIN_TYPE: 3,
  GEC_INVALID_USER_ID: 4,
  GEC_DEVICE_ID_ERROR: 5,
  GEC_INVALID_TOKEN: 6,
  GEC_NOT_LOGIN_OR_INVALID_TOKEN: 7
};

/**
 * @enum {number}
 */
proto.LoginType = {
  ELT_NOT_LOGIN: 0,
  ELT_LOGIN_BY_VISITOR: 1,
  ELT_LOGIN_BY_APPLEID: 2,
  ELT_LOGIN_BY_FACEBOOK: 3,
  ELG_LOGIN_BY_GOOLE: 4
};

/**
 * @enum {number}
 */
proto.UserGameState = {
  UGS_READY: 0,
  UGS_PLAYING: 2,
  UGS_DISCARD: 3
};

/**
 * @enum {number}
 */
proto.GameState = {
  GS_READY: 0,
  GS_HOLECARDS: 1,
  GS_FLOPCARDS: 2,
  GS_RIVERCARDS: 3,
  GS_END: 4
};

/**
 * @enum {number}
 */
proto.CardTypes = {
  CT_HIGHT_CARD: 0,
  CT_ONE_PAIR: 1,
  CT_TWO_PAIRS: 2,
  CT_THREE_OF_A_KIND: 3,
  CT_STRAIGHT: 4,
  CT_FLUSH: 5,
  CT_FULL_HOUSE: 6,
  CT_FOUR_OF_A_KIND: 7,
  CT_STRAIGHT_FLUSH: 8,
  CT_ROYAL_FLUSH: 9
};

goog.object.extend(exports, proto);
