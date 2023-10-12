const BASE_URL = 'http://192.168.0.69:3000';

//auth router
export const LOGIN_REQUEST_URL = BASE_URL + '/login';
//dashboard router
export const GET_DASHBOARD_DATA = BASE_URL + '/dashboard';
export const UPLOAD_SHEET_TO_DATABASE = BASE_URL + '/uploadsheet';

// employee router to backend
export const UPLOAD_EXCEL_URL = BASE_URL + '/uploadfile';
export const GET_ALL_EMPS = BASE_URL + '/emps/getallemp';
export const ADD_NEW_EMP = BASE_URL + '/emps/addemp';
export const GET_ALL_EMP_TIME = BASE_URL + '/emps/getemptime';
export const EDIT_EMP_TIME = BASE_URL + '/emps/editEmpTime';
export const EDIT_EMPLOYEE_URL = BASE_URL + '/emps/editemp';
export const GET_ALL_EMPS_TIME_HISTORY_URL = BASE_URL + '/emps/emphistory';

//department routes
export const GET_ALL_DEPARTMENTS = BASE_URL + '/dept/getalldepts';
export const ADD_NEW_DEPARTMENT = BASE_URL + '/dept/addnewdept';
export const DELETE_DEPARTMENTS = BASE_URL + '/dept/deletedepts';

//jobs routes
export const GET_ALL_JOBS = BASE_URL + '/job/getalljobs';
export const ADD_NEW_JOB = BASE_URL + '/job/addnewjob';

//time repo routes
export const GET_ALL_TIME_REPO = BASE_URL + '/report/timerepo';

//send email
export const SEND_EMAIL_REQUEST = BASE_URL + '/emps/sendemail';
