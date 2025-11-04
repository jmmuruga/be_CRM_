export async function getChangedProperty<T>(
  editedPayload: any[], //after edit
  legacyPayload: any[] //before edit
): Promise<string> {
  let changedPropertyList: string = "";
  editedPayload.forEach((ele, index) => {
    const obj = legacyPayload[index];
    Object.keys(ele).forEach((key) => {
      if (
        ele[key] != obj[key] &&
        key !== "employeeImage" &&
        key !== "companyImage"
      ) {
        changedPropertyList +=
          `${key} Changed From ${obj[key]} To ${ele[key]}` + ", ";
      }
    });
  });
  return changedPropertyList;
}

export function generateOtp(): string {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  return otp;
}


export function getFullMonthYearAndDate(date: string): string {
    const parsedDate = new Date(date);
    const year = parsedDate.getFullYear();
    const month = (parsedDate.getMonth() + 1).toString().padStart(2, "0");
    const day = parsedDate.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
}
