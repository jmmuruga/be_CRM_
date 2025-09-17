import { appSource } from "../../core/dataBase/db";
import { userDetails } from "../userDetails/userDetails.model";
import { logsDto } from "./logs.dto";
import { Logs } from "./logs.model";

export const InsertLog = async (payload: logsDto): Promise<void> => {
  const logsRepository = appSource.getRepository(Logs);
  const userRepository = appSource.getRepository(userDetails);
  const userDetail = await userRepository.findBy({ userId: payload.userId });
  const userName = userDetail[0]?.userName || "-";
  payload.userName = userName;
  payload.message = payload.message + " " + userName;
  await logsRepository.save(payload);
};