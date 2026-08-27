import Event from '../models/eventModel.js';


export const createEvent = async (req, res) => {
    try {
        const { date, time, text, intervalStudy, color } = req.body;

        const newEvent = await Event.create({
            date,
            time,
            text,
            intervalStudy,
            color
        });

        res.status(201).json(newEvent);
    } catch (error) {
        res.status(400).json({ message: 'Помилка при створенні події', error: error.message });
    }
};


export const getEvents = async (req, res) => {
    try {
        const events = await Event.find({});
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: 'Помилка при отриманні подій', error: error.message });
    }
};
export const updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedEvent = await Event.findByIdAndUpdate(id, req.body, { returnDocument: 'after' });

        if (!updatedEvent) return res.status(404).json({ message: 'Подію не знайдено' });

        res.status(200).json(updatedEvent);
    } catch (error) {
        res.status(400).json({ message: 'Помилка при оновленні події', error: error.message });
    }
};

export const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedEvent = await Event.findByIdAndDelete(id);

        if (!deletedEvent) return res.status(404).json({ message: 'Подію не знайдено' });

        res.status(200).json({ message: 'Подію успішно видалено' });
    } catch (error) {
        res.status(400).json({ message: 'Помилка при видаленні події', error: error.message });
    }
};