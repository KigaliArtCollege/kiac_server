const Joi = require("joi");
const { Internships } = require("../model/internship.model");

exports.postInternship = async (req, res) => {
  try {
    const createInternshipSchema = Joi.object({
      firstName: Joi.string().required(),
      email: Joi.string().email().required().email(),
      lastName: Joi.string().required(),
      phone: Joi.string().required(),
      national_id: Joi.string().required(),
      dob: Joi.date().required(),
      gender: Joi.string().required(),
      institution: Joi.string().required(),
      country: Joi.string(),
      fieldOfStudy: Joi.string().required(),
      dts: Joi.string().required(),
      duration: Joi.string(),
      career_plan: Joi.string(),
      course: Joi.string().required(),
      objective: Joi.string().required(),
      expectation: Joi.string().required(),
      payment_status: Joi.boolean(),
      approved: Joi.boolean(),
      status_of_application: Joi.string().default("pending"),
    });
    const studentData = req.body;

    const { error } = createInternshipSchema.validate(req.body);
    if (error) {
      console.log(error);
      return res.status(400).json({
        success: false,
        error: "Invalid or Already used Data Given.",
        errors: error.details,
      });
    }

    const existingStudent = await Internships.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (existingStudent) {
      console.log(
        "Blocking registration: Application with email:",
        req.body.email,
        "already exists."
      );
      return res.status(400).json({
        success: false,
        message: "An application with this email has already applied.",
      });
    }

    const application = new Internships(studentData);
    await application.save();

    // Send a successful response back to the client
    return res
      .status(200)
      .json({ success: true, message: "Application submitted successfully" });
  } catch (error) {
    console.error("Error during student registration:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// get applications
exports.getApplications = async (req, res) => {
  try {
    const applications = await Internships.findAll({
      where: {
        approved: false,
        status_of_application: "pending",
      },
    });
    return res.status(200).json(applications);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error occurred",
      details: error.message,
    });
  }
};

//delete agent
exports.rejectApplication = async (req, res) => {
  const { id } = req.params;
  try {
    const application = await Internships.findOne({
      where: {
        id,
      },
    });

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    // Update the application status to "rejected"
    application.status_of_application = "rejected";
    await application.save();

    res.status(200).json({
      message: "Application rejected successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error occurred",
      details: error.message,
    });
  }
};

exports.updatePaymentStatusAndApproved = async (req, res) => {
  const { id } = req.params;

  try {
    const application = await Internships.findOne({
      where: {
        id: id,
      },
    });

    if (!application) {
      return res.status(404).json({
        message: "No application found with the provided ID.",
      });
    }

    const updatedApplication = await application.update({
      payment_status: true,
      approved: true,
      status_of_application: "accepted",
    });

    res.status(200).json({
      message: "Application updated successfully.",
      application: updatedApplication,
      agent: application,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error occurred",
      details: error.message,
    });
  }
};
