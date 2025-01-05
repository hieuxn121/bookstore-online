import React, { useState, useEffect, useContext, createContext } from "react";
import styled from "styled-components";
import { ArrowUpward, ArrowDownward } from "@material-ui/icons";
import TextArea from "react-textarea-autosize";
import  { commentApi } from "../../apis";
import { HTTP_STATUS, SNACKBAR } from "../../constants";
import Markdown from "./Markdown";
import Card from "./Card";
import Button from "./Button";
import { useAuth, useSnackbar } from "../../contexts";
import moment from "moment";
import { useParams } from "react-router-dom";

const CommentContext = createContext({});

function compare(a1, a2) {
  if (JSON.stringify(a1) === JSON.stringify(a2)) {
    return true;
  }
  return false;
}

function gen_comments(comments, colorindex, path) {
  return comments?.map((comment, i) => {
    return (
      <Comment
        username={comment.fullName}
        userId={comment.userId}
        date={comment.modifiedAt}
        text={comment.content}
        id={comment.id}
        colorindex={colorindex}
        key={i}
        path={[...path, i]}
        comments={comment.children?.reverse()}
        children={comment?.parentCommentId}
      />
    );
  });
}

function Reply(props) {
  const { id } = useParams();
  const bookId = id;
  const auth = useAuth();
  const user = auth?.user;
  const [text, setText] = useState("");
  const { openSnackbar } = useSnackbar();

  const hanldeSubmitComment = async () => {
    if(text !== "" && bookId) {
      try {
        const payload = {
          id: null,
          bookId: bookId,
          parentCommentId: props.parentCommentId || null,
          replyToUserId: props.userId || null,
          content: text,
        }
        const { data, status } = await commentApi.postComment(payload);
        if (status === HTTP_STATUS.OK) {
          if (data.statusCode === "00000") {
            if(window.fetchComments) {
              window.fetchComments();
            }
            setText("");
            openSnackbar(SNACKBAR.SUCCESS, "Bình luận thành công!");
          } else {
            openSnackbar(SNACKBAR.ERROR, "Bình luận thất bại!");
          }
        }
      } catch (error) {
        openSnackbar(SNACKBAR.ERROR, "Bình luận thất bại!");
      }
    }
  }

  return (
    <div {...props}>
      <TextArea
        placeholder={user ? "Hãy để lại bình luận của bạn" : "Đăng nhập để bình luận"}
        minRows={2}
        defaultValue={text}
        value={text}
        onChange={value => {
          setText(value.target.value);
        }}
        disabled={!user}
      />
      <div className="panel">
        <div className="comment_as">
          Bình luận bởi{" "}
          <a href="" className="username">
            {user?.name}
          </a>
        </div>
        <Button onClick={hanldeSubmitComment} disabled={text===""}>Bình luận</Button>
      </div>
    </div>
  );
}

Reply = styled(Reply)`
  border-radius: 8px;
  border: solid 1px #3d4953;
  overflow: hidden;

  &.hidden {
    display: none;
  }

  textarea {
    font-family: inherit;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;

    resize: none;

    background: #13181d;
    padding: 12px;
    color: #cccccc;
    border: none;
    max-width: 100%;
    min-width: 100%;
  }

  .panel {
    display: flex;
    align-items: center;
    background: #3d4953;
    padding: 8px;

    .comment_as {
      font-size: 14px;
      color: #cccccc;
      margin-right: 8px;

      .username {
        display: inline-block;
        color: #4f9eed;
      }
    }

    ${Button} {
      font-size: 14px;
      margin-left: auto;
    }
  }
`;

