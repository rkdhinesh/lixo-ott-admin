export class ColumnModel {

    tableSequenceId: number;
    tableSequenceName: string;
    checkBoxSelection: boolean;

    constructor(tableSequenceId: number, tableSequenceName: string, checkBoxSelection: boolean) {
        this.tableSequenceId = tableSequenceId;
        this.tableSequenceName = tableSequenceName;
        this.checkBoxSelection = checkBoxSelection;
    }
}
