import User from "../models/user.model.js";

/*
  GET /api/users/students

  Teacher only

  Optional query parameters:

  ?search=harsh
  ?className=10A

  Examples:

  GET /api/users/students
  GET /api/users/students?search=harsh
  GET /api/users/students?className=10A
  GET /api/users/students?search=harsh&className=10A
*/

export const getAllStudents = async (req, res) => {
  try {
    const { search, className } = req.query;

    // Only students
    const query = {
      role: "student",
    };

    // Filter by class
    if (className && className !== "all") {
      query.className = className;
    }

    // Search by name / username / email
    if (search && search.trim()) {
      const searchRegex = new RegExp(
        search.trim(),
        "i"
      );

      query.$or = [
        {
          name: searchRegex,
        },
        {
          username: searchRegex,
        },
        {
          email: searchRegex,
        },
      ];
    }

    const students = await User.find(query)
      .select(
        "_id name username email className"
      )
      .sort({
        name: 1,
      });

    res.status(200).json({
      success: true,
      count: students.length,
      students,
    });

  } catch (error) {
    console.error(
      "Get All Students Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch students",
    });
  }
};