import React from '@vitejs/plugin-react';
import Inspect from 'vite-plugin-inspect';

export default {
    plugins: [
        Inspect(),
        React()
    ]
};
