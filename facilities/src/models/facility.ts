import mongoose from 'mongoose';

// An interface to check the inputs to the build function
// to create new facility tickets 
interface FacilityAttrs{
    title: string;
    price: number;
}

// An interface to define the properties inside the 
// Facility document for mongoDb
interface FacilityDoc extends mongoose.Document{
    title: string;
    price: number;
}

// An interface to define the properties inside the 
// Facility model
interface FacilityModel extends mongoose.Model<FacilityDoc>{
    build(attrs: FacilityAttrs) : FacilityDoc;
}

// Tells MongoDB what fields will be stored in the 
// MongoDB document (on the database side, not client side)
const facilitySchema = new mongoose.Schema({
    title: {
        required: true,
        type: String
    },
    price: {
        required: true,
        type: Number
    }
}, {
    toJSON:{
        transform(doc, ret){
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

// Add a build method to include type checking 
// from Typescript
facilitySchema.statics.build = (attrs: FacilityAttrs) => {
    return new Facility(attrs);
}

const Facility = mongoose.model<FacilityDoc, FacilityModel>('Facility', facilitySchema);

export {Facility};