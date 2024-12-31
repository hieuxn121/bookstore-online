import * as rest from "./base";

const listCommentInBook = (bookId) =>
  rest.get(
    `/comments?bookId=${bookId}`
  );

const postComment = (data) => rest.post(`/comments`, data);
const deleteComment = (id) => rest.del(`/comments/${id}`);

export default {
    listCommentInBook,
    postComment,
    deleteComment
};
