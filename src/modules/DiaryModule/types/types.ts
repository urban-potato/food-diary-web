import { ICharacteristicsSum } from "../../../global/types/types";

export interface ICharacteristicsSumWithLocalId extends ICharacteristicsSum {
  localId: number;
}

export type TCalendarValue = Date;
