const fs = require('fs');
const path = require('path');

async function loadProxyConfig(fileName) {
  const filePath = path.join(__dirname, '..', 'proxy', fileName);

  try {
    const content = fs.readFileSync(filePath, 'utf8').trim();
    if (!content) return null;

    const parts = content.split(':');
    if (parts.length !== 4) {
      console.error("❌ Định dạng proxy không hợp lệ. Dạng đúng: IP:PORT:USERNAME:PASSWORD");
      return null;
    }

    const [host, portStr, username, password] = parts;
    const port = parseInt(portStr);

    return { host, port, username, password };
  } catch (err) {
    console.error(`❌ Không đọc được proxy từ file ${fileName}:`, err.message);
    return null;
  }
}

module.exports = { loadProxyConfig };
