// modules/reconnectHandler.js
module.exports = function setupReconnect(bot, createBotFn, options = {}) {
  const MAX_RECONNECT_ATTEMPTS = options.maxAttempts || 5;
  let reconnectAttempts = 0;
  let checkClockInterval;

  function clearIntervals() {
    if (checkClockInterval) clearInterval(checkClockInterval);
  }

  // Thiết lập lại khi bot spawn
  bot.once('spawn', () => {
    reconnectAttempts = 0;

    // Kiểm tra Clock slot 4 mỗi 10s
    checkClockInterval = setInterval(() => {
      if (bot.loggedIn && !bot.menuOpened) {
        const slot4 = bot.inventory.slots[36 + 4];
        if (slot4?.name === 'minecraft:clock') {
          bot.setQuickBarSlot(4);
          bot.activateItem();
        }
      }
    }, 10000);
  });

  bot.on('end', () => {
    clearIntervals();
    console.log(`❌ Mất kết nối (lần thử ${reconnectAttempts + 1}/${MAX_RECONNECT_ATTEMPTS})`);

    if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
      console.log("🛑 Đã thử lại quá số lần quy định, thoát process.");
      return process.exit(1);
    }

    const delays = [5000, 10000, 15000, 20000, 25000];
    const delay = delays[Math.min(reconnectAttempts, delays.length - 1)];

    console.log(`⌛ Thử kết nối lại sau ${delay/1000}s...`);
    setTimeout(() => {
      reconnectAttempts++;
      createBotFn();
    }, delay);
  });

  bot.on('kicked', (reason) => {
    clearIntervals();
    console.log("❌ Bị kick:", reason);

    if (reason.includes("Tài khoản này hiện đang kết nối đến máy chủ rồi!") || reason.includes("already connected")) {
      console.log("⚠️ Phát hiện lỗi session, đợi 20s rồi reconnect");
      setTimeout(() => {
        reconnectAttempts = 0;
        createBotFn();
      }, 20000);
    } else {
      // Thường kick khác thì reconnect ngay
      reconnectAttempts = 0;
      createBotFn();
    }
  });
};
