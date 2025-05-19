function lookHandler(bot) {
  process.stdin.on('data', data => {
    const input = data.toString().trim();

    if (input.startsWith('#look')) {
      const args = input.split(' ').slice(1);
      if (args.length !== 2) {
        console.log("⚠️ Cú pháp đúng: #look <yaw> <pitch>");
        return;
      }
      const yaw = parseFloat(args[0]);
      const pitch = parseFloat(args[1]);
      if (isNaN(yaw) || isNaN(pitch)) {
        console.log("⚠️ Giá trị yaw hoặc pitch không hợp lệ!");
        return;
      }
      try {
        bot.look(yaw, pitch, true);
        console.log(`👁 Bot đã nhìn hướng yaw=${yaw}, pitch=${pitch}`);
      } catch (err) {
        console.log("⚠️ Lỗi khi thực hiện look:", err.message);
      }
    }
  });
}

module.exports = lookHandler;
