export function formToJson(form: FormData) {
    const jsonForm: Record<string, FormDataEntryValue> = {}
    for (const [key, value] of form.entries()) {
        jsonForm[key] = value
    }
    return jsonForm
}