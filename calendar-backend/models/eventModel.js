import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
    date: {
        type: String, // Зберігатимемо дату, наприклад, у форматі "YYYY-MM-DD"
        required: true,
    },
    time: {
        type: String, // Час із твого інпуту, наприклад, "00:00"
        required: true,
    },
    text: {
        type: String,
        required: true,
        maxLength: 60, // Обмеження, яке вже є у твоєму textarea
    },
    intervalStudy: {
        type: Boolean,
        default: false, // Значення чекбоксу
    },
    color: {
        type: String,
        default: "#00a3ff",
    },
}, {
    timestamps: true // Автоматично додасть поля створення та оновлення (createdAt, updatedAt)
});

export default mongoose.model('Event', eventSchema);