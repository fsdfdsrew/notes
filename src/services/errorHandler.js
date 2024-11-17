export function handleErrorResponse(error) {
    if (error.response && error.response.data && Array.isArray(error.response.data.message)) {
        return error.response.data.message[0]; // Возвращаем только первую ошибку
    } else if (error.response && error.response.data && error.response.data.message) {
        return error.response.data.message; // Если ошибка — строка
    } else {
        return "Ошибка сети или сервера"; // Общая ошибка
    }
}