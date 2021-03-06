import { CONTEXT } from "./workouts_context.js";
import { JARVIS_WASM_64 } from "./jarvis_wasm_64.js";

const picovoiceWorkerUrl = `${process.env.PUBLIC_URL}/scripts/picovoice_worker.js`;
const downsamplingWorkerUrl = `${process.env.PUBLIC_URL}/scripts/downsampling_worker.js`;

class NSunsManager {
    constructor() {
        this.picovoiceMgr = window.PicovoiceManager;
        this.keywordIDs = {
            picovoice: Buffer.from(JARVIS_WASM_64, "base64"),
        }
        this.sensitivities = new Float32Array([1.0]);
        this.context = Buffer.from(CONTEXT, "base64");
    }

    errorCallback = function (ex) {
        alert(ex.toString());
    };

    start = (initCallback, ppnCallback, rhnCallback) => {
        this.picovoiceMgr.start(
            this.keywordIDs,
            this.sensitivities,
            ppnCallback,
            this.context,
            rhnCallback,
            this.errorCallback,
            initCallback,
            picovoiceWorkerUrl,
            downsamplingWorkerUrl
        );
    };

    refresh = (initCallback, ppnCallback, rhnCallback) => {
        if (this.picovoiceMgr !== null) {
            this.picovoiceMgr.refresh(initCallback, ppnCallback, rhnCallback);
        }
    };

    stop = () => {
        if (this.picovoiceMgr !== null) {
            this.picovoiceMgr.stop();
        }
    };
}

export default NSunsManager;