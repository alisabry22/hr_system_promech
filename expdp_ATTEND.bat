set datestr=%date%
rem set result=%datestr:/=-%
set result=%datestr:/=%
@echo %result%

expdp attend/attend@xe schemas=ATTEND directory=EXPDMP_ATTEND dumpfile=%result%_attend.DMP logfile=%result%_export.log 