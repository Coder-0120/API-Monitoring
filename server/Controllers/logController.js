// controllers/logController.js
const ApiLog = require("../Models/apiLogModel");

const getResponseTimeTrend = async (req, res) => {
  try {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const data = await ApiLog.aggregate([
      {
        $match: {
          createdAt: { $gte: since },
          status: "UP",
          responseTime: { $ne: null }
        }
      },
      {
        $group: {
          _id: {
            hour: {
              $dateToString: {
                format: "%H:00",
                date: "$createdAt"
              }
            }
          },
          avgResponseTime: { $avg: "$responseTime" }
        }
      },
      {
        $sort: { "_id.hour": 1 }
      }
    ]);

    return res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch response trend" });
  }
};
module.exports = {
  getResponseTimeTrend
};