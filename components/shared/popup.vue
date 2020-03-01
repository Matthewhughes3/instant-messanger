<template>
  <v-dialog v-model="value" persistent>
    <v-toolbar dark>
      <v-toolbar-title>{{ title }}</v-toolbar-title>
      <v-spacer> </v-spacer>
      <v-toolbar-items>
        <v-btn text @click="emitClose" v-if="headerCancel"
          ><v-icon>mdi-close</v-icon></v-btn
        >
      </v-toolbar-items>
    </v-toolbar>
    <v-card flat class="pa-2" style="border-radius: 0">
      <slot></slot>
      <v-card-actions v-if="!hideFooter">
        <v-btn text @click="emitClose" v-if="!headerCancel || actionCancel">{{
          close
        }}</v-btn>
        <v-btn color="success" :loading="actionLoading" @click="emitAction">{{
          action
        }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    value: {
      required: true,
      type: Boolean
    },
    title: {
      default: "Default Popup",
      type: String
    },
    close: {
      default: "Cancel",
      type: String
    },
    action: {
      default: "Save",
      type: String
    },
    actionLoading: {
      default: false,
      type: Boolean
    },
    hideFooter: {
      default: false,
      type: Boolean
    },
    headerCancel: {
      default: false,
      type: Boolean
    },
    actionCancel: {
      default: false,
      type: Boolean
    }
  },
  methods: {
    emitAction() {
      const vm = this;

      vm.$emit("action");
    },
    emitClose() {
      const vm = this;

      vm.$emit("input", false);
    }
  }
};
</script>

<style></style>
