/*
* each stage is described here
* the approach used is indexed face set
* */
export class StageDescriber{
    static objectsDesc = {
        EMPTY: -1,
        GATE: 0,
        END_POINT: 1,
        BLOCK_GATE: 2,
        FLOATING_GATE: 3,
        FloatING_BLOCK_GATE: 4,
        FLOATING_END_POINT: 5,
        BULLET: 6
    }

    static Stages = {//used to describe which stage is being built
        ONE: 1,
        TWO: 2,
        THREE: 3,
        FOUR: 4
    }

    /*
    * describes how stage one is suppose to look like
    * */
    static stage1(){

        return [
            /*
            * each row describes how each section is suppose to look like (we use objectsDesc to do this)
            * the direction the rows take is in the z-axis, this means each row describes how a horizontal position
            * is suppose to look like at a specific z-position
            * */
            [this.objectsDesc.EMPTY, this.objectsDesc.EMPTY, this.objectsDesc.EMPTY],
            [this.objectsDesc.EMPTY, this.objectsDesc.EMPTY, this.objectsDesc.GATE],
            [this.objectsDesc.EMPTY, this.objectsDesc.GATE, this.objectsDesc.EMPTY],
            [this.objectsDesc.EMPTY, this.objectsDesc.GATE, this.objectsDesc.EMPTY],
            [this.objectsDesc.EMPTY, this.objectsDesc.GATE, this.objectsDesc.EMPTY],
            [this.objectsDesc.EMPTY, this.objectsDesc.GATE, this.objectsDesc.EMPTY],
            [this.objectsDesc.EMPTY, this.objectsDesc.EMPTY, this.objectsDesc.EMPTY],
            [this.objectsDesc.GATE, this.objectsDesc.EMPTY, this.objectsDesc.EMPTY],
            [this.objectsDesc.EMPTY, this.objectsDesc.EMPTY, this.objectsDesc.GATE],
            [this.objectsDesc.EMPTY, this.objectsDesc.EMPTY, this.objectsDesc.EMPTY],
            [this.objectsDesc.EMPTY, this.objectsDesc.EMPTY, this.objectsDesc.EMPTY],
            [this.objectsDesc.EMPTY, this.objectsDesc.EMPTY, this.objectsDesc.EMPTY],
            [this.objectsDesc.EMPTY, this.objectsDesc.FLOATING_GATE, this.objectsDesc.EMPTY],
            [this.objectsDesc.EMPTY, this.objectsDesc.GATE, this.objectsDesc.EMPTY],
            [this.objectsDesc.EMPTY, this.objectsDesc.EMPTY, this.objectsDesc.GATE],
            [this.objectsDesc.EMPTY, this.objectsDesc.EMPTY, this.objectsDesc.GATE],
            [this.objectsDesc.EMPTY, this.objectsDesc.EMPTY, this.objectsDesc.BLOCK_GATE],
            [this.objectsDesc.EMPTY, this.objectsDesc.EMPTY, this.objectsDesc.EMPTY],
            [this.objectsDesc.EMPTY, this.objectsDesc.EMPTY, this.objectsDesc.GATE],
            [this.objectsDesc.EMPTY, this.objectsDesc.EMPTY, this.objectsDesc.EMPTY],
            [this.objectsDesc.EMPTY, this.objectsDesc.BLOCK_GATE, this.objectsDesc.EMPTY],
            [this.objectsDesc.GATE, this.objectsDesc.EMPTY, this.objectsDesc.EMPTY],
            [this.objectsDesc.EMPTY, this.objectsDesc.EMPTY, this.objectsDesc.GATE],
            [this.objectsDesc.EMPTY, this.objectsDesc.EMPTY, this.objectsDesc.EMPTY],
            [this.objectsDesc.EMPTY, this.objectsDesc.FLOATING_GATE, this.objectsDesc.EMPTY],
            [this.objectsDesc.EMPTY, this.objectsDesc.EMPTY, this.objectsDesc.EMPTY],
            [this.objectsDesc.FLOATING_GATE, this.objectsDesc.EMPTY, this.objectsDesc.EMPTY],
            [this.objectsDesc.EMPTY, this.objectsDesc.EMPTY, this.objectsDesc.EMPTY],
            [this.objectsDesc.EMPTY, this.objectsDesc.EMPTY, this.objectsDesc.END_POINT]
        ];
    }

