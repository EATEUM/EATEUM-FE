<script setup>
import { RouterLink, useRouter } from 'vue-router'
import { useAlert } from '@/composables/useAlert'

const { showLoginRequired } = useAlert()
const router = useRouter()

const goToFridge = () => {
  router.push('/fridge')
}
</script>

<template>
  <div class="intro-container">
    <header>
      <a href="#" class="logo">
        <img
          src="@/assets/logo/logo-eateum.png"
          alt="EATEUM"
          class="h-12 w-auto object-contain sm:h-16"
        />
      </a>
      <!-- Navigate to main app -->
      <RouterLink to="/home" class="btn-open-app">Start</RouterLink>
    </header>

    <main class="bento-container">
      <!-- 1. Hero Card: Left Big Box -->
      <div class="card card-hero">
        <video autoplay loop muted playsinline class="hero-video">
          <source src="@/assets/intro/recipe_icon.mp4" type="video/mp4" />
        </video>
        <div class="hero-content">
          <h1 class="hero-title">냉장고를<br />부탁해</h1>
          <p style="font-size: 1.2vw; opacity: 0.9">
            맛있는 요리가 시작되는 곳,<br />EAT:EUM과 함께하세요.
          </p>
        </div>
      </div>

      <!-- 2. Fridge Feature: Top Middle -->
      <div class="card card-fridge cursor-pointer" @click="goToFridge">
        <h2 class="card-title">Smart Fridge</h2>
        <p class="card-desc">냉장고 속 재료 관리</p>
        <div class="card-img-container">
          <img src="@/assets/intro/refrige_icon.png" alt="Fridge" />
        </div>
      </div>

      <!-- 3. Personalized Feature: Top Right -->
      <div class="card card-personalized cursor-pointer" @click="showLoginRequired">
        <h2 class="card-title">Just for You</h2>
        <p class="card-desc">취향 저격 레시피</p>
        <div class="card-img-container">
          <img src="@/assets/intro/recipebook_icon.png" alt="Recipe Book" />
        </div>
      </div>

      <!-- 4. Combined Chatbot Card: Bottom Middle & Right -->
      <RouterLink to="/home" class="card card-chatbot">
        <div class="chatbot-layout">
          <div class="chatbot-visual-side">
            <img src="@/assets/intro/eateumi.png" alt="Eateumi" class="eateumi-img" />
          </div>
          <div class="chatbot-text-side">
            <div class="chatbot-badge-small">AI 챗봇 이틈이</div>
            <h2 class="chatbot-main-text">무엇이든 물어보세요!</h2>
          </div>
        </div>
      </RouterLink>
    </main>
  </div>
</template>



<style scoped>
:root {
  --bg-color: #f2f0ea;
  --card-bg: #ffffff;
  --primary: #f5d77a;
  --text-main: #2f2f2f;
  --text-sub: #6b6b6b;
  --radius-main: 32px;
  --gap: 20px;
}

/* Container to scope body styles */
.intro-container {
  background-color: #f2f0ea; /* var(--bg-color) */
  color: #2f2f2f; /* var(--text-main) */
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: 0 20px 20px 20px;
}

/* --- Header --- */
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 10px;
  flex-shrink: 0;
}

.logo img {
  /* height: 32px; Removed to allow Tailwind classes (h-12, sm:h-16) to control size */
  display: block;
}

.btn-open-app {
  padding: 10px 24px;
  border-radius: 100px;
  background-color: #1a1a1a;
  color: white;
  font-weight: 600;
  text-decoration: none;
  transition: transform 0.2s;
}

.btn-open-app:hover {
  transform: scale(1.05);
}

/* --- Bento Grid Layout --- */
.bento-container {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  grid-template-rows: 1.4fr 1fr;
  gap: 20px; /* var(--gap) */
  width: 100%;
  flex: 1;
  min-height: 0;
}

/* --- Card Styles --- */
.card {
  background: #ffffff; /* var(--card-bg) */
  border-radius: 32px; /* var(--radius-main) */
  padding: 30px;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  border: 1px solid rgba(0, 0, 0, 0.02);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.02);
  cursor: default;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
  border-color: rgba(0, 0, 0, 0.05);
}

