export const actions = {
  newChatroomService(store, { chatroomName, userId }) {
    const vm = this;

    return vm
      .$axios({
        method: "POST",
        url: "/api/chatroom",
        data: { name: chatroomName, id: userId }
      })
      .catch(err => {
        alert("ERROR");
        console.log(err);
      });
  },
  getAllChatroomsService(store) {
    const vm = this;

    return vm
      .$axios({
        method: "GET",
        url: "/api/chatroom"
      })
      .catch(err => {
        alert("ERROR");
        console.log(err);
      });
  },
  deleteChatroomService(store, chatroomId) {
    const vm = this;

    return vm
      .$axios({
        method: "DELETE",
        url: `/api/chatroom/${chatroomId}`
      })
      .catch(err => {
        alert("ERROR");
        console.log(err);
      });
  },
  getMessagesService(store, chatroomId) {
    const vm = this;

    return vm
      .$axios({
        method: "GET",
        url: `/api/chatroom/${chatroomId}/messages`
      })
      .catch(err => {
        alert("ERROR");
        console.log(err);
      });
  },
  sendMessageService(store, { chatroomId, userId, message }) {
    const vm = this;

    return vm
      .$axios({
        method: "POST",
        url: `/api/chatroom/${chatroomId}`,
        data: { id: userId, message }
      })
      .catch(err => {
        alert("ERROR");
        console.log(err);
      });
  }
};
