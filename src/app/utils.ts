export function formToJson(form: FormData) {
    const jsonForm: Record<string, FormDataEntryValue> = {}
    for (const [key, value] of form.entries()) {
        jsonForm[key] = value
    }
    return jsonForm
}

export function URLSearchParamsToJson(params: URLSearchParams) {
    const data: Record<string, any> = {}
    for (const [key, value] of params) {
        data[key] = value
    }
    return data
}
