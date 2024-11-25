import { GetAccountData } from "../../../core/useCases/getAccount";
import { SingupData } from "../../../core/useCases/signup";

export interface AccountDAO extends GetAccountData, SingupData {}