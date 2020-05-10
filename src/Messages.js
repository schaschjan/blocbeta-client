export const Messages = {
  range: {
    min: (value, property) => {
      return `Minimal ${property} is ${value}`;
    },
    max: (value, property) => {
      return `Maximal ${property} is ${value}`;
    },
  },
  required: "Please provide a value",
  requiredOption: "Please select a value",
  email: {
    invalid: "Please provide a valid E-Mail address",
  },
  errors: {
    general: "Uh, oh oh. That was a slip…",
  },
  reset: "Resetting probably right now!",
};
