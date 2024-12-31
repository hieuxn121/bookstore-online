import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Notification.css"; // Optional for custom styling
import { notificationApi } from "../../apis";
import { useAuth, useSnackbar } from "../../contexts";
import { HTTP_STATUS, SNACKBAR } from "../../constants";
import moment from "moment";

const Notification = () => {
  const { user } = useAuth();
  const { openSnackbar } = useSnackbar();
  const [notifications, setNotifications] = useState([]);
  const [unreadNoti, setUnreadNoti] = useState([]);
  const [limit, setLimit] = useState(4);
  const [isToggled, setIsToggled] = useState(false);

  const handleToggle = () => {
    setIsToggled(!isToggled);
    if(isToggled) {
      fetchNotification();
    } else {
      setNotifications(unreadNoti);
    }
  };

  const fetchNotification = async (limit) => {
    try {
      const { data, status } = await notificationApi.listNotifications(user?.id);
      if (status === HTTP_STATUS.OK) {
        if (data.statusCode === "00000") {
          let notis = data.data?.map((item) => {
            if(item?.type === "COMMENT") {
              const customDate = moment(item?.modifiedAt).format("YY-MM-dd");
              const time = moment(item?.modifiedAt).format("HH:mm:ss");
              return {
                ...item,
                icon: "💬",
                message: item?.message,
                time: time,
                date: customDate
              }
            }
          });
          if(limit) {
            notis = notis?.filter((item, key) => key < limit);
          }
          const unreadNotis = notis.filter((item) => !item?.isRead);
          setUnreadNoti(unreadNotis);
          setNotifications(notis);
        } else {
          openSnackbar(SNACKBAR.ERROR, "Đăng nhập lại để tiếp tục");
        }
      } else {
        openSnackbar(SNACKBAR.ERROR, "Đăng nhập lại để tiếp tục");
      }
    } catch (error) {
      openSnackbar(SNACKBAR.ERROR, "Đăng nhập lại để tiếp tục");
    }
  };

  useEffect(() => {
    fetchNotification(limit);
  }, [limit]);

  const handleUpdateNoti = async (note) => {
    if(!note?.isRead) {
      try {
        const { data, status } = await notificationApi.markAsRead(note?.id);
        if(status === HTTP_STATUS.OK) {
          if(data.statusCode === "00000") {
            fetchNotification();
            if(window.fetchCountUnread) {
              window.fetchCountUnread();
            }
          } else {
            openSnackbar(SNACKBAR.ERROR, "Đánh dấu đã đọc thất bại!");
          }
        } else {
          openSnackbar(SNACKBAR.ERROR, "Đánh dấu đã đọc thất bại!");
        }
      } catch (error) {
        openSnackbar(SNACKBAR.ERROR, "Đánh dấu đã đọc thất bại!");
      }
    }
  };

  const handleMarkAll = async () => {
    try {
      const { data, status } = await notificationApi.markReadAll(user?.id);
      if(status === HTTP_STATUS.OK) {
        if(data.statusCode === "00000") {
          fetchNotification();
          if(window.fetchCountUnread) {
            window.fetchCountUnread();
          }
        } else {
          openSnackbar(SNACKBAR.ERROR, "Đánh dấu đã đọc thất bại!");
        }
      } else {
        openSnackbar(SNACKBAR.ERROR, "Đánh dấu đã đọc thất bại!");
      }
    } catch (error) {
      openSnackbar(SNACKBAR.ERROR, "Đánh dấu đã đọc thất bại!");
    }
  }

  return (
    <div className="notification-container rounded shadow" style={{ boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px"}}>
      <div className="notification-header d-flex align-items-center justify-content-between p-3">
        <div className="toggle-container">
          <span className={`toggle-text ${!isToggled ? "active" : ""}`}>Tất cả</span>
          <div className="toggle-switch">
            <input
              type="checkbox"
              id="toggle"
              className="toggle-input"
              checked={isToggled}
              onChange={handleToggle}
            />
            <label htmlFor="toggle" className="toggle-label">
              <span className="toggle-inner" />
              <span className="toggle-switch-button" />
            </label>
          </div>
          <span className={`toggle-text ${isToggled ? "active" : ""}`}>Chưa đọc</span>
          <button className="mark-read" onClick={handleMarkAll}>Đánh dấu đã đọc</button>
        </div>
      </div>
      <div style={{ maxHeight: "450px", overflowY: "auto" }}>
        {notifications.map((note, index) => (
          <div
            key={index}
            style={{ backgroundColor: note.isRead ? "white" : "#f1f1f1", color: "black" }}
            className="d-flex align-items-center justify-content-between p-3 noti-item"
          >
            <div className="d-flex align-items-center">
              <div className="check-read">
                <span className="check-read-icon"
                  onClick={() => {
                    handleUpdateNoti(note);
                  }}
                  style={{ 
                    backgroundColor: !note.isRead ? "rgb(243, 169, 161)" : "transparent",
                    cursor: !note.isRead ? "pointer" : "none"
                  }}>
                </span>
                <span className="notification-icon">{note.icon}</span>
              </div> 
              <div>
                <p className="mb-1 fw-bold">{note.message}</p>
                {note.extra && <p className="text-muted small mb-0">{note.extra}</p>}
                {note.date && <p className="small">{note.date}</p>}
              </div>
            </div>
            <div className="text-muted small" style={{ color: "white", fontSize: "11px" }}>
              <p className="mb-1">{note.time}</p>

            </div>
          </div>
        ))}
      </div>
      <div className="text-center">
        <button onClick={() => {
          setLimit(undefined);
        }} className="btn btn-outline-primary btn-sm">Tất cả thông báo</button>
      </div>
    </div>
  );
};

export default Notification;
