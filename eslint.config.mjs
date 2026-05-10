import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  { 
    languageOptions: { 
      globals: {
        ...globals.node,
        ...globals.jest // Додаємо підтримку Jest (describe, it, expect)
      } 
    } 
  },
  pluginJs.configs.recommended,
  {
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "error"
    }
  }
];