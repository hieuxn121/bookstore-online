import * as rest from "./base";

const listNotifications = (userId) =>
  rest.get(`/notifications?userId=${userId}`);

const listNotificationsUnread = (userId) =>
    rest.get(`/notifications/count-unread?userId=${userId}`);

const markAsRead = (id) =>
    rest.put(`/notifications/read/${id}`);

const markReadAll = (userId) =>
    rest.put(`/notifications/read-all?userId=${userId}`);

export default {
    listNotifications,
    listNotificationsUnread,
    markAsRead,
    markReadAll
};