/* --- Grid Placements --- */

/* 1. Big Hero Box Left */
.card-hero {
  grid-column: 1 / 2;
  grid-row: 1 / 3;
  background: #1a1a1a;
  color: white;
  padding: 0;
  border: none;
}

/* 2. Top Middle */
.card-fridge {
  grid-column: 2 / 3;
  grid-row: 1 / 2;
  background: #fffcf0;
}

/* 3. Top Right */
.card-personalized {
  grid-column: 3 / 4;
  grid-row: 1 / 2;
  background: #fff5f8;
}

/* 4. Combined Chatbot Card */
.card-chatbot {
  grid-column: 2 / 4;
  grid-row: 2 / 3;
  background: #fff3c7; /* Solid color (darkest part of previous gradient) */
  padding: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-decoration: none;
  border: none;
}

.chatbot-layout {
  display: flex;
  flex: 1;
  padding: 30px;
  align-items: center;
  gap: 0px; /* Reduced to 0 to move text further left */
}

.chatbot-visual-side {
  flex: 1; /* Exactly matches the 1fr column width of the Fridge card above */
  display: flex;
  justify-content: center;
}

.chatbot-text-side {
  flex: 1; /* Pushes text into the second half of the card's spanned width */
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-start;
  text-align: left;
  margin-left: -10px; /* Moved slightly more to the left as requested */
}

.chatbot-badge-small {
  font-size: 13px;
  font-weight: 700;
  color: #8d6e63;
  background: rgba(255, 255, 255, 0.8);
  padding: 4px 12px;
  border-radius: 20px;
}

.chatbot-main-text {
  font-size: 30px; /* Slightly larger text to match larger character */
  font-weight: 800;
  line-height: 1.2;
  color: #3e2723;
}

.chatbot-visual-side {
  display: flex;
  justify-content: center;
  align-items: center;
}

.eateumi-img {
  width: 200px; /* Increased size as requested */
  height: auto;
  margin-left: -20px; /* Shifted slightly to the left as requested */
  filter: drop-shadow(0 10px 15px rgba(0, 0, 0, 0.15));
  transition: transform 0.4s ease;
}

.card-chatbot:hover .eateumi-img {
  transform: translateY(-10px) scale(1.1);
}

/* --- Content Styles --- */

/* Hero */
.hero-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.6;
}

.hero-content {
  position: relative;
  z-index: 10;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 50px;
}

.hero-title {
  font-size: 4vw;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 20px;
}

/* Feature Cards */
.card-title {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 8px;
  color: #1a1a1a;
}

.card-desc {
  font-size: 14px;
  color: #6b6b6b; /* var(--text-sub) */
  line-height: 1.4;
  margin-bottom: 16px;
}

.card-img-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-img-container img {
  max-height: 80%;
  max-width: 80%;
  width: auto;
  height: auto;
  object-fit: contain;
  filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.1));
  transition: transform 0.4s ease;
}

.card:hover .card-img-container img {
  transform: scale(1.05) rotate(5deg);
}

/* CTA */
.cta-text {
  font-size: 22px;
  font-weight: 800;
  color: #3e2723;
}

.arrow-icon {
  font-size: 32px;
  margin-top: 5px;
  display: block;
  color: #3e2723;
}

/* Stats */
.stat-number {
  font-size: 42px;
  font-weight: 800;
  color: #1a1a1a;
}

.stat-label {
  font-size: 14px;
  color: #999;
  margin-top: 5px;
}

/* Responsive specific tweaks */
@media (max-width: 1024px) {
  .intro-container {
    overflow-y: auto;
    height: auto;
  }
  
  .bento-container {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto;
  }

  .card-hero {
    grid-column: 1 / 3;
    height: 400px;
  }

  .card-fridge {
    grid-column: 1 / 2;
    grid-row: 2;
    height: 300px;
  }

  .card-personalized {
    grid-column: 2 / 3;
    grid-row: 2;
    height: 300px;
  }

  .card-stat, .card-cta {
    display: none; /* Old classes if they somehow stay */
  }

  .card-chatbot {
    grid-column: 1 / 3;
    grid-row: 3;
    height: auto;
    min-height: 250px;
  }
}
</style>
