import Glamping from "../models/glamping";
import fs from 'fs'


export const create = async(req, res ) => {
  console.log('req.fields',req.fields)
  console.log('req.files',req.files )
  try{
    let fields = req.fields
    let files = req.files

    let glamping = new Glamping(fields);

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
  let all = await Glamping.find({})
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