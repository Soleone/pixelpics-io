<template>
  <b-input-group size="lg" :prepend="title" id="options-input-group">
    <b-form-input :value="value" class="code-text" id="input-to-copy"></b-form-input>

    <b-input-group-append>
      <b-btn id="copy-button" variant="primary" @click="copyToClipboard">
        <icon name="copy"></icon>
      </b-btn>
      <b-tooltip target="copy-button" placement="top">
        Copy to clipboard
      </b-tooltip>
      <b-tooltip triggers="" ref="copiedFeedbackTooltip" target="options-input-group" placement="top">
        Copied to clipboard!
      </b-tooltip>
    </b-input-group-append>
  </b-input-group>
</template>


<script>

export default {
  name: 'CopyButton',
  props: [
    'value',
    'title'
  ],
  methods: {
    copyToClipboard() {
      let input = document.getElementById('input-to-copy');
      input.select();
      document.execCommand('copy');
      input.blur();
      this.$root.$emit('bv::hide::tooltip');
      this.$refs.copiedFeedbackTooltip.$emit('open');
      setTimeout( () => {
        this.$root.$emit('bv::hide::tooltip');
      }, 1000);
    }
  },
}
</script>


<style scoped>
  .code-text {
    font-family: monospace;
  }
</style>