function Rating(props) {
  const [count, setCount] = useState(props.votes);
  const [thumbsUp, setThumbsUp] = useState(false);
  const [thumbsDown, setThumbsDown] = useState(false);

  useEffect(() => {
    setCount(props.votes);
  }, [props.votes]);

  return (
    <div {...props}>
      <button
        className={`material-icons ${thumbsUp ? "selected" : ""}`}
        id="thumbs_up"
        // onClick={() => {
        //   setThumbsUp(!thumbsUp);
        //   setThumbsDown(false);
        // }}
      >
        <ArrowUpward/>
      </button>
      <div
        className={`count ${thumbsUp ? "up" : ""} ${thumbsDown ? "down" : ""}`}
      >
        {thumbsUp ? count + 1 : ""}
        {thumbsDown ? count - 1 : ""}
        {thumbsUp || thumbsDown ? "" : count}
      </div>
      <button
        className={`material-icons ${thumbsDown ? "selected" : ""}`}
        id="thumbs_down"
        // onClick={() => {
        //   setThumbsDown(!thumbsDown);
        //   setThumbsUp(false);
        // }}
      >
        <ArrowDownward/>
      </button>
    </div>
  );
}

Rating = styled(Rating)`
  display: flex;
  flex-direction: column;
  margin-right: 12px;

  .count {
    font-weight: bold;
    text-align: center;
    color: #3d4953;

    &.up {
      color: #4f9eed;
    }

    &.down {
      color: #ed4f4f;
    }
  }

  button#thumbs_up,
  button#thumbs_down {
    border: none;
    background: none;
    cursor: pointer;
    color: #3d4953;
    user-select: none;
  }

  #thumbs_up.selected {
    color: #4f9eed;
  }

  #thumbs_down.selected {
    color: #ed4f4f;
  }
`;

