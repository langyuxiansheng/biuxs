<template>
    <div class="dg-view-wrapper">
        <div :class="['dg-content-body', {'dg-content-body--has-title': messageHasTitle}]">
            <template v-if="messageHasTitle">
                <h6 v-if="options.html" class="dg-title" v-html="messageTitle" />
                <h6 v-else="" class="dg-title">
                    {{ messageTitle }}
                </h6>
            </template>

            <div v-if="options.html" class="dg-content" v-html="messageBody" />
            <div v-else="" class="dg-content">
                {{ messageBody }}
            </div>

            <form v-if="isHardConfirm || isPrompt"
                  class="dg-form"
                  autocomplete="off"
                  @submit.prevent="submitDialogForm"
            >
                <!-- <label for="dg-input-elem" style="font-size: 13px">{{ isPrompt ? promptHelpText : hardConfirmHelpText }}</label> -->
                <!-- :placeholder="isPrompt ? '' : options.verification" -->
                <input id="dg-input-elem"
                       ref="inputElem"
                       v-model="input"
                       type="text"
                       :placeholder="options.placeholder"
                       autocomplete="off"
                >
            </form>
        </div>

        <div class="dg-content-footer">
            <button :is="leftBtnComponent" :loading="loading" :enabled="leftBtnEnabled"
                    :options="options" :focus="leftBtnFocus" @click="clickLeftBtn()"
            >
                <span v-if="options.html" v-html="leftBtnText" />
                <span v-else="">{{ leftBtnText }}</span>
            </button>

            <button :is="rightBtnComponent" :loading="loading" :enabled="rightBtnEnabled"
                    :options="options" :focus="rightBtnFocus" @click="clickRightBtn()"
            >
                <span v-if="options.html" v-html="rightBtnText" />
                <span v-else="">{{ rightBtnText }}</span>
            </button>

            <div class="dg-clear" />
        </div>
    </div>
</template>
<script>
import DialogMixin from '../../js/mixins/dialog-mixin';
import OkBtn from '../../components/ok-btn.vue';
import CancelBtn from '../../components/cancel-btn.vue';
export default {
    components: { CancelBtn, OkBtn },
    mixins: [DialogMixin],
    data: function() {
        return {};
    },
    mounted() {
        this.isHardConfirm && this.$refs.inputElem && this.$refs.inputElem.focus();
    }
};
</script>
