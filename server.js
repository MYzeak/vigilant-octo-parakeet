const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const path = require("path");

const app = express();
const PORT = 3000;

// Orjin izinleri ve JSON parsleme
app.use(cors());
app.use(bodyParser.json());

// Statik dosyalar (frontend)
app.use(express.static(path.join(__dirname, "public")));

// "Fake" veritabanı (sunucu kapanınca sıfırlanır)
const users = []; 
// user objesi: { name, email, passwordHash, isActive, activationCode }

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "atamanbirol523@gmail.com",
    pass: "UYGULAMA_ŞİFREN"
  },
  tls: {
    rejectUnauthorized: false
  }
});


// Aktivasyon kodu üretici
function generateActivationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6 haneli kod
}

// --- ROUTE: KAYIT ---
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ message: "Tüm alanlar zorunlu." });

  // Var mı daha önce kayıtlı?
  const existing = users.find((u) => u.email === email);
  if (existing) {
    return res.status(400).json({ message: "Bu e-posta zaten kayıtlı." });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const activationCode = generateActivationCode();

  const newUser = {
    name,
    email,
    passwordHash,
    isActive: false,
    activationCode,
  };
  users.push(newUser);

  // Aktivasyon linki
  const activationLink = `http://localhost:${PORT}/activate?email=${encodeURIComponent(
    email
  )}&code=${activationCode}`;

  console.log("KULLANICI KAYIT:", newUser);
  console.log("AKTİVASYON LİNKİ (test için):", activationLink);

  // Mail gönderme
  try {
    await transporter.sendMail({
      from: '"Üyelik Sistemi" <MAIL_ADRESİNİ_YAZ>',
      to: email,
      subject: "Üyelik Aktivasyonu",
      text: `Merhaba ${name},\n\nHesabını aktifleştirmek için bu linke tıkla:\n${activationLink}\n\nAktivasyon kodun: ${activationCode}`,
    });

    return res.json({
      message:
        "Kayıt başarılı! Aktivasyon linki e-posta adresine gönderildi. (Görmüyorsan spam klasörüne bak.)",
    });
  } catch (err) {
    console.error("Mail gönderilemedi:", err);
    return res.status(500).json({
      message:
        "Kayıt yapıldı ama mail gönderilemedi. Konsolda aktivasyon linki yazıyor.",
    });
  }
});

// --- ROUTE: AKTİVASYON ---
app.get("/activate", (req, res) => {
  const { email, code } = req.query;

  if (!email || !code) {
    return res.status(400).send("Geçersiz aktivasyon linki.");
  }

  const user = users.find((u) => u.email === email);
  if (!user) {
    return res.status(404).send("Kullanıcı bulunamadı.");
  }

  if (user.isActive) {
    return res.send("Hesabın zaten aktif. Giriş yapabilirsin.");
  }

  if (user.activationCode !== code) {
    return res.status(400).send("Aktivasyon kodu geçersiz.");
  }

  user.isActive = true;
  user.activationCode = null;

  return res.send("Hesabın başarıyla aktifleştirildi! Artık giriş yapabilirsin.");
});

// --- ROUTE: LOGIN ---
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = users.find((u) => u.email === email);
  if (!user) {
    return res.status(400).json({ message: "E-posta veya şifre hatalı." });
  }

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) {
    return res.status(400).json({ message: "E-posta veya şifre hatalı." });
  }

  if (!user.isActive) {
    return res
      .status(403)
      .json({ message: "Hesabın aktif değil. Lütfen maildeki linke tıkla." });
  }

  return res.json({ message: `Hoş geldin, ${user.name}! Giriş başarılı.` });
});

// SUNUCUYU BAŞLAT
app.listen(PORT, () => {
  console.log(`Sunucu çalışıyor: http://localhost:${PORT}`);
});




