module.exports = class BaseError extends Error {
  status;
  errors;
  locale;
  constructor(status, message, errors = [], locale = "uz") {
    super(message);
    this.status = status;
    this.errors = errors;
    this.locale = locale;
  }

  static UnAuthorizedError(locale = "uz") {
    const message = {
      uz: "Foydalanuvchi avtorizatsiyadan o'tmagan",
      ru: "Пользователь не авторизован",
      en: "User is not authorized",
    };
    return new BaseError(401, message[locale], [], locale);
  }
  static BadRequest(message, errors = []) {
    const defaultMessages = {
      uz: "Noto'g'ri so'rov",
      ru: "Неверный запрос",
      en: "Bad request",
    };
    const finaleMessage = message || defaultMessages[locale];
    return new BaseError(400, finaleMessage, errors, locale);
  }
  static NotFound(resource = null, locale = "uz") {
    const messages = {
      uz: resource ? `${resource} topilmadi` : "Ma'lumot topilmadi",
      ru: resource ? `${resource} не найден` : "Данные не найдены",
      en: resource ? `${resource} not found` : "Data not found",
    };

    return new BaseError(404, messages[locale], [], locale);
  }

  static Forbiden(locale = "uz") {
    const message = {
      uz: "Ruxsat yo'q",
      ru: "Нет разрешения",
      en: "No permission",
    };
    return new BaseError(403, message[locale], [], locale);
  }
  static InternalServerError(locale = "uz") {
    const message = {
      uz: "Serverda xatolik yuz berdi",
      ru: "Произошла ошибка на сервере",
      en: "An error occurred on the server",
    };
    return new BaseError(500, message[locale], [], locale);
  }
  static Conflict(message = null, locale = "uz") {
    const defaultMessages = {
      uz: "Konflikt yuz berdi",
      ru: "Произошел конфликт",
      en: "A conflict occurred",
    };
    const finaleMessage = message || defaultMessages[locale];
    return new BaseError(409, finaleMessage, [], locale);
  }
  static UnprocessableEntity(message = null, errors = [], locale = "uz") {
    const defaultMessages = {
      uz: "So'rovni qayta ishlab bo'lmadi",
      ru: "Невозможно обработать запрос",
      en: "The request could not be processed",
    };
    const finaleMessage = message || defaultMessages[locale];
    return new BaseError(422, finaleMessage, errors, locale);
  }

  static ServiceUnavailable(locale = "uz") {
    const message = {
      uz: "Xizmat mavjud emas",
      ru: "Сервис недоступен",
      en: "Service is unavailable",
    };
    return new BaseError(503, message[locale], [], locale);
  }
};
