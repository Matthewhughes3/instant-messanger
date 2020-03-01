<template>
  <v-card width="50%" class="my-3 pa-3">
    <v-card-title>
      {{ chatroom.name }}
      <v-spacer> </v-spacer>
      <v-icon class="pointer" v-if="user.isAdmin" @click="deleteChatroom"
        >mdi-trash-can</v-icon
      >
    </v-card-title>
    Owned By: {{ chatroom.user.username }}
    <v-btn class="mx-3" @click="openChat">Open Chatroom</v-btn>
    <popup v-model="chatDialog" :title="chatroom.name" hideFooter headerCancel>
      <chat :chatroom="chatroom" />
    </popup>
  </v-card>
</template>

<script>
import Popup from "../shared/popup";
import Chat from "./chat";
import { mapState, mapActions } from "vuex";

export default {
  data() {
    return {
      chatDialog: false
    };
  },
  props: {
    chatroom: Object
  },
  components: {
    popup: Popup,
    chat: Chat
  },
  computed: {
    ...mapState("user", ["user"])
  },
  methods: {
    ...mapActions("chatroom", ["deleteChatroomService"]),
    openChat() {
      const vm = this;

      vm.chatDialog = true;
    },
    closeChat() {
      const vm = this;

      vm.chatDialog = false;
    },
    async deleteChatroom() {
      const vm = this;

      const response = await vm.deleteChatroomService(vm.chatroom.id);

      vm.$emit("delete", vm.chatroom.id);
    }
  }
};
</script>

<style></style>
