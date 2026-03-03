const validateGeoFence = (data)=>{
    const lng = data.location?.coordinates?.[0];
    const lat = data.location?.coordinates?.[1];
    return{
        name:data.name,
        type:data.type,
        cityName: data.cityName,
        location:{
            type:"Point",
            coordinates:[parseFloat(data.lng), parseFloat(data.lat)]
        },
        radius:parseInt(data.radius) || 50,
        isActive:true,
        createdAt : new Date()
    };
};
module.exports = {validateGeoFence};