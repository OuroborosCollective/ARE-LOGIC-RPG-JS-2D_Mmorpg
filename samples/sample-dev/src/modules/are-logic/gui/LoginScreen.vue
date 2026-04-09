<template>
  <div class="login-screen" v-if="!authenticated">
    <div class="login-card">
      <div class="login-header">
        <h1 class="login-title">CHRONICLES</h1>
        <p class="login-subtitle">of the Ancients</p>
      </div>

      <div class="login-form">
        <div class="login-tabs">
          <button
            class="tab-btn"
            :class="{ active: mode === 'login' }"
            @click="mode = 'login'; error = ''"
          >
            Login
          </button>
          <button
            class="tab-btn"
            :class="{ active: mode === 'register' }"
            @click="mode = 'register'; error = ''"
          >
            Register
          </button>
        </div>

        <form @submit.prevent="submit" class="form-fields">
          <div class="field">
            <input
              v-model="email"
              type="email"
              placeholder="Email"
              autocomplete="email"
              required
              class="login-input"
            />
          </div>
          <div class="field">
            <input
              v-model="password"
              type="password"
              :placeholder="mode === 'register' ? 'Password (min 4 chars)' : 'Password'"
              autocomplete="current-password"
              required
              class="login-input"
            />
          </div>
          <div v-if="error" class="error-msg">{{ error }}</div>
          <button type="submit" class="submit-btn" :disabled="loading">
            {{ loading ? 'Please wait...' : mode === 'login' ? 'Enter World' : 'Create Account' }}
          </button>
        </form>
      </div>

      <div class="login-version">v1.0.0</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "rpg-login-screen",
  inject: { rpgGui: { default: null } },
  data() {
    return {
      mode: "login",
      email: "",
      password: "",
      error: "",
      loading: false,
      authenticated: false,
    };
  },
  mounted() {
    const token = localStorage.getItem("rpg_auth_token");
    if (token) {
      this.validateExistingSession(token);
    }
  },
  methods: {
    hideLogin() {
      this.authenticated = true;
      if (this.rpgGui) {
        try { this.rpgGui.hide("rpg-login-screen"); } catch {}
      }
    },
    async validateExistingSession(token) {
      try {
        const res = await fetch("/api/auth/session", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.valid) {
          this.hideLogin();
        }
      } catch {}
    },
    async submit() {
      this.error = "";
      this.loading = true;
      try {
        const endpoint =
          this.mode === "register" ? "/api/auth/register" : "/api/auth/login";
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: this.email, password: this.password }),
        });
        const data = await res.json();
        if (data.token) {
          localStorage.setItem("rpg_auth_token", data.token);
          this.hideLogin();
        } else {
          this.error = data.error || "Something went wrong";
        }
      } catch (err) {
        this.error = "Network error. Please try again.";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.login-screen {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
  font-family: "Fredoka", sans-serif;
  z-index: 10000;
  padding: 16px;
  box-sizing: border-box;
}

.login-card {
  width: 100%;
  max-width: 380px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.login-header {
  text-align: center;
}

.login-title {
  font-size: clamp(28px, 7vw, 48px);
  color: #ffd700;
  margin: 0;
  text-shadow: 0 0 20px rgba(255, 215, 0, 0.4);
  letter-spacing: 4px;
}

.login-subtitle {
  font-size: clamp(14px, 3.5vw, 18px);
  color: rgba(255, 255, 255, 0.6);
  margin: 4px 0 0;
  letter-spacing: 2px;
}

.login-form {
  width: 100%;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 24px;
  backdrop-filter: blur(10px);
}

.login-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}

.tab-btn {
  flex: 1;
  padding: 10px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  background: transparent;
  color: rgba(255, 255, 255, 0.5);
  font-family: inherit;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.2s;
}

.tab-btn.active {
  background: rgba(255, 215, 0, 0.15);
  border-color: #ffd700;
  color: #ffd700;
}

.form-fields {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.login-input {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.3);
  color: #fff;
  font-family: inherit;
  font-size: 15px;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.2s;
}

.login-input:focus {
  border-color: #ffd700;
}

.login-input::placeholder {
  color: rgba(255, 255, 255, 0.35);
}

.error-msg {
  color: #ff6b6b;
  font-size: 13px;
  text-align: center;
  padding: 4px 0;
}

.submit-btn {
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 8px;
  background: linear-gradient(135deg, #ffd700, #f0a500);
  color: #1a1a2e;
  font-family: inherit;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.15s, opacity 0.2s;
  margin-top: 4px;
}

.submit-btn:active {
  transform: scale(0.97);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.login-version {
  color: rgba(255, 255, 255, 0.25);
  font-size: 12px;
}

@media (max-height: 500px) {
  .login-card {
    gap: 12px;
  }
  .login-form {
    padding: 16px;
  }
  .login-title {
    font-size: 24px;
  }
}
</style>
