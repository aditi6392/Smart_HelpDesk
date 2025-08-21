import {
  registerUserService,
  loginUserService,
  updateUserRoleService,
} from "../services/userService.js";

// ----------------- REGISTER -----------------
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const { user, token } = await registerUserService({ name, email, password, role });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ----------------- LOGIN -----------------
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required" });

    const { user, token } = await loginUserService({ email, password });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ----------------- UPDATE USER ROLE -----------------
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const updatedUser = await updateUserRoleService(req.params.id, role);
    res.json({ message: "Role updated", user: updatedUser });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
