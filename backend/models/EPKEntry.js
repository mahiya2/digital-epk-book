const mongoose = require("mongoose");

const epkEntrySchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    dayType: {
      type: String,
      required: true,
    },

    otherReason: {
      type: String,
      default: "",
    },

    key: {
      type: String,
      default: "",
    },

    route: {
      type: String,
      default: "",
    },

    scheduledKm: {
      type: Number,
      default: 0,
    },

    operatedKm: {
      type: Number,
      default: 0,
    },
    extraKm: {
  type: Number,
  default: 0,
},

    cancelledKm: {
      type: Number,
      default: 0,
    },

    earnings: {
      type: Number,
      default: 0,
    },

    epk: {
      type: Number,
      default: 0,
    },

    remarks: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("EPKEntry", epkEntrySchema);