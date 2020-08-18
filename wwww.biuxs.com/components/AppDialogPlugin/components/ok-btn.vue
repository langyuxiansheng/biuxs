<template>
    <button v-if="enabled" ref="btn"
            :class="['dg-btn', 'dg-btn--ok', {'dg-btn--loading': loading}, {'dg-pull-right': !options.reverse}]" :disabled="is_disabled" @click.prevent="proceed()"
    >
        <span class="dg-btn-content">
            <slot />
            <span v-if="soft_confirm">({{ clicks_remaining }})</span>
        </span>
        <span is="btn-loader" v-if="loading" />
    </button>
</template>
<script>
import BtnLoader from './btn-loader.vue';
import { CONFIRM_TYPES } from '../js/constants';
export default {
    components: { BtnLoader },
    props: {
        enabled: {
            required: false,
            type: Boolean,
            'default': true
        },
        options: {
            required: true,
            type: Object
        },
        focus: {
            required: false,
            type: Boolean,
            'default': false
        },
        loading: {
            required: false,
            type: Boolean,
            'default': false
        }
    },
    data() {
        return {
            clicks_count: 0
        };
    },
    computed: {
        soft_confirm() {
            return (this.options.type === CONFIRM_TYPES.SOFT);
        },
        hard_confirm() {
            return (this.options.type === CONFIRM_TYPES.HARD);
        },
        is_disabled() {
            return (this.$parent.okBtnDisabled);
        },
        clicks_remaining() {
            return Math.max((this.options.clicksCount - this.clicks_count), 0);
        }
    },
    mounted() {
        this.focus && this.$refs.btn.focus();
    },
    methods: {
        proceed() {
            if (!this.is_disabled && this.validateProceed()) {
                this.$emit('click');
            }
        },
        validateProceed() {
            switch (this.options.type) {
            case CONFIRM_TYPES.SOFT:
                this.clicks_count++;
                return (this.clicks_count >= this.options.clicksCount);
            case CONFIRM_TYPES.BASIC:
            default:
                return true;
            }
        }
    }
};
</script>
