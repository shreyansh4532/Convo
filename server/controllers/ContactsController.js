import User from "../models/UserModel.js";

export const search = async (req, res) => {
  try {
    // console.log(req.body);
    const { searchVal } = req.body;

    if (searchVal === undefined || searchVal === null) {
      return res.status(400).send("Search Value is Required!");
    }

    const sanitizedSearchTerm = searchVal.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );

    const regex = new RegExp(sanitizedSearchTerm, "i");

    const contacts = await User.find({
      $and: [
        {
          _id: { $ne: req.userID },
        },
        {
          $or: [{ firstName: regex }, { lastName: regex }, { email: regex }],
        },
      ],
    });

    return res.status(200).json({ contacts });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};
