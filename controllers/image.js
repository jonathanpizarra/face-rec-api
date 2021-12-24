import fetch from 'node-fetch';
import clarifai from 'clarifai';

const handleImage = (req, res, db)=>{
    const {id, url} = req.body;

    const raw = JSON.stringify({
        "user_app_id": {
          "user_id": "u1eyj1igdiih",
          "app_id": "24783cca8a0a46ac813d0f75d1391854"
        },
        "inputs": [
          {
            "data": {
              "image": {
                "url": url
              }
            }
          }
        ]
    });
      
    const requestOptions = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Key 02e81bf997df4603a71738071ced80a9'
        },
        body: raw
    };

      // NOTE: MODEL_VERSION_ID is optional, you can also call prediction with the MODEL_ID only
      // https://api.clarifai.com/v2/models/{YOUR_MODEL_ID}/outputs
      // this will default to the latest version_id
      

    fetch(`https://api.clarifai.com/v2/models/${clarifai.FACE_DETECT_MODEL}/outputs`, requestOptions)
    .then(response => response.json())
    .then(result =>{
        if(result.status.description === 'Ok'){
            
            db('users')
            .where('id', '=', id)
            .increment('entries', 1)
            .returning('entries')
            .then(entries =>{
                let data = {entries : entries[0]};
                data.regions = result.outputs[0].data.regions;
                console.log('data: ', result.outputs[0].data)
                res.json(data);
            })
            .catch(err => res.status(400).json('error getting entries : ' + err))
        }else{
            res.status(400).json("Clarifai servers are down at the moment");
        }
        
    })
    .catch(error => {
        console.log("server error: ", error)
        res.status(400).json('server error')
    });

}

    


export default handleImage;