const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");

async function ensureAdmin() {
  const email = (process.env.ADMIN_EMAIL || "").toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.warn("ADMIN_EMAIL or ADMIN_PASSWORD is missing. Admin login will not work until they are set.");
    return;
  }

  const hashed = await bcrypt.hash(password, 10);
  const existing = await Admin.findOne({ email });

  if (existing) {
    existing.password = hashed;
    await existing.save();
  } else {
    await Admin.create({ email, password: hashed });
  }

  console.log(`Admin account ready: ${email}`);
}

module.exports = { ensureAdmin };
