/*
* each stage is described here
* the approach used is indexed face set
* */
export class StageDescriber{
    static objectsDesc = {
        EMPTY: -1,
        GATE: 0,
        END_POINT: 1
    }

    static Stages = {//used to describe which stage is being built
        ONE: 1
    }

    /*
    * describes how stage one is suppose to look like
    * */
    static stage1(){

        return [
            /* each row must contain 0 or 1 gate since the avatar can't pass two gates at the same pos
            * each row describes how each section is suppose to look like
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
            [this.objectsDesc.GATE, this.objectsDesc.EMPTY, this.objectsDesc.EMPTY],
            [this.objectsDesc.EMPTY, this.objectsDesc.GATE, this.objectsDesc.EMPTY],
            [this.objectsDesc.EMPTY, this.objectsDesc.GATE, this.objectsDesc.EMPTY],
            [this.objectsDesc.EMPTY, this.objectsDesc.EMPTY, this.objectsDesc.GATE],
            [this.objectsDesc.EMPTY, this.objectsDesc.EMPTY, this.objectsDesc.GATE],
            [this.objectsDesc.EMPTY, this.objectsDesc.EMPTY, this.objectsDesc.GATE],
            [this.objectsDesc.EMPTY, this.objectsDesc.EMPTY, this.objectsDesc.EMPTY],
            [this.objectsDesc.EMPTY, this.objectsDesc.EMPTY, this.objectsDesc.GATE],
            [this.objectsDesc.EMPTY, this.objectsDesc.EMPTY, this.objectsDesc.EMPTY],
            [this.objectsDesc.EMPTY, this.objectsDesc.GATE, this.objectsDesc.EMPTY],
            [this.objectsDesc.GATE, this.objectsDesc.EMPTY, this.objectsDesc.EMPTY],
            [this.objectsDesc.EMPTY, this.objectsDesc.EMPTY, this.objectsDesc.GATE],
            [this.objectsDesc.GATE, this.objectsDesc.EMPTY, this.objectsDesc.EMPTY],
            [this.objectsDesc.EMPTY, this.objectsDesc.GATE, this.objectsDesc.EMPTY],
            [this.objectsDesc.EMPTY, this.objectsDesc.EMPTY, this.objectsDesc.GATE],
            [this.objectsDesc.GATE, this.objectsDesc.EMPTY, this.objectsDesc.EMPTY],
            [this.objectsDesc.EMPTY, this.objectsDesc.EMPTY, this.objectsDesc.EMPTY],
            [this.objectsDesc.END_POINT, this.objectsDesc.END_POINT, this.objectsDesc.END_POINT]
        ];
    }


}
