const isDevelopment = import.meta.env.DEV;

const logInfo = (message, data = null) => {
  if (isDevelopment) {
    if (data) {
      console.log(`[INFO] ${message}`, data);
    } else {
      console.log(`[INFO] ${message}`);
    }
  }
};

const logError = (message, error = null) => {
  if (isDevelopment) {
    if (error) {
      console.error(`[ERROR] ${message}`, error);
    } else {
      console.error(`[ERROR] ${message}`);
    }
  }
};

const logWarn = (message, data = null) => {
  if (isDevelopment) {
    if (data) {
      console.warn(`[WARN] ${message}`, data);
    } else {
      console.warn(`[WARN] ${message}`);
    }
  }
};

export { logInfo, logError, logWarn };