    static stage2(){
        return [
            [this.objectsDesc.EMPTY, this.objectsDesc.EMPTY, this.objectsDesc.EMPTY],
            [this.objectsDesc.EMPTY, this.objectsDesc.EMPTY, this.objectsDesc.EMPTY],
            [this.objectsDesc.EMPTY, this.objectsDesc.EMPTY, this.objectsDesc.EMPTY],
            [this.objectsDesc.EMPTY, this.objectsDesc.EMPTY, this.objectsDesc.EMPTY],
            [this.objectsDesc.EMPTY, this.objectsDesc.EMPTY, this.objectsDesc.FLOATING_GATE],
            [this.objectsDesc.EMPTY, this.objectsDesc.EMPTY, this.objectsDesc.FLOATING_GATE],
            [this.objectsDesc.EMPTY, this.objectsDesc.EMPTY, this.objectsDesc.EMPTY],
            [this.objectsDesc.EMPTY, this.objectsDesc.EMPTY, this.objectsDesc.EMPTY],
            [this.objectsDesc.EMPTY, this.objectsDesc.FLOATING_GATE, this.objectsDesc.EMPTY],
            [this.objectsDesc.EMPTY, this.objectsDesc.EMPTY, this.objectsDesc.EMPTY],
            [this.objectsDesc.EMPTY, this.objectsDesc.EMPTY, this.objectsDesc.EMPTY],
            [this.objectsDesc.EMPTY, this.objectsDesc.FloatING_BLOCK_GATE, this.objectsDesc.EMPTY],
            [this.objectsDesc.EMPTY, this.objectsDesc.EMPTY, this.objectsDesc.EMPTY],
            [this.objectsDesc.EMPTY, this.objectsDesc.EMPTY, this.objectsDesc.EMPTY],
            [this.objectsDesc.GATE, this.objectsDesc.EMPTY, this.objectsDesc.EMPTY],
            [this.objectsDesc.EMPTY, this.objectsDesc.EMPTY, this.objectsDesc.EMPTY],
            [this.objectsDesc.EMPTY, this.objectsDesc.EMPTY, this.objectsDesc.GATE],
            [this.objectsDesc.EMPTY, this.objectsDesc.EMPTY, this.objectsDesc.BLOCK_GATE],
            [this.objectsDesc.EMPTY, this.objectsDesc.EMPTY, this.objectsDesc.EMPTY],
            [this.objectsDesc.EMPTY, this.objectsDesc.EMPTY, this.objectsDesc.EMPTY],
            [this.objectsDesc.FLOATING_GATE, this.objectsDesc.EMPTY, this.objectsDesc.EMPTY],
            [this.objectsDesc.EMPTY, this.objectsDesc.EMPTY, this.objectsDesc.EMPTY],
            [this.objectsDesc.EMPTY, this.objectsDesc.EMPTY, this.objectsDesc.EMPTY],
            [this.objectsDesc.EMPTY, this.objectsDesc.BLOCK_GATE, this.objectsDesc.EMPTY],
            [this.objectsDesc.EMPTY, this.objectsDesc.EMPTY, this.objectsDesc.EMPTY],
            [this.objectsDesc.EMPTY, this.objectsDesc.EMPTY, this.objectsDesc.EMPTY],
            [this.objectsDesc.EMPTY, this.objectsDesc.FloatING_BLOCK_GATE, this.objectsDesc.EMPTY],
            [this.objectsDesc.EMPTY, this.objectsDesc.EMPTY, this.objectsDesc.EMPTY],
            [this.objectsDesc.EMPTY, this.objectsDesc.FLOATING_END_POINT, this.objectsDesc.EMPTY]
        ];
    }

    static stage3(){
        return [
            [this.objectsDesc.EMPTY, this.objectsDesc.EMPTY, this.objectsDesc.EMPTY],
            [this.objectsDesc.EMPTY, this.objectsDesc.EMPTY, this.objectsDesc.EMPTY],
            [this.objectsDesc.EMPTY, this.objectsDesc.EMPTY, this.objectsDesc.EMPTY],
            [this.objectsDesc.EMPTY, this.objectsDesc.EMPTY, this.objectsDesc.EMPTY],
            [this.objectsDesc.EMPTY, this.objectsDesc.BLOCK_GATE, this.objectsDesc.EMPTY],
            [this.objectsDesc.EMPTY, this.objectsDesc.EMPTY, this.objectsDesc.EMPTY],
            [this.objectsDesc.EMPTY, this.objectsDesc.EMPTY, this.objectsDesc.EMPTY],
            [this.objectsDesc.BLOCK_GATE, this.objectsDesc.EMPTY, this.objectsDesc.EMPTY],
            [this.objectsDesc.BLOCK_GATE, this.objectsDesc.EMPTY, this.objectsDesc.EMPTY],
            [this.objectsDesc.EMPTY, this.objectsDesc.EMPTY, this.objectsDesc.EMPTY],
            [this.objectsDesc.EMPTY, this.objectsDesc.EMPTY, this.objectsDesc.BLOCK_GATE],
            [this.objectsDesc.EMPTY, this.objectsDesc.EMPTY, this.objectsDesc.EMPTY],
            [this.objectsDesc.EMPTY, this.objectsDesc.EMPTY, this.objectsDesc.EMPTY],
            [this.objectsDesc.EMPTY, this.objectsDesc.BLOCK_GATE, this.objectsDesc.EMPTY],
            [this.objectsDesc.EMPTY, this.objectsDesc.EMPTY, this.objectsDesc.EMPTY],
            [this.objectsDesc.EMPTY, this.objectsDesc.BLOCK_GATE, this.objectsDesc.EMPTY],
            [this.objectsDesc.EMPTY, this.objectsDesc.EMPTY, this.objectsDesc.EMPTY],
            [this.objectsDesc.EMPTY, this.objectsDesc.EMPTY, this.objectsDesc.EMPTY],
            [this.objectsDesc.EMPTY, this.objectsDesc.BLOCK_GATE, this.objectsDesc.EMPTY],
            [this.objectsDesc.EMPTY, this.objectsDesc.EMPTY, this.objectsDesc.EMPTY],
            [this.objectsDesc.EMPTY, this.objectsDesc.EMPTY, this.objectsDesc.EMPTY],
            [this.objectsDesc.BLOCK_GATE, this.objectsDesc.EMPTY, this.objectsDesc.EMPTY],
            [this.objectsDesc.EMPTY, this.objectsDesc.EMPTY, this.objectsDesc.EMPTY],
            [this.objectsDesc.EMPTY, this.objectsDesc.EMPTY, this.objectsDesc.EMPTY],
            [this.objectsDesc.EMPTY, this.objectsDesc.BLOCK_GATE, this.objectsDesc.EMPTY],
            [this.objectsDesc.EMPTY, this.objectsDesc.EMPTY, this.objectsDesc.EMPTY],
            [this.objectsDesc.EMPTY, this.objectsDesc.EMPTY, this.objectsDesc.EMPTY],
            [this.objectsDesc.EMPTY, this.objectsDesc.EMPTY, this.objectsDesc.BLOCK_GATE],
            [this.objectsDesc.EMPTY, this.objectsDesc.EMPTY, this.objectsDesc.END_POINT]
        ];
    }

