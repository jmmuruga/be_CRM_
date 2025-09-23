export async function getChangedProperty<T>(
  editedPayload: any[], //after edit
  legacyPayload: any[] //before edit 
): Promise<string> {
  let changedPropertyList: string = "";
  editedPayload.forEach((ele, index) => {
    const obj = legacyPayload[index];
    Object.keys(ele).forEach((key) => {
      if (ele[key] != obj[key] && (key !== 'employeeImage') && (key !== 'companyImage')) {
        changedPropertyList += `${key} Changed From ${obj[key]} To ${ele[key]}` + ', ';
      }
    });
  });
  return changedPropertyList;
}