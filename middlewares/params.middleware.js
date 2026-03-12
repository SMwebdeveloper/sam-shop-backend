const BaseError = require("../errors/base.error")

const validateParams = (requiredParams) => {
    return (req, res, next) =>{
      const missingParrams = []

      // check required params
      requiredParams.forEach(param => {
         if(!req.params[param] || req.params[param].trim() === '') {
            missingParrams.push(param)
         }
      });
      const errorMessages = {
        uz: "Kerakli parametrlar yetishmayapti",
        ru: "Отсутствуют необходимые параметры",
        en: "Missing required parameters",
      };
      const messages = {
        uz:"Quyidagi parametrlar talab qilinadi:",
        ru: "Требуются следующие параметры:",
        en: "The following parameters are required:"
      }
      if(missingParrams.length > 0) {
        return res.status(400).json({
            success: false,
            error: errorMessages[req.lang],
            missingParrams,
            message:`${messages[req.lang]} ${missingParrams.join(", ")}`
        })
      }

      next()
    }
}
module.exports = validateParams