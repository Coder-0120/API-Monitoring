const mongoose = require("mongoose");
const ApiLog = require("../Models/apiLogModel");

const getResponseTimeTrend = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required"
      });
    }

    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const data = await ApiLog.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
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
                date: "$createdAt",
                timezone: "+05:30"
              }
            }
          },
          avgResponseTime: { $avg: "$responseTime" },
          peakResponseTime: { $max: "$responseTime" }
        }
      },
      { $sort: { "_id.hour": 1 } },
      {
        $project: {
          _id: 0,
          hour: "$_id.hour",
          avgResponseTime: { $round: ["$avgResponseTime", 0] },
          peakResponseTime: "$peakResponseTime"
        }
      }
    ]);

    return res.status(200).json({
      success: true,
      data
    });

  } catch (error) {
    console.error("❌ Response Trend Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch response trend"
    });
  }
};

module.exports = { getResponseTimeTrend };
