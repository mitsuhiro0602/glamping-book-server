import Glamping from "../models/glamping";
import fs from 'fs'
import Order from "../models/order"

export const create = async(req, res ) => {
  try{
    let fields = req.fields
    let files = req.files

    let glamping = new Glamping(fields);
    glamping.postedBy = req.user._id;

    // handle image
    if(files.image) {
      glamping.image.data = fs.readFileSync(files.image.path);
      glamping.image.contentType = files.image.type;
    }
    glamping.save((err, result) => {
      if(err) {
        console.log('saving glamping err ===>', err)
        res.status(400).send('Error saving')
      }
      res.json(result);
    });
  }catch(err){
    console.log(err)
    res.status(400).json({
      err: err.message,
    });
  }
};

export const glampings = async(req, res) => {
  // let all = await Glamping.find({})
  let all = await Glamping.find({})
  // let all = await Glamping.find({ "from": { $gte: new Date() } })
    .limit(24)
    .select('-image.data')
    .populate("postedBy", '_id name')
    .exec();
  res.json(all)
}


export const image =  async(req, res) => {
  let glamping = await Glamping.findById(req.params.glampingId).exec();
  if(glamping && glamping.image && glamping.image.data !== null) {
    res.set('Content-Type', glamping.image.contentType)
    return res.send(glamping.image.data);
  }
}

export const sellerGlampings = async(req, res) => {
  let all = await Glamping.find({postedBy: req.user._id})
    .select('-image.data')
    .populate('postedBy', '_id name')
    .exec();
    console.log(all);
  res.send(all);
}

export const remove = async(req, res) => {
  let removed = await Glamping.findByIdAndDelete(req.params.glampingId)
    .select('-image.data')
    .exec();
  res.json(removed);
};

export const read = async(req, res) => {
  let glamping = await Glamping.findById(req.params.glampingId)
    .populate('postedBy', '_id name')
    .select('-image.data')
    .exec();
  console.log("SINGLE GLAMPING",glamping)
  res.json(glamping)
}

export const update = async (req, res) => {
  try {
    let fields = req.fields;
    let files = req.files;

    let data = {...fields}

    if(files.image) {
      let image = {}
      image.data = fs.readFileSync(files.image.path)
      image.contentType = files.image.type;

      data.image = image;
    }

    let updated = await Glamping.findByIdAndUpdate(req.params.glampingId, data, {
      new: true,
    }).select('-image.data');

    res.json(updated);
  } catch(err) {
    res.status(400).send('Glamping update failed. Try again.')
  }
}

export const userGlampingBookings = async(req, res) => {
  const all = await Order.find({orderedBy: req.user._id})
    .select('session')
    .populate('glamping', '-image.data')
    .populate('orderedBy', '_id name')
    .exec();
  console.log('all', all)
  res.json(all);
};

export const isAlreadyBooked = async(req, res) => {
  const { glampingId } = req.params;
  const userOrders = await Order.find({orderedBy: req.user._id})
    .select('glamping')
    .exec()

  let ids = []
  for (let i = 0; i < userOrders.length; i++) {
    ids.push(userOrders[i].glamping.toString());
  }
  res.json({
    ok: ids.includes(glampingId)
  })
}

export const searchListings = async (req, res) => {
  const {location, date, person} = req.body

  const fromDate = date.split(',');
  // console.log(fromDate[0])
  let result = await Glamping.find({ 
    from: {$gte: new Date(fromDate[0])},
    // location
  })
    .select('-image.data')
    .exec();
  res.json(result);
}