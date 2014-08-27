CREATE USER [IIS APPPOOL\DefaultAppPool] FOR LOGIN [IIS APPPOOL\DefaultAppPool]
EXEC sp_addrolemember N'db_owner', N'IIS APPPOOL\DefaultAppPool'