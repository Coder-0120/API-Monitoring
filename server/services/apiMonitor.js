const axios = require("axios");
const Api = require("../Models/apiModels");
const Apilog = require("../Models/apiLogModel");

const checkApi = async () => {
  try {
    const allApis = await Api.find(); // fetch fresh APIs each cycle

    for (const api of allApis) {
      const start = Date.now();
      const prevStatus = api.status;
      let newStatus = "DOWN";
      let responseTime = null;
      let errorMessage = null;

      try {
        await axios.get(api.url, { timeout: 5000 });
        responseTime = Date.now() - start;
        newStatus = "UP";
      } catch (err) {
        errorMessage = err.message;
        newStatus = "DOWN";
      }

      try {
        // 🔒 SAFE UPDATE (won't crash if API was deleted)
        const updated = await Api.updateOne(
          { _id: api._id },
          {
            $set: {
              status: newStatus,
              responseTime,
              lastChecked: new Date()
            }
          }
        );

        // if API was deleted meanwhile → skip
        if (updated.matchedCount === 0) {
          console.warn(`API ${api._id} deleted during cron. Skipping.`);
          continue;
        }

        // create log ONLY when status changes
        if (prevStatus && prevStatus !== newStatus) {
          await Apilog.create({
            apiId: api._id,
            status: newStatus,
            responseTime,
            Errormessage: errorMessage
          });

          console.log(`Api log created for ${api.name}`);
        }

      } catch (dbError) {
        console.error("DB update error:", dbError.message);
        // do NOT throw — cron must continue
      }
    }
  } catch (error) {
    console.error("Cron checkApi failed:", error.message);
  }
};

module.exports = checkApi;
