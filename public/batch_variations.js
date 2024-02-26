import { questionOrder } from "./mainStudyOrderSequence";
import { data2DArray } from "./mainstudy";


// no same order of questions, but also batch must be evenly distributed between batches
// random number from 0 and 5
// set order of questions, but the batch will be different, so the actual appearance will be out
export default batch;

const batch = {
    batchA : {
        picture: data2DArray[questionOrder][2][0]
        

    },
    batchB : {
        picture: data2DArray[questionOrder][2][1]
    },

    batchC : {

    },

    batchD :{
        
    }


}