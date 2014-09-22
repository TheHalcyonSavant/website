EXEC dbo.sp_changedbowner @loginame = N'sa', @map = false
CREATE USER [IIS APPPOOL\DefaultAppPool] FOR LOGIN [IIS APPPOOL\DefaultAppPool]