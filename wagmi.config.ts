
import { defineConfig } from "@wagmi/cli";
import { hardhat } from "@wagmi/cli/plugins";

export default defineConfig({
  out: "src/generated.ts",
  contracts: [],
  plugins: [
    hardhat({
      commands: {
        clean: "pnpm hardhat clean",
        build: "pnpm hardhat compile",
        rebuild: "pnpm hardhat compile",
      },
      project: "./blockchain",
    }),
  ],
});
