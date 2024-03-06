const staffPipeline = [
  // Match users with role "staff"
  {
    $match: {
      $or: [{ role: "staff" }, { role: "viewer" }],
    },
  },
  // Lookup education, experience, and catalog documents
  {
    $lookup: {
      from: "professionals",
      localField: "_id",
      foreignField: "user",
      as: "professional",
    },
  },
  // Project necessary fields
  {
    $project: {
      _id: 1,
      image: 1,
      firstname: 1,
      lastname: 1,
      email: 1,
      age: 1,
      nationality: 1,
      phone: 1,
      role: 1,
      education: "$professional.education",
      experience: "$professional.experience",
      catalog: "$professional.catalog",
    },
  },
  // Grouping by user fields
  {
    $group: {
      _id: "$_id",
      image: { $first: "$image" },
      firstname: { $first: "$firstname" },
      lastname: { $first: "$lastname" },
      email: { $first: "$email" },
      age: { $first: "$age" },
      nationality: { $first: "$nationality" },
      phone: { $first: "$phone" },
      role: { $first: "$role" },
      education: { $first: "$education" },
      experience: { $first: "$experience" },
      catalog: { $first: "$catalog" },
    },
  },
];

module.exports = staffPipeline;
