// import { Request, Response } from "express";
// import { appSource } from "../../core/dataBase/db";
// import { hostingMaster } from "./hostingMaster.model";
// import { ValidationException } from "../../core/exception";
// import { hostingMasterDto, hostingMasterValidation } from "./hostingMaster.dto";

// export const getHostingId = async (req: Request, res: Response) => {
//   try {
//     const companyid = req.params.companyId;
//     const hostingMasterRepositry = appSource.getRepository(hostingMaster);
//     let hostingId = await hostingMasterRepositry.query(
//       `SELECT hostingId
//             FROM [${process.env.DB_NAME}].[dbo].[hosting_master] where companyId = ${companyid}
//             Group by hostingId
//             ORDER BY CAST(hostingId AS INT) DESC;`
//     );

//     let id = "0";
//     if (hostingId?.length > 0) {
//       id = hostingId[0].hostingId;
//     }
//     const finalRes = Number(id) + 1;
//     res.status(200).send({
//       Result: finalRes,
//     });
//   } catch (error) {
//     if (error instanceof ValidationException) {
//       return res.status(400).send({
//         message: error?.message,
//       });
//     }
//     res.status(500).send(error);
//   }
// };

// export const addUpdateHostingMaster = async (req: Request, res: Response) => {
//   try {
//     const payload: hostingMasterDto = req.body;
//     const validation = hostingMasterValidation.validate(payload);
//     if (validation.error) {
//       throw new ValidationException(validation.error.message);
//     }

//     const hostingMasterRepositry = appSource.getRepository(hostingMaster);
//     const existingDetails = await hostingMasterRepositry.findOneBy({
//       hostingId: payload.hostingId,
//       companyId: payload.companyId,
//     });
//     if (existingDetails) {
//       await hostingMasterRepositry
//         .update({ hostingId: payload.hostingId }, payload)
//         .then(async (r) => {
//           res.status(200).send({
//             IsSuccess: " Hosting Master Details Updated successFully",
//           });
//         })
//         .catch(async (error) => {
//           if (error instanceof ValidationException) {
//             return res.status(400).send({
//               message: error?.message,
//             });
//           }
//           res.status(500).send(error);
//         });
//       return;
//     } else {
//       const nameValidation = await hostingMasterRepositry.findOneBy({
//         hostingName: payload.hostingName,
//       });
//       if (nameValidation) {
//         throw new ValidationException("Hosting Name Already Exist ");
//       }
//       await hostingMasterRepositry.save(payload);
//       res.status(200).send({
//         IsSuccess: "Details Added successFully",
//       });
//     }
//   } catch (error) {
//     if (error instanceof ValidationException){
//         return res.status(400).send({
//             message:error?.message
//         });
//     }
//     res.status(500).send(error);
//   }
// };

import { Request, Response } from "express";
import { appSource } from "../../core/dataBase/db";
import { hostingMaster } from "./hostingMaster.model";
import { ValidationException } from "../../core/exception";
import { hostingMasterDto, hostingMasterValidation } from "./hostingMaster.dto";

export const getHostingId = async (req: Request, res: Response) => {
  try {
    const companyId = req.params.companyId;
    const hostingMasterRepository = appSource.getRepository(hostingMaster);

    const hostingId = await hostingMasterRepository.query(
      `SELECT hostingId
       FROM [${process.env.DB_NAME}].[dbo].[hosting_master]
      where companyId = ${companyId}
       GROUP BY hostingId
       ORDER BY CAST(hostingId AS INT) DESC;`,
      [companyId]
    );

    let id = "0";
    if (hostingId?.length > 0) {
      id = hostingId[0].hostingId;
    }
    const finalRes = Number(id) + 1;

    res.status(200).send({ Result: finalRes });
  } catch (error) {
    res.status(500).send(error);
  }
};

export const addUpdateHostingMaster = async (req: Request, res: Response) => {
  try {
    const payload: hostingMasterDto = req.body;
    const validation = hostingMasterValidation.validate(payload);
    if (validation.error) {
      throw new ValidationException(validation.error.message);
    }

    const hostingMasterRepository = appSource.getRepository(hostingMaster);

    const existingDetails = await hostingMasterRepository.findOneBy({
      hostingId: payload.hostingId,
      companyId: payload.companyId,
    });

    if (existingDetails) {
      await hostingMasterRepository.update(
        { hostingId: payload.hostingId, companyId: payload.companyId },
        payload
      );

      return res
        .status(200)
        .send({ IsSuccess: "Hosting Master Details Updated Successfully" });
    } else {
      const nameValidation = await hostingMasterRepository.findOneBy({
        hostingName: payload.hostingName,
      });
      if (nameValidation) {
        throw new ValidationException("Hosting Name Already Exists");
      }

      await hostingMasterRepository.save(payload);
      return res.status(200).send({ IsSuccess: "Details Added Successfully" });
    }
  } catch (error) {
    if (error instanceof ValidationException) {
      return res.status(400).send({ message: error.message });
    }
    res.status(500).send(error);
  }
};
