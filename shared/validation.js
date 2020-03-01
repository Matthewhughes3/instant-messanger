const required = value => !!value || "This field is required"

const minLength = length => value => value && value.length >= length || `This field must be at least ${length} characters long`

const maxLength = length => value => value && value.length <= length || `This field can't be more than ${length} characters long`

export { required, minLength, maxLength }
