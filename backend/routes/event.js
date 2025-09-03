const Event = require('../models/Event');

// ✅ Create Event
const createEvent = async (req, res) => {
  try {
    const event = new Event(req.body);
    await event.save();
    res.status(201).json({ message: 'Event created successfully', event });
  } catch (error) {
    console.error('❌ Error creating event:', error);
    res.status(500).json({ message: 'Failed to create event', error: error.message });
  }
};

// ✅ Get All Events
const getAllEvents = async (req, res) => {
  try {
    console.log('🔐 Authenticated user:', req.user.email || req.user.id);
    const events = await Event.find();
    res.status(200).json(events);
  } catch (error) {
    console.error('❌ Error in getAllEvents:', error);
    res.status(500).json({ message: 'Failed to fetch events', error: error.message });
  }
};

// ✅ Get Event by ID
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.status(200).json(event);
  } catch (error) {
    console.error('❌ Error fetching event:', error);
    res.status(500).json({ message: 'Error fetching event', error: error.message });
  }
};

// ✅ Update Event
const updateEvent = async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedEvent) return res.status(404).json({ message: 'Event not found' });
    res.status(200).json({ message: 'Event updated', event: updatedEvent });
  } catch (error) {
    console.error('❌ Error updating event:', error);
    res.status(500).json({ message: 'Error updating event', error: error.message });
  }
};

// ✅ Delete Event
const deleteEvent = async (req, res) => {
  try {
    const deleted = await Event.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Event not found' });
    res.status(200).json({ message: 'Event deleted', event: deleted });
  } catch (error) {
    console.error('❌ Error deleting event:', error);
    res.status(500).json({ message: 'Error deleting event', error: error.message });
  }
};

module.exports = {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
};
