<template>
  <section class="landing-page">
    <div class="landing-overlay"></div>

    <div class="container position-relative landing-shell">
      <div class="row align-items-center justify-content-center">
        <div class="col-12 col-lg-7">
          <div class="hero-copy">
            <span class="hero-eyebrow">WSA PAY</span>
            <h1 class="hero-title">The Smart Way to Handle Global Partner Payments</h1>
            <p class="hero-description">
              WSA PAY is a fee-free global B2B payment system built to help partners move
              money faster, manage cross-border payouts clearly, and operate with confidence.
            </p>

            <div class="hero-actions">
              <NuxtLink to="/member/login" class="btn btn-primary hero-button">
                Login
              </NuxtLink>
              <NuxtLink to="/member/register" class="btn btn-outline-light hero-button hero-button-secondary">
                Open Account / Register
              </NuxtLink>
            </div>

            <div class="hero-trust">
              <div class="trust-item">
                <strong>Fee-free</strong>
                <span>Built for global B2B partner transfers</span>
              </div>
              <div class="trust-item">
                <strong>Transparent</strong>
                <span>Clear status updates from application to approval</span>
              </div>
              <div class="trust-item">
                <strong>Trusted</strong>
                <span>Designed for controlled access and secure operations</span>
              </div>
            </div>
          </div>
        </div>

        <div class="col-12 col-lg-5">
          <div class="hero-panel">
            <div class="panel-card">
              <div class="panel-pill">Global Partner Accounts</div>
              <h2>Apply once. Go live after approval.</h2>
              <p>
                Create your member profile, submit your business details, and access the
                platform as soon as your account is approved by the admin team.
              </p>

              <div class="panel-metrics">
                <div class="metric-card">
                  <span class="metric-label">Registration</span>
                  <strong>Fast</strong>
                </div>
                <div class="metric-card">
                  <span class="metric-label">Status</span>
                  <strong>Pending Review</strong>
                </div>
                <div class="metric-card">
                  <span class="metric-label">Access</span>
                  <strong>After Approval</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "auth",
  middleware: "guest",
  title: "Welcome",
});
</script>

<style scoped>
.landing-page {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  background:
    linear-gradient(135deg, rgba(14, 32, 64, 0.92), rgba(24, 82, 149, 0.84)),
    url('/app-assets/images/pages/vuexy-login-bg.jpg') center center / cover no-repeat;
}

.landing-overlay {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at top left, rgba(255, 255, 255, 0.14), transparent 34%),
    radial-gradient(circle at bottom right, rgba(180, 217, 255, 0.14), transparent 30%);
}

.landing-shell {
  z-index: 1;
  padding-top: 64px;
  padding-bottom: 64px;
}

.hero-copy {
  color: #ffffff;
  padding: 16px 0;
}

.hero-eyebrow {
  display: inline-flex;
  align-items: center;
  margin-bottom: 22px;
  padding: 8px 14px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.16);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.hero-title {
  max-width: 680px;
  margin-bottom: 18px;
  font-size: clamp(2.5rem, 5vw, 4.5rem);
  line-height: 1.08;
  font-weight: 700;
  color: #ffffff;
}

.hero-description {
  max-width: 620px;
  margin-bottom: 30px;
  color: rgba(255, 255, 255, 0.82);
  font-size: 1.08rem;
  line-height: 1.8;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-bottom: 34px;
}

.hero-button {
  min-width: 190px;
  padding: 14px 22px;
  border-radius: 999px;
  font-weight: 600;
}

.hero-button-secondary {
  border-width: 1px;
  background: rgba(255, 255, 255, 0.06);
}

.hero-button-secondary:hover {
  background: rgba(255, 255, 255, 0.14);
}

.hero-trust {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.trust-item {
  padding: 18px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(8px);
}

.trust-item strong {
  display: block;
  margin-bottom: 8px;
  font-size: 1rem;
  color: #ffffff;
}

.trust-item span {
  display: block;
  color: rgba(255, 255, 255, 0.72);
  font-size: 0.92rem;
  line-height: 1.6;
}

.hero-panel {
  padding-top: 16px;
}

.panel-card {
  padding: 32px;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.94);
  box-shadow: 0 24px 70px rgba(8, 24, 48, 0.24);
}

.panel-pill {
  display: inline-flex;
  align-items: center;
  margin-bottom: 18px;
  padding: 8px 14px;
  border-radius: 999px;
  background: #eaf2ff;
  color: #185295;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.panel-card h2 {
  margin-bottom: 14px;
  color: #10233f;
  font-size: 1.9rem;
  line-height: 1.25;
  font-weight: 700;
}

.panel-card p {
  margin-bottom: 24px;
  color: #5c6b80;
  line-height: 1.75;
}

.panel-metrics {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.metric-card {
  padding: 18px 16px;
  border-radius: 20px;
  background: #f5f8fd;
}

.metric-label {
  display: block;
  margin-bottom: 8px;
  color: #6d7a8f;
  font-size: 0.82rem;
}

.metric-card strong {
  color: #10233f;
  font-size: 1rem;
}

@media (max-width: 991.98px) {
  .landing-shell {
    padding-top: 48px;
    padding-bottom: 48px;
  }

  .hero-copy {
    text-align: center;
  }

  .hero-description {
    margin-left: auto;
    margin-right: auto;
  }

  .hero-actions {
    justify-content: center;
  }

  .hero-trust {
    grid-template-columns: 1fr;
  }

  .hero-panel {
    padding-top: 28px;
  }
}

@media (max-width: 575.98px) {
  .landing-shell {
    padding-top: 28px;
    padding-bottom: 28px;
  }

  .hero-title {
    font-size: 2.2rem;
  }

  .hero-description {
    font-size: 1rem;
  }

  .hero-button {
    width: 100%;
  }

  .panel-card {
    padding: 24px 20px;
    border-radius: 22px;
  }

  .panel-card h2 {
    font-size: 1.55rem;
  }

  .panel-metrics {
    grid-template-columns: 1fr;
  }
}
</style>
