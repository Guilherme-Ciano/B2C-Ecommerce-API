const createMessageFor = (entity?: string) => ({
  SUCCESS: {
    CREATED: `${entity} created successfully.`,
    FETCHED: `${entity} fetched successfully.`,
    UPDATED: `${entity} updated successfully.`,
    DELETED: `${entity} deleted successfully.`,
    OK: 'Operation completed successfully.',
  },
  CLIENT_ERROR: {
    BAD_REQUEST: 'Bad request. One or more parameters are invalid.',
    UNAUTHORIZED: 'Authentication failed. Please check your credentials.',
    FORBIDDEN: 'Access denied. You do not have permission to perform this action.',
    NOT_FOUND: `${entity} not found.`,
    CONFLICT: `A conflict occurred. This ${entity} already exists.`,
    VALIDATION_ERROR: `Validation failed. Please check the provided data.`,
  },
  SERVER_ERROR: {
    INTERNAL_SERVER_ERROR: 'An unexpected error occurred. Please try again later.',
    SERVICE_UNAVAILABLE: 'The service is temporarily unavailable.',
  },
})

export { createMessageFor }
