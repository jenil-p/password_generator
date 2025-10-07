
const encoder = new TextEncoder();
const decoder = new TextDecoder();

export async function deriveKeyFromUserId(userId) {
    const baseKey = await crypto.subtle.importKey(
        "raw",
        encoder.encode(String(userId)),
        { name: "PBKDF2" },
        false,
        ["deriveKey"]
    );

    const salt = encoder.encode("password-vault-salt-v1");

    const key = await crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt,
            iterations: 150000,
            hash: "SHA-256",
        },
        baseKey,
        { name: "AES-GCM", length: 256 },
        false,
        ["encrypt", "decrypt"]
    );

    return key;
}

export async function encryptData(key, dataObj) {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const plaintext = encoder.encode(JSON.stringify(dataObj));
    const ct = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, plaintext);
    return {
        iv: btoa(String.fromCharCode(...iv)),
        ciphertext: btoa(String.fromCharCode(...new Uint8Array(ct))),
    };
}

export async function decryptData(key, ivBase64, ciphertextBase64) {
    const iv = Uint8Array.from(atob(ivBase64), c => c.charCodeAt(0));
    const ct = Uint8Array.from(atob(ciphertextBase64), c => c.charCodeAt(0));
    const plainBuf = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, ct);
    return JSON.parse(decoder.decode(plainBuf));
}
