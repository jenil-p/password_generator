
## Getting Started


First install all dependencies :
```bash
npm i
```
run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Live Demo hosted in vercel: [passOP](https://password-generator-eight-indol-12.vercel.app/) Please check it out

We have used Next.js for both frontend ans backend as well in this project.

In this project, I used **Web Crypto API** (via `SubtleCrypto`) to securely **encrypt and decrypt vault entries**. It provides **strong, browser-native cryptography**, supports AES-GCM for authenticated encryption, and avoids exposing raw keys, ensuring user data remains safe even if the server is compromised.