    static stage4(){
        return [
            [this.objectsDesc.EMPTY, this.objectsDesc.EMPTY, this.objectsDesc.EMPTY],
            [this.objectsDesc.EMPTY, this.objectsDesc.EMPTY, this.objectsDesc.EMPTY],
            [this.objectsDesc.EMPTY, this.objectsDesc.EMPTY, this.objectsDesc.EMPTY],
            [this.objectsDesc.EMPTY, this.objectsDesc.EMPTY, this.objectsDesc.EMPTY],
            [this.objectsDesc.EMPTY, this.objectsDesc.FLOATING_GATE, this.objectsDesc.EMPTY],
            [this.objectsDesc.EMPTY, this.objectsDesc.EMPTY, this.objectsDesc.EMPTY],
            [this.objectsDesc.EMPTY, this.objectsDesc.EMPTY, this.objectsDesc.BLOCK_GATE],
            [this.objectsDesc.EMPTY, this.objectsDesc.GATE, this.objectsDesc.EMPTY],
            [this.objectsDesc.EMPTY, this.objectsDesc.BLOCK_GATE, this.objectsDesc.EMPTY],
            [this.objectsDesc.EMPTY, this.objectsDesc.EMPTY, this.objectsDesc.EMPTY],
            [this.objectsDesc.EMPTY, this.objectsDesc.EMPTY, this.objectsDesc.BLOCK_GATE],
            [this.objectsDesc.EMPTY, this.objectsDesc.EMPTY, this.objectsDesc.EMPTY],
            [this.objectsDesc.EMPTY, this.objectsDesc.GATE, this.objectsDesc.EMPTY],
            [this.objectsDesc.EMPTY, this.objectsDesc.BLOCK_GATE, this.objectsDesc.EMPTY],
            [this.objectsDesc.EMPTY, this.objectsDesc.EMPTY, this.objectsDesc.EMPTY],
            [this.objectsDesc.EMPTY, this.objectsDesc.FloatING_BLOCK_GATE, this.objectsDesc.EMPTY],
            [this.objectsDesc.EMPTY, this.objectsDesc.EMPTY, this.objectsDesc.EMPTY],
            [this.objectsDesc.EMPTY, this.objectsDesc.FloatING_BLOCK_GATE, this.objectsDesc.EMPTY],
            [this.objectsDesc.EMPTY, this.objectsDesc.EMPTY, this.objectsDesc.EMPTY],
            [this.objectsDesc.EMPTY, this.objectsDesc.EMPTY, this.objectsDesc.FLOATING_GATE],
            [this.objectsDesc.EMPTY, this.objectsDesc.EMPTY, this.objectsDesc.EMPTY],
            [this.objectsDesc.BLOCK_GATE, this.objectsDesc.EMPTY, this.objectsDesc.EMPTY],
            [this.objectsDesc.EMPTY, this.objectsDesc.EMPTY, this.objectsDesc.EMPTY],
            [this.objectsDesc.EMPTY, this.objectsDesc.EMPTY, this.objectsDesc.EMPTY],
            [this.objectsDesc.EMPTY, this.objectsDesc.BLOCK_GATE, this.objectsDesc.EMPTY],
            [this.objectsDesc.EMPTY, this.objectsDesc.EMPTY, this.objectsDesc.BLOCK_GATE],
            [this.objectsDesc.BLOCK_GATE, this.objectsDesc.EMPTY, this.objectsDesc.EMPTY],
            [this.objectsDesc.EMPTY, this.objectsDesc.EMPTY, this.objectsDesc.BLOCK_GATE],
            [this.objectsDesc.EMPTY, this.objectsDesc.END_POINT, this.objectsDesc.EMPTY]
        ];
    }
}
