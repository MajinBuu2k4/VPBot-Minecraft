const { GoalBlock } = require('mineflayer-pathfinder').goals;

function movementHandler(bot) {
  process.stdin.on('data', async data => {
    const input = data.toString().trim();

    if (input.startsWith('#goto')) {
      const args = input.split(' ').slice(1);

      // #goto z (chỉ nhập 1 tham số thì dùng x=23 y=55 mặc định)
      if (args.length === 1) {
        const z = parseInt(args[0]);
        if (isNaN(z)) {
          console.log("⚠️ Tọa độ z không hợp lệ!");
          return;
        }
        const x = 23;
        const y = 55;
        try {
          console.log(`🧭 Bot đang đi đến chính xác: ${x} ${y} ${z}`);
          await bot.pathfinder.goto(new GoalBlock(x, y, z));
          console.log("✅ Bot đã đến đúng tọa độ.");
        } catch (err) {
          console.log("⚠️ Lỗi khi di chuyển:", err.message);
        }
        return;
      }

      // #goto x y z
      if (args.length === 3) {
        const x = parseInt(args[0]);
        const y = parseInt(args[1]);
        const z = parseInt(args[2]);
        if ([x, y, z].some(n => isNaN(n))) {
          console.log("⚠️ Tọa độ không hợp lệ!");
          return;
        }
        try {
          console.log(`🧭 Bot đang đi đến chính xác: ${x} ${y} ${z}`);
          await bot.pathfinder.goto(new GoalBlock(x, y, z));
          console.log("✅ Bot đã đến đúng tọa độ.");
        } catch (err) {
          console.log("⚠️ Lỗi khi di chuyển:", err.message);
        }
        return;
      }

      console.log("⚠️ Cú pháp đúng: #goto z (mặc định x=23 y=55) hoặc #goto x y z");
    }
  });
}

module.exports = movementHandler;
