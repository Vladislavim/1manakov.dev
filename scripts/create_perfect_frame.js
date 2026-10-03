const sharp = require('sharp');

async function createPerfectFrame() {
  const { data, info } = await sharp('public/images/devices/allnrg-current.webp')
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  // Precise MacBook screen bounds
  const macL = 151;
  const macR = 1221;
  const macT = 107;
  const macB = 762;
  const macCornerRadius = 10;

  // Precise iPhone outer body bounds (to not cut into the phone chassis/shadow)
  // Phone body is a rounded rectangle:
  const phoneBodyL = 1056;
  const phoneBodyR = 1414;
  const phoneBodyT = 312;
  const phoneBodyB = 1060;
  const phoneBodyRadius = 55;

  // Precise iPhone screen bounds (where the video will show):
  const phoneScreenL = 1075;
  const phoneScreenR = 1395;
  const phoneScreenT = 332;
  const phoneScreenB = 1040;
  const phoneScreenRadius = 45;

  function insideRoundedRect(x, y, l, r, t, b, radius) {
    if (x < l || x > r || y < t || y > b) return false;
    if (x < l + radius && y < t + radius) {
      return Math.hypot(x - (l + radius), y - (t + radius)) <= radius;
    }
    if (x > r - radius && y < t + radius) {
      return Math.hypot(x - (r - radius), y - (t + radius)) <= radius;
    }
    if (x < l + radius && y > b - radius) {
      return Math.hypot(x - (l + radius), y - (b - radius)) <= radius;
    }
    if (x > r - radius && y > b - radius) {
      return Math.hypot(x - (r - radius), y - (b - radius)) <= radius;
    }
    return true;
  }

  // MacBook notch
  function isMacNotch(x, y) {
    return (y >= 107 && y <= 118 && x >= 692 && x <= 734);
  }

  // iPhone Dynamic Island
  function isDynamicIsland(x, y) {
    return insideRoundedRect(x, y, 1205, 1265, 345, 360, 7);
  }

  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      const idx = (y * info.width + x) * 4;

      // 1. Cut out iPhone screen
      if (insideRoundedRect(x, y, phoneScreenL, phoneScreenR, phoneScreenT, phoneScreenB, phoneScreenRadius)) {
        if (!isDynamicIsland(x, y)) {
          data[idx + 3] = 0;
        }
        continue;
      }

      // 2. Check if inside phone body
      const isInsidePhoneBody = insideRoundedRect(x, y, phoneBodyL, phoneBodyR, phoneBodyT, phoneBodyB, phoneBodyRadius);

      // 3. Cut out MacBook screen (outside phone body)
      if (insideRoundedRect(x, y, macL, macR, macT, macB, macCornerRadius) && !isInsidePhoneBody) {
        if (!isMacNotch(x, y)) {
          data[idx + 3] = 0;
        }
      }
    }
  }

  await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
    .png()
    .toFile('public/images/devices/allnrg-device-frame.png');

  console.log('Saved refined allnrg-device-frame.png!');
}

createPerfectFrame().catch(console.error);
