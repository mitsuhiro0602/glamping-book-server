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