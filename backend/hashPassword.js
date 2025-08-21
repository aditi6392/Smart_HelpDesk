import bcrypt from "bcryptjs";

const password = "admin"; // <-- change to your desired password

bcrypt.hash(password, 10, (err, hash) => {
  if (err) {
    console.error("Error hashing password:", err);
  } else {
    console.log("Hashed password:", hash);
  }
});
