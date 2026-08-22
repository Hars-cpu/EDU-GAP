export const getProfile = async (req, res) => {
  try {
    res.status(200).json({
      message: "Protected route",
      user: req.user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};