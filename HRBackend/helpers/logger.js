const winston = require("winston");
// const { format } = winston;
// const { combine, timestamp, label, prettyPrint } = format;
const logger = winston.createLogger({
  level:'info',
  transports: [
    new winston.transports.File({ filename: "sendmails.log", level: "info",options:{flags:'w'} })
  ],
});

module.exports = logger;


