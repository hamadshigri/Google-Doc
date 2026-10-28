import mongoose from "mongoose";

export const connectDB = () => {
     mongoose.connect(`mongodb://hamadshigri95_db_user:IfMaavKoiy68Aos3@ac-cirw345-shard-00-00.m2wsspt.mongodb.net:27017,ac-cirw345-shard-00-01.m2wsspt.mongodb.net:27017,ac-cirw345-shard-00-02.m2wsspt.mongodb.net:27017/document?ssl=true&replicaSet=atlas-13u12i-shard-0&authSource=admin`).then(() => {
        console.log('Connected!');
    }).catch((err) => {
    console.log(err);
    })
}