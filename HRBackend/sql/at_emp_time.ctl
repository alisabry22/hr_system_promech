LOAD DATA
INFILE  "D:\hr_system\HRBackend\sql\attend.csv"
BADFILE 'D:\hr_system\HRBackend\sql\attend.bad'
append
INTO TABLE at_emp_time
FIELDS TERMINATED BY ',' 	
( card_id ,
  emp_name,
  date_day "to_date(:date_day,'YYYY/MM/dd')",
  clock_in,
  clock_out,
  late,
  early,
  absent_flag,
  remarks,
  trans_amt,
  company_name
  )
