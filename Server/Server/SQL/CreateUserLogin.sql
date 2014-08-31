DECLARE @PublicUser sysname;
SET @PublicUser = 'IIS APPPOOL\DefaultAppPool';
IF NOT EXISTS(SELECT principal_id FROM sys.database_principals WHERE name = @PublicUser)
BEGIN
	DECLARE @sql as varchar(500);
    SET @sql = 'CREATE USER ' + @PublicUser + ' FOR LOGIN ' + @PublicUser;
    EXEC (@sql);
	EXEC sp_addrolemember N'db_owner', @PublicUser
END