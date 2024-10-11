import initSqlJs from "sql.js";
import pako from 'pako';
import { DB_URL } from "./shared-const";
import { fetchGitHubRepoContents } from "./utils";

// https://stackoverflow.com/questions/9267899/how-can-i-convert-an-arraybuffer-to-a-base64-encoded-string
function _arrayBufferToBase64(buffer) {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

// https://gist.github.com/darmie/e39373ee0a0f62715f3d2381bc1f0974
function _base64ToArrayBuffer(base64) {
    var binary_string = window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes;
}

// Function to compress ArrayBuffer and store it in localStorage
function compressAndStoreInLocalStorage(data: ArrayBuffer) {
    const compressedData = pako.gzip(new Uint8Array(data));
    const base64Compressed = _arrayBufferToBase64(compressedData.buffer);
    localStorage.setItem('localDB', base64Compressed);
}

function decompressFromLocalStorage(): ArrayBuffer | null {
    const base64Compressed = localStorage.getItem('localDB');

    if (base64Compressed) {
        const compressedArrayBuffer = _base64ToArrayBuffer(base64Compressed);
        const decompressedData = pako.ungzip(new Uint8Array(compressedArrayBuffer));
        return decompressedData.buffer;
    }

    return null;
}

function loadLocalDatabase(SQL: any, localDB: string) {
    const data = decompressFromLocalStorage();
    if (data) {
        const db = new SQL.Database(new Uint8Array(data));
        return db;
    }

    return null;
}

async function loadDatabase() {
    const SQL = await initSqlJs();
    const localDb = localStorage.getItem('localDB');
    const localSha = localStorage.getItem('localSha');

    let isInternet = true;
    let json;
    try {
        json = await fetchGitHubRepoContents();
    } catch (error) {
        console.log('Failed to fetch data:', error);
        isInternet = false;
    }

    if (!isInternet || localSha === json.sha) {
        console.log('Loading local database');
        return loadLocalDatabase(SQL, localDb);
    }

    // download new db
    const response = await fetch(DB_URL);
    if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    const data = await response.arrayBuffer();
    const db = new SQL.Database(new Uint8Array(data));

    try {
        localStorage.clear();
        compressAndStoreInLocalStorage(data);
        localStorage.setItem('localSha', json.sha);
    } catch (error) {
        console.error('Error saving database to localStorage:', error);
    }

    return db;
}

export { loadDatabase };


