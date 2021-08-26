import mongoose from 'mongoose';

const {Schema} = mongoose;

const {ObjectId} = mongoose.Schema

const glampingSchema = new Schema({
  title: {
    type: String,
    require: 'Title is required'
  },
  content: {
    type: String,
    require: 'Content is required',
    maxlength: 1000
  },
  location: {
    type: String,
  },
  price: {
    type: Number,
    require: 'Price is required',
    trim: true
  },
  tags: {
    type: String,
  },
  type: {
    type: Number,
  },
  redirect_url: {
    type: String,
  },
  postedBy: {
    type: ObjectId,
    ref: 'User'
  },
  image: {
    data: Buffer,
    contentType: String
  },
  from: {
    type: Date
  },
  to: {
    type: Date,
  },
  person: {
    type: Number,
  }
}, {timestamps: true})

export default mongoose.model('Glamping', glampingSchema);