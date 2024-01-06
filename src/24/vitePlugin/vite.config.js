import Inspect from 'vite-plugin-inspect';
import Csv from './vite-plugin-csv.js';

export default {
    plugins: [
        Inspect(),
        Csv()
    ]
}