function Comment(props) {
  const auth = useAuth();
  const [replying, setReplying] = useContext(CommentContext);
  const [minimized, setMinimized] = useState(false);
  const [hidden, setHidden] = useState(false);
  const customDate = moment(props?.date).format("yyyy-MM-dd HH:mm:ss");
  const [countComments, setCountComments] = useState(props.comments?.length || 0);
  const { openSnackbar } = useSnackbar();
  const { user } = auth;

  useEffect(() => {
    setCountComments(props.comments?.length);
  }, [props.comments?.length]);

  useEffect(() => {
    async function fetchData() {
      if (props.path.length > 2 && props.path.length % 2 === 0) {
        setHidden(true);
      }
      if (props.path[props.path.length - 1] > 3) {
        setHidden(true);
      }
    };
    fetchData();
  }, [props.path]);

  const handleDeleteComment = async () => {
    if(props.id) {
      try {
        const { status } = await commentApi.deleteComment(props.id);
        if(status === HTTP_STATUS.OK) {
          if(window.fetchComments) {
            window.fetchComments();
          }
          openSnackbar(SNACKBAR.SUCCESS, "Xóa bình luận thành công!");
        } else {
          openSnackbar(SNACKBAR.ERROR, "Xóa bình luận thất bại!");
        }
      } catch (error) {
        openSnackbar(SNACKBAR.ERROR, "Xóa bình luận thất bại!");
      }
    }
  }
  return (
    <div {...props}>
      {hidden ? (
        <button
          id="showMore"
          onClick={() => {
            setHidden(false);
          }}
        >
          Show More Replies
        </button>
      ) : (
        <>
          <div id="left" className={minimized ? "hidden" : ""}>
            <Rating votes={countComments} />
          </div>
          <div id="right">
            <div id="top">
              <span
                className="minimize"
                onClick={() => {
                  setMinimized(!minimized);
                }}
              >
                [{minimized ? "+" : "-"}]
              </span>
              <span id="username">
                <a href="">{props.username}</a>
              </span>
              <span id="date">
                <a href="">{customDate}</a>
              </span>
            </div>
            <div id="content" className={minimized ? "hidden" : ""}>
              <Markdown options={{ forceBlock: true }}>{props.text}</Markdown>
            </div>
            <div id="actions" className={minimized ? "hidden" : ""}>
              {!props.children && (
                <span
                  className={`${compare(replying, props.path) ? "selected" : ""}`}
                  onClick={() => {
                    if (compare(replying, props.path)) {
                      setReplying([]);
                    } else {
                      setReplying(props.path);
                    }
                  }}
                >
                  reply
                </span>
              )}
              {
                user?.id === props.userId && (
                  <span onClick={handleDeleteComment}>delete</span>
                )
              }
            </div>
            <Reply
              className={
                compare(replying, props.path) && !minimized ? "" : "hidden"
              }
              parentCommentId={props.id}
              userId={props.userId}
            />
            <div className={`comments ${minimized ? "hidden" : ""}`}>
              {gen_comments(props.comments, props.colorindex + 1, [
                ...props.path
              ])}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

Comment = styled(Comment)`
  display: flex;
  text-align: left;
  background: ${props => (props.colorindex % 2 === 0 ? "#161C21" : "#13181D")};
  padding: 16px 16px 16px 12px;
  border: 0.1px solid #3d4953;
  border-radius: 8px;

  #showMore {
    background: none;
    border: none;
    color: #53626f;
    cursor: pointer;
    font-size: 13px;
    text-align: left;

    &:hover {
      text-decoration: underline;
    }
  }

  .comments {
    > * {
      margin-bottom: 16px;

      &:last-child {
        margin-bottom: 0px;
      }
    }

    &.hidden {
      display: none;
    }
  }

  #left {
    text-align: center;
    &.hidden {
      visibility: hidden;
      height: 0;
    }
  }

  #right {
    flex-grow: 1;

    #top {
      .minimize {
        cursor: pointer;
        color: #53626f;

        -webkit-touch-callout: none; /* iOS Safari */
        -webkit-user-select: none; /* Safari */
        -khtml-user-select: none; /* Konqueror HTML */
        -moz-user-select: none; /* Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
        user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome and Opera */
      }

      #username {
        color: #4f9eed;
      }

      #date {
        display: inline-block;
        color: #53626f;
      }

      > * {
        margin-right: 8px;
      }
    }

    #content {
      color: #cccccc;

      &.hidden {
        display: none;
      }
    }

    #actions {
      color: #53626f;
      margin-bottom: 12px;

      -webkit-touch-callout: none; /* iOS Safari */
      -webkit-user-select: none; /* Safari */
      -khtml-user-select: none; /* Konqueror HTML */
      -moz-user-select: none; /* Firefox */
      -ms-user-select: none; /* Internet Explorer/Edge */
      user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome and Opera */

      &.hidden {
        display: none;
      }

      > .selected {
        font-weight: bold;
      }

      > * {
        cursor: pointer;
        margin-right: 8px;
      }
    }
  }

  ${Reply} {
    margin-bottom: 12px;
  }
`;

function Comments(props) {
  const { id } = useParams();
  const bookId = id;
  const { openSnackbar } = useSnackbar();
  var [replying, setReplying] = useState([]);
  var [comments, setComments] = useState([]);
  const count = comments?.map((comment) => comment.children.length).reduce((a, b) => a + b, 0) + comments.length;

  async function fetchComments() {
    try {
      const { data, status } = await commentApi.listCommentInBook(bookId);
      if (status === HTTP_STATUS.OK) {
        if(data?.statusCode === "00000") {
          setComments(data?.data?.reverse());
        }
      }
    } catch (error) {
    openSnackbar(SNACKBAR.ERROR, "Get list comments failed"); 
    setComments([]);
  }};

  window.fetchComments = fetchComments;

  useEffect(() => {
    if(bookId) {
      fetchComments();
    }
  }, [bookId]);

  return (
    <Card {...props}>
      <span id="comments">Comments</span>
      <span id="comments_count">{`(${count})`}</span>
      <Reply />
      <CommentContext.Provider value={[replying, setReplying]}>
        {gen_comments(comments, 0, [])}
      </CommentContext.Provider>
    </Card>
  );
}

export default styled(Comments)`
  max-width: 100%;
  width: 100%;
  min-width: min-content;
  margin-top: 24px;

  > * {
    margin-bottom: 16px;

    &:last-child {
      margin-bottom: 0px;
    }
  }

  #comments,
  #comments_count {
    font-weight: 900;
    font-size: 20px;
    display: inline-block;
    margin-right: 4px;
    margin-bottom: 8px;
  }

  #comments {
    color:  #53626f;
  }

  #comments_count {
    color: #53626f;
  }
`;
