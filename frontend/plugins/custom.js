export default {
  install (Vue) {
    // DEV_MODE
    Vue.prototype.DEV_MODE = (process.env.NODE_ENV === 'development')

    // Field rules
    Vue.prototype.$rules = {
      required: (message = 'This field is required.') => v => !!v || message,
      email: (message = 'This must be a valid email address.') => v => /.+@.+/.test(v) || message,
      compare: (data1, data2, message = 'Data doesn\'t match.') => v => data1 === data2 || message,
      min: (minimum, message) => v => {
        if (typeof v === 'string') {
          return v.length >= minimum || message
        } else {
          return v >= minimum || message
        }
      },
      range: (from, to, message = 'Input is not in range.') => v => (v >= from && v <= to) || message
    }

    // Delay simulator
    Vue.prototype.$delay = timeout => new Promise((resolve) => setTimeout(() => resolve(timeout), timeout))

    // Generate Placeholder Objects
    Vue.prototype.$placeholderObjects = (counts, structure) => [...Array(counts)].map((v, id) => ({ id: ++id, ...structure}))
  }
}
