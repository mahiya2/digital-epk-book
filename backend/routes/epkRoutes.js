const express = require("express");
const EPKEntry = require("../models/EPKEntry");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

// Save EPK entry
router.post("/entry", authMiddleware, async (req, res) => {
  try {
const {
  date,
  dayType,
  otherReason,
  key,
  route,
  scheduledKm,
  operatedKm,
  extraKm,
  earnings,
  remarks,
} = req.body;

   if (!date || !dayType) {
  return res.status(400).json({
    message: "Date and day type are required.",
  });
}
    // Validate numeric values
if (
  Number(scheduledKm) < 0 ||
  Number(operatedKm) < 0 ||
    Number(extraKm) < 0 ||
  Number(earnings) < 0
) {
  return res.status(400).json({
    message: "KM and Earnings cannot be negative.",
  });
}
if (Number(operatedKm) > Number(scheduledKm)) {
  return res.status(400).json({
    message: "Operated KM cannot be greater than Scheduled KM.",
  });
}
    // Calculate EPK
   const totalKm = Number(operatedKm || 0) + Number(extraKm || 0);

const epk =
  totalKm > 0
    ? Number(earnings) / totalKm
    : 0;
        const [day, month, year] = date.split("/");

const formattedDate = new Date(
  `${year}-${month}-${day}T00:00:00`
);

    // Create entry
    const entry = new EPKEntry({
      employeeId: req.employee.employeeId,
      date: formattedDate,
      dayType,
      otherReason,
      key,
      route,
      scheduledKm: Number(scheduledKm || 0),
      operatedKm: Number(operatedKm || 0),
      extraKm: Number(extraKm || 0),
cancelledKm: Math.max(
  0,
  Number(scheduledKm || 0) - Number(operatedKm || 0)
),
      earnings: Number(earnings || 0),
      epk,
      remarks,
    });

    await entry.save();

    res.status(201).json({
      message: "EPK entry saved successfully!",
      entry,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error while saving EPK entry.",
    });
  }
});
// Get monthly EPK summary
router.get("/summary",authMiddleware, async (req, res) => {
  try {
const { month } = req.query;
const employeeId = req.employee.employeeId;

    if (!employeeId || !month) {
      return res.status(400).json({
        message: "Employee ID and month are required.",
      });
    }

    const startDate = new Date(`${month}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    const entries = await EPKEntry.find({
      employeeId,
      date: {
        $gte: startDate,
        $lt: endDate,
      },
    }).sort({ date: 1 });

    const summary = {
      dutyDays: entries.filter(
        (entry) => entry.dayType === "Duty"
      ).length,

      specialDuty: entries.filter(
        (entry) => entry.dayType === "Special Duty"
      ).length,

      leave: entries.filter(
        (entry) => entry.dayType === "Leave"
      ).length,

      weeklyOff: entries.filter(
        (entry) => entry.dayType === "Weekly Off"
      ).length,

      scheduledKm: entries.reduce(
        (total, entry) => total + entry.scheduledKm,
        0
      ),

      operatedKm: entries.reduce(
        (total, entry) => total + entry.operatedKm,
        0
      ),

      cancelledKm: entries.reduce(
  (total, entry) =>
    total +
    Math.max(0, entry.scheduledKm - entry.operatedKm),
  0
),
      totalEarnings: entries.reduce(
        (total, entry) => total + entry.earnings,
        0
      ),

    monthlyEpk:
  entries.reduce(
    (total, entry) =>
      total + entry.operatedKm + (entry.extraKm || 0),
    0
  ) > 0
    ? entries.reduce(
        (total, entry) => total + entry.earnings,
        0
      ) /
      entries.reduce(
        (total, entry) =>
          total + entry.operatedKm + (entry.extraKm || 0),
        0
      )
    : 0,
    };

    res.status(200).json({
      summary,
      entries,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error while getting monthly summary.",
    });
  }
});
// Get all EPK history for an employee
router.get("/history", authMiddleware, async (req, res) => {
  try {
const employeeId = req.employee.employeeId;

    if (!employeeId) {
      return res.status(400).json({
        message: "Employee ID is required.",
      });
    }

    const entries = await EPKEntry.find({
      employeeId,
    }).sort({ date: -1 });

    res.status(200).json({
      entries,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error while getting history.",
    });
  }
});
// Update EPK entry
router.put("/entry/:id", authMiddleware, async (req, res) => {
  try {
    const {
      date,
      dayType,
      otherReason,
      key,
      route,
      scheduledKm,
      operatedKm,
      extraKm,
      cancelledKm,
      earnings,
      remarks,
    } = req.body;

    const entry = await EPKEntry.findOne({
      _id: req.params.id,
      employeeId: req.employee.employeeId,
    });

    if (!entry) {
      return res.status(404).json({
        message: "EPK entry not found.",
      });
    }
let formattedDate;

if (date.includes("/")) {
  const [day, month, year] = date.split("/");

  formattedDate = new Date(
    `${year}-${month}-${day}T00:00:00`
  );
} else if (date.includes("-")) {
  formattedDate = new Date(`${date}T00:00:00`);
} else {
  return res.status(400).json({
    message: "Invalid date format. Please use DD/MM/YYYY.",
  });
}

if (isNaN(formattedDate.getTime())) {
  return res.status(400).json({
    message: "Invalid date. Please enter a valid date.",
  });
}

  const totalKm =
  Number(operatedKm || 0) + Number(extraKm || 0);

const epk =
  totalKm > 0
    ? Number(earnings || 0) / totalKm
    : 0;
    entry.date = formattedDate;
    entry.dayType = dayType;
    entry.otherReason = otherReason;
    entry.key = key;
    entry.route = route;
    entry.scheduledKm = Number(scheduledKm || 0);
    entry.operatedKm = Number(operatedKm || 0);
    entry.extraKm = Number(extraKm || 0);
    entry.cancelledKm = Number(cancelledKm || 0);
    entry.earnings = Number(earnings || 0);
    entry.epk = epk;
    entry.remarks = remarks;

    await entry.save();

    res.status(200).json({
      message: "EPK entry updated successfully!",
      entry,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error while updating EPK entry.",
    });
  }
});
// Delete EPK entry
router.delete("/entry/:id", authMiddleware, async (req, res) => {
  try {
    const entry = await EPKEntry.findOne({
      _id: req.params.id,
      employeeId: req.employee.employeeId,
    });

    if (!entry) {
      return res.status(404).json({
        message: "EPK entry not found.",
      });
    }

    await EPKEntry.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "EPK entry deleted successfully!",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error while deleting EPK entry.",
    });
  }
});
module.exports = router;