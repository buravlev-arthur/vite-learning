import Inspect from 'vite-plugin-inspect';
import Vue from '@vitejs/plugin-vue';

export default {
    plugins: [
        Inspect(),
        Vue()
    ]
};
