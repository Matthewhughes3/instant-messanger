<template>
  <div>
    <v-toolbar dense>
      <v-toolbar-title v-if="user"
        >{{ user.username }}
        <span v-if="user && user.isAdmin">ADMIN</span></v-toolbar-title
      >
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn @click="logoutService">Logout</v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <center class="mt-5">
      <v-btn v-if="user && user.isAdmin" @click="openNewChatroom"
        >Create New Chatroom</v-btn
      >
      <div class="mt-5">
        <chatroomCard
          v-for="chatroom in chatrooms"
          :key="chatroom.id"
          :chatroom="chatroom"
					@delete="deleteChatroom"
        />
      </div>
    </center>
    <popup
      v-model="chatroomDialog"
      title="Create New Chatroom"
      @action="createNewChatroom"
    >
      <div class="red--text">{{ errorMessage }}</div>
      <v-text-field v-model="chatroomName" label="Chatroom Name" />
    </popup>
  </div>
</template>

<script>
import Popup from "../components/shared/popup";
import ChatroomCard from "../components/chatroom/chatroomCard";
import { mapActions, mapState } from "vuex";

export default {
  data() {
    return {
      errorMessage: null,
      chatroomDialog: false,
      chatroomName: null,
      chatrooms: []
    };
  },
  computed: {
    ...mapState("user", ["user"])
  },
  components: {
    popup: Popup,
    chatroomCard: ChatroomCard
  },
  methods: {
    ...mapActions("user", ["logoutService"]),
    ...mapActions("chatroom", ["newChatroomService", "getAllChatroomsService"]),
    openNewChatroom() {
      const vm = this;

      vm.chatroomDialog = true;
    },
    closeNewChatroom() {
      const vm = this;

      vm.chatroomDialog = false;
    },
    async createNewChatroom() {
      const vm = this;

      const response = await vm.newChatroomService({
        userId: vm.user.id,
        chatroomName: vm.chatroomName
      });

      if (response.data.error) {
        vm.errorMessage = response.data.error;
      } else {
        vm.chatrooms.push(response.data.chatroom);

        vm.closeNewChatroom();
      }
    },
		deleteChatroom(chatroomId) {
			const vm = this

			const index = vm.chatrooms.findIndex(chatroom => chatroom.id === chatroomId)
			vm.chatrooms.splice(index, 1)
		}
  },
  async mounted() {
    const vm = this;

    const response = await vm.getAllChatroomsService();
    vm.chatrooms = response.data.chatrooms;
  }
};
</script>

<style></style>
