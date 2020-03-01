<template>
  <div>
    <v-container style="height: 300px; overflow: auto" ref="messageContainer">
      <v-row v-for="message in messages" :key="message.id">
        <v-col :align="message.user.id === user.id ? 'right' : 'left'">
          <v-card width="50%" class="my-3" style="text-align: left">
            <v-row>
              <v-col class="ml-5 overline">
								<span v-if="message.user.username === user.username">Me</span>
								<span v-else>{{ message.user.username }}</span>
								<span v-if="message.user.username === chatroom.user.username"> - Channel Owner</span>
								<span> - {{ $moment.utc(message.createdAt).local().format("M/DD/YYYY h:mm a") }}</span>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="ml-5">
                {{ message.content }}
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-container>
      <v-row>
        <v-col>
          <v-form v-model="valid" class="mb-3" ref="messageForm" @submit.prevent="">
            <v-text-field
              :rules="messageRules"
              label="Message"
              v-model="message"
							@keyup.enter="onEnter"
            />
          </v-form>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-btn color="primary" :disabled="!valid" @click="sendMessage"
            >Send</v-btn
          >
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { required } from "../../shared/validation";
import { mapActions, mapState } from "vuex";

export default {
  data() {
    return {
      valid: false,
      message: null,
      messages: [],
      messageRules: [required],
			ws: null
    };
  },
  props: {
    chatroom: Object
  },
  computed: {
    ...mapState("user", ["user"])
  },
  methods: {
    ...mapActions("chatroom", ["getMessagesService", "sendMessageService"]),
		sleep(ms) {
			return new Promise(resolve => {
				setTimeout(resolve, ms)
			})
		},
    async sendMessage() {
      const vm = this;

			//UGLY
			vm.ws.onmessage = message => {}

      const response = await vm.sendMessageService({
        userId: vm.user.id,
        chatroomId: vm.chatroom.id,
        message: vm.message
      });

      vm.messages.push(response.data.message);

			vm.message = null

			vm.$refs.messageForm.resetValidation()

			//UGLY UGLY UGLY
			//YOU SHOULD BE ASHAMED
			vm.ws.onmessage = message => {
				vm.messages.push(JSON.parse(message.data))
			}
    },
		onEnter() {
			const vm = this;

			if(vm.$refs.messageForm.validate()) {
				vm.sendMessage()
			}
		},
		scrollToBottom() {
			const vm = this

			vm.$refs.messageContainer.scrollTop = vm.$refs.messageContainer.scrollHeight
		}
  },
	watch: {
		async messages() {
			const vm = this;

			await vm.sleep(200)

			vm.scrollToBottom()
		}
	},
  async mounted() {
    const vm = this;

    const response = await vm.getMessagesService(vm.chatroom.id);

		vm.ws = new WebSocket("ws://localhost:40510")

		vm.ws.onmessage = message => {
			vm.messages.push(JSON.parse(message.data))
		}

    vm.messages = response.data.messages;
  }
};
</script>

<style></style>
