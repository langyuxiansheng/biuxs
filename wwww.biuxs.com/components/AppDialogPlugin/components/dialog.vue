<template>
    <div>
        <dialog-window
            v-for="dialog in dialogsARR"
            :key="dialog.id"
            :options="dialog"
            :escape-key-close="dialog.escapeKeyClose"
            :registered-views="registeredViews"
            @close="destroyDialog"
        />
    </div>
</template>
<script>
import DialogWindow from './dialog-window.vue';
import { firstIndex } from '../js/utilities';
export default {
    components: { DialogWindow },
    data: function () {
        return {
            dialogsARR: [],
            registeredViews: {}
        };
    },
    watch: {
        'dialogsARR': {
            handler (dialogs) {
                let clsName = 'dg-open';
                const body = document.getElementsByTagName('body')[0];

                if (!body) {
                    return;
                }

                if (dialogs.length && !body.classList.contains(clsName)) {
                    body.classList.add(clsName);
                } else if (!dialogs.length && body && body.classList.contains(clsName)) {
                    body.classList.remove(clsName);
                }
            }
        }
    },
    created() {
        document.addEventListener('keydown', this.escapeKeyListener);
    },
    destroyed() {
        document.removeEventListener('keydown', this.escapeKeyListener);
    },
    methods: {
        commit(data) {
            data.escapeKeyClose = false;
            this.dialogsARR.push(data);
        },
        forceCloseAll() {
            this.dialogsARR.forEach((d, idx) => this.$delete(this.dialogsARR, idx));
        },
        destroyDialog(dialogId) {
            let dialogIndex = firstIndex(this.dialogsARR, dialogId, 'id');

            if (dialogIndex !== -1) {
                this.$delete(this.dialogsARR, dialogIndex);
            }
        },
        escapeKeyListener(e) {
            if (e.keyCode !== 27) return;

            let dialogIndex = (-1 + this.dialogsARR.length);

            if (dialogIndex > -1) {
                this.$set(this.dialogsARR[dialogIndex], 'escapeKeyClose', true);
            }
        }
    }
};
</script>

<style lang="less">
    @import '../styles/main';
</style>
