import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

    server: {
        allowedHosts: [
            'ai-hkt.millons-io.store'
        ]
    },
    // 빌드 후 미리보기(preview) 설정
    preview: {
        allowedHosts: [
            'ai-hkt.millons-io.store'
        ]
    }
});